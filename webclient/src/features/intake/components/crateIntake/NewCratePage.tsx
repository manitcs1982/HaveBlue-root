import React from "react";
import { useIsFetching } from "react-query";
import { useHistory } from "react-router-dom";
import {
  Container,
  MenuItem,
  Button,
  Typography,
  Grid,
  Backdrop,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { DateTimePicker, TimePicker } from "formik-material-ui-pickers";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { DropzoneArea } from "material-ui-dropzone";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { useCustomers } from "../../../projectManagement/projectManagementQueries";
import { useCrateDispositions } from "../../../common/services/dispositionServices";
import {
  useCreateCrate,
  useLinkFileToCrate,
  useAddNoteToCrate,
} from "../../intakeMutations";
import { useProjects } from "../../intakeQueries";
import { useFetchContext } from "../../../common/FetchContext";
import { useAuthContext } from "../../../common/AuthContext";
import { Customer } from "../../../common/types/customer.type";
import { AddNewNote } from "../../../common/NoteOnNewDialog";
import { ViewNote } from "../../../common/ViewNoteDialog";

import { usePostFile } from "../../../common/services/fileServices";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { useSubmitNote } from "../../../common/CommonMutations";
import { processErrorOnMutation } from "../../../../util/errorMessaging";

export const NewCratePage = () => {
  const { authAxios } = useFetchContext();
  const { dispatch } = useAuthContext();
  const isFetching = useIsFetching();
  const history = useHistory();
  const { mutateAsync: mutateCreateCrate } = useCreateCrate();
  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFileToCrate } = useLinkFileToCrate();
  const { mutateAsync: mutateAddNote } = useSubmitNote();
  const {
    error: errorCustomers,
    data: customers,
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers,
  } = useCustomers();
  const {
    error: errorDispositions,
    data: dispositions,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
  } = useCrateDispositions();

  const {
    error: errorProjects,
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
  } = useProjects();

  const [files, setFiles] = React.useState([]);
  const [notes, setNotes] = React.useState<any[]>([]);
  const [viewNote, setViewNote] = React.useState(false);

  const [selectedNote, setSelectedNote] = React.useState({});

  const handleClose = () => {
    setViewNote(!viewNote);
  };

  const handleClick = (e: any) => {
    setSelectedNote(e);
    handleClose();
  };

  if (isErrorCustomers || isErrorDispositions || isErrorProjects) {
    return (
      <>
        {isErrorCustomers && <ErrorMessage error={errorCustomers} />}
        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}
        {isErrorProjects && <ErrorMessage error={errorProjects} />}
      </>
    );
  }

  if (isLoadingDispositions || isLoadingCustomers || isLoadingProjects) {
    return (
      <Backdrop
        open={isLoadingDispositions || isLoadingCustomers || isLoadingProjects}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const handleFileChange = (uploadedFiles: any) => {
    setFiles(uploadedFiles);
  };

  return (
    <>
      <Formik
        initialValues={{
          project: "",
          shippedBy: "",
          agent: "",
          crateNameId: "",
          dateTimeReceived: new Date(),
          disposition: "",
        }}
        validationSchema={Yup.object({
          project: Yup.string(),
          shippedBy: Yup.string().required("Field must be required"),
          agent: Yup.string().required("Field must be required"),
          crateNameId: Yup.string().required("Field must be required"),
          dateTimeReceived: Yup.string().required("Field must be required"),
          disposition: Yup.string().required("Field must be required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            console.log("Form values", JSON.stringify(values));

            const newCrateData = await mutateCreateCrate({
              authAxios,
              name: values.crateNameId,
              project: values.project,
              shipping_agent: values.agent,
              shipped_by: values.shippedBy,
              disposition: values.disposition,
              received_date: values.dateTimeReceived.toJSON(),
            });
            if (files.length > 0) {
              for (let file of files) {
                const postedFile = await mutatePostFile({ authAxios, file });
                await mutateLinkFileToCrate({
                  authAxios,
                  fileId: postedFile.id,
                  crateId: newCrateData.id,
                });
              }
            }
            if (notes.length > 0) {
              for (let note of notes) {
                await mutateAddNote({
                  authAxios,
                  id: newCrateData.id,
                  model: "crate",
                  subject: note.subject,
                  text: note.text.toString("markdown"),
                  note_type: 1,
                  owner: 0,
                  disposition: 0,
                  labels: [],
                  groups: [],
                  tagged_users: [],
                });
              }
            }

            setSubmitting(false);
            history.push(`/operations/intake/crate/edit/${newCrateData.id}/`);
            toast.success("Crate was succesfully created");
          } catch (error) {
            toast.error("Error while submitting crate");
            processErrorOnMutation(error, dispatch, history);
          }
        }}
      >
        {({ errors, touched, submitForm }) => (
          <Form>
            <Container maxWidth="sm">
              {isFetching ? (
                <Typography variant="body2">Refreshing...</Typography>
              ) : null}
              <Field
                id="shippedBy"
                type="text"
                name="shippedBy"
                select={true}
                fullWidth
                component={TextField}
                helperText={touched.shippedBy ? errors.shippedBy : ""}
                error={touched.shippedBy && Boolean(errors.shippedBy)}
                style={{ marginBottom: 32 }}
                label="Shipped By"
                data-testid="shippedById"
              >
                {customers?.map((customer: Customer) => (
                  <MenuItem key={customer.id} value={customer.url}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Field>

              <Field
                name="agent"
                helperText={touched.agent ? errors.agent : ""}
                error={touched.agent && Boolean(errors.agent)}
                component={TextField}
                data-testid="agent"
                label="Shipping Agent"
                style={{ marginBottom: 32 }}
                placeholder="Add Shipping Agent"
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Field
                name="crateNameId"
                helperText={touched.crateNameId ? errors.crateNameId : ""}
                error={touched.crateNameId && Boolean(errors.crateNameId)}
                component={TextField}
                data-testid="crateNameId"
                label="Crate Name/Id"
                style={{ marginBottom: 32 }}
                placeholder="Write a crate name"
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Field
                id="project"
                type="text"
                name="project"
                select={true}
                fullWidth
                component={TextField}
                helperText={touched.project ? errors.project : null}
                error={touched.project && Boolean(errors.project)}
                style={{ marginBottom: 32 }}
                label="Project"
                data-testid="project"
              >
                {projects?.map((project: any) => (
                  <MenuItem key={project.id} value={project.project}>
                    {project.project_number}
                  </MenuItem>
                ))}
              </Field>

              <Grid
                container
                spacing={3}
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <Field
                    name="dateTimeReceived"
                    component={DateTimePicker}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ marginBottom: 32 }}
                    label="Date & Time Received"
                    inputVariant="outlined"
                    data-testid="dateReceivedId"
                  />
                </Grid>
              </Grid>

              <AddNewNote notes={notes} addNote={setNotes} />

              <Paper
                variant="outlined"
                style={{ marginTop: 32, marginBottom: 32 }}
              >
                <List component="nav" aria-label="main mailbox folders">
                  {notes.map((note) => (
                    <ListItem button dense onClick={() => handleClick(note)}>
                      <ListItemText primary={`Subject: ${note.subject}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Field
                id="disposition"
                type="text"
                data-testid="dispositionId"
                name="disposition"
                helperText={touched.disposition ? errors.disposition : ""}
                error={touched.disposition && Boolean(errors.disposition)}
                component={TextField}
                select={true}
                label="Disposition"
                style={{ marginBottom: 32 }}
                fullWidth
              >
                {dispositions?.map((disposition) => (
                  <MenuItem key={disposition.id} value={disposition.url}>
                    {disposition.name}
                  </MenuItem>
                ))}
              </Field>
              <Typography gutterBottom variant="subtitle1">
                Upload Image(s) optional
              </Typography>
              <DropzoneArea
                acceptedFiles={["image/*", ".pdf"]}
                onChange={(files) => handleFileChange(files)}
                filesLimit={
                  process.env.REACT_APP_FILE_LIMIT
                    ? parseInt(process.env.REACT_APP_FILE_LIMIT)
                    : 20
                }
                maxFileSize={12000000}
                data-testid="fileUploadCrate"
              />
              <Grid
                container
                spacing={3}
                direction="row"
                justify="space-around"
                alignItems="center"
                style={{ marginTop: 32 }}
              >
                <Grid item xs={2}>
                  <Button
                    data-testid="submitCrateId"
                    variant="contained"
                    color="primary"
                    onClick={submitForm}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button variant="contained" color="secondary">
                    Clear
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    data-testid="return"
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/operations/intake/crate`}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Form>
        )}
      </Formik>
      <ViewNote note={selectedNote} open={viewNote} handleClose={handleClose} />
    </>
  );
};
