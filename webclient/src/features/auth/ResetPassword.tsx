import React from "react";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { useSubmitMagicLink, useResetPassword } from "./authMutations";
import { toast } from "react-toastify";
import { useAuthContext } from "../common/AuthContext";
import {
  Container,
  Button,
  Grid,
  useTheme,
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { processErrorOnMutation } from "../../util/errorMessaging";

export const ResetPassword = () => {
  const { accessToken } = useParams() as {
    accessToken: string;
  };
  const theme = useTheme();
  const history = useHistory();
  const { state, dispatch } = useAuthContext();
  const {
    mutateAsync: mutateMagicLink,
    isLoading: isLoadingMagicLink,
    isSuccess,
    isError,
    data: magicLinkData,
  } = useSubmitMagicLink();
  const {
    mutateAsync: mutateResetPassword,
    isLoading: isLoadingResetPassword,
  } = useResetPassword();

  React.useEffect(() => {
    const refreshToken = async () => {
      try {
        const refreshTokenResponse = await mutateMagicLink({
          token: accessToken,
        });
        dispatch({ type: "LOGIN_SUCCESS", payload: refreshTokenResponse });
      } catch (error) {
        toast.error(`Reset password link failed`);
        processErrorOnMutation(error, dispatch, history);
      }
    };
    refreshToken();
  }, [accessToken, dispatch, history, mutateMagicLink]);

  if (isLoadingResetPassword || isLoadingMagicLink || state.isLoading) {
    return (
      <Backdrop open={isLoadingResetPassword || isLoadingMagicLink}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isError) {
    return <Redirect to="/" />;
  }

  if (isSuccess && magicLinkData.token) {
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
              <Typography variant="h3">Reset Password</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                Please enter your new password.
              </Typography>
            </Grid>{" "}
            <Grid item xs={12}>
              <Formik
                initialValues={{
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={Yup.object({
                  password: Yup.string().required("Password must be required"),
                  confirmPassword: Yup.string().when("password", {
                    is: (val: any) => (val && val.length > 0 ? true : false),
                    then: Yup.string().oneOf(
                      [Yup.ref("password")],
                      "Both password need to be the same"
                    ),
                  }),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const dataResetPasswordRequest = await mutateResetPassword({
                      id: state.id,
                      token: state.token,
                      new_password: values.password,
                    });

                    setSubmitting(false);
                    toast.success("Password was succesfully changed.");
                    dispatch({
                      type: "REFRESH_TOKEN",
                      payload: { token: dataResetPasswordRequest.token },
                    });
                    history.push("/home");
                  } catch (error) {
                    toast.error(`Error while trying to change the password`);
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
                            id="password"
                            type="password"
                            name="password"
                            fullWidth
                            component={TextField}
                            helperText={touched.password ? errors.password : ""}
                            error={touched.password && Boolean(errors.password)}
                            style={{ marginBottom: 32 }}
                            label="Password"
                            data-testid="password"
                          ></Field>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            fullWidth
                            component={TextField}
                            helperText={
                              touched.confirmPassword
                                ? errors.confirmPassword
                                : ""
                            }
                            error={
                              touched.confirmPassword &&
                              Boolean(errors.confirmPassword)
                            }
                            style={{ marginBottom: 32 }}
                            label="Confirm Password"
                            data-testid="confirmPassword"
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
                                data-testid="submitResetPassword"
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
  }

  return <></>;
};
