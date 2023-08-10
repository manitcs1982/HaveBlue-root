import React from "react";
import { Container, Paper, Typography } from "@material-ui/core";
import MuiLink from "@material-ui/core/Link";
import { Link } from "react-router-dom";

export const ProfileManagementList = () => {
  return (
    <Container>
      <Typography variant="h4">Profile Management</Typography>
      <Paper>
        <MuiLink component={Link} to={"/profile_management/my_profile"}>
          <Typography variant="h6">My Profile</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"/profile_management/user_management"}>
          <Typography variant="h6">(Admin) User Management</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"/profile_management/my_agenda"}>
          <Typography variant="h6">My Agenda</Typography>
        </MuiLink>
      </Paper>
    </Container>
  );
};
