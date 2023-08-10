import React from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { useUsers } from "../../userQueries";
import { UserTable } from "./UserTable";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { Link } from "react-router-dom";

export const UserManagementList = () => {
  const { data, error, isLoading, isError, isFetching } = useUsers();

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return (
    <Container>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3">User Management</Typography>
        </Grid>
        <Grid item>
          <Button
            component={Link}
            to={`/profile_management/user_management/new_user`}
            variant="contained"
            color="primary"
          >
            New User
          </Button>
        </Grid>
      </Grid>
      <UserTable data={data} />
      {isFetching ? (
        <Typography variant="body2">Refreshing...</Typography>
      ) : null}
    </Container>
  );
};
