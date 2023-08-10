import React from "react";
import {
  Button,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";

import { PositionChartOne } from "./PositionChartOne";
import { PositionChartTwo } from "./PositionChartTwo";
import { PositionChartThree } from "./PositionChartThree";
import { SubmissionColorModal } from "./submissionModal";
import { ConfirmationDialog } from "../../common/ConfirmationDialog";

import { useAuthContext } from "../../common/AuthContext";
import { useFetchContext } from "../../common/FetchContext";
import { ErrorMessage } from "../../common/ErrorMessage";
import { useDispositionsByName } from "../../common/services/dispositionServices";
import {
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
} from "../common/testMutations";
import measurementSubmission from "../common/measurementSubmission";
import TesterTypes from "../common/TesterTypes";
import CharacterizationQueueDialog from "../common/CharacterizationQueueDialog";

export const ColorlimiterTester = ({
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
  const theme = useTheme();
  const history = useHistory();
  const { dispatch } = useAuthContext();
  const { authAxios } = useFetchContext();

  const [backsheetValues, setBacksheetValues] = React.useState<any[]>([]);
  const [dataIndex, setIndex] = React.useState(0);
  const [chart, setChart] = React.useState(1);
  const selections = [
    { value: 1, label: "Full Cell" },
    { value: 2, label: "Half Cell 1" },
    { value: 3, label: "Half Cell 2" },
  ];
  const l_ref = React.useRef<any>();
  const a_ref = React.useRef<any>();
  const b_ref = React.useRef<any>();
  const nextRef = React.useRef<any>();
  const [direction, setDirection] = React.useState(0);
  const [modal, setModal] = React.useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState(false);

  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();

  const {
    error: errorDispositionRequiresReview,
    data: dispositionRequiresReview,
    isLoading: isLoadingDispositionRequiresReview,
    isError: isErrorDispositionRequiresReview,
  } = useDispositionsByName("Requires Review");

  const handleChart = (event: any) => {
    setChart(event.target.value);
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const handleNext = (event: any) => {
    if (event.which === 13) {
      if (event.target === l_ref.current) {
        a_ref.current.focus();
      } else if (event.target === a_ref.current) {
        b_ref.current.focus();
      } else if (event.target === b_ref.current && dataIndex !== 9) {
        nextRef.current.focus();
      }
    }
  };

  const submitData: () => Promise<void> = async () => {
    await measurementSubmission({
      testerType: TesterTypes.Colorimeter,
      setConfirmationDialogOpen,
      setSubmissionStatus,
      setModal,
      historicData,
      historicDate,
      historicUser,
      historicDisposition,
      assetData,
      procedureResultData,
      dispositionRequiresReview,
      startDateTime,
      closeHistoricModal,
      history,
      dispatch,
      authAxios,
      mutateSubmitMeasurementResult,
      mutateSubmitStepResult,
      mutateSubmitProcedureResult,
      setClearedValues,
      chart,
      backsheetValues,
    });
  };

  if (isErrorDispositionRequiresReview) {
    return (
      <>
        {isErrorDispositionRequiresReview && (
          <ErrorMessage error={errorDispositionRequiresReview} />
        )}
      </>
    );
  }

  if (isLoadingDispositionRequiresReview) {
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

  if (submissionStatus) {
    return (
      <Backdrop open={submissionStatus}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <Grid container direction="column" alignItems="stretch" spacing={2}>
        <Grid item>
          <CharacterizationQueueDialog
            historicData={historicData}
            procedureResultData={procedureResultData}
            assetData={assetData}
          />
        </Grid>
        <Grid item>
          <Paper elevation={2} style={{ padding: 5 }}>
            <Formik
              initialValues={{
                l_Value: backsheetValues[dataIndex]?.l_value,
                a_Value: backsheetValues[dataIndex]?.a_value,
                b_Value: backsheetValues[dataIndex]?.b_value,
              }}
              validationSchema={Yup.object({
                l_Value: Yup.number()
                  .min(0)
                  .max(100)
                  .required("Field must be required"),
                a_Value: Yup.number().required("Field must be required"),
                b_Value: Yup.number().required("Field must be required"),
              })}
              onSubmit={async (values, { resetForm }) => {
                console.log(values);
                console.log(backsheetValues);
                console.log(dataIndex);
                let updatedValues = backsheetValues;
                updatedValues[dataIndex] = {
                  position: dataIndex,
                  l_value: values.l_Value,
                  a_value: values.a_Value,
                  b_value: values.b_Value,
                };

                setBacksheetValues(updatedValues);

                var tempIndex = dataIndex;

                if (direction === -1) {
                  tempIndex = dataIndex - 1;
                } else if (direction === 1) {
                  tempIndex = dataIndex + 1;
                } else if (direction === 0) {
                  tempIndex = dataIndex;
                }
                setIndex(tempIndex);

                if (
                  backsheetValues[tempIndex]?.l_value === null ||
                  backsheetValues[tempIndex]?.l_value === undefined
                ) {
                  resetForm({
                    values: {
                      l_Value: "",
                      a_Value: "",
                      b_Value: "",
                    },
                  });
                } else {
                  resetForm({
                    values: {
                      l_Value: backsheetValues[tempIndex]?.l_value,
                      a_Value: backsheetValues[tempIndex]?.a_value,
                      b_Value: backsheetValues[tempIndex]?.b_value,
                    },
                  });
                }
                l_ref.current.focus();
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
                      <Grid item xs={3}>
                        <Select
                          labelId="chart-select"
                          id="chart-select"
                          value={chart}
                          onChange={handleChart}
                          fullWidth
                        >
                          {selections.map((item: any) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={2}>
                        <Paper style={{ padding: 5 }}>
                          <Typography variant="body1">
                            Position: {dataIndex + 1}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={1}>
                        <Field
                          id="l_Value"
                          type="number"
                          data-testid="l_Value"
                          name="l_Value"
                          helperText={touched.l_Value ? errors.l_Value : ""}
                          error={touched.l_Value && Boolean(errors.l_Value)}
                          component={TextField}
                          label="L*"
                          fullWidth
                          autoFocus
                          inputRef={l_ref}
                          onKeyDown={handleNext}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Field
                          id="a_Value"
                          type="number"
                          data-testid="a_Value"
                          name="a_Value"
                          helperText={touched.a_Value ? errors.a_Value : ""}
                          error={touched.a_Value && Boolean(errors.a_Value)}
                          component={TextField}
                          label="A*"
                          fullWidth
                          inputRef={a_ref}
                          onKeyDown={handleNext}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Field
                          id="b_Value"
                          type="number"
                          data-testid="b_Value"
                          name="b_Value"
                          helperText={touched.b_Value ? errors.b_Value : ""}
                          error={touched.b_Value && Boolean(errors.b_Value)}
                          component={TextField}
                          label="B*"
                          fullWidth
                          inputRef={b_ref}
                          onKeyDown={handleNext}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        {dataIndex !== 0 ? (
                          <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            onClick={() => {
                              setDirection(-1);
                              submitForm();
                            }}
                          >
                            {"<"}
                          </Button>
                        ) : (
                          <Button variant="contained" disabled fullWidth>
                            {"<"}
                          </Button>
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        {dataIndex !== 9 ? (
                          <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            buttonRef={nextRef}
                            onClick={() => {
                              setDirection(1);
                              submitForm();
                            }}
                          >
                            {">"}
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            /*ref={nextRef}*/
                            onClick={async () => {
                              setDirection(0);
                              await submitForm();
                              handleModal();
                            }}
                          >
                            Submit
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Paper>
        </Grid>
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          <Grid
            item
            xs={2}
            container
            direction="column"
            spacing={10}
            justify="flex-start"
            alignItems="stretch"
          >
            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                Calibrated True White
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                borderStyle: "solid",
                borderWidth: "1px",
                height: "35px",
                backgroundColor: "#F4F4F2",
              }}
            ></Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                Calibrated True Black
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                borderStyle: "solid",
                borderWidth: "1px",
                height: "35px",
                backgroundColor: "#010101",
              }}
            ></Grid>
          </Grid>
          <Grid item xs={10}>
            {chart === 1 && (
              <PositionChartOne position={dataIndex} colors={backsheetValues} />
            )}
            {chart === 2 && (
              <PositionChartTwo position={dataIndex} colors={backsheetValues} />
            )}
            {chart === 3 && (
              <PositionChartThree
                position={dataIndex}
                colors={backsheetValues}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <SubmissionColorModal
        data={backsheetValues}
        chart={chart}
        open={modal}
        setOpen={handleModal}
        setSubmit={() => setConfirmationDialogOpen(true)}
      />
      <ConfirmationDialog
        id="colorimeter-test-confirmation"
        keepMounted
        open={confirmationDialogOpen}
        title="Colorimeter Test Confirmation"
        content="Are you sure that you want to submit this Colorimeter Test?"
        onCancel={() => setConfirmationDialogOpen(false)}
        onSubmit={submitData}
      />
    </>
  );
};
