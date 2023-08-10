import React from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  LinearProgress,
  Typography,
  useTheme,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ConfirmationDialog } from "../../common/ConfirmationDialog";

import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import { green, red } from "@material-ui/core/colors";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircle from "@material-ui/icons/CheckCircle";
import { useFetchContext } from "../../common/FetchContext";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useDispositionsByName } from "../../common/services/dispositionServices";
import {
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
} from "../common/testMutations";
import { LSDBTimer } from "../../common/Timer";

import { useAuthContext } from "../../common/AuthContext";
import { ErrorMessage } from "../../common/ErrorMessage";
import measurementSubmission from "../common/measurementSubmission";
import TesterTypes from "../common/TesterTypes";
import CharacterizationQueueDialog from "../common/CharacterizationQueueDialog";

export const WetLeakageTester = ({
  testerData,
  procedureResultData,
  assetData,
  setClearedValues,
  historicUser,
  historicDate,
  historicData,
  historicDisposition,
  closeHistoricModal,
  startDateTime,
}: any) => {
  const history = useHistory();
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

  const [testStatus, setTestStatus] = React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState(false);

  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();
  const { authAxios } = useFetchContext();
  const { dispatch } = useAuthContext();
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
          spacing={1}
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
      case "Insulation Resistance":
        return values.insulationResistance;
      case "Leakage Current":
        return values.leakageCurrent;
      case "Test Voltage":
        return values.systemVoltage;
      case "Water Temperature":
        return values.waterTemperature;
      case "Current Trip Setpoint":
        return values.currentTripSetpoint;
      case "Wet Leakage Current Pass/Fail":
        return testStatus;
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
      spacing={1}
    >
      <Grid item md={6} xs={12}>
        <LSDBTimer />
      </Grid>
      <Grid item md={6} xs={12}>
        <CharacterizationQueueDialog
          procedureResultData={procedureResultData}
          historicData={historicData}
          assetData={assetData}
        />
      </Grid>
      <Grid item xs={12}>
        <Formik
          initialValues={{
            moduleHeight: testerData.module_height,
            moduleWidth: testerData.module_width,
            systemVoltage: testerData.system_voltage,
            waterTemperature: "",
            leakageCurrent: "",
            insulationResistance: "",
            currentTripSetpoint: 3,
          }}
          validationSchema={Yup.object({
            moduleHeight: Yup.number().required("Field must be required"),
            moduleWidth: Yup.number().required("Field must be required"),
            systemVoltage: Yup.number().required("Field must be required"),
            waterTemperature: Yup.number().required("Field must be required"),
            leakageCurrent: Yup.number().required("Field must be required"),
            insulationResistance: Yup.number().required(
              "Field must be required"
            ),
            currentTripSetpoint: Yup.number().required(
              "Field must be required"
            ),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await measurementSubmission({
              testerType: TesterTypes.WetLeakage,
              setConfirmationDialogOpen,
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
              minimumMeasurementResultsLength: 6,
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
          {({
            errors,
            touched,
            submitForm,
            setFieldValue,
            initialValues,
            values,
          }) => {
            const calculateInsulation = (
              e: React.ChangeEvent<HTMLInputElement>
            ) => {
              setFieldValue("leakageCurrent", e.currentTarget.valueAsNumber);
              if (e.currentTarget.value === "") {
                setFieldValue("insulationResistance", "");
                return;
              }
              const moduleHeight = values.moduleHeight / 1000;
              const moduleWidth = values.moduleWidth / 1000;
              const systemVoltage = values.systemVoltage;
              const leakageCurrent = e.currentTarget.valueAsNumber * 1000;
              const insulationResistance =
                moduleWidth * moduleHeight * (systemVoltage / leakageCurrent);

              setFieldValue(
                "insulationResistance",
                insulationResistance === Infinity ? -1 : insulationResistance
              );
            };

            const renderResults = () => {
              if (values.insulationResistance !== "") {
                if (parseFloat(values.insulationResistance) > 40) {
                  setTestStatus(true);
                  return (
                    <>
                      <CheckCircle style={{ color: green[500] }} />
                      <Typography variant="subtitle1">Passed</Typography>
                    </>
                  );
                }
                setTestStatus(false);
                return (
                  <>
                    <CancelIcon style={{ color: red[500] }} />
                    <Typography variant="subtitle1">Failed</Typography>
                    <Typography variant="body2">less than :40MΩ·m²</Typography>
                  </>
                );
              }
            };

            return (
              <Form>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item xs={12} md={2}>
                    <Field
                      id="moduleHeight"
                      type="number"
                      data-testid="moduleHeight"
                      name="moduleHeight"
                      disabled
                      value={initialValues.moduleHeight}
                      helperText={
                        touched.moduleHeight ? errors.moduleHeight : ""
                      }
                      error={
                        touched.moduleHeight && Boolean(errors.moduleHeight)
                      }
                      component={TextField}
                      label="Module Height"
                      style={{ marginBottom: 32 }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">mm</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Field
                      id="moduleWidth"
                      type="number"
                      data-testid="moduleWidth"
                      name="moduleWidth"
                      value={initialValues.moduleWidth}
                      disabled
                      helperText={touched.moduleWidth ? errors.moduleWidth : ""}
                      error={touched.moduleWidth && Boolean(errors.moduleWidth)}
                      component={TextField}
                      label="Module Width"
                      style={{ marginBottom: 32 }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">mm</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Field
                      id="systemVoltage"
                      type="number"
                      data-testid="systemVoltage"
                      name="systemVoltage"
                      helperText={
                        touched.systemVoltage ? errors.systemVoltage : ""
                      }
                      error={
                        touched.systemVoltage && Boolean(errors.systemVoltage)
                      }
                      component={TextField}
                      label="System Voltage"
                      style={{ marginBottom: 32 }}
                      fullWidth
                      value={initialValues.systemVoltage}
                      disabled
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">V</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Field
                      id="waterTemperature"
                      type="number"
                      data-testid="waterTemperature"
                      name="waterTemperature"
                      helperText={
                        touched.waterTemperature ? errors.waterTemperature : ""
                      }
                      error={
                        touched.waterTemperature &&
                        Boolean(errors.waterTemperature)
                      }
                      component={TextField}
                      label="Water Temperature"
                      style={{ marginBottom: 32 }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">°C</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Field
                      id="leakageCurrent"
                      type="number"
                      data-testid="leakageCurrent"
                      name="leakageCurrent"
                      onChange={calculateInsulation}
                      helperText={
                        touched.leakageCurrent ? errors.leakageCurrent : ""
                      }
                      error={
                        touched.leakageCurrent && Boolean(errors.leakageCurrent)
                      }
                      component={TextField}
                      label="Leakage Current"
                      style={{ marginBottom: 32 }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">mA</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Field
                      id="insulationResistance"
                      type="number"
                      data-testid="insulationResistance"
                      name="insulationResistance"
                      helperText={
                        touched.insulationResistance
                          ? errors.insulationResistance
                          : ""
                      }
                      error={
                        touched.insulationResistance &&
                        Boolean(errors.insulationResistance)
                      }
                      component={TextField}
                      label="Insulation Resistance"
                      style={{ marginBottom: 32 }}
                      fullWidth
                      disabled
                      value={values.insulationResistance}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">MΩ·m²</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Field
                      id="currentTripSetpoint"
                      type="number"
                      data-testid="currentTripSetpoint"
                      name="currentTripSetpoint"
                      helperText={
                        touched.currentTripSetpoint
                          ? errors.currentTripSetpoint
                          : ""
                      }
                      error={
                        touched.currentTripSetpoint &&
                        Boolean(errors.currentTripSetpoint)
                      }
                      component={TextField}
                      label="Current Trip Setpoint"
                      style={{ marginBottom: 32 }}
                      fullWidth
                      value={values.currentTripSetpoint}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">mA</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={2}>
                    {renderResults()}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      style={theme.btnSubmit}
                      fullWidth
                      onClick={() => setConfirmationDialogOpen(true)}
                    >
                      Save Measurement
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      style={theme.btnClear}
                      fullWidth
                      onClick={() => setClearedValues(true)}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
                <ConfirmationDialog
                  id="wet-leakage-test-confirmation"
                  keepMounted
                  open={confirmationDialogOpen}
                  title="Wet Leakage Test Confirmation"
                  content="Are you sure that you want to submit this Wet Leakage Test?"
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
