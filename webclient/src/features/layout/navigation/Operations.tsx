import React from "react";
import { Container, Paper, Typography } from "@material-ui/core";
import MuiLink from "@material-ui/core/Link";
import { Link } from "react-router-dom";

export const OperationsList = () => {
  return (
    <Container>
      <Typography variant="h4">Operations</Typography>
      <Paper>
        <MuiLink component={Link} to="operations/wet_leakage">
          <Typography variant="h6">Wet Leakage</Typography>
        </MuiLink>
        <MuiLink component={Link} to="operations/diode_test">
          <Typography variant="h6">Diode Test</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"operations/visual_inspection"}>
          <Typography variant="h6">Visual Inspection</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"operations/colorimeter"}>
          <Typography variant="h6">Colorimeter</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"operations/intake/crate"}>
          <Typography variant="h6">Crate Intake</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"operations/intake/unit"}>
          <Typography variant="h6">Unit Intake</Typography>
        </MuiLink>
      </Paper>
    </Container>
  );
};
