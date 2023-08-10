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
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import {
  useProjectDetails,
  useProjectManagers,
} from "../../projectManagementQueries";
import { useUpdateProject } from "../../projectManagementMutations";
import { useDispositions } from "../../../common/services/dispositionServices";
import { useCustomerDetailsContext } from "../../../common/CustomerDetailsContext";
import { useAuthContext } from "../../../common/AuthContext";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { ViewNote } from "../../../common/ViewNoteDialog";
import { processErrorOnMutation } from "../../../../util/errorMessaging";

import { useProjectNotes } from "../../projectQueries";
import { ViewAddNoteList } from "../../../common/ViewAddNotes";
import { stringSanitize } from "../../../common/util";
import { Messaging } from "../../../common/enums";

export const EditProject = () => {
  const { state } = useCustomerDetailsContext();
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const theme = useTheme();
  const { projectId } = useParams() as {
    projectId: string;
    customerId: string;
  };
  const { mutateAsync: mutate } = useUpdateProject();
  const {
    error: errorProjectDetails,
    data: projectDetails,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
    isSuccess: isSuccessProjectDetails,
  } = useProjectDetails(projectId);

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

  const [viewNote, setViewNote] = React.useState(false);

  const [selectedNote, setSelectedNote] = React.useState({});

  const handleClose = () => {
    setViewNote(!viewNote);
  };

  if (isErrorProjectDetails || isErrorDispositions || isErrorProjectManagers) {
    return (
      <>
        {isErrorProjectDetails && <ErrorMessage error={errorProjectDetails} />}
        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}
        {isErrorProjectManagers && (
          <ErrorMessage error={errorProjectManagers} />
        )}
      </>
    );
  }

  if (
    isLoadingProjectDetails ||
    isLoadingDispositions ||
    isLoadingDispositions
  ) {
    return (
      <Backdrop
        open={
          isLoadingProjectDetails ||
          isLoadingDispositions ||
          isLoadingDispositions
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
          {isSuccessProjectDetails && (
            <Grid item xs={12}>
              <Typography variant="h5">
                Edit Project for Customer {projectDetails.customer_name}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Formik
              initialValues={{
                number: projectDetails?.number,
                sfdc_number: projectDetails?.sfdc_number,
                project_manager: projectDetails?.project_manager,
                disposition: projectDetails?.disposition,
                proposal_price: projectDetails?.proposal_price,
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
                  console.log("Form values", JSON.stringify(values));

                  const newProjectData = await mutate({
                    projectId,
                    number: values.number,
                    sfdc_number: values.sfdc_number,
                    project_manager: values.project_manager,
                    disposition: values.disposition,
                    group: projectDetails.group,
                    customer: projectDetails.customer,
                    proposal_price: values.proposal_price,
                  });
                  console.log("Project data", newProjectData);

                  setSubmitting(false);
                  history.push(
                    `/project_management/customer/${state.activeCustomerId}`
                  );
                  toast.success("Project was succesfully changed");
                } catch (error) {
                  toast.error("Error while modifying project.");
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
                    <Grid item sm={12}>
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
                    <Grid item sm={12}>
                      {projectDetails.notes && (
                        <ViewAddNoteList
                          id={projectDetails.id}
                          type={1}
                          model={"project"}
                          invalidate={["project", projectDetails.id]}
                          count={projectDetails.notes[0]?.count}
                          getNotes={useProjectNotes}
                        />
                      )}
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
