import React from "react";
import { useIsFetching, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import {
  Box,
  Container,
  MenuItem,
  Button,
  Typography,
  Grid,
  LinearProgress,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useCrates, useLocations, useCrateNotes } from "../../intakeQueries";
import {
  useCreateUnit,
  useLinkFileToUnit,
  useLinkUnitsToWorkOrder,
  useAutoAssignUnitsToWorkOrder,
  useEmptyCrate,
  useAddNoteToCrate,
} from "../../intakeMutations";

import { useFetchContext } from "../../../common/FetchContext";
import { useAuthContext } from "../../../common/AuthContext";
import some from "lodash/some";
import moment from "moment";
import { usePostFile } from "../../../common/services/fileServices";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { ViewAddNoteList } from "../../../common/ViewAddNotes";

import { UnitIntakeImageDialog } from "./UnitIntakeDialog";
import { UnitIntakeDeleteDialog } from "./UnitIntakeDeleteDialog";

export const UnitIntakeNewPage = ({
  activeArrivedUnits,
  project,
  workOrder,
  unitIntakeType,
  activeUnitIntakeExpectedUnitTypeId,
}: any) => {
  const { authAxios } = useFetchContext();
  const { dispatch: authDispatch } = useAuthContext();
  const history = useHistory();
  const isFetching = useIsFetching();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const submitRef = React.useRef<any>();
  const { mutateAsync: mutateUnit } = useCreateUnit();
  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFileToUnit } = useLinkFileToUnit();
  const { mutateAsync: mutateLinkUnitsToWorkOrder } = useLinkUnitsToWorkOrder();
  const { mutateAsync: mutateLinkAutoAssign } = useAutoAssignUnitsToWorkOrder();
  const { mutateAsync: mutateEmptyCrate } = useEmptyCrate();
  const { mutateAsync: mutateAddNoteToCrate } = useAddNoteToCrate();

  const {
    error: errorCrates,
    data: crates,
    isLoading: isLoadingCrates,
    isError: isErrorCrates,
  } = useCrates();
  const {
    error: errorLocations,
    data: locations,
    isLoading: isLoadingLocations,
    isError: isErrorLocations,
  } = useLocations();

  const [serialNumbers, setSerialNumbers] = React.useState<any[]>([]);
  const [newSerialNumber, setNewSerialNumber] = React.useState("");
  const [serialNumberAttachments, setSerialNumberAttachments] =
    React.useState<any>([]);

  const isSerialNumberDuplicated = (serialNumber: string) => {
    return (
      some(activeArrivedUnits, ["serial_number", serialNumber]) ||
      some(serialNumbers, function (e) {
        return e === serialNumber;
      })
    );
  };

  const [open, setOpen] = React.useState(false);
  const [selectedSerialNumber, setSelectedSerialNumber] = React.useState("");
  const [selectedCrate, setSelectedCrate] = React.useState({
    id: 0,
    url: "",
    name: "",
    disposition_name: "",
    disposition: "",
    shipped_by_name: "",
    shipped_by: "",
    shipping_agent: "",
    notes: [
      {
        count: 0,
      },
    ],
    received_date: "",
    crate_images: [],
  });

  const handleClose = () => {
    setOpen(!open);
  };

  const [activeSerialNumber, setActiveSerialNumber] = React.useState("");
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const [createdIDs, setCreatedIDs] = React.useState<any[]>([]);
  const [autoAssign, setAutoAssign] = React.useState(true);
  const [emptyCrate, setEmptyCrate] = React.useState(false);

  const handleDeleteClose = () => {
    setDeleteOpen(!deleteOpen);
  };

  const updateIDs = (id: any) => {
    var tempIDs = createdIDs;
    tempIDs.push(id);
    setCreatedIDs(tempIDs);
  };

  const handleEmptyCrate = async () => {
    setEmptyCrate(!emptyCrate);
  };

  if (isErrorCrates || isErrorLocations) {
    return (
      <>
        {isErrorCrates && <ErrorMessage error={errorCrates} />}
        {isErrorLocations && <ErrorMessage error={errorLocations} />}
      </>
    );
  }

  if (isLoadingCrates || isLoadingLocations) {
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

  return (
    <>
      <Grid
        container
        spacing={3}
        direction="row"
        justify="space-around"
        alignItems="center"
        style={{ marginTop: 32 }}
      >
        <Grid item xs={4}>
          <Formik
            initialValues={{
              crate: "",
              location: "",
            }}
            validationSchema={Yup.object({
              crate: Yup.string().required("Field must be required"),
              location: Yup.string().required("Field must be required"),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              if (serialNumbers.length > 0) {
                try {
                  for (let serialNumber of serialNumbers) {
                    if (
                      serialNumberAttachments[serialNumber] &&
                      serialNumberAttachments[serialNumber].length > 0
                    ) {
                      const createdUnit = await mutateUnit({
                        authAxios,
                        crate: values.crate,
                        location: values.location,
                        serial_number: serialNumber,
                        unit_type: unitIntakeType,
                        intake_date: moment().format(),
                        project_url: project.url,
                        files: serialNumberAttachments[serialNumber],
                      });
                      for (let file of serialNumberAttachments[serialNumber]) {
                        const postedFile = await mutatePostFile({
                          authAxios,
                          file,
                        });
                        await mutateLinkFileToUnit({
                          authAxios,
                          unitId: createdUnit.id,
                          fileId: postedFile.id,
                        });
                      }
                      updateIDs(createdUnit.id);
                      toast.success(
                        `Unit with Serial Number ${serialNumber} was succesfully created`
                      );
                    } else {
                      const createdUnit = await mutateUnit({
                        authAxios,
                        crate: values.crate,
                        location: values.location,
                        serial_number: serialNumber,
                        intake_date: moment().format(),
                        unit_type: unitIntakeType,
                        project_url: project.url,
                      });
                      updateIDs(createdUnit.id);
                      toast.success(
                        `Unit with Serial Number ${serialNumber} was succesfully created`
                      );
                    }
                  }
                } catch (err) {
                  setSubmitting(false);
                  if (err.response.status === 401) {
                    authDispatch({ type: "LOGOUT" });
                    history.push("/");
                  } else if (err.response.status === 403) {
                    toast.error(
                      `Current credentials are not allowed to perform this operation.`
                    );
                  } else {
                    toast.error(`Error while generating new unit: ${err}`);
                  }
                }

                try {
                  if (autoAssign) {
                    await mutateLinkAutoAssign({
                      authAxios,
                      workOrderId: workOrder.id,
                      unitIds: createdIDs,
                    });
                    toast.success("Units added and assigned test sequence.");
                  } else {
                    await mutateLinkUnitsToWorkOrder({
                      authAxios,
                      workOrderId: workOrder.id,
                      unitIds: createdIDs,
                    });
                    toast.success("Units successfully added to work order.");
                  }
                } catch (err) {
                  setSubmitting(false);
                  if (err.response.status === 401) {
                    authDispatch({ type: "LOGOUT" });
                    history.push("/");
                  } else if (err.response.status === 403) {
                    toast.error(
                      `Current credentials are not allowed to perform this operation.`
                    );
                  } else {
                    toast.error(`Error while linking units: ${err}`);
                  }
                }

                if (emptyCrate) {
                  try {
                    await mutateEmptyCrate({
                      authAxios,
                      id: selectedCrate.id,
                    });
                    toast.success("Crate marked as empty successfully!");
                  } catch (error) {
                    setSubmitting(false);
                    toast.error(`Error while marking crate as empty: ${error}`);
                  }
                }

                queryClient.invalidateQueries([
                  "expectedUnitDetails",
                  activeUnitIntakeExpectedUnitTypeId,
                ]);
                queryClient.invalidateQueries("crates");
                setSubmitting(false);
                setSerialNumbers([]);
                setCreatedIDs([]);
                setActiveSerialNumber("");
                setNewSerialNumber("");
                setSerialNumberAttachments([]);
                resetForm();
              }
            }}
          >
            {({ errors, touched, submitForm, isSubmitting, resetForm }) => (
              <Form>
                <Container>
                  {isFetching ? (
                    <Typography variant="body2">Refreshing...</Typography>
                  ) : null}
                  <Grid
                    container
                    spacing={3}
                    direction="row"
                    justify="space-around"
                    alignItems="center"
                    style={{ marginTop: 32 }}
                  >
                    <Grid item xs={10}>
                      <Field
                        id="crate"
                        type="text"
                        name="crate"
                        select={true}
                        fullWidth
                        component={TextField}
                        helperText={touched.crate ? errors.crate : ""}
                        error={touched.crate && Boolean(errors.crate)}
                        style={{ marginBottom: 32 }}
                        label="Crate"
                        data-testid="crate"
                      >
                        {crates?.map((crate: any) => (
                          <MenuItem
                            key={crate.id}
                            value={crate.url}
                            onClick={(e) => {
                              setSelectedCrate(crate);
                            }}
                          >
                            {crate.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={2}>
                      <ViewAddNoteList
                        id={selectedCrate.id}
                        type={1}
                        model={"crate"}
                        invalidate={[
                          ["crateNotes", selectedCrate.id],
                          "crates",
                        ]}
                        count={selectedCrate.notes[0]?.count}
                        getNotes={useCrateNotes}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        id="location"
                        type="text"
                        name="location"
                        select={true}
                        fullWidth
                        component={TextField}
                        helperText={touched.location ? errors.location : ""}
                        error={touched.location && Boolean(errors.location)}
                        style={{ marginBottom: 32 }}
                        label="Location"
                        data-testid="location"
                      >
                        {locations?.map((location: any) => (
                          <MenuItem key={location.id} value={location.url}>
                            {location.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    {!isSubmitting ? (
                      <>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={autoAssign}
                                onChange={() => {
                                  setAutoAssign(!autoAssign);
                                }}
                                name="autoCheck"
                              />
                            }
                            label="Auto Assign Units?"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={emptyCrate}
                                onChange={() => {
                                  setEmptyCrate(!emptyCrate);
                                }}
                                name="emptyCrate"
                              />
                            }
                            label="Mark Crate as Empty"
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <Button
                            data-testid="submitCrateId"
                            variant="contained"
                            color="primary"
                            onClick={submitForm}
                          >
                            Submit Units
                          </Button>
                        </Grid>
                        <Grid item xs={7}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => resetForm()}
                          >
                            Clear Crate and Location
                          </Button>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={autoAssign}
                                disabled
                                onChange={() => {
                                  setAutoAssign(!autoAssign);
                                }}
                                name="autoCheck"
                              />
                            }
                            label="Auto Assign Units?"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={emptyCrate}
                                disabled
                                onChange={() => handleEmptyCrate()}
                                name="emptyCrate"
                              />
                            }
                            label="Mark Crate as Empty"
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <Button
                            data-testid="submitCrateId"
                            variant="contained"
                            color="primary"
                            disabled
                            onClick={submitForm}
                          >
                            Submit Units
                          </Button>
                        </Grid>
                        <Grid item xs={7}>
                          <Button
                            variant="contained"
                            color="secondary"
                            disabled
                            onClick={() => resetForm()}
                          >
                            Clear Crate and Location
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Container>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={8}>
          <Formik
            initialValues={{
              serialNumber: "",
            }}
            validationSchema={Yup.object({
              serialNumber: Yup.string(),
            })}
            onSubmit={async (values, { resetForm }) => {
              if (values.serialNumber !== "") {
                if (isSerialNumberDuplicated(values.serialNumber)) {
                  toast.error(
                    `Serial Number ${values.serialNumber} already exists. Please type a different one.`
                  );
                  setNewSerialNumber("");
                } else {
                  const updatedSerialNumbers = [
                    ...serialNumbers,
                    values.serialNumber.toUpperCase(),
                  ];
                  setSerialNumbers(updatedSerialNumbers);
                  setNewSerialNumber("");
                }
              }
              resetForm();
              submitRef.current.focus();
            }}
          >
            {({ errors, touched, submitForm, resetForm }) => (
              <Form>
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                >
                  <Grid item xs={6}>
                    <Grid
                      container
                      spacing={3}
                      direction="column"
                      justify="space-around"
                      alignItems="center"
                    >
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          Serial Number Intake
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="serialNumber"
                          helperText={
                            touched.serialNumber ? errors.serialNumber : ""
                          }
                          error={
                            touched.serialNumber && Boolean(errors.serialNumber)
                          }
                          component={TextField}
                          data-testid="serial-number"
                          label="Serial Number"
                          style={{ marginBottom: 32 }}
                          fullWidth
                          margin="dense"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputRef={submitRef}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid
                      container
                      spacing={1}
                      direction="column"
                      justifyContent="center"
                      style={{ marginBottom: "8px" }}
                    >
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          # of Scanned Serials
                        </Typography>
                      </Grid>
                      <Grid item xs={12} alignItems="flex-end">
                        <Typography variant="h4">
                          {serialNumbers.length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={2} />
                  <Grid item xs={4}>
                    <Button variant="contained" onClick={submitForm}>
                      Enter Serial Number
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="contained" onClick={() => resetForm()}>
                      Clear Serial Number
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          <Box width={1}>
            {serialNumbers.length !== 0 && (
              <Paper variant="outlined">
                <List component="nav" aria-label="main mailbox folders">
                  {serialNumbers.map((serialNumber) => (
                    <ListItem
                      button
                      selected={activeSerialNumber === serialNumber}
                      onClick={() => {
                        setActiveSerialNumber(serialNumber);
                        handleDeleteClose();
                      }}
                      dense
                    >
                      <ListItemText primary={serialNumber} />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => {
                            setSelectedSerialNumber(serialNumber);
                            handleClose();
                          }}
                        >
                          {serialNumberAttachments[serialNumber] &&
                          serialNumberAttachments[serialNumber].length > 0 ? (
                            <CameraAltIcon />
                          ) : (
                            <CameraAltOutlinedIcon />
                          )}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
      <UnitIntakeImageDialog
        open={open}
        handleClose={handleClose}
        activeSerialNumber={selectedSerialNumber}
        serialNumberAttachments={serialNumberAttachments}
        setSerialNumberAttachments={setSerialNumberAttachments}
      />
      <UnitIntakeDeleteDialog
        open={deleteOpen}
        handleClose={handleDeleteClose}
        activeSerialNumber={activeSerialNumber}
        setActiveSerialNumber={setActiveSerialNumber}
        serialNumberAttachments={serialNumberAttachments}
        setSerialNumberAttachments={setSerialNumberAttachments}
        serialNumbers={serialNumbers}
        setSerialNumbers={setSerialNumbers}
      />
    </>
  );
};
