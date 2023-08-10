import React from "react";
import { Container, Paper, Typography } from "@material-ui/core";
import MuiLink from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import { DefaultLayout } from "../DefaultLayout";

export const ProjectManagementList = () => {
  return (
    <Container>
      <Typography variant="h4">Project Management</Typography>
      <Paper>
        {/*
          <MuiLink component={Link} to="/project_management/work_log">
            <Typography variant="h6">Work Log</Typography>
          </MuiLink>
          */}
        <MuiLink component={Link} to="/project_management/my_projects">
          <Typography variant="h6">My Projects</Typography>
        </MuiLink>
        <MuiLink component={Link} to="/project_management/active_projects">
          <Typography variant="h6">Active Projects</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"/project_management/customer"}>
          <Typography variant="h6">Customers</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"/project_management/virtual_traveler"}>
          <Typography variant="h6">Virtual Traveler</Typography>
        </MuiLink>
        <MuiLink component={Link} to={"/project_management/projects"}>
          <Typography variant="h6">Project Data</Typography>
        </MuiLink>
        <MuiLink
          component={Link}
          to={"/project_management/report_writers_agenda"}
        >
          <Typography variant="h6">Report Writer's Agenda</Typography>
        </MuiLink>
      </Paper>
    </Container>
  );
};
