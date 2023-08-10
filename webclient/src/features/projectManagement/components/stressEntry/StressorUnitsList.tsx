import { useUnitsByAsset } from "../../../testCommunication/common/testQueries";
import {
  Backdrop,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { useStressEntryContext } from "./StressEntryContext";

const StressorUnitsList = () => {
  const { state } = useStressEntryContext();

  const {
    data: units,
    error: unitsError,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
  } = useUnitsByAsset(state.selectedStressType?.id, {
    enabled:
      state.selectedStressType !== null &&
      state.selectedStressType.id !== undefined,
  });

  if (isLoadingUnits) {
    return (
      <Backdrop open={isLoadingUnits}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorUnits) {
    return <ErrorMessage error={unitsError} />;
  }

  return (
    <Paper
      style={{
        padding: "10px",
      }}
    >
      {state.selectedStressType !== null ? (
        <>
          {units !== null && units?.length > 0 ? (
            <>
              <Typography variant="h6">
                Units currently on asset: {units.length}
              </Typography>
              <List>
                {units.map((unit: any, index: number) => (
                  <ListItem>
                    <ListItemText
                      primary={`${index + 1} - ${unit.serial_number}`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <p>There's no units in this asset</p>
          )}
        </>
      ) : (
        <p>Please Select an Asset</p>
      )}
    </Paper>
  );
};

export default StressorUnitsList;
