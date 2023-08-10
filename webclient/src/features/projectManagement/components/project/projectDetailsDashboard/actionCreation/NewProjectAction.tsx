import { useHistory } from "react-router-dom";
import { Container, Grid, LinearProgress, useTheme } from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { useCreateProjectAction } from "../../../../projectManagementMutations";
import {
  useActionDefinitions,
  useGroups,
} from "../../../../projectManagementQueries";

import { useAuthContext } from "../../../../../common/AuthContext";
import { processErrorOnMutation } from "../../../../../../util/errorMessaging";
import { useDispositions } from "../../../../../common/services/dispositionServices";
import { ErrorMessage } from "../../../../../common/ErrorMessage";
import { useActionCreationFormValues } from "./useActionCreationFormValues";
import { ActionCreationForm } from "./ActionCreationForm";

export const NewProjectAction = ({ projectId, closeModal }: any) => {
  const theme = useTheme();
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const { mutateAsync: mutateCreateProjectAction } = useCreateProjectAction();
  const { values, schema } = useActionCreationFormValues();
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

  if (isErrorDispositions || isErrorActionDefinitionsData || isErrorGroups) {
    return (
      <>
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
          await mutateCreateProjectAction({
            projectId: projectId,
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
