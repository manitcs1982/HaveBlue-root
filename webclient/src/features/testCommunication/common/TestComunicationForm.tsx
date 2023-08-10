import React from "react";
import {
  MenuItem,
  Button,
  Grid,
  useTheme,
  TextField,
  LinearProgress,
  Typography,
  Card,
  Paper,
} from "@material-ui/core";
import { useHistory } from "react-router";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { TextField as FormikTextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  useTestCommunicationDetails,
  useUnitsBySerialNumber,
  useProcedureResult,
} from "./testQueries";
import { useValidateAsset } from "./testMutations";
import { useDataFromUrl } from "../../common/services/generalServices";
import { useFetchContext } from "../../common/FetchContext";
import { UnitSelectionDialog } from "./UnitSelectionDialog";

import { useAuthContext } from "../../common/AuthContext";
import { useVisualInspectionDetailsContext } from "../../common/VisualInspectionContext";
import { ErrorMessage } from "../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../util/errorMessaging";
import moment from "moment";

export const TestCommunicationForm = ({
  setTesterData,
  setSelectedProcedureResult,
  selectedProcedureResult,
  selectedAsset,
  setSelectedAsset,
  setClearedValues,
  clearedValues,
  visualizer,
  historicData = null,
  unitData = null,
  unitTypeData = null,
  setStartDateTime,
}: any) => {
  const theme = useTheme();
  const history = useHistory();
  const { authAxios } = useFetchContext();
  const { dispatch: authDispatch } = useAuthContext();
  const { dispatch } = useVisualInspectionDetailsContext();
  const [serialNumber, setSerialNumber] = React.useState("");
  const [selectedUnit, setSelectedUnit] = React.useState<any>(unitData);
  const [procedureResults, setProcedureResults] = React.useState<any>(null);
  const [openUnitsDialog, setOpenUnitsDialog] = React.useState(false);
  const serialNumberRef = React.useRef<any>();

  const formikRef = React.useRef<any>();
  const {
    mutateAsync: mutateValidateAsset,

    isSuccess: isSuccessValidateAsset,
    isLoading: isLoadingValidateAsset,
  } = useValidateAsset();

  const {
    error: errorTestCommunicationDetails,
    data: testCommunicationDetails,
    isError: isErrorTestCommunicationDetails,
    isSuccess: isSuccessTestCommunicationDetails,
    isLoading: isLoadingTestCommunicationDetails,
  } = useTestCommunicationDetails(visualizer);

  const {
    error: errorUnits,
    data: units,
    isError: isErrorUnits,
    isSuccess: isSuccessUnits,
    isLoading: isLoadingUnitsBySerialNumber,
  } = useUnitsBySerialNumber(serialNumber);

  const {
    data: dataFromUrl,
    error: errorDataFromUrl,
    isError: isErrorDataFromUrl,
    isSuccess: isSuccessDataFromUrl,
    isLoading: isLoadingDataFromUrl,
  } = useDataFromUrl(selectedUnit?.unit_type, unitTypeData);

  const {
    data: procedureResult,
    error: errorProcedureResult,
    isError: isErrorProcedureResult,
    isSuccess: isSuccessProcedureResult,
    isLoading: isLoadingProcedureResult,
  } = useProcedureResult(historicData?.id);

  React.useEffect(() => {
    if (historicData && unitData && isSuccessProcedureResult && unitTypeData) {
      setSelectedUnit(unitData);
      setSelectedProcedureResult(procedureResult);
      setTesterData(unitTypeData?.module_property);
    }
  }, [
    historicData,
    unitData,
    isSuccessProcedureResult,
    setSelectedProcedureResult,
    procedureResult,
    setTesterData,
    unitTypeData,
  ]);

  // Side Effects TestCommunication
  React.useEffect(() => {
    if (
      isSuccessTestCommunicationDetails &&
      testCommunicationDetails.assets.length === 0
    ) {
      toast.error("No assets available. Please contact Engineering");
    } else if (
      isSuccessTestCommunicationDetails &&
      testCommunicationDetails.assets.length === 1
    ) {
      setSelectedAsset(testCommunicationDetails.assets[0]);
    }
  }, [
    isSuccessTestCommunicationDetails,
    setSelectedAsset,
    testCommunicationDetails,
  ]);

  // Side Effects Serial Number Units
  React.useEffect(() => {
    if (isSuccessUnits && units.length === 0) {
      setSerialNumber("");
      toast.error("Invalid serial number. Please try again.");
      formikRef.current.setFieldValue("serialNumberForm", "");
      serialNumberRef.current.focus();
    } else if (isSuccessUnits && units.length === 1) {
      setSelectedUnit(units[0]);
    } else if (isSuccessUnits && units.length > 1) {
      setOpenUnitsDialog(true);
    }
  }, [
    historicData,
    isSuccessProcedureResult,
    isSuccessUnits,
    procedureResult,
    setSelectedProcedureResult,
    unitData,
    units,
  ]);

  // Side Effects Mutate Asset
  React.useEffect(() => {
    if (isSuccessDataFromUrl && dataFromUrl && !historicData) {
      const validateAsset = async () => {
        try {
          const mutateResult = await mutateValidateAsset({
            authAxios,
            unitId: selectedUnit.id,
            asset_name: selectedAsset?.name,
          });
          if (mutateResult && mutateResult.length === 0) {
            toast.error("This PV module has nothing to do here!");
            setClearedValues(true);
          } else {
            setProcedureResults(mutateResult);
            if (mutateResult.length === 1) {
              setTesterData(dataFromUrl?.module_property);
              setSelectedProcedureResult(mutateResult[0]);
            }
          }
        } catch (err) {
          toast.error("Error while executing validating asset routine.");
          processErrorOnMutation(err, authDispatch, history);
          setClearedValues(true);
        }
      };
      validateAsset();
    }
  }, [
    dataFromUrl,
    isSuccessDataFromUrl,
    selectedUnit,
    mutateValidateAsset,
    authAxios,
    selectedAsset,
    setTesterData,
    setSelectedProcedureResult,
    setClearedValues,
    authDispatch,
    history,
    historicData,
  ]);

  // Side Effects Cleanup
  React.useEffect(() => {
    if (clearedValues) {
      formikRef.current.resetForm();
      setSerialNumber("");
      setSelectedUnit(null);
      setTesterData(null);
      setSelectedProcedureResult(null);
      setProcedureResults(null);
      serialNumberRef.current.focus();
      dispatch({ type: "CLEANUP_VISUAL_INSPECTION" });
      setClearedValues(false);
    }
  }, [
    clearedValues,
    dispatch,
    setClearedValues,
    setSelectedAsset,
    setSelectedProcedureResult,
    setTesterData,
  ]);

  const renderAvailableAssets = () => {
    if (
      testCommunicationDetails &&
      testCommunicationDetails.assets.length > 1
    ) {
      return (
        <Grid item xs={12}>
          <TextField
            id="asset"
            type="text"
            data-testid="asset"
            name="asset"
            select={true}
            label="Assets"
            fullWidth
          >
            {testCommunicationDetails.assets?.map((asset: any) => (
              <MenuItem
                key={asset.id}
                value={asset.url}
                onClick={() => setSelectedAsset(asset)}
              >
                {asset.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      );
    } else if (
      testCommunicationDetails &&
      testCommunicationDetails.assets.length === 1 &&
      selectedAsset
    ) {
      return (
        <Grid item xs={12}>
          <TextField
            id="asset"
            type="text"
            data-testid="asset"
            name="asset"
            disabled
            select={true}
            value={selectedAsset?.url}
            label="Assets"
            fullWidth
          >
            <MenuItem
              key={selectedAsset?.id}
              value={selectedAsset?.url}
              selected
            >
              {selectedAsset?.name}
            </MenuItem>
          </TextField>
        </Grid>
      );
    }
  };

  const renderDetailsSection = () => {
    if (selectedProcedureResult && (dataFromUrl || unitTypeData)) {
      return (
        <>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              Model Name
            </Typography>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              {selectedUnit?.model}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              Manufacturer
            </Typography>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              {dataFromUrl?.manufacturer_name ||
                unitTypeData?.manufacturer_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              Project Number
            </Typography>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              {selectedProcedureResult?.project_number}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              Customer Name
            </Typography>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              {selectedProcedureResult?.customer_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              Work Order Name
            </Typography>
            <Typography variant="subtitle1" style={theme.monospacedText}>
              {selectedProcedureResult?.work_order_name}
            </Typography>
          </Grid>
        </>
      );
    }
  };

  const renderResults = () => {
    if (
      isLoadingDataFromUrl ||
      isLoadingValidateAsset ||
      isLoadingUnitsBySerialNumber ||
      isLoadingProcedureResult
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
    } else if (isSuccessDataFromUrl && isSuccessValidateAsset) {
      if (procedureResults && procedureResults.length > 1) {
        return (
          <>
            {renderDetailsSection()}
            <Grid item xs={12} md={4}>
              <TextField
                id="procedureResult"
                type="text"
                data-testid="procedureResult"
                name="procedureResult"
                select={true}
                label="Characterization point"
                fullWidth
              >
                {procedureResults?.map((procedureResult: any) => (
                  <MenuItem
                    key={procedureResult.id}
                    value={procedureResult.url}
                    onClick={() => {
                      setTesterData(dataFromUrl?.module_property);
                      setSelectedProcedureResult(procedureResult);
                    }}
                  >
                    {procedureResult.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </>
        );
      } else if (procedureResults && procedureResults.length === 1) {
        return (
          <>
            {renderDetailsSection()}

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" style={theme.monospacedText}>
                Characterization point
              </Typography>
              <Typography variant="body1" style={theme.monospacedText}>
                {procedureResults[0].name}
              </Typography>
            </Grid>
          </>
        );
      }
    } else if (historicData && isSuccessProcedureResult && procedureResult) {
      return (
        <>
          {renderDetailsSection()}
          <Grid item xs={4}>
            <TextField
              id="procedureResult"
              type="text"
              data-testid="procedureResult"
              name="procedureResult"
              select={true}
              disabled
              label="Characterization point"
              fullWidth
              value={procedureResult.url}
            >
              <MenuItem key={procedureResult.id} value={procedureResult.url}>
                {procedureResult.name}
              </MenuItem>
            </TextField>
          </Grid>
        </>
      );
    }
  };

  if (isErrorDataFromUrl || isErrorTestCommunicationDetails || isErrorUnits) {
    return (
      <>
        {isErrorDataFromUrl && <ErrorMessage error={errorDataFromUrl} />}
        {isErrorTestCommunicationDetails && (
          <ErrorMessage error={errorTestCommunicationDetails} />
        )}
        {isErrorUnits && <ErrorMessage error={errorUnits} />}
      </>
    );
  }

  if (isLoadingTestCommunicationDetails) {
    return (
      <Backdrop open={isLoadingTestCommunicationDetails}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <UnitSelectionDialog
        units={units}
        setSelectedUnit={setSelectedUnit}
        setOpen={setOpenUnitsDialog}
        isOpen={openUnitsDialog}
      />
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={2}
      >
        {isSuccessTestCommunicationDetails &&
          testCommunicationDetails.assets.length > 0 && (
            <>
              <Grid item xs={12} md={6}>
                {renderAvailableAssets()}
              </Grid>
              <Grid item xs={12} md={6}>
                <Formik
                  innerRef={formikRef}
                  validateOnBlur={false}
                  validateOnChange={false}
                  initialValues={{
                    serialNumberForm: "",
                  }}
                  validationSchema={Yup.object({
                    serialNumberForm: Yup.string().required(
                      "Field must be required"
                    ),
                  })}
                  onSubmit={async (values, formikBag) => {
                    await formikBag.validateForm();
                    setSerialNumber(values.serialNumberForm.toUpperCase());
                    setStartDateTime(moment().format("YYYY-MM-DD HH:mm:ss"));
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
                          spacing={2}
                        >
                          <Grid item xs={12} md={10}>
                            <Field
                              id="serialNumberForm"
                              name="serialNumberForm"
                              disabled={historicData}
                              fullWidth
                              helperText={
                                touched.serialNumberForm
                                  ? errors.serialNumberForm
                                  : ""
                              }
                              error={
                                touched.serialNumberForm &&
                                Boolean(errors.serialNumberForm)
                              }
                              component={FormikTextField}
                              data-testid="serialNumberForm"
                              label="Serial Number"
                              margin="dense"
                              InputProps={{
                                inputRef: serialNumberRef,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Button
                              disabled={historicData}
                              data-testid="submitSerialNumber"
                              variant="contained"
                              color="primary"
                              onClick={submitForm}
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </Form>
                    );
                  }}
                </Formik>
              </Grid>
            </>
          )}
        <Grid item xs={12} md={12}>
          <Paper>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={2}
            >
              {renderResults()}
            </Grid>
          </Paper>
        </Grid>

        {/* {procedureResults && (
          <Grid item xs={12} md={2}>
            <Button
              data-testid="clearWetLeakageForm"
              variant="contained"
              color="primary"
              onClick={() => setClearedValues(true)}
            >
              Clear
            </Button>
          </Grid>
        )} */}
      </Grid>
    </>
  );
};
