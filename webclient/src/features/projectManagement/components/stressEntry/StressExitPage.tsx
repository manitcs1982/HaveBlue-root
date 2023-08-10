import React from "react";
import { Backdrop, CircularProgress, useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { StressSelector } from "./StressSelector";
import { ProcedureSelector } from "./ProcedureSelector";

import { SerialNumberScanner } from "./SerialNumberScanner";
import { UnitChecker } from "./UnitChecker";
import { StressorStarter } from "./StressorStarter";
import { useStressEntryContext } from "./StressEntryContext";
import { STRESSOR_CHECK_OUT_MODE } from "./constants";
import { useStressTypes } from "./stressEntryQueries";
import { ErrorMessage } from "../../../common/ErrorMessage";
import StressorUnitsList from "./StressorUnitsList";

export const StressExitPage = () => {
  const theme = useTheme();
  const { state, dispatch } = useStressEntryContext();

  const {
    data: stresses,
    error: errorStresses,
    isLoading: isLoadingStresses,
    isError: isErrorStresses,
  } = useStressTypes();

  React.useEffect(() => {
    dispatch({ type: "CLEAN_STRESS_ENTRY" });
    dispatch({ type: "SET_MODE", payload: STRESSOR_CHECK_OUT_MODE });
  }, [dispatch]);

  if (isLoadingStresses) {
    return (
      <Backdrop open={isLoadingStresses}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorStresses) {
    return <ErrorMessage error={errorStresses} />;
  }

  return (
    <div style={theme.containerMargin}>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={2}>
          <StressSelector
            stresses={stresses}
            selectedStressType={state.selectedStressType}
            onStressSelection={(selectedStressType: any) => {
              dispatch({
                type: "SET_SELECTED_STRESS_TYPE",
                payload: { selectedStressType },
              });
            }}
            onPermissionSet={(permission: any) => {
              dispatch({ type: "SET_PERMISSION", payload: { permission } });
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <ProcedureSelector />
        </Grid>
        <Grid item xs={6}>
          <StressorStarter />
        </Grid>

        <Grid item xs={6}>
          <SerialNumberScanner />
        </Grid>
        <Grid item xs={6}>
          <UnitChecker />
        </Grid>

        <Grid item xs={6}>
          <StressorUnitsList />
        </Grid>
      </Grid>
    </div>
  );
};
