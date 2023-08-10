import React from "react";
import {
  Button,
  Grid,
  useTheme,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";
import { useStressEntryContext } from "./StressEntryContext";
import { useDispositionsByNameAndEnabled } from "../../../common/services/dispositionServices";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { processErrorOnMutation } from "../../../../util/errorMessaging";
import { useAuthContext } from "../../../common/AuthContext";
import { ConfirmationDialog } from "../../../common/ConfirmationDialog";
import {
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
} from "../../../testCommunication/common/testMutations";
import { find, every, some, isEmpty } from "lodash";
import { useFetchContext } from "../../../common/FetchContext";
import moment from "moment";
import {
  MEASUREMENT_RESULT_END_TIME_NAME,
  MEASUREMENT_RESULT_START_TIME_NAME,
  STEP_RESULT_TEST_END_NAME,
  STEP_RESULT_TEST_START_NAME,
  STRESSOR_CHECK_IN_MODE,
  STRESSOR_CHECK_OUT_MODE,
  STRESSOR_NOT_APPLY_METADATA,
} from "./constants";

export const StressorStarter = () => {
  const theme = useTheme();
  const history = useHistory();
  const { state, dispatch } = useStressEntryContext();
  const { dispatch: authDispatch } = useAuthContext();
  const { authAxios } = useFetchContext();
  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();
  const [
    confirmationDialogStartStressorOpen,
    setConfirmationDialogStartStressorOpen,
  ] = React.useState(false);

  const {
    data: dispositionInProgress,
    isLoading: isLoadingDispositionInProgress,
    isError: isErrorDispositionInProgress,
    error: errorDispositionInProgress,
  } = useDispositionsByNameAndEnabled(
    "In Progress",
    state.checkedUnits?.size !== 0
  );

  const {
    data: dispositionCompleted,
    isLoading: isLoadingDispositionCompleted,
    isError: isErrorDispositionCompleted,
    error: errorDispositionCompleted,
  } = useDispositionsByNameAndEnabled(
    "Completed",
    state.checkedUnits?.size !== 0
  );

  if (isLoadingDispositionInProgress || isLoadingDispositionCompleted) {
    return (
      <Backdrop
        open={isLoadingDispositionInProgress || isLoadingDispositionCompleted}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorDispositionInProgress) {
    return <ErrorMessage error={errorDispositionInProgress} />;
  }

  if (isErrorDispositionCompleted) {
    return <ErrorMessage error={errorDispositionCompleted} />;
  }

  const handleStressorProcessing = async () => {
    try {
      setConfirmationDialogStartStressorOpen(false);
      const values = [...state.checkedUnits.values()];
      const areMetadataValuesEmpty = some(values, (value) => {
        return (
          value.sibling !== STRESSOR_NOT_APPLY_METADATA &&
          (value.metadata === undefined ||
            value.metadata === null ||
            value.metadata === "")
        );
      });

      if (areMetadataValuesEmpty) {
        toast.error("Please fill the metadata values requested.");
      } else {
        let stepResultValueToFind = "";
        let measurementResultValueToFind = "";
        let dispositionToUseForProcedureResult = undefined;
        if (state.mode === STRESSOR_CHECK_IN_MODE) {
          stepResultValueToFind = STEP_RESULT_TEST_START_NAME;
          measurementResultValueToFind = MEASUREMENT_RESULT_START_TIME_NAME;
          dispositionToUseForProcedureResult = dispositionInProgress?.id;
        } else if (state.mode === STRESSOR_CHECK_OUT_MODE) {
          stepResultValueToFind = STEP_RESULT_TEST_END_NAME;
          measurementResultValueToFind = MEASUREMENT_RESULT_END_TIME_NAME;
          dispositionToUseForProcedureResult = dispositionCompleted?.id;
        }

        for (let [key, value] of state.checkedUnits) {
          let testStartStepResult = find(value.step_results, [
            "name",
            STEP_RESULT_TEST_START_NAME,
          ]);
          let testStartMeasurementResult = find(
            testStartStepResult.measurement_results,
            ["name", MEASUREMENT_RESULT_START_TIME_NAME]
          );

          // Check for Stress Entry before an Stress Exit Submission
          if (
            state.mode === STRESSOR_CHECK_OUT_MODE &&
            isEmpty(testStartStepResult.disposition) &&
            isEmpty(testStartMeasurementResult.disposition)
          ) {
            toast.error(
              `Stress Entry for procedure ${value.id} doesn't exists.`
            );
          } else {
            let procedureResult = value;
            let stepResult =
              state.mode === STRESSOR_CHECK_OUT_MODE
                ? find(procedureResult.step_results, [
                    "name",
                    stepResultValueToFind,
                  ])
                : testStartStepResult;
            let measurementResult =
              state.mode === STRESSOR_CHECK_OUT_MODE
                ? find(stepResult.measurement_results, [
                    "name",
                    measurementResultValueToFind,
                  ])
                : testStartMeasurementResult;

            await mutateSubmitMeasurementResult({
              authAxios,
              disposition: dispositionCompleted?.id,
              measurementResultId: measurementResult.id,
              start_datetime: moment().format(),
              result_datetime: state.stressEntryDate,
              asset: state.selectedStressType.id,
            });

            await mutateSubmitStepResult({
              authAxios,
              disposition: dispositionCompleted?.id,
              stepResultId: stepResult.id,
              start_datetime: moment().format(),
            });

            // Metadata process
            if (value.sibling !== STRESSOR_NOT_APPLY_METADATA) {
              const stepResultSibling = value.sibling;
              const measurementResultSibling =
                stepResultSibling.measurement_results[0];
              const resultTypeField =
                measurementResultSibling.measurement_result_type_field;

              await mutateSubmitMeasurementResult({
                authAxios,
                disposition: dispositionCompleted?.id,
                measurementResultId: measurementResultSibling?.id,
                asset: state.selectedStressType.id,
                [resultTypeField]: value.metadata,
              });

              await mutateSubmitStepResult({
                authAxios,
                disposition: dispositionCompleted?.id,
                stepResultId: stepResultSibling.id,
              });
            }

            if (state.mode === STRESSOR_CHECK_IN_MODE) {
              await mutateSubmitProcedureResult({
                authAxios,
                disposition: dispositionToUseForProcedureResult,
                procedureResultId: procedureResult.id,
                start_datetime: state.stressEntryDate,
              });
            } else if (state.mode === STRESSOR_CHECK_OUT_MODE) {
              await mutateSubmitProcedureResult({
                authAxios,
                disposition: dispositionToUseForProcedureResult,
                procedureResultId: procedureResult.id,
                end_datetime: state.stressEntryDate,
              });
            }

            if (state.mode === STRESSOR_CHECK_IN_MODE) {
              toast.success(`Serial Number ${key} was successfully checked in`);
            } else if (state.mode === STRESSOR_CHECK_OUT_MODE) {
              toast.success(
                `Serial Number ${key} was successfully checked out`
              );
            }
          }
          if (state.mode === STRESSOR_CHECK_IN_MODE) {
            toast.success("Check-in process completed");
          } else if (state.mode === STRESSOR_CHECK_OUT_MODE) {
            toast.success("Check-out process completed");
          }
          dispatch({ type: "CLEAN_STRESS_ENTRY" });
        }
      }
    } catch (err) {
      if (state.mode === STRESSOR_CHECK_IN_MODE) {
        toast.error("Error while executing check-in routine.");
      } else if (state.mode === STRESSOR_CHECK_OUT_MODE) {
        toast.error("Error while executing check-out routine.");
      }
      processErrorOnMutation(err, authDispatch, history);
    }
  };

  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "CLEAN_STRESS_ENTRY" });
  };

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item xs={9} style={{ textAlign: "right" }}>
        {state.selectedStressType && (
          <Button color="secondary" variant="contained" onClick={handleReset}>
            Reset
          </Button>
        )}
      </Grid>
      <Grid item xs={3} style={{ textAlign: "right" }}>
        {state.checkedUnits.size !== 0 && (
          <Button
            style={theme.btnNew}
            variant="contained"
            onClick={() => setConfirmationDialogStartStressorOpen(true)}
          >
            {state.mode === STRESSOR_CHECK_IN_MODE
              ? "Start Stressor"
              : "End Stressor"}
          </Button>
        )}
      </Grid>
      <ConfirmationDialog
        id="stressor-start-confirmation"
        keepMounted
        open={confirmationDialogStartStressorOpen}
        title={
          state.mode === STRESSOR_CHECK_IN_MODE
            ? "Start Stressor Confirmation"
            : "End Stressor Confirmation"
        }
        content={
          state.mode === STRESSOR_CHECK_IN_MODE
            ? "Are you sure that you want to start stressor?"
            : "Are you sure that you want to end stressor?"
        }
        onCancel={() => setConfirmationDialogStartStressorOpen(false)}
        onSubmit={handleStressorProcessing}
      />
    </Grid>
  );
};
