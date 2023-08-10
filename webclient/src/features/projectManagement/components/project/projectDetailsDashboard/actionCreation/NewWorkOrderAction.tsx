import { useHistory } from "react-router-dom";
import {
  Container,
  Grid,
  MenuItem,
  LinearProgress,
  useTheme,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { useCreateWorkOrderAction } from "../../../../projectManagementMutations";
import {
  useActionDefinitions,
  useGroups,
  useProjectWorkOrders,
} from "../../../../projectManagementQueries";

import { useAuthContext } from "../../../../../common/AuthContext";
import { processErrorOnMutation } from "../../../../../../util/errorMessaging";
import { useDispositions } from "../../../../../common/services/dispositionServices";
import { ErrorMessage } from "../../../../../common/ErrorMessage";
import { ActionCreationForm } from "./ActionCreationForm";
import { useActionCreationFormValues } from "./useActionCreationFormValues";

export const NewWorkOrderAction = ({ projectId, closeModal }: any) => {
  const theme = useTheme();
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const { values, schema } = useActionCreationFormValues(
    { workOrder: "" },
    { workOrder: Yup.string().required("Field must be required") }
  );
  const { mutateAsync: mutate } = useCreateWorkOrderAction();
  const {
    data: projectWorkOrders,
    error: errorProjectWorkOrders,
    isLoading: isLoadingProjectWorkOrders,
    isError: isErrorProjectWorkOrders,
    isSuccess: isSuccessProjectWorkOrders,
  } = useProjectWorkOrders(projectId);

  const {
    data: actionDefinitionsData,
    error: errorActionDefinitionsData,
    isLoading: isLoadingActionDefinitionsData,
    isError: isErrorActionDefinitionsData,
    isSuccess: isSuccessActionDefinitionsData,
  } = useActionDefinitions();

  const {
    data: groups,
    error: errorGroups,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
    isSuccess: isSuccessGroups,
  } = useGroups();

  const {
    data: dispositions,
    error: errorDispositions,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
    isSuccess: isSuccessDispositions,
  } = useDispositions();

  if (
    isLoadingProjectWorkOrders ||
    isLoadingActionDefinitionsData ||
    isLoadingDispositions ||
    isLoadingGroups
  ) {
    return (
      <>
        <div style={theme.container}>
          <Container>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid xs={12}>
                <LinearProgress />
              </Grid>
            </Grid>
          </Container>
        </div>
      </>
    );
  }

  if (
    isErrorProjectWorkOrders ||
    isErrorDispositions ||
    isErrorActionDefinitionsData ||
    isErrorGroups
  ) {
    return (
      <>
        {isErrorProjectWorkOrders && (
          <ErrorMessage error={errorProjectWorkOrders} />
        )}
        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}
        {isErrorActionDefinitionsData && (
          <ErrorMessage error={errorActionDefinitionsData} />
        )}
        {isErrorGroups && <ErrorMessage error={errorGroups} />}
      </>
    );
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={Yup.object(schema)}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await mutate({
            workOrderId: values.workOrder,
            name: values.name,
            description: values.description,
            disposition: values.disposition,
            action_definition: values.action_definition,
            execution_group: values.execution_group,
            promise_datetime: values.promise_datetime,
            eta_datetime: values.eta_datetime,
            groups: values.groups,
          });

          setSubmitting(false);
          closeModal();
          toast.success("Action was succesfully created");
        } catch (error) {
          toast.error("Error while creating action");
          processErrorOnMutation(error, dispatch, history);
        }
      }}
    >
      {({ errors, touched, submitForm, resetForm }) => {
        return (
          <Form>
            <Container maxWidth="sm">
              <Field
                id="workOrder"
                type="text"
                name="workOrder"
                select={true}
                fullWidth
                helperText={touched.workOrder ? errors.workOrder : ""}
                error={touched.workOrder && Boolean(errors.workOrder)}
                component={TextField}
                data-testid="workOrder"
                placeholder="Choose a work order"
                label="Work order"
                style={{ marginBottom: 32 }}
              >
                {projectWorkOrders?.map((workOrder: any) => (
                  <MenuItem key={workOrder.id} value={workOrder.id}>
                    {workOrder.name}
                  </MenuItem>
                ))}
              </Field>
              <ActionCreationForm
                errors={errors}
                touched={touched}
                submitForm={submitForm}
                resetForm={resetForm}
                dispositions={dispositions}
                actionDefinitionsData={actionDefinitionsData}
                groups={groups}
              />
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
};
