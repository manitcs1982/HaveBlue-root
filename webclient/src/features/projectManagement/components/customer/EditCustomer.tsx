import React from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Button,
  Grid,
  Backdrop,
  CircularProgress,
  useTheme,
} from "@material-ui/core";
import { useQueryClient } from "react-query";
import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { useCustomerDetails } from "../../projectManagementQueries";
import { useUpdateCustomer } from "../../projectManagementMutations";
import { useFetchContext } from "../../../common/FetchContext";
import { useAuthContext } from "../../../common/AuthContext";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../util/errorMessaging";
import { stringSanitize } from "../../../common/util";
import { Messaging } from "../../../common/enums";

export const EditCustomer = () => {
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { customerId } = useParams() as {
    customerId: string;
  };
  const { mutateAsync: mutate } = useUpdateCustomer();
  const {
    error: errorCustomerDetails,
    data: customerDetails,
    isLoading: isLoadingCustomerDetails,
    isError: isErrorCustomerDetails,
  } = useCustomerDetails(customerId);

  if (isLoadingCustomerDetails) {
    return (
      <Backdrop open={isLoadingCustomerDetails}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorCustomerDetails) {
    return <ErrorMessage error={errorCustomerDetails} />;
  }

  return (
    <div style={theme.container}>
      <Formik
        initialValues={{
          name: customerDetails?.name,
          short_name: customerDetails?.short_name,
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
          short_name: Yup.string()
            .required("Field must be required")
            .test(
              "sanitize",
              Messaging.UserInput,
              (value: string | undefined) =>
                value ? stringSanitize(value) : false
            ),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await mutate({
              customerId,
              name: values.name,
              short_name: values.short_name,
            });
            queryClient.invalidateQueries(["customer", customerId]);

            setSubmitting(false);
            history.push(`/project_management/customer/${customerId}`);
            toast.success("Customer was succesfully changed");
          } catch (error) {
            toast.success("Error while modifying customer");
            processErrorOnMutation(error, dispatch, history);
          }
        }}
      >
        {({ errors, touched, submitForm, resetForm }) => (
          <Form>
            <Container maxWidth="sm">
              <Field
                id="name"
                type="text"
                name="name"
                fullWidth
                component={TextField}
                helperText={touched.name ? errors.name : ""}
                error={touched.name && Boolean(errors.name)}
                style={{ marginBottom: 32 }}
                label="Customer Name"
                data-testid="name"
              ></Field>

              <Field
                name="short_name"
                helperText={touched.short_name ? errors.short_name : ""}
                error={touched.short_name && Boolean(errors.short_name)}
                component={TextField}
                data-testid="short_name"
                label="Short Name"
                style={{ marginBottom: 32 }}
                placeholder="Write a short name"
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
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
            </Container>
          </Form>
        )}
      </Formik>
    </div>
  );
};
