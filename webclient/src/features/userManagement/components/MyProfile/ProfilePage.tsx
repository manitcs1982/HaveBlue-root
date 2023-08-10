import React from "react";
import { useAuthContext } from "../../../common/AuthContext";
import { useUserReducedDetails } from "../../userQueries";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { useSetPassword, useUpdateReducedUser } from "../../userMutations";
import { toast } from "react-toastify";
import { TemplatesPicker } from "../TemplatesPicker";
import * as Yup from "yup";

type UserValues = { first_name: string; last_name: string };
type PasswordValues = { oldPassword: string; newPassword: string };

const ProfilePage = () => {
  const { state, dispatch } = useAuthContext();
  const userDetails = useUserReducedDetails(`${state.id}`);

  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const { mutateAsync: updateUser } = useUpdateReducedUser();
  const { mutateAsync: setPassword } = useSetPassword();

  const handleOpen = () => {
    setDialogIsOpen(true);
  };

  const handleClose = () => {
    setDialogIsOpen(false);
  };

  React.useEffect(() => {
    if (userDetails.isSuccess) {
      setFirstName(userDetails.data.first_name);
      setLastName(userDetails.data.last_name);
    }
  }, [userDetails.data, userDetails.isSuccess]);

  return (
    <>
      {userDetails.isSuccess && (
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h3">
                Welcome
                {firstName === "" && lastName === ""
                  ? " User"
                  : `, ${firstName} ${lastName}`}
              </Typography>
            </Grid>
          </Grid>

          <Formik
            initialValues={{
              first_name: userDetails.data.first_name,
              last_name: userDetails.data.last_name,
            }}
            onSubmit={async (values: UserValues) => {
              try {
                await updateUser(
                  {
                    userId: +state.id!,
                    updatedReducedUser: {
                      first_name: values.first_name,
                      last_name: values.last_name,
                    },
                  },
                  {
                    onSuccess: () => {
                      setFirstName(values.first_name);
                      setLastName(values.last_name);
                      toast.success("Successfully updated your data!");
                    },
                  }
                );
              } catch (e) {
                toast.error("Error while updating your data.");
              }
            }}
          >
            {({ submitForm }) => (
              <Paper>
                <Form>
                  <Container maxWidth="md">
                    <Field
                      id="first_name"
                      name="first_name"
                      type="text"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      placeholder="Mark"
                      label="First Name"
                    />

                    <Field
                      id="last_name"
                      name="last_name"
                      type="text"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      placeholder="Davis"
                      label="Last Name"
                    />

                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      style={{ marginBottom: 32 }}
                      onClick={handleOpen}
                    >
                      Change Password
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{ marginBottom: 32 }}
                      onClick={() => submitForm()}
                    >
                      Submit Changes
                    </Button>
                  </Container>
                </Form>
              </Paper>
            )}
          </Formik>

          <br />

          <TemplatesPicker
            userId={+state.id!}
            assignedTemplatesIds={userDetails.data.allowed_templates.map(
              (allowedTemplate) => allowedTemplate.id
            )}
          />
        </Container>
      )}

      <Dialog open={dialogIsOpen} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>

        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
          }}
          validationSchema={Yup.object({
            oldPassword: Yup.string().required("Input your current password"),
            newPassword: Yup.string().required("Input the new password"),
          })}
          onSubmit={async (values: PasswordValues, { resetForm }) => {
            console.log({ values });

            try {
              await setPassword(
                {
                  userId: state.id!,
                  passwords: {
                    old_password: values.oldPassword,
                    new_password: values.newPassword,
                  },
                },
                {
                  onSuccess: () => {
                    toast.success(
                      "Successfully updated your password! Logging you out...",
                      { autoClose: 2500 }
                    );
                    resetForm();
                    handleClose();
                    setTimeout(() => {
                      dispatch({ type: "LOGOUT" });
                    }, 3000);
                  },
                }
              );
            } catch (e) {
              resetForm();
              toast.error(
                "Error updating your password. Check your current password and try again"
              );
            }
          }}
        >
          {({ submitForm }) => (
            <>
              <DialogContent>
                <Form>
                  <Field
                    id="oldPassword"
                    name="oldPassword"
                    label="Old Password"
                    type="password"
                    fullWidth
                    component={TextField}
                    style={{ marginBottom: 16 }}
                  />

                  <Field
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    type="password"
                    fullWidth
                    component={TextField}
                    style={{ marginBottom: 16 }}
                  />
                </Form>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={() => submitForm()} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default ProfilePage;
