import React from "react";
import {
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { StressSelector } from "./StressSelector";
import moment from "moment";
import { useHistory } from "react-router-dom";

import { useStressHistoricContext } from "./StressHistoricContext";
import { useAuthContext } from "../../../common/AuthContext";
import {
  STEP_RESULT_TEST_END_NAME,
  STEP_RESULT_TEST_START_NAME,
  MEASUREMENT_RESULT_START_TIME_NAME,
  MEASUREMENT_RESULT_END_TIME_NAME,
  STRESSOR_NOT_APPLY_METADATA,
} from "./constants";
import {
  useUsers,
  useProcedureResult,
} from "../../../testCommunication/common/testQueries";

import { ErrorMessage } from "../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../util/errorMessaging";
import { filter, find } from "lodash";
import { toast } from "react-toastify";
import { StressDateTimePicker } from "./StressDateTimePicker";
import { HistoricReviewerCapture } from "../../../testCommunication/common/HistoricReviewerCapture";
import { StressUnit } from "./StressUnit";
import { HistoricDispositionCapture } from "../../../testCommunication/common/HistoricDispositionCapture";
import {
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
} from "../../../testCommunication/common/testMutations";
import { useFetchContext } from "../../../common/FetchContext";
import { useTestPermissions } from "../../projectQueries";
import { useMeasurementsDispositions } from "../../../common/services/dispositionServices";
import { useStressTypes } from "./stressEntryQueries";
import isEmpty from "lodash/isEmpty";

export const StressEntryHistoricalModal = ({
  historicData,
  unitData,
  unitTypeData,
  closeHistoricModal,
}: any) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const theme = useTheme();
  const history = useHistory();

  const { state, dispatch } = useStressHistoricContext();
  const { authAxios } = useFetchContext();
  const { dispatch: authDispatch } = useAuthContext();

  const {
    data: users,
    isError: isErrorUsers,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useUsers();

  const {
    data: procedureResult,
    error: errorProcedureResult,
    isError: isErrorProcedureResult,
    isSuccess: isSuccessProcedureResult,
    isLoading: isLoadingProcedureResult,
  } = useProcedureResult(historicData?.id);

  const {
    data: stresses,
    error: errorStresses,
    isLoading: isLoadingStresses,
    isError: isErrorStresses,
  } = useStressTypes();
  const {
    data: permission,
    error: errorPermission,
    isLoading: isLoadingPermission,
    isError: isErrorPermission,
    isSuccess: isSuccessPermission,
  } = useTestPermissions();

  const {
    data: dispositions,
    isError: isErrorDispositions,
    isLoading: isLoadingDispositions,
    error: errorDispositions,
  } = useMeasurementsDispositions();

  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();

  React.useEffect(() => {
    dispatch({ type: "CLEAN_STRESS" });
  }, [dispatch]);

  React.useEffect(() => {
    if (isSuccessProcedureResult && procedureResult) {
      let stepEntryResult = find(procedureResult.step_results, [
        "name",
        STEP_RESULT_TEST_START_NAME,
      ]);
      let stepExitResult = find(procedureResult.step_results, [
        "name",
        STEP_RESULT_TEST_END_NAME,
      ]);
      if (!stepEntryResult && !stepExitResult) {
        toast.error(
          `The unit ${unitData.serial_number} does not have work for the selected procedure.Please review it in the scanned list and modify it.`
        );
      } else {
        const linearExecutionGroupEntry =
          stepEntryResult.linear_execution_group;
        const stepResultSiblingEntry = filter(
          procedureResult.step_results,
          (stepResult) =>
            stepResult.linear_execution_group === linearExecutionGroupEntry &&
            stepResult.name !== STEP_RESULT_TEST_START_NAME
        );
        const linearExecutionGroupExit = stepExitResult.linear_execution_group;
        const stepResultSiblingExit = filter(
          procedureResult.step_results,
          (stepResult) =>
            stepResult.linear_execution_group === linearExecutionGroupExit &&
            stepResult.name !== STEP_RESULT_TEST_END_NAME
        );
        dispatch({
          type: "SET_SIBLINGS",
          payload: {
            stressEntrySibling:
              stepResultSiblingEntry[0] || STRESSOR_NOT_APPLY_METADATA,
            stressExitSibling:
              stepResultSiblingExit[0] || STRESSOR_NOT_APPLY_METADATA,
          },
        });
      }
    }
  }, [dispatch, isSuccessProcedureResult, procedureResult, unitData]);

  if (
    isLoadingDispositions ||
    isLoadingStresses ||
    isLoadingUsers ||
    isLoadingProcedureResult ||
    isLoadingPermission
  ) {
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      </Grid>
    );
  }

  if (
    isErrorStresses ||
    isErrorDispositions ||
    isErrorUsers ||
    isErrorProcedureResult ||
    isErrorPermission
  ) {
    return (
      <>
        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}
        {isErrorStresses && <ErrorMessage error={errorStresses} />}
        {isErrorUsers && <ErrorMessage error={errorUsers} />}
        {isErrorProcedureResult && (
          <ErrorMessage error={errorProcedureResult} />
        )}
        {isErrorPermission && <ErrorMessage error={errorPermission} />}{" "}
      </>
    );
  }

  if (isSuccessPermission && permission) {
    dispatch({ type: "SET_PERMISSION", payload: { permission } });
  }

  const submitMeasurementsAndSteps = async (
    stepResult: any,
    measurementResult: any,
    stressDateTime: any,
    reviewUser: any,
    reviewDate: any,
    sibling: any,
    metadata: any
  ) => {
    await mutateSubmitMeasurementResult({
      authAxios,
      measurementResultId: measurementResult.id,
      start_datetime: moment().format(),
      result_datetime: stressDateTime,
      asset: state.asset.id,
      disposition: state.stressDisposition?.id,
      user: reviewUser.id,
      datetime: reviewDate,
      historic: true,
    });

    await mutateSubmitStepResult({
      authAxios,
      stepResultId: stepResult.id,
      start_datetime: moment().format(),
      disposition: state.stressDisposition?.id,
      user: reviewUser.id,
      datetime: reviewDate,
      historic: true,
    });

    // Metadata process
    if (sibling !== STRESSOR_NOT_APPLY_METADATA) {
      const stepResultSibling = sibling;
      const measurementResultSibling = stepResultSibling.measurement_results[0];
      const resultTypeField =
        measurementResultSibling.measurement_result_type_field;

      await mutateSubmitMeasurementResult({
        authAxios,
        measurementResultId: measurementResultSibling?.id,
        asset: state.asset.id,
        [resultTypeField]: metadata,
        disposition: state.stressDisposition.id,
        user: reviewUser.id,
        datetime: reviewDate,
        start_datetime: moment().format(),
        historic: true,
      });

      await mutateSubmitStepResult({
        authAxios,
        stepResultId: stepResultSibling.id,
        disposition: state.stressDisposition.id,
        user: reviewUser.id,
        datetime: reviewDate,
        start_datetime: moment().format(),
        historic: true,
      });
    }
  };

  const stressModalValidate = () => {
    if (isEmpty(state.stressDisposition)) {
      throw new Error("Disposition wasnt picked");
    }

    if (isEmpty(state.asset)) {
      throw new Error("Asset wasnt picked.");
    }
    if (isEmpty(state.stressEntryReviewer)) {
      throw new Error("Stress entry reviewer wasnt picked");
    }
    if (isEmpty(state.stressEntryReviewDate)) {
      throw new Error("Stress entry review date wasnt picked");
    }
    if (
      state.stressEntrySibling !== STRESSOR_NOT_APPLY_METADATA &&
      isEmpty(state.stressEntryMetadata)
    ) {
      throw new Error("Please fill stress entry metadata");
    }

    if (
      !isEmpty(state.stressExitReviewer) ||
      !isEmpty(state.stressExitReviewDate) ||
      (!isEmpty(state.stressExitMetadata) &&
        state.stressExitSibling !== STRESSOR_NOT_APPLY_METADATA)
    ) {
      if (isEmpty(state.stressExitReviewer)) {
        throw new Error("Stress exit reviewer wasnt picked");
      }
      if (isEmpty(state.stressExitReviewDate)) {
        throw new Error("Stress exit review date wasnt picked");
      }
      if (
        state.stressExitSibling !== STRESSOR_NOT_APPLY_METADATA &&
        isEmpty(state.stressExitMetadata)
      ) {
        throw new Error("Please fill stress exit metadata");
      }
    }
  };

  const submitStress = async () => {
    setIsSubmitting(true);

    try {
      stressModalValidate();
      // Stress Entry Entities Extraction
      let stepResultStressEntry = find(procedureResult.step_results, [
        "name",
        STEP_RESULT_TEST_START_NAME,
      ]);
      let measurementResultStressEntry = find(
        stepResultStressEntry.measurement_results,
        ["name", MEASUREMENT_RESULT_START_TIME_NAME]
      );

      // Stress Entry Submission
      await submitMeasurementsAndSteps(
        stepResultStressEntry,
        measurementResultStressEntry,
        state.stressEntryDate,
        state.stressEntryReviewer,
        state.stressEntryReviewDate,
        state.stressEntrySibling,
        state.stressEntryMetadata
      );

      if (
        !isEmpty(state.stressExitReviewer) &&
        !isEmpty(state.stressExitReviewDate) &&
        ((state.stressExitSibling !== STRESSOR_NOT_APPLY_METADATA &&
          !isEmpty(state.stressExitMetadata)) ||
          (state.stressExitSibling === STRESSOR_NOT_APPLY_METADATA &&
            isEmpty(state.stressExitMetadata)))
      ) {
        // Stress Exit Entities Extraction
        let stepResultStressExit = find(procedureResult.step_results, [
          "name",
          STEP_RESULT_TEST_END_NAME,
        ]);
        let measurementResultStressExit = find(
          stepResultStressExit.measurement_results,
          ["name", MEASUREMENT_RESULT_END_TIME_NAME]
        );

        // Stress Exit Submission
        await submitMeasurementsAndSteps(
          stepResultStressExit,
          measurementResultStressExit,
          state.stressExitDate,
          state.stressExitReviewer,
          state.stressExitReviewDate,
          state.stressExitSibling,
          state.stressExitMetadata
        );

        // Procedure Stress Submission
        await mutateSubmitProcedureResult({
          authAxios,
          procedureResultId: procedureResult.id,
          start_datetime: state.stressEntryDate,
          end_datetime: state.stressExitDate,
          disposition: state.stressDisposition.id,
        });
      }
      toast.success("Stress submission was successful");
      closeHistoricModal();
    } catch (err) {
      toast.error("Error while executing stress submission routine.");
      processErrorOnMutation(err, authDispatch, history);
    }

    setIsSubmitting(false);
  };

  return (
    <div style={theme.containerMargin}>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={4}>
          <HistoricDispositionCapture
            dispositions={dispositions}
            historicDisposition={state.stressDisposition}
            setHistoricDisposition={(disposition: any) => {
              dispatch({
                type: "SET_STRESS_DISPOSITION",
                payload: { disposition },
              });
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <StressSelector
            stresses={stresses}
            selectedStressType={state.asset}
            onStressSelection={(asset: any) => {
              dispatch({
                type: "SET_ASSET",
                payload: { asset },
              });
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            style={theme.btnNew}
            onClick={() => submitStress()}
          >
            Submit Stress
          </Button>
        </Grid>
        <Grid item xs={1}>
          {isSubmitting && <CircularProgress />}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Stress Entry</Typography>
        </Grid>
        <Grid item xs={6}>
          <HistoricReviewerCapture
            users={users}
            reviewDateLabel="Stress Entry Review Date"
            reviewer={state.stressEntryReviewer}
            setReviewer={(reviewer: any) =>
              dispatch({
                type: "SET_STRESS_ENTRY_REVIEWER",
                payload: { reviewer },
              })
            }
            reviewDate={state.stressEntryReviewDate}
            setReviewDate={(date: any) =>
              dispatch({
                type: "SET_STRESS_ENTRY_REVIEW_DATE",
                payload: { date },
              })
            }
          />
        </Grid>

        <Grid item xs={6}>
          <StressDateTimePicker
            label="Stress Entry date"
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
        <Grid item xs={12}>
          <StressUnit
            unitData={unitData}
            procedureResult={procedureResult}
            sibling={state.stressEntrySibling}
            metadata={state.stressEntryMetadata}
            onChangeMetadata={(value: any) => {
              dispatch({
                type: "SET_STRESS_ENTRY_METADATA",
                payload: { metadata: value },
              });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Stress Exit</Typography>
        </Grid>
        <Grid item xs={6}>
          <HistoricReviewerCapture
            users={users}
            reviewDateLabel="Stress Exit Review Date"
            reviewer={state.stressExitReviewer}
            setReviewer={(reviewer: any) =>
              dispatch({
                type: "SET_STRESS_EXIT_REVIEWER",
                payload: { reviewer },
              })
            }
            reviewDate={state.stressExitReviewDate}
            setReviewDate={(date: any) =>
              dispatch({
                type: "SET_STRESS_EXIT_REVIEW_DATE",
                payload: { date },
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <StressDateTimePicker
            label="Stress Exit date"
            value={state.stressExitDate}
            onChange={(date: any) => {
              dispatch({
                type: "SET_STRESS_EXIT_DATE",
                payload: {
                  date,
                },
              });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <StressUnit
            unitData={unitData}
            procedureResult={procedureResult}
            sibling={state.stressExitSibling}
            metadata={state.stressExitMetadata}
            onChangeMetadata={(metadata: any) => {
              dispatch({
                type: "SET_STRESS_EXIT_METADATA",
                payload: { metadata },
              });
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};
