import React from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  MenuItem,
  Button,
  Typography,
  Grid,
  Backdrop,
  CircularProgress,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import {
  useProjectGroup,
  useCustomerDetails,
  useProjectManagers,
} from "../../projectManagementQueries";
import { useCreateProject } from "../../projectManagementMutations";
import { useDispositions } from "../../../common/services/dispositionServices";
import { useFetchContext } from "../../../common/FetchContext";
import { useAuthContext } from "../../../common/AuthContext";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { AddNewNote } from "../../../common/NoteOnNewDialog";
import { ViewNote } from "../../../common/ViewNoteDialog";
import { useSubmitNote } from "../../../common/CommonMutations";
import { processErrorOnMutation } from "../../../../util/errorMessaging";
import { stringSanitize } from "../../../common/util";
import { Messaging } from "../../../common/enums";

export const NewProject = () => {
  const { authAxios } = useFetchContext();
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const theme = useTheme();

  const [notes, setNotes] = React.useState<any[]>([]);
  const [viewNote, setViewNote] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState({});

  const { customerId } = useParams() as {
    customerId: string;
  };
  const { mutateAsync: mutate } = useCreateProject();
  const { mutateAsync: mutateAddNote } = useSubmitNote();

  const {
    error: errorDispositions,
    data: dispositions,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
  } = useDispositions();

  const {
    error: errorProjectManagers,
    data: projectManagers,
    isError: isErrorProjectManagers,
  } = useProjectManagers();

  const {
    error: errorProjectGroup,
    data: projectGroup,
    isLoading: isLoadingProjectGroup,
    isError: isErrorProjectGroup,
  } = useProjectGroup();

  const {
    data: customerDetailsData,
    error: errorCustomerDetails,
    isError: isErrorCustomerDetails,
  } = useCustomerDetails(customerId);

  const handleClose = () => {
    setViewNote(!viewNote);
  };

  const handleClick = (e: any) => {
    setSelectedNote(e);
    handleClose();
  };

  if (isLoadingProjectGroup || isLoadingDispositions || isLoadingDispositions) {
    return (
      <Backdrop
        open={
          isLoadingProjectGroup ||
          isLoadingDispositions ||
          isLoadingDispositions
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (
    isErrorDispositions ||
    isErrorProjectManagers ||
    isErrorProjectManagers ||
    isErrorCustomerDetails
  ) {
    return (
      <>
        {isErrorCustomerDetails && (
          <ErrorMessage error={errorCustomerDetails} />
        )}

        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}
        {isErrorProjectManagers && (
          <ErrorMessage error={errorProjectManagers} />
        )}
        {isErrorProjectGroup && <ErrorMessage error={errorProjectGroup} />}
      </>
    );
  }

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <Typography variant="h5">Create New Project</Typography>
          </Grid>

          <Grid item xs={12}>
            <Formik
              initialValues={{
                number: "",
                sfdc_number: "",
                project_manager: "",
                disposition: "",
                proposal_price: "",
              }}
              validationSchema={Yup.object({
                number: Yup.string()
                  .required("Field must be required")
                  .test(
                    "sanitize",
                    Messaging.UserInput,
                    (value: string | undefined) =>
                      value ? stringSanitize(value) : false
                  ),
                sfdc_number: Yup.string()
                  .required("Field must be required")
                  .test(
                    "sanitize",
                    Messaging.UserInput,
                    (value: string | undefined) =>
                      value ? stringSanitize(value) : false
                  ),
                project_manager: Yup.string().required(
                  "Field must be required"
                ),
                disposition: Yup.string().required("Field must be required"),
                proposal_price: Yup.string().required("Field must be required"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const newProjectData = await mutate({
                    number: values.number,
                    sfdc_number: values.sfdc_number,
                    project_manager: values.project_manager,
                    disposition: values.disposition,
                    group: projectGroup.url,
                    customer: customerDetailsData.url,
                    proposal_price: values.proposal_price,
                  });

                  if (notes.length > 0) {
                    for (let note of notes) {
                      await mutateAddNote({
                        authAxios,
                        id: newProjectData.id,
                        model: "project",
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
                  history.push(`/project_management/customer/${customerId}`);
                  toast.success("Project was succesfully created.");
                } catch (error) {
                  toast.error("Error while creating project");
                  processErrorOnMutation(error, dispatch, history);
                }
              }}
            >
              {({ errors, touched, submitForm, resetForm }) => (
                <Form>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    spacing={4}
                  >
                    <Grid item sm={6}>
                      <Field
                        id="number"
                        type="text"
                        name="number"
                        fullWidth
                        component={TextField}
                        helperText={touched.number ? errors.number : ""}
                        error={touched.number && Boolean(errors.number)}
                        style={{ marginBottom: 32 }}
                        label="Project Number"
                        data-testid="project_number"
                      ></Field>

                      <Field
                        name="sfdc_number"
                        helperText={
                          touched.sfdc_number ? errors.sfdc_number : ""
                        }
                        error={
                          touched.sfdc_number && Boolean(errors.sfdc_number)
                        }
                        component={TextField}
                        data-testid="sfdc_number"
                        label="SFDC Number"
                        style={{ marginBottom: 32 }}
                        placeholder="Write an SFDC number"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <Field
                        id="project_manager"
                        type="text"
                        name="project_manager"
                        select={true}
                        fullWidth
                        component={TextField}
                        helperText={
                          touched.project_manager ? errors.project_manager : ""
                        }
                        error={
                          touched.project_manager &&
                          Boolean(errors.project_manager)
                        }
                        style={{ marginBottom: 32 }}
                        label="Project Manager"
                        data-testid="project_manager"
                      >
                        {projectManagers?.map((projectManager: any) => (
                          <MenuItem
                            key={projectManager.id}
                            value={projectManager.url}
                          >
                            {projectManager.first_name}{" "}
                            {projectManager.last_name}
                          </MenuItem>
                        ))}
                      </Field>
                      <Field
                        id="disposition"
                        type="text"
                        name="disposition"
                        select={true}
                        fullWidth
                        component={TextField}
                        helperText={
                          touched.disposition ? errors.disposition : ""
                        }
                        error={
                          touched.disposition && Boolean(errors.disposition)
                        }
                        style={{ marginBottom: 32 }}
                        label="Disposition"
                        data-testid="disposition"
                      >
                        {dispositions?.map((disposition: any) => (
                          <MenuItem
                            key={disposition.id}
                            value={disposition.url}
                          >
                            {disposition.name}
                          </MenuItem>
                        ))}
                      </Field>
                      <Field
                        id="number"
                        type="number"
                        name="proposal_price"
                        fullWidth
                        component={TextField}
                        helperText={
                          touched.proposal_price ? errors.proposal_price : ""
                        }
                        error={
                          touched.proposal_price &&
                          Boolean(errors.proposal_price)
                        }
                        style={{ marginBottom: 32 }}
                        label="Contract Value"
                        data-testid="proposal_price"
                      ></Field>
                    </Grid>
                    <Grid item sm={6}>
                      <AddNewNote notes={notes} addNote={setNotes} />

                      <Paper
                        variant="outlined"
                        style={{ marginTop: 32, marginBottom: 32 }}
                      >
                        <List component="nav" aria-label="main mailbox folders">
                          {notes.map((note) => (
                            <ListItem
                              button
                              dense
                              onClick={() => handleClick(note)}
                            >
                              <ListItemText
                                primary={`Subject: ${note.subject}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
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
                    <Grid item xs={4}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => resetForm()}
                      >
                        Undo Changes
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
        <ViewNote
          note={selectedNote}
          open={viewNote}
          handleClose={handleClose}
        />
      </Container>
    </div>
  );
};
