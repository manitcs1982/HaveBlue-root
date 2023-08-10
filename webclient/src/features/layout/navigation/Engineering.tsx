import React from "react";
import { Container, Paper, Typography } from "@material-ui/core";
import MuiLink from "@material-ui/core/Link";
import { Link } from "react-router-dom";

export const EngineeringList = () => {
  return (
    <Container>
      <Typography variant="h4">Engineering</Typography>
      <Paper>
        <MuiLink component={Link} to="/engineering/unit_type">
          <Typography variant="h6">Unit Types</Typography>
        </MuiLink>
        <MuiLink component={Link} to="/engineering/engineering_agenda">
          <Typography variant="h6">Engineering Agenda</Typography>
        </MuiLink>
        <MuiLink component={Link} to="/engineering/plugins">
          <Typography variant="h6">Plugins</Typography>
        </MuiLink>
        <MuiLink component={Link} to="/engineering/test_sequence_definitions">
          <Typography variant="h6">Test Sequence Definitions</Typography>
        </MuiLink>
      </Paper>
    </Container>
  );
};
