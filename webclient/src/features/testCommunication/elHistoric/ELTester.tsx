import React from "react";
import { Grid, LinearProgress, useTheme } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";

import CameraAltIconOutlined from "@material-ui/icons/CameraAltOutlined";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import * as Yup from "yup";

import { useFetchContext } from "../../common/FetchContext";
import { ELImageModal } from "./ELImageModal";

import { usePostFile } from "../../common/services/fileServices";
import {
  useLinkFileToMeasurement,
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
} from "../common/testMutations";
import measurementSubmission from "../common/measurementSubmission";
import TesterTypes from "../common/TesterTypes";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../common/AuthContext";

export const ELTester = ({
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
  const [openRaw, setOpenRaw] = React.useState(false);
  const [openCropped, setOpenCropped] = React.useState(false);
  const [raw, setRaw] = React.useState<any[]>([]);
  const [cropped, setCropped] = React.useState<any[]>([]);
  const [submissionStatus, setSubmissionStatus] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();

  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFileToMeasurement } =
    useLinkFileToMeasurement();
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    React.useState(false);

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

  return (
    <>
      <Formik
        initialValues={{
          exposure_count: null,
          iso: null,
          aperture: null,
          injection_current: null,
          exposure_time: null,
        }}
        validationSchema={Yup.object({
          injection_current: Yup.number(),
          exposure_time: Yup.number(),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          /*
          Order of Operations:
            - Upload file
            - Find measurement result
            - Attach File

            - For Each Value in Values:
              - Find measurement result
              - Mutate measurement result

            - Mutate Step Result
            - Mutate Procedure Result
            - Set Submitting False
        */
          await measurementSubmission({
            testerType: TesterTypes.EL,
            setSubmissionStatus: setIsSubmitting,
            setSubmittingForm: setSubmitting,
            historicData,
            historicDate,
            historicUser,
            historicDisposition,
            assetData,
            procedureResultData,
            values,
            closeHistoricModal,
            resetForm,
            history,
            dispatch,
            authAxios,
            mutateSubmitMeasurementResult,
            mutateSubmitStepResult,
            mutateSubmitProcedureResult,
            raw,
            cropped,
            mutatePostFile,
            mutateLinkFileToMeasurement,
          });
          /*
          setIsSubmitting(true);

          try {
            if (
              historicData &&
              (!historicDate ||
                !historicUser ||
                !historicDisposition ||
                !assetData)
            ) {
              throw new Error(
                "Asset, user and date are mandatory for capture historic record."
              );
            }

            let elImageRaw = find(
              procedureResultData.step_results[0].measurement_results,
              ["name", "EL Image (raw)"]
            );
            let elImageCropped = find(
              procedureResultData.step_results[0].measurement_results,
              ["name", "EL Image (grayscale)"]
            );

            let postedImage = await mutatePostFile({ authAxios, file: raw[0] });
            await mutateLinkFileToMeasurement({
              authAxios,
              fileId: postedImage.id,
              measurementId: elImageRaw.id,
            });

            await mutateSubmitMeasurementResult({
              authAxios,
              user: historicUser.id,
              datetime: historicDate,
              historic: true,
              disposition: historicDisposition.id,
              asset: assetData.id,
              measurementResultId: elImageRaw.id,
            });

            toast.info("Uploaded Raw Image");

            postedImage = await mutatePostFile({ authAxios, file: cropped[0] });
            await mutateLinkFileToMeasurement({
              authAxios,
              fileId: postedImage.id,
              measurementId: elImageCropped.id,
            });

            await mutateSubmitMeasurementResult({
              authAxios,
              user: historicUser.id,
              datetime: historicDate,
              historic: true,
              disposition: historicDisposition.id,
              asset: assetData.id,
              measurementResultId: elImageCropped.id,
            });

            toast.info("Uploaded Cropped Image");

            const stepResult = procedureResultData.step_results[0];
            const measurementResults = stepResult.measurement_results;

            for (let measurementResult of measurementResults) {
              let result = null;
              switch (measurementResult.name) {
                case "Exposure Count":
                  result = values.exposure_count;
                  break;
                case "ISO":
                  result = values.iso;
                  break;
                case "Aperture":
                  result = values.aperture;
                  break;
                case "Injection Current":
                  result = values.injection_current;
                  break;
                case "Exposure Time":
                  result = values.exposure_time;
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
              toast.success(`Submitted ${measurementResult.name}`);
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

            setSubmitting(false);
          } catch (error) {
            toast.error(`Error submitting EL Measurement: ${error}`);
            setSubmitting(false);
          }

          if (closeHistoricModal) {
            closeHistoricModal();
          } else {
            resetForm();
          }

          toast.success("Measurement Saved");
          setIsSubmitting(false);
          */
        }}
      >
        {({ errors, touched, submitForm, values }) => {
          return (
            <Form>
              <Paper style={{ marginTop: 32, marginBottom: 32 }} elevation={2}>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell> Raw </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setOpenRaw(!openRaw);
                            }}
                            startIcon={
                              raw[0] ? (
                                <CameraAltIcon />
                              ) : (
                                <CameraAltIconOutlined />
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell> Cropped </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setOpenCropped(!openCropped);
                            }}
                            startIcon={
                              cropped[0] ? (
                                <CameraAltIcon />
                              ) : (
                                <CameraAltIconOutlined />
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={6}>
                  <Field
                    id="exposure_count"
                    type="number"
                    data-testid="exposure_count"
                    name="exposure_count"
                    helperText={
                      touched.exposure_count ? errors.exposure_count : ""
                    }
                    error={
                      touched.exposure_count && Boolean(errors.exposure_count)
                    }
                    component={TextField}
                    label="Exposure Count"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="iso"
                    type="number"
                    data-testid="iso"
                    name="iso"
                    helperText={touched.iso ? errors.iso : ""}
                    error={touched.iso && Boolean(errors.iso)}
                    component={TextField}
                    label="ISO"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="aperture"
                    type="number"
                    data-testid="aperture"
                    name="aperture"
                    helperText={touched.aperture ? errors.aperture : ""}
                    error={touched.aperture && Boolean(errors.aperture)}
                    component={TextField}
                    label="Aperture"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="injection_current"
                    type="number"
                    data-testid="injection_current"
                    name="injection_current"
                    helperText={
                      touched.injection_current ? errors.injection_current : ""
                    }
                    error={
                      touched.injection_current &&
                      Boolean(errors.injection_current)
                    }
                    component={TextField}
                    label="Injection Current (A)"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="exposure_time"
                    type="number"
                    data-testid="exposure_time"
                    name="exposure_time"
                    helperText={
                      touched.exposure_time ? errors.exposure_time : ""
                    }
                    error={
                      touched.exposure_time && Boolean(errors.exposure_time)
                    }
                    component={TextField}
                    label="Exposure Time (s)"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  {raw[0] && cropped[0] ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={submitForm}
                      fullWidth
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button fullWidth disabled>
                      Submit
                    </Button>
                  )}
                </Grid>
                <Grid item xs={6}>
                  {isSubmitting && <CircularProgress />}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
      <ELImageModal
        image={raw}
        setImage={setRaw}
        open={openRaw}
        setOpen={setOpenRaw}
      />
      <ELImageModal
        image={cropped}
        setImage={setCropped}
        open={openCropped}
        setOpen={setOpenCropped}
      />
    </>
  );
};
