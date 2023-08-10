import React from "react";
import { Container, Paper, Typography } from "@material-ui/core";
import MuiLink from "@material-ui/core/Link";
import { Link } from "react-router-dom";

export const IntakeLandingPage = () => {
  return (
    <Container>
      <Typography variant="h4">Manage</Typography>
      <Paper>
        <MuiLink component={Link} to="/operations/intake/crate">
          <Typography variant="h6">Crate Intake</Typography>
        </MuiLink>
        <MuiLink component={Link} to="/operations/intake/unit">
          <Typography variant="h6">Unit Intake</Typography>
        </MuiLink>
      </Paper>
    </Container>
  );
};
