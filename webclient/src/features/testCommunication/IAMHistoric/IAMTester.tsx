import React from "react";
import {
  Grid,
  useTheme,
  Typography,
  LinearProgress,
  Box,
  Badge,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import { Field, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import some from "lodash/some";
import * as Yup from "yup";

import { useFetchContext } from "../../common/FetchContext";

import {
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
  useMutateRecordCompletion,
} from "../common/testMutations";
import { useAuthContext } from "../../common/AuthContext";
import { ErrorMessage } from "../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../util/errorMessaging";
import { ConfirmationDialog } from "../../common/ConfirmationDialog";
import { useQueryClient } from "react-query";
import measurementSubmission from "../common/measurementSubmission";
import TesterTypes from "../common/TesterTypes";
import { useHistory } from "react-router-dom";

export const IAMTester = ({
  procedureResultData,
  assetData,
  setClearedValues,
  dispositionRequiresReview,
  dispositionPassed,
  historicUser,
  historicDate,
  historicData,
  historicDisposition,
  closeHistoricModal,
}: any) => {
  const theme = useTheme();
  const history = useHistory();
  const { dispatch } = useAuthContext();
  const { authAxios } = useFetchContext();
  const [open, setOpen] = React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState(false);
  const [filledValues, setFilledValues] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();
  const { mutateAsync: mutateRecordCompletion } = useMutateRecordCompletion();
  const toastId = React.useRef<any>(null);

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

  const renderFormButton = (values: any, submitForm: any) => {
    return (
      <>
        <Grid item xs={6}>
          <Button
            color="primary"
            variant="contained"
            onClick={submitForm}
            fullWidth
          >
            Submit
          </Button>
        </Grid>
      </>
    );
  };

  const showSuccessToast = (message: string) => {
    if (toastId.current === null) {
      toastId.current = toast.success(message, { progress: undefined });
    } else {
      toast.update(toastId.current, { render: <>{message}</> });
    }
  };

  const isDispositionPerformedReviewOnly = () => {
    return historicDisposition?.name.includes("Performed - Record Only");
  };

  const submitRecordCompletion = async () => {
    try {
      if (
        historicData &&
        (!historicDate || !historicUser || !historicDisposition || !assetData)
      ) {
        throw new Error(
          "Asset, reviewer user , reviewer date and at least one IAM field are mandatory for capture historic record."
        );
      }

      await mutateRecordCompletion({
        procedure_result: procedureResultData.id,
        user: historicUser.username,
        start_datetime: historicDate,
      });

      if (closeHistoricModal) {
        closeHistoricModal();
      }
      showSuccessToast(`Submission of record was successful.`);
    } catch (error) {
      processErrorOnMutation(error);
    }
  };
  const requiredMessage = "Field is required";

  return (
    <>
      <Formik
        initialValues={{
          zero: "",
          five: "",
          ten: "",
          fifteen: "",
          twenty: "",
          twentyFive: "",
          thirty: "",
          thirtyFive: "",
          fourty: "",
          fourtyFive: "",
          fifty: "",
          fiftyFive: "",
          sixty: "",
          sixtyFive: "",
          seventy: "",
          seventyFive: "",
          eigthy: "",
          eightyFive: "",
          ninety: "",
        }}
        validationSchema={Yup.object({
          zero: Yup.string().required(requiredMessage),
          five: Yup.string().required(requiredMessage),
          ten: Yup.string().required(requiredMessage),
          fifteen: Yup.string().required(requiredMessage),
          twenty: Yup.string().required(requiredMessage),
          twentyFive: Yup.string().required(requiredMessage),
          thirty: Yup.string().required(requiredMessage),
          thirtyFive: Yup.string().required(requiredMessage),
          fourty: Yup.string().required(requiredMessage),
          fourtyFive: Yup.string().required(requiredMessage),
          fifty: Yup.string().required(requiredMessage),
          fiftyFive: Yup.string().required(requiredMessage),
          sixty: Yup.string().required(requiredMessage),
          sixtyFive: Yup.string().required(requiredMessage),
          seventy: Yup.string().required(requiredMessage),
          seventyFive: Yup.string().required(requiredMessage),
          eigthy: Yup.string().required(requiredMessage),
          eightyFive: Yup.string().required(requiredMessage),
          ninety: Yup.string().required(requiredMessage),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await measurementSubmission({
            testerType: TesterTypes.IAM,
            setSubmittingForm: setSubmitting,
            setSubmissionStatus,
            historicData,
            historicDate,
            historicUser,
            historicDisposition,
            assetData,
            procedureResultData,
            values,
            closeHistoricModal,
            history,
            dispatch,
            authAxios,
            mutateSubmitMeasurementResult,
            mutateSubmitStepResult,
            mutateSubmitProcedureResult,
            showSuccessToast,
          });
          /*setIsSubmitting(true);
          try {
            if (
              historicData &&
              (!historicDate ||
                !historicUser ||
                !historicDisposition ||
                !assetData)
            ) {
              throw new Error(
                "Asset, reviewer user , reviewer date and at least one IAM field are mandatory for capture historic record."
              );
            }

            const stepResult = procedureResultData.step_results[0];
            const measurementResults = stepResult.measurement_results;

            for (let measurementResult of measurementResults) {
              let result = null;
              switch (measurementResult.name) {
                case "IAM at 0° AOI":
                  result = values.zero;
                  break;
                case "IAM at 5° AOI":
                  result = values.five;
                  break;
                case "IAM at 10° AOI":
                  result = values.ten;
                  break;
                case "IAM at 15° AOI":
                  result = values.fifteen;
                  break;
                case "IAM at 20° AOI":
                  result = values.twenty;
                  break;
                case "IAM at 25° AOI":
                  result = values.twentyFive;
                  break;
                case "IAM at 30° AOI":
                  result = values.thirty;
                  break;
                case "IAM at 35° AOI":
                  result = values.thirtyFive;
                  break;
                case "IAM at 40° AOI":
                  result = values.fourty;
                  break;
                case "IAM at 45° AOI":
                  result = values.fourtyFive;
                  break;
                case "IAM at 50° AOI":
                  result = values.fifty;
                  break;
                case "IAM at 55° AOI":
                  result = values.fiftyFive;
                  break;
                case "IAM at 60° AOI":
                  result = values.sixty;
                  break;
                case "IAM at 65° AOI":
                  result = values.sixtyFive;
                  break;
                case "IAM at 70° AOI":
                  result = values.seventy;
                  break;
                case "IAM at 75° AOI":
                  result = values.seventyFive;
                  break;
                case "IAM at 80° AOI":
                  result = values.eigthy;
                  break;
                case "IAM at 85° AOI":
                  result = values.eightyFive;
                  break;
                case "IAM at 90° AOI":
                  result = values.ninety;
                  break;
                default:
                  break;
              }

              if (result === null) {
                continue;
              }

              await mutateSubmitMeasurementResult({
                authAxios,
                user: historicUser.id,
                datetime: historicDate,
                historic: true,
                disposition: historicDisposition.id,
                result_double: result,
                asset: assetData.id,
                measurementResultId: measurementResult.id,
              });

              showSuccessToast(`Submitted ${measurementResult.name}`);
              //toast.success(`Submitted ${measurementResult.name}`);
            }

            await mutateSubmitStepResult({
              authAxios,
              disposition: historicDisposition.id,
              stepResultId: procedureResultData.step_results[0].id,
              start_datetime: procedureResultData.start_datetime,
            });

            await mutateSubmitProcedureResult({
              authAxios,
              disposition: historicDisposition.id,
              procedureResultId: procedureResultData.id,
            });

            showSuccessToast("IAM Test Submitted");
            setSubmitting(false);
            if (closeHistoricModal) {
              closeHistoricModal();
            } else {
              resetForm();
            }
          } catch (error) {
            // toast.error(`Error submitting IAM Measurement: ${error}`);
            processErrorOnMutation(error);
            setSubmitting(false);
          }

          setIsSubmitting(false);*/
        }}
      >
        {({ errors, touched, submitForm, values }) => {
          return (
            <Form>
              {!isDispositionPerformedReviewOnly() && (
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <Field
                      id="zero"
                      type="number"
                      data-testid="zero"
                      name="zero"
                      helperText={touched.zero ? errors.zero : ""}
                      error={touched.zero && Boolean(errors.zero)}
                      component={TextField}
                      label="0° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="five"
                      type="number"
                      data-testid="five"
                      name="five"
                      helperText={touched.five ? errors.five : ""}
                      error={touched.five && Boolean(errors.five)}
                      component={TextField}
                      label="5° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="ten"
                      type="number"
                      data-testid="ten"
                      name="ten"
                      helperText={touched.ten ? errors.ten : ""}
                      error={touched.ten && Boolean(errors.ten)}
                      component={TextField}
                      label="10° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="fifteen"
                      type="number"
                      data-testid="isc"
                      name="fifteen"
                      helperText={touched.fifteen ? errors.fifteen : ""}
                      error={touched.fifteen && Boolean(errors.fifteen)}
                      component={TextField}
                      label="15° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="twenty"
                      type="number"
                      data-testid="twenty"
                      name="twenty"
                      helperText={touched.twenty ? errors.twenty : ""}
                      error={touched.twenty && Boolean(errors.twenty)}
                      component={TextField}
                      label="20° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="twentyFive"
                      type="number"
                      data-testid="twentyFive"
                      name="twentyFive"
                      helperText={touched.twentyFive ? errors.twentyFive : ""}
                      error={touched.twentyFive && Boolean(errors.twentyFive)}
                      component={TextField}
                      label="25° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="thirty"
                      type="number"
                      data-testid="thirty"
                      name="thirty"
                      helperText={touched.thirty ? errors.thirty : ""}
                      error={touched.thirty && Boolean(errors.thirty)}
                      component={TextField}
                      label="30° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="thirtyFive"
                      type="number"
                      data-testid="thirtyFive"
                      name="thirtyFive"
                      helperText={touched.thirtyFive ? errors.thirtyFive : ""}
                      error={touched.thirtyFive && Boolean(errors.thirtyFive)}
                      component={TextField}
                      label="35° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="fourty"
                      type="number"
                      data-testid="fourty"
                      name="fourty"
                      helperText={touched.fourty ? errors.fourty : ""}
                      error={touched.fourty && Boolean(errors.fourty)}
                      component={TextField}
                      label="40° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="fourtyFive"
                      type="number"
                      data-testid="fourtyFive"
                      name="fourtyFive"
                      helperText={touched.fourtyFive ? errors.fourtyFive : ""}
                      error={touched.fourtyFive && Boolean(errors.fourtyFive)}
                      component={TextField}
                      label="45° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="fifty"
                      type="number"
                      data-testid="fifty"
                      name="fifty"
                      helperText={touched.fifty ? errors.fifty : ""}
                      error={touched.fifty && Boolean(errors.fifty)}
                      component={TextField}
                      label="50° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="fiftyFive"
                      type="number"
                      data-testid="fiftyFive"
                      name="fiftyFive"
                      helperText={touched.fiftyFive ? errors.fiftyFive : ""}
                      error={touched.fiftyFive && Boolean(errors.fiftyFive)}
                      component={TextField}
                      label="55° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="sixty"
                      type="number"
                      data-testid="sixty"
                      name="sixty"
                      helperText={touched.sixty ? errors.sixty : ""}
                      error={touched.sixty && Boolean(errors.sixty)}
                      component={TextField}
                      label="60° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="sixtyFive"
                      type="number"
                      data-testid="sixtyFive"
                      name="sixtyFive"
                      helperText={touched.sixtyFive ? errors.sixtyFive : ""}
                      error={touched.sixtyFive && Boolean(errors.sixtyFive)}
                      component={TextField}
                      label="65° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="seventy"
                      type="number"
                      data-testid="seventy"
                      name="seventy"
                      helperText={touched.seventy ? errors.seventy : ""}
                      error={touched.seventy && Boolean(errors.seventy)}
                      component={TextField}
                      label="70° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="seventyFive"
                      type="number"
                      data-testid="seventyFive"
                      name="seventyFive"
                      helperText={touched.seventyFive ? errors.seventyFive : ""}
                      error={touched.seventyFive && Boolean(errors.seventyFive)}
                      component={TextField}
                      label="75° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="eigthy"
                      type="number"
                      data-testid="eigthy"
                      name="eigthy"
                      helperText={touched.eigthy ? errors.eigthy : ""}
                      error={touched.eigthy && Boolean(errors.eigthy)}
                      component={TextField}
                      label="80° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="eightyFive"
                      type="number"
                      data-testid="eightyFive"
                      name="eightyFive"
                      helperText={touched.eightyFive ? errors.eightyFive : ""}
                      error={touched.eightyFive && Boolean(errors.eightyFive)}
                      component={TextField}
                      label="85° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="ninety"
                      type="number"
                      data-testid="ninety"
                      name="ninety"
                      helperText={touched.ninety ? errors.ninety : ""}
                      error={touched.ninety && Boolean(errors.ninety)}
                      component={TextField}
                      label="90° AOI"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  {renderFormButton(values, submitForm)}
                  <Grid item xs={6}>
                    {isSubmitting && <CircularProgress />}
                  </Grid>
                </Grid>
              )}
            </Form>
          );
        }}
      </Formik>
      {isDispositionPerformedReviewOnly() && (
        <Button
          color="primary"
          variant="contained"
          onClick={submitRecordCompletion}
          fullWidth
        >
          Submit Record Completion
        </Button>
      )}
    </>
  );
};
