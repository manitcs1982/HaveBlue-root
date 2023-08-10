import { Container, Grid, Typography } from "@material-ui/core";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import React from "react";
import UserForm from "./UserForm";
import { useCreateUser } from "../../userMutations";

export const NewUser = () => {
  const history = useHistory();
  const { mutateAsync: createUser } = useCreateUser();

  return (
    <Container>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3">New User</Typography>
        </Grid>
      </Grid>
      <UserForm
        isDetailView={false}
        submitForm={async (values) => {
          try {
            await createUser(
              {
                email: values.email,
                is_active: values.is_active,
                is_staff: values.is_staff,
                is_superuser: values.is_superuser,
                date_joined: values.date_joined,
                username: values.username,
                first_name: values.first_name,
                last_name: values.last_name,
                userprofile: {
                  notes: values.notes,
                  registration_comment: values.registration_comment,
                  administration_comment: values.administration_comment,
                  user_registration_status: values.user_registration_status,
                  email_subscriptions: [],
                },
                password: values.password,
              },
              {
                onSuccess: ({ id }) => {
                  history.push(`${id}`);
                },
              }
            );
          } catch (error) {
            toast.error("Error while creating user");
          }
        }}
      />
    </Container>
  );
};
