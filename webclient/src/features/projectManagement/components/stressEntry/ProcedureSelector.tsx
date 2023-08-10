import React from "react";
import { useStressEntryContext } from "./StressEntryContext";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ErrorMessage } from "../../../common/ErrorMessage";

import { Grid, useTheme } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import { useStressProcedures } from "./stressEntryQueries";
import { STRESSOR_CHECK_IN_MODE } from "./constants";

export const ProcedureSelector = () => {
  const theme = useTheme();
  const { state, dispatch } = useStressEntryContext();
  const { data, error, isLoading, isError } = useStressProcedures(
    state?.selectedStressType?.id,
    state.mode
  );

  if (!state.selectedStressType) {
    return null;
  }

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  const handleSelection = (selectedStressProcedure: any) => () => {
    if (
      state.selectedStressProcedure &&
      selectedStressProcedure.id !== state.selectedStressProcedure.id
    ) {
      dispatch({ type: "CLEAN_SCANNED_UNITS" });
    }
    dispatch({
      type: "SET_SELECTED_STRESS_PROCEDURE",
      payload: { selectedStressProcedure },
    });
  };

  return (
    <div style={theme.container}>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={6}>
          {state.mode === STRESSOR_CHECK_IN_MODE && (
            <FormControl
              style={{
                minWidth: 200,
              }}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Select a procedure
              </InputLabel>
              <Select
                variant="filled"
                defaultValue={0}
                value={
                  state.selectedStressProcedure?.id
                    ? state.selectedStressProcedure.id
                    : 0
                }
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {data.map((stressProcedure: any) => (
                  <MenuItem
                    value={stressProcedure.id}
                    onClick={handleSelection(stressProcedure)}
                  >
                    {stressProcedure.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
        <Grid item xs={6}>
          <DateTimePicker
            label={
              state.mode === STRESSOR_CHECK_IN_MODE ? "Start date" : "End date"
            }
            inputVariant="outlined"
            format="YYYY-MM-DD HH:mm:ss"
            value={state.stressEntryDate}
            onChange={(date: any) => {
              dispatch({
                type: "SET_STRESS_ENTRY_DATE",
                payload: {
                  date,
                },
              });
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};
