import React from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Button,
  Grid,
  useTheme,
  Typography,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { useSubmitForgotPassword } from "./authMutations";
import { processErrorOnMutation } from "../../util/errorMessaging";

export const ForgotPassword = () => {
  const history = useHistory();
  const { mutateAsync } = useSubmitForgotPassword();
  const theme = useTheme();

  return (
    <div style={theme.container}>
      <Container maxWidth="sm">
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography variant="h3">Forgot Password</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              Enter your email address and we will send you a link to reset your
              password
            </Typography>
          </Grid>{" "}
          <Grid item xs={12}>
            <Formik
              initialValues={{
                username: "",
              }}
              validationSchema={Yup.object({
                username: Yup.string().required("Email must be required"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await mutateAsync({
                    username: values.username,
                  });

                  setSubmitting(false);
                  toast.success(
                    "Email for password reset was succesfully sent to the given email account."
                  );
                } catch (error) {
                  toast.error(`Error while trying to send email link`);
                  processErrorOnMutation(error);
                }
              }}
            >
              {({ errors, touched, submitForm, resetForm }) => {
                return (
                  <Form>
                    <Grid
                      container
                      direction="row"
                      justify="space-around"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={12}>
                        <Field
                          id="username"
                          type="text"
                          name="username"
                          fullWidth
                          component={TextField}
                          helperText={touched.username ? errors.username : ""}
                          error={touched.username && Boolean(errors.username)}
                          style={{ marginBottom: 32 }}
                          label="Email"
                          data-testid="username"
                        ></Field>
                      </Grid>
                      <Grid item xs={12}>
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
                              data-testid="submitForgotPassword"
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
                          <Grid item xs={4}>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => history.push("/")}
                            >
                              Return to Login
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
