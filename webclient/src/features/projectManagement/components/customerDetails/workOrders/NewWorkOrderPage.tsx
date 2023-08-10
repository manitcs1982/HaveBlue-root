import React from "react";
import { useIsFetching } from "react-query";
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
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { useProjectDetails } from "../../../projectManagementQueries";
import { useCreateWorkOrder } from "../../../projectManagementMutations";
import {
  useWorkOrderDispositions,
  useWorkOrderUnitsDispositions,
} from "../../../../common/services/dispositionServices";

import { ErrorMessage } from "../../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";
import { useAuthContext } from "../../../../common/AuthContext";
import { stringSanitize } from "../../../../common/util";
import { Messaging } from "../../../../common/enums";

export const NewWorkOrderPage = () => {
  const { dispatch } = useAuthContext();
  const isFetching = useIsFetching();
  const theme = useTheme();
  const history = useHistory();

  const { projectId, customerId } = useParams() as {
    projectId: string;
    customerId: string;
  };
  const { mutateAsync: mutate } = useCreateWorkOrder();
  const {
    error: errorProjectDetails,
    data: projectDetailsData,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
  } = useProjectDetails(projectId);

  const {
    error: errorDispositions,
    data: dispositions,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
  } = useWorkOrderDispositions();

  const {
    error: errorWorkOrderUnitsDispositions,
    data: workOrderUnitsDispositions,
    isLoading: isLoadingWorkOrderUnitsDispositions,
    isError: isErrorWorkOrderUnitsDispositions,
  } = useWorkOrderUnitsDispositions();

  if (
    isLoadingProjectDetails ||
    isLoadingDispositions ||
    isLoadingWorkOrderUnitsDispositions
  ) {
    return (
      <Backdrop
        open={
          isLoadingProjectDetails ||
          isLoadingDispositions ||
          isLoadingWorkOrderUnitsDispositions
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (
    isErrorProjectDetails ||
    isErrorDispositions ||
    isErrorWorkOrderUnitsDispositions
  ) {
    return (
      <>
        {isErrorProjectDetails && <ErrorMessage error={errorProjectDetails} />}
        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}
        {isErrorWorkOrderUnitsDispositions && (
          <ErrorMessage error={errorWorkOrderUnitsDispositions} />
        )}
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
            <Typography variant="h5">Create New Work Order</Typography>
          </Grid>
          <Grid item xs={12}>
            <Formik
              initialValues={{
                name: "",
                description: "",
                start_datetime: new Date(),
                disposition: "",
                unitDisposition: "",
                tib: false,
              }}
              validationSchema={Yup.object({
                name: Yup.string()
                  .required("Field must be required")
                  .test(
                    "sanitize",
                    Messaging.UserInput,
                    (value: string | undefined) =>
                      value ? stringSanitize(value) : false
                  ),
                description: Yup.string().required("Field must be required"),
                start_datetime: Yup.date().required("Field must be required"),
                disposition: Yup.string().required("Field must be required"),
                unitDisposition: Yup.string().required(
                  "Field must be required"
                ),
                tib: Yup.boolean().optional(),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const createdWorkOrder = await mutate({
                    project: projectDetailsData.url,
                    tib: values.tib,
                    name: values.name,
                    disposition: values.disposition,
                    unit_disposition: values.unitDisposition,
                    description: values.description,
                    start_datetime: values.start_datetime,
                  });

                  setSubmitting(false);
                  if (history.location.pathname.includes("customer")) {
                    history.push(
                      `/project_management/customer/${customerId}/projects/${projectId}/work_orders/edit/${createdWorkOrder.id}`
                    );
                  } else {
                    history.push(
                      `/project_management/project_intelligence/${projectId}`
                    );
                  }

                  toast.success("Work Order was succesfully created");
                } catch (error) {
                  toast.error("Error while creating work order.");
                  processErrorOnMutation(error, dispatch, history);
                }
              }}
            >
              {({ errors, touched, submitForm, resetForm }) => (
                <Form>
                  {isFetching ? (
                    <Typography variant="body2">Refreshing...</Typography>
                  ) : null}

                  <Field
                    name="name"
                    helperText={touched.name ? errors.name : ""}
                    error={touched.name && Boolean(errors.name)}
                    component={TextField}
                    data-testid="workOrderName"
                    label="Work Order Name"
                    style={{ marginBottom: 32 }}
                    placeholder="Type a name"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <Field
                    name="start_datetime"
                    component={DateTimePicker}
                    format="YYYY-MM-DD"
                    style={{ marginBottom: 32 }}
                    label="Start DateTime"
                    inputVariant="outlined"
                    data-testid="startDateTime"
                  />

                  <Field
                    data-testid="description"
                    name="description"
                    label="Description"
                    component={TextField}
                    helperText={touched.description ? errors.description : ""}
                    error={touched.description && Boolean(errors.description)}
                    style={{ marginBottom: 32 }}
                    placeholder="Write a description"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

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
                  <Field
                    id="unitDisposition"
                    type="text"
                    data-testid="unitDispositionId"
                    name="unitDisposition"
                    helperText={
                      touched.unitDisposition ? errors.unitDisposition : ""
                    }
                    error={
                      touched.unitDisposition && Boolean(errors.unitDisposition)
                    }
                    component={TextField}
                    select={true}
                    label="Work Order Unit Disposition"
                    style={{ marginBottom: 32 }}
                    fullWidth
                  >
                    {workOrderUnitsDispositions?.map((disposition) => (
                      <MenuItem key={disposition.id} value={disposition.url}>
                        {disposition.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    id="tib"
                    data-testid="tib"
                    name="tib"
                    type="checkbox"
                    component={CheckboxWithLabel}
                    helperText={touched.tib ? errors.tib : ""}
                    error={touched.tib && Boolean(errors.tib)}
                    fullWidth
                    margin="dense"
                    Label={{ label: "TIB" }}
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
                        data-testid="submitWorkOrder"
                        variant="contained"
                        color="primary"
                        onClick={submitForm}
                      >
                        Submit
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => resetForm()}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
