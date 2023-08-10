import React from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  LinearProgress,
  useTheme,
} from "@material-ui/core";

import { ConfirmationDialog } from "../../common/ConfirmationDialog";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import * as Yup from "yup";
import { useFetchContext } from "../../common/FetchContext";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useDispositionsByName } from "../../common/services/dispositionServices";
import {
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
} from "../common/testMutations";

import { useAuthContext } from "../../common/AuthContext";
import { ErrorMessage } from "../../common/ErrorMessage";
import measurementSubmission from "../common/measurementSubmission";
import TesterTypes from "../common/TesterTypes";
import CharacterizationQueueDialog from "../common/CharacterizationQueueDialog";

export const DiodeTester = ({
  assetData,
  procedureResultData,
  setClearedValues,
  historicUser,
  historicDate,
  historicData,
  historicDisposition,
  closeHistoricModal,
  startDateTime,
}: any) => {
  const history = useHistory();
  const { dispatch } = useAuthContext();
  const {
    error: errorDispositionPassed,
    data: dispositionPassed,
    isLoading: isLoadingDispositionPassed,
    isError: isErrorDispositionPassed,
  } = useDispositionsByName("Pass");

  const {
    error: errorDispositionRequiresReview,
    data: dispositionRequiresReview,
    isLoading: isLoadingDispositionRequiresReview,
    isError: isErrorDispositionRequiresReview,
  } = useDispositionsByName("Requires Review");

  const {
    error: errorDispositionFailed,
    data: dispositionFailed,
    isLoading: isLoadingDispositionFailed,
    isError: isErrorDispositionFailed,
  } = useDispositionsByName("Fail");

  const [submissionStatus, setSubmissionStatus] = React.useState(false);
  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();
  const { authAxios } = useFetchContext();
  const theme = useTheme();
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    React.useState(false);

  if (
    isErrorDispositionPassed ||
    isErrorDispositionFailed ||
    isErrorDispositionRequiresReview
  ) {
    return (
      <>
        {isErrorDispositionPassed && (
          <ErrorMessage error={errorDispositionPassed} />
        )}
        {isErrorDispositionRequiresReview && (
          <ErrorMessage error={errorDispositionRequiresReview} />
        )}
        {isErrorDispositionFailed && (
          <ErrorMessage error={errorDispositionFailed} />
        )}
      </>
    );
  }

  if (
    isLoadingDispositionFailed ||
    isLoadingDispositionPassed ||
    isLoadingDispositionRequiresReview
  ) {
    return (
      <div style={theme.containerMargin}>
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
      </div>
    );
  }

  if (submissionStatus && !historicData) {
    return (
      <Backdrop open={submissionStatus}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (submissionStatus && historicData) {
    return (
      <div style={theme.containerMargin}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      </div>
    );
  }

  const getValueToSubmit = (name: string, values: any) => {
    switch (name) {
      case "Forward Voltage":
        return values.forwardVoltage;
      case "Reverse Voltage":
        return values.reverseVoltage;
      case "Diode Test Pass/Fail":
        return values.passesTest;
      default:
        return null;
    }
  };

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      spacing={4}
    >
      <Grid item xs={12}>
        <Formik
          initialValues={{
            forwardVoltage: "",
            reverseVoltage: "",
            passesTest: false,
          }}
          validationSchema={Yup.object({
            forwardVoltage: Yup.string().required("Field must be required"),
            reverseVoltage: Yup.string().required("Field must be required"),
            passesTest: Yup.bool().required(),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await measurementSubmission({
              testerType: TesterTypes.Diode,
              setSubmissionStatus,
              setSubmittingForm: setSubmitting,
              historicData,
              historicDate,
              historicUser,
              historicDisposition,
              assetData,
              procedureResultData,
              values,
              dispositionFailed,
              dispositionPassed,
              minimumMeasurementResultsLength: 3,
              getValueToSubmit,
              startDateTime,
              dispositionRequiresReview,
              closeHistoricModal,
              resetForm,
              history,
              dispatch,
              authAxios,
              mutateSubmitMeasurementResult,
              mutateSubmitStepResult,
              mutateSubmitProcedureResult,
              setClearedValues,
            });
          }}
        >
          {({ errors, touched, submitForm }) => {
            return (
              <Form>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item xs={4}>
                    <Field
                      id="forwardVoltage"
                      type="number"
                      data-testid="forwardVoltage"
                      name="forwardVoltage"
                      helperText={
                        touched.forwardVoltage ? errors.forwardVoltage : ""
                      }
                      error={
                        touched.forwardVoltage && Boolean(errors.forwardVoltage)
                      }
                      component={TextField}
                      label="Forward Voltage"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">V</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      id="reverseVoltage"
                      type="number"
                      data-testid="reverseVoltage"
                      name="reverseVoltage"
                      helperText={
                        touched.reverseVoltage ? errors.reverseVoltage : ""
                      }
                      error={
                        touched.reverseVoltage && Boolean(errors.reverseVoltage)
                      }
                      component={TextField}
                      label="Reverse Voltage"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">V</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      id="passesTest"
                      type="text"
                      data-testid="passesTest"
                      name="passesTest"
                      helperText={touched.passesTest ? errors.passesTest : ""}
                      error={touched.passesTest && Boolean(errors.passesTest)}
                      component={CheckboxWithLabel}
                      Label={{ label: "Passes Test?" }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CharacterizationQueueDialog
                      procedureResultData={assetData}
                      historicData={historicData}
                      assetData={assetData}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      style={theme.btnNew}
                      fullWidth
                      onClick={() => {
                        setConfirmationDialogOpen(true);
                      }}
                    >
                      Submit Measurement
                    </Button>
                  </Grid>
                </Grid>
                <ConfirmationDialog
                  id="diode-test-confirmation"
                  keepMounted
                  open={confirmationDialogOpen}
                  title="Diode Test Confirmation"
                  content="Are you sure that you want to submit this Diode Test?"
                  onCancel={() => setConfirmationDialogOpen(false)}
                  onSubmit={submitForm}
                />
              </Form>
            );
          }}
        </Formik>
      </Grid>
    </Grid>
  );
};
