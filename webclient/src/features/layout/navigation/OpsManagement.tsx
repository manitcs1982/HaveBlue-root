import React from "react";
import { Container, Paper, Typography } from "@material-ui/core";
import MuiLink from "@material-ui/core/Link";
import { Link } from "react-router-dom";

export const OpsManagementList = () => {
  return (
    <Container>
      <Typography variant="h4">Operations Management</Typography>
      <Paper>
        <MuiLink component={Link} to="operations_management/ops_agenda">
          <Typography variant="h6">Ops Agenda</Typography>
        </MuiLink>
        <MuiLink component={Link} to="operations_management/data_verification">
          <Typography variant="h6">Data Verification</Typography>
        </MuiLink>
        <MuiLink component={Link} to="operations_management/work_log">
          <Typography variant="h6">Work Log</Typography>
        </MuiLink>

        <MuiLink component={Link} to="operations_management/stress_entry">
          <Typography variant="h6">Stress Entry</Typography>
        </MuiLink>
        <MuiLink component={Link} to="operations_management/stress_exit">
          <Typography variant="h6">Stress Exit</Typography>
        </MuiLink>

        <MuiLink component={Link} to="operations_management/ops_queues">
          <Typography variant="h6">Ops Queues</Typography>
        </MuiLink>
      </Paper>
    </Container>
  );
};
