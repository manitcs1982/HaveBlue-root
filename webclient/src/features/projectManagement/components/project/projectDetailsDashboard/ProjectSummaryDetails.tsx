import { Typography, Grid, useTheme, Container } from "@material-ui/core";
import { motion } from "framer-motion";
import React from "react";
import { BackButton } from "../../../../common/returnButton";

export const ProjectSummaryDetails = ({ projectData }: any) => {
  const theme = useTheme();

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid xs={11}>
            <Typography variant="h3">Project Summary Details</Typography>
          </Grid>
          <Grid item xs={1}>
            <BackButton />
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Container>
    </div>
  );
};
