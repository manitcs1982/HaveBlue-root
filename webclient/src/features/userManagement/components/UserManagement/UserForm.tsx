import * as Yup from "yup";
import {
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik, FormikValues } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import React from "react";
import { useUserRegistrationStatuses } from "../../userQueries";
import LSDBSelectField from "../../../common/LSDBSelectField";

const UserForm = ({
  initialValues,
  submitForm,
  isDetailView,
}: {
  initialValues?: any;
  submitForm: (values: FormikValues) => Promise<any>;
  isDetailView: boolean;
}) => {
  const userRegistrationStatusesQuery = useUserRegistrationStatuses();

  return (
    <>
      {userRegistrationStatusesQuery.isSuccess && (
        <Formik
          initialValues={
            initialValues || {
              email: "",
              is_active: true,
              is_staff: true,
              is_superuser: false,
              date_joined: new Date(),
              username: "",
              first_name: "",
              last_name: "",
              notes: "",
              registration_comment: "",
              administration_comment: "",
              userRegistration_status: null,
              password: "",
            }
          }
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Input is not an email")
              .required("Email is required"),
            is_active: Yup.boolean(),
            is_staff: Yup.boolean(),
            is_superuser: Yup.boolean(),
            date_joined: Yup.date(),
            username: Yup.string()
              .max(150, "Username has reached max length: 150")
              .required("Username is required"),
            first_name: Yup.string().required("First name is required"),
            last_name: Yup.string().required("Last name is required"),
            notes: Yup.string(),
            registration_comment: Yup.string().nullable(),
            administration_comment: Yup.string().nullable(),
            user_registration_status: isDetailView
                ? Yup.string()
                : Yup.string().required("Registration Status is required"),
            password: isDetailView
              ? Yup.string()
              : Yup.string().required("Password is required"),
          })}
          onSubmit={(values) => submitForm(values)}
        >
          {({ submitForm, errors }) => {
            return (
              <Paper>
                <Form>
                  <Container maxWidth="md">
                    <Field
                      id="email"
                      type="email"
                      name="email"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      placeholder="email@email.com"
                      label="Email"
                    />

                    <Field
                      id="is_active"
                      type="checkbox"
                      name="is_active"
                      fullWidth
                      component={CheckboxWithLabel}
                      Label={{
                        label:
                          "Active (Designates whether this user should be treated as active. Unselect this instead of deleting accounts.)",
                      }}
                    />

                    <Field
                      id="is_staff"
                      type="checkbox"
                      name="is_staff"
                      fullWidth
                      component={CheckboxWithLabel}
                      Label={{
                        label:
                          "Staff Status (Designates whether the user can log into this admin site.)",
                      }}
                    />

                    <Field
                      id="is_superuser"
                      type="checkbox"
                      name="is_superuser"
                      fullWidth
                      component={CheckboxWithLabel}
                      Label={{
                        label:
                          "Superuser Status (Designates that this user has all permissions without explicitly assigning them.)",
                      }}
                    />

                    <Field
                      label="Date Joined"
                      id="date_joined"
                      name="date_joined"
                      component={DatePicker}
                      format="YYYY-MM-DD"
                    />

                    <br />

                    <Field
                      id="username"
                      type="text"
                      name="username"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      label="Username"
                      placeholder="mharris"
                    />

                    <Field
                      id="first_name"
                      type="text"
                      name="first_name"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      label="First Name"
                      placeholder="Michael"
                    />

                    <Field
                      id="last_name"
                      type="text"
                      name="last_name"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      label="Last Name"
                      placeholder="Harris"
                    />

                    <Grid item>
                      <Typography variant="h5">User Profile</Typography>
                    </Grid>

                    <Field
                      id="notes"
                      type="text"
                      name="notes"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      multiline={true}
                      rows={3}
                      label="Notes"
                      placeholder="Notes"
                    />

                    <Field
                      id="registration_comment"
                      type="text"
                      name="registration_comment"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      label="Registration Comment"
                      placeholder="Comment"
                    />

                    <Field
                      id="administration_comment"
                      type="text"
                      name="administration_comment"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      label="Administration Comment"
                      placeholder="Comment"
                    />

                    <LSDBSelectField
                      fieldId="user_registration_status"
                      fieldName="user_registration_status"
                      fieldDisplayName="User Registration Status"
                      fullWidth={true}
                      errors={errors.user_registration_status}
                      options={userRegistrationStatusesQuery.data}
                      mappingFunction={(userRegistrationStatus) => (
                        <MenuItem value={userRegistrationStatus.url}>
                          {userRegistrationStatus.status}
                        </MenuItem>
                      )}
                    />

                    <Field
                      id="password"
                      type="password"
                      name="password"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      label="Password"
                      autoComplete="new-password"
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
                          data-testid="submitUser"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            submitForm();
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </Container>
                </Form>
              </Paper>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default UserForm;
