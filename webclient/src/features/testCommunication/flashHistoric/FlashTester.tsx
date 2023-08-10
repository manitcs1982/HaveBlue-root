import React from "react";
import { Badge, Grid, LinearProgress, useTheme } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import Button from "@material-ui/core/Button";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";

import { useFetchContext } from "../../common/FetchContext";
import { FlashFileModal } from "./FlashFileModal";

import { usePostFile } from "../../common/services/fileServices";
import {
  useAddMeasurementToStep,
  useLinkFileToMeasurement,
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
} from "../common/testMutations";
import measurementSubmission from "../common/measurementSubmission";
import TesterTypes from "../common/TesterTypes";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../common/AuthContext";

export const FlashTester = ({
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
  const { authAxios } = useFetchContext();
  const { dispatch } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<any[]>([]);
  const [submissionStatus, setSubmissionStatus] = React.useState(false);
  const [filledValues, setFilledValues] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();
  const { mutateAsync: mutateAddMeasurementToStep } = useAddMeasurementToStep();

  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFileToMeasurement } =
    useLinkFileToMeasurement();
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    React.useState(false);

  React.useEffect(() => {
    if (historicUser) {
      console.log(historicUser);
    }
  }, [historicUser]);

  const renderButton = (values: any, submitForm: any) => {
    if (!filledValues && files.length === 0) {
      return (
        <>
          <Grid item xs={12}>
            <Button color="primary" variant="contained" disabled fullWidth>
              Autofill Values From Files
            </Button>
          </Grid>
        </>
      );
    } else if (!filledValues && files.length > 0) {
      return (
        <>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                autofillValues(values);
              }}
              fullWidth
            >
              Autofill Values From Files
            </Button>
          </Grid>
        </>
      );
    } else if (filledValues) {
      return (
        <>
          <Grid item xs={6}>
            <Button
              color="secondary"
              variant="contained"
              /*onClick={() => {autofillValues(values);}}*/
              disabled
              fullWidth
            >
              Retry Autofill
            </Button>
          </Grid>
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
    }
  };

  const autofillValues = (values: any) => {
    console.log(values);
    values.pmp = 12;
    values.voc = 11;
    values.vmp = 13;
    values.isc = 12;
    values.imp = 1;
    values.irradiance = 100;
    values.temperature = 98.2;
    console.log(values);
    setFilledValues(true);
  };

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
          pmp: null,
          voc: null,
          vmp: null,
          isc: null,
          imp: null,
          irradiance: null,
          temperature: null,
        }}
        validationSchema={Yup.object({
          pmp: Yup.number(),
          voc: Yup.number(),
          vmp: Yup.number(),
          isc: Yup.number(),
          imp: Yup.number(),
          irradiance: Yup.number(),
          temperature: Yup.number(),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await measurementSubmission({
            testerType: TesterTypes.Flash,
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
            files,
            mutatePostFile,
            mutateLinkFileToMeasurement,
            mutateAddMeasurementToStep,
          });
        }}
      >
        {({ errors, touched, submitForm, values }) => {
          return (
            <Form>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={6}>
                  <Field
                    id="pmp"
                    type="number"
                    data-testid="pmp"
                    name="pmp"
                    helperText={touched.pmp ? errors.pmp : ""}
                    error={touched.pmp && Boolean(errors.pmp)}
                    component={TextField}
                    label="PMP"
                    /*disabled*/
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="voc"
                    type="number"
                    data-testid="voc"
                    name="voc"
                    helperText={touched.voc ? errors.voc : ""}
                    error={touched.voc && Boolean(errors.voc)}
                    component={TextField}
                    label="VOC"
                    /*disabled*/
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="vmp"
                    type="number"
                    data-testid="vmp"
                    name="vmp"
                    helperText={touched.vmp ? errors.vmp : ""}
                    error={touched.vmp && Boolean(errors.vmp)}
                    component={TextField}
                    label="VMP"
                    /*disabled*/
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="isc"
                    type="number"
                    data-testid="isc"
                    name="isc"
                    helperText={touched.isc ? errors.isc : ""}
                    error={touched.isc && Boolean(errors.isc)}
                    component={TextField}
                    label="ISC"
                    /*disabled*/
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="imp"
                    type="number"
                    data-testid="imp"
                    name="imp"
                    helperText={touched.imp ? errors.imp : ""}
                    error={touched.imp && Boolean(errors.imp)}
                    component={TextField}
                    label="IMP"
                    /*disabled*/
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="irradiance"
                    type="number"
                    data-testid="irradiance"
                    name="irradiance"
                    helperText={touched.irradiance ? errors.irradiance : ""}
                    error={touched.irradiance && Boolean(errors.irradiance)}
                    component={TextField}
                    label="Irradiance"
                    /*disabled*/
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    id="temperature"
                    type="number"
                    data-testid="temperature"
                    name="temperature"
                    helperText={touched.temperature ? errors.temperature : ""}
                    error={touched.temperature && Boolean(errors.temperature)}
                    component={TextField}
                    label="Temperature"
                    /*disabled*/
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Badge badgeContent={files.length} color="secondary">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setOpen(!open);
                      }}
                      fullWidth
                    >
                      Add Files
                    </Button>
                  </Badge>
                </Grid>
                {renderButton(values, submitForm)}
                <Grid item xs={6}>
                  {isSubmitting && <CircularProgress />}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
      <FlashFileModal
        fileArray={files}
        setFiles={setFiles}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};
