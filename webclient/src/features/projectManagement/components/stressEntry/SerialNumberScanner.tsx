import React from "react";
import { useStressEntryContext } from "./StressEntryContext";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { FormFocusError } from "../../../common/FormFocusError";
import { TextField as FormikTextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  useTheme,
  Typography,
  Backdrop,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import { useValidateAssetSerial } from "../../../testCommunication/common/testMutations";
import { useUnitsBySerialNumber } from "../../../testCommunication/common/testQueries";

import { useAuthContext } from "../../../common/AuthContext";
import { useFetchContext } from "../../../common/FetchContext";
import { processErrorOnMutation } from "../../../../util/errorMessaging";
import { useHistory } from "react-router-dom";
import { filter, find } from "lodash";
import {
  STEP_RESULT_TEST_END_NAME,
  STEP_RESULT_TEST_START_NAME,
  STRESSOR_CHECK_IN_MODE,
  STRESSOR_CHECK_OUT_MODE,
  STRESSOR_NOT_APPLY_METADATA,
} from "./constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.grey[200],
      minHeight: 100,

      position: "relative",
      overflow: "auto",
    },
  })
);

const useFocus = () => {
  const htmlElRef = React.useRef(null);
  const setFocus = () => {
    htmlElRef.current && (htmlElRef.current as any).focus();
  };

  return { htmlElRef, setFocus };
};

export const SerialNumberScanner = () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const { state, dispatch } = useStressEntryContext();
  const { dispatch: authDispatch } = useAuthContext();
  const { authAxios } = useFetchContext();
  const { htmlElRef, setFocus } = useFocus();

  const {
    mutateAsync: mutateValidateAssetSerial,

    error: errorMutateValidateAsset,
    isError: isErrorMutateValidateAsset,
    isSuccess: isSuccessValidateAsset,
    isLoading: isLoadingValidateAsset,
  } = useValidateAssetSerial();

  const {
    data: units,
    isSuccess: isSuccessUnits,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
    error: errorUnits,
  } = useUnitsBySerialNumber(state.submittedSerialNumber);

  React.useEffect(() => {
    if (
      state.submittedSerialNumber &&
      state.submittedSerialNumber !== "" &&
      isSuccessUnits &&
      units.length === 0
    ) {
      toast.error("Invalid serial number.Please type another one.");

      setFocus();
    } else if (
      state.submittedSerialNumber &&
      state.submittedSerialNumber !== "" &&
      units &&
      units.length !== 0
    ) {
      dispatch({ type: "ADD_SCANNED_UNIT", payload: { unit: units[0] } });

      setFocus();
    }
  }, [dispatch, isSuccessUnits, setFocus, state.submittedSerialNumber, units]);

  if (isErrorMutateValidateAsset) {
    return <ErrorMessage error={errorMutateValidateAsset} />;
  }
  if (isLoadingUnits) {
    return (
      <Backdrop open={isLoadingUnits}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorUnits) {
    return <ErrorMessage error={errorUnits} />;
  }

  if (!state.selectedStressProcedure && state.mode === STRESSOR_CHECK_IN_MODE) {
    return null;
  }

  if (!state.selectedStressType && state.mode === STRESSOR_CHECK_OUT_MODE) {
    return null;
  }

  const checkUnits = async (e: any) => {
    try {
      for (let [key, value] of state.scannedUnits) {
        if (state.checkedUnits.has(key)) {
          toast.error(`Serial number ${key} already checked.`);
        } else {
          let mutateResult;
          if (state.mode === STRESSOR_CHECK_IN_MODE) {
            mutateResult = await mutateValidateAssetSerial({
              authAxios,
              asset_name: state.selectedStressType.name,
              procedure_definition: state.selectedStressProcedure.id,
              unitId: value.id,
            });
          } else if (state.mode === STRESSOR_CHECK_OUT_MODE) {
            mutateResult = await mutateValidateAssetSerial({
              authAxios,
              asset_name: state.selectedStressType.name,
              unitId: value.id,
            });
          }

          if (mutateResult && mutateResult.length === 0) {
            toast.error(
              "This PV module has nothing to do here!.Please review it in the scanned list and modify it."
            );
          } else {
            const procedureResult = mutateResult[0];
            const currentMode =
              state.mode === STRESSOR_CHECK_IN_MODE
                ? STEP_RESULT_TEST_START_NAME
                : STEP_RESULT_TEST_END_NAME;

            let stepResult = find(procedureResult.step_results, [
              "name",
              currentMode,
            ]);
            if (!stepResult) {
              toast.error(
                `The unit ${key} does not have work for the selected procedure.Please review it in the scanned list and modify it.`
              );
            } else {
              const linearExecutionGroup = stepResult.linear_execution_group;
              const stepResultSibling = filter(
                procedureResult.step_results,
                (stepResult) =>
                  stepResult.linear_execution_group === linearExecutionGroup &&
                  stepResult.name !== currentMode
              );
              dispatch({
                type: "ADD_CHECKED_UNIT",
                payload: {
                  unit: value,
                  procedureResult: mutateResult[0],
                  sibling: stepResultSibling[0] || STRESSOR_NOT_APPLY_METADATA,
                },
              });
              dispatch({ type: "REMOVE_SCANNED_UNIT", payload: { id: key } });
            }
          }
        }
      }
    } catch (err) {
      toast.error("Error while executing validating asset routine.");
      processErrorOnMutation(err, authDispatch, history);
    }
  };

  return (
    <Grid container direction="row" justify="space-around" alignItems="center">
      <Grid item xs={12}>
        <Formik
          initialValues={{
            serialNumber: "",
          }}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={Yup.object({
            serialNumber: Yup.string()
              .required("Field must be required")
              .test(
                "serial-number-dup",
                "Serial number already scanned",
                (value) => (value ? !state.scannedUnits.has(value) : false)
              ),
          })}
          onSubmit={async (values, actions) => {
            await actions.validateForm();
            if (state.checkedUnits.has(values.serialNumber)) {
              toast.error(
                `Serial number ${values.serialNumber} already checked.`
              );
            } else {
              dispatch({
                type: "SET_SUBMITTED_SERIAL_NUMBER",
                payload: { serialNumber: values.serialNumber },
              });
            }
            console.log(values);
            actions.setFieldValue("serialNumber", "");
          }}
        >
          {({ errors, touched, submitForm, resetForm }) => {
            return (
              <div style={theme.container}>
                <Form>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs={3}>
                      <Field
                        id="serialNumber"
                        name="serialNumber"
                        helperText={
                          touched.serialNumber ? errors.serialNumber : ""
                        }
                        error={
                          touched.serialNumber && Boolean(errors.serialNumber)
                        }
                        component={FormikTextField}
                        data-testid="serialNumber"
                        label="Serial Number"
                        margin="dense"
                        InputProps={{
                          inputRef: htmlElRef,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        data-testid="scanSerialNumber"
                        variant="contained"
                        color="primary"
                        onClick={submitForm}
                        endIcon={<AddIcon>Add</AddIcon>}
                      >
                        Scan
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        data-testid="clearSerialNumber"
                        variant="contained"
                        color="secondary"
                        onClick={() => resetForm()}
                        endIcon={<ClearIcon>Clear</ClearIcon>}
                      >
                        Clear
                      </Button>
                    </Grid>
                    {state.scannedUnits.size > 0 && (
                      <Grid item xs={3}>
                        <Button
                          data-testid="submitSerialNumber"
                          variant="contained"
                          style={theme.btnSubmit}
                          onClick={checkUnits}
                          endIcon={<CheckIcon>Check</CheckIcon>}
                        >
                          {state.mode === STRESSOR_CHECK_IN_MODE
                            ? " Check-in"
                            : "Check-out"}
                        </Button>
                      </Grid>
                    )}
                    <Grid item xs={2}>
                      {isLoadingValidateAsset && (
                        <CircularProgress
                          color="inherit"
                          style={{ textAlign: "left" }}
                        />
                      )}
                    </Grid>
                  </Grid>
                  <FormFocusError />
                </Form>
              </div>
            );
          }}
        </Formik>
      </Grid>
      <Grid item xs={11}>
        {state.scannedUnits.size > 0 && (
          <>
            <Typography variant="h6">Serial Number Model</Typography>
            <List
              component="nav"
              aria-label="main serial number folders"
              className={classes.root}
            >
              <ListItem dense></ListItem>
              {[...state.scannedUnits].map(([key, value]) => {
                return (
                  <ListItem dense>
                    <ListItemText
                      primary={`${
                        value.serial_number || "Not Available"
                      }         ${value.model || "Not Available"}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          dispatch({
                            type: "REMOVE_SCANNED_UNIT",
                            payload: { id: key },
                          });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
};
