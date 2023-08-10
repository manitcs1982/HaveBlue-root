import { useIsFetching, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  MenuItem,
  Button,
  Typography,
  Grid,
  useTheme,
  LinearProgress,
} from "@material-ui/core";
import { TextField, CheckboxWithLabel } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { useWorkOrderDetails } from "../../../projectManagementQueries";
import { useUpdateWorkOrder } from "../../../projectManagementMutations";
import {
  useWorkOrderDispositions,
  useWorkOrderUnitsDispositions,
} from "../../../../common/services/dispositionServices";
import { useCustomerDetailsContext } from "../../../../common/CustomerDetailsContext";
import { TestSequenceDefinitionsTable } from "./TestSequenceDefinitionsTable";
import { WorkOrderSequenceDefinitionsTable } from "./WorkOrderSequenceDefinitionsTable";
import { useTestSequenceDefinitions } from "../../../projectManagementQueries";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";
import { useAuthContext } from "../../../../common/AuthContext";
import { getBaseUrl } from "../../../../common/util";
import { stringSanitize } from "../../../../common/util";
import { Messaging } from "../../../../common/enums";

export const EditWorkOrderPage = () => {
  const { dispatch } = useAuthContext();
  const { state } = useCustomerDetailsContext();
  const theme = useTheme();
  const history = useHistory();
  const { projectId, customerId, workOrderId } = useParams() as {
    projectId: string;
    customerId: string;
    workOrderId: string;
  };

  const { mutateAsync: mutate } = useUpdateWorkOrder();
  const {
    error: errorWorkOrderDetails,
    data: workOrderDetails,
    isLoading: isLoadingWorkOrderDetails,
    isError: isErrorWorkOrderDetails,
    isFetching: isFetchingWorkOrderDetails,
  } = useWorkOrderDetails(workOrderId);

  const {
    error: errorDispositions,
    data: dispositions,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
    isFetching: isFetchingWorkOrderDispositions,
  } = useWorkOrderDispositions();

  const {
    error: errorWorkOrderUnitsDispositions,
    data: workOrderUnitsDispositions,
    isLoading: isLoadingWorkOrderUnitsDispositions,
    isError: isErrorWorkOrderUnitsDispositions,
    isFetching: isFetchingWorkOrderUnitsDispositions,
  } = useWorkOrderUnitsDispositions();

  const {
    error: errorTestSequenceDefinitions,
    data: testSequenceDefinitionsData,
    isLoading: isLoadingTestSequenceDefinitions,
    isError: isErrorTestSequenceDefinitions,
    isFetching: isFetchingTestSequenceDefinitions,
  } = useTestSequenceDefinitions(workOrderId);

  if (
    isLoadingWorkOrderDetails ||
    isLoadingDispositions ||
    isLoadingTestSequenceDefinitions ||
    isLoadingWorkOrderUnitsDispositions ||
    isFetchingTestSequenceDefinitions ||
    isFetchingWorkOrderDispositions ||
    isFetchingWorkOrderDetails ||
    isFetchingWorkOrderUnitsDispositions
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
  }

  if (
    isErrorWorkOrderDetails ||
    isErrorDispositions ||
    isErrorTestSequenceDefinitions ||
    isErrorWorkOrderUnitsDispositions
  ) {
    return (
      <>
        {isErrorWorkOrderDetails && (
          <ErrorMessage error={errorWorkOrderDetails} />
        )}
        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}

        {isErrorTestSequenceDefinitions && (
          <ErrorMessage error={errorTestSequenceDefinitions} />
        )}
        {isErrorWorkOrderUnitsDispositions && (
          <ErrorMessage error={errorWorkOrderUnitsDispositions} />
        )}
      </>
    );
  }

  const generateProjectUrl = () => {
    const hostname = getBaseUrl();
    return `${hostname}/projects/${projectId}/`;
  };

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
            <Typography variant="h5">
              Edit Work Order:{workOrderDetails?.name}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Formik
              initialValues={{
                name: workOrderDetails?.name,
                description: workOrderDetails?.description,
                start_datetime: workOrderDetails?.start_datetime,
                disposition: workOrderDetails?.disposition,
                unit_disposition: workOrderDetails?.unit_disposition,
                tib: workOrderDetails?.tib,
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
                unit_disposition: Yup.string().required(
                  "Field must be required"
                ),
                tib: Yup.boolean().nullable(),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  console.log("The values", values);
                  let projectUrl = "";
                  if (state.activeProjectUrl) {
                    projectUrl = state.activeProjectUrl;
                  } else if (workOrderId) {
                    projectUrl = generateProjectUrl();
                  }
                  await mutate({
                    project: projectUrl,
                    tib: values.tib,
                    name: values.name,
                    disposition: values.disposition,
                    unit_disposition: values.unit_disposition,
                    description: values.description,
                    start_datetime: values.start_datetime,
                    workOrderId,
                  });

                  setSubmitting(false);
                  if (history.location.pathname.includes("customer")) {
                    history.push(`/project_management/customer/${customerId}`);
                  } else {
                    history.push(
                      `/project_management/project_intelligence/${projectId}`
                    );
                  }

                  toast.success("Work Order was succesfully changed");
                } catch (error) {
                  toast.error("Error while changing work order.");
                  processErrorOnMutation(error, dispatch, history);
                }
              }}
            >
              {({ errors, touched, submitForm, resetForm }) => (
                <Form>
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
                    label="NTP Date"
                    inputVariant="outlined"
                    data-testid="startDateTime"
                    helperText={
                      touched.start_datetime ? errors.start_datetime : ""
                    }
                    error={
                      touched.start_datetime && Boolean(errors.start_datetime)
                    }
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
                    id="unit_disposition"
                    type="text"
                    data-testid="unitDispositionId"
                    name="unit_disposition"
                    helperText={
                      touched.unit_disposition ? errors.unit_disposition : ""
                    }
                    error={
                      touched.unit_disposition &&
                      Boolean(errors.unit_disposition)
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
                        onClick={() => submitForm()}
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
          <Grid item xs={12}>
            <WorkOrderSequenceDefinitionsTable
              data={workOrderDetails.test_sequence_definitions}
              workOrderId={workOrderId}
            />
          </Grid>
        </Grid>
      </Container>

      <TestSequenceDefinitionsTable
        testSequences={testSequenceDefinitionsData}
        workOrderDetails={workOrderDetails}
      />
    </div>
  );
};
