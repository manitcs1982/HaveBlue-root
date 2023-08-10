import React from "react";
import { Grid, useTheme, Container, CircularProgress } from "@material-ui/core";
import { motion } from "framer-motion";
import { useProjectDetails } from "../../../projectManagementQueries";
import { WorkOrdersCardDetailsTable } from "./WorkOrdersCardDetailsTable";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { useMyWorkorders } from "../../../projectQueries";
import { useParams } from "react-router-dom";

export const WorkOrdersDetails = ({ isOpen, toggleOpen }: any) => {
  const theme = useTheme();
  const { projectId } = useParams() as {
    projectId: string;
  };
  const {
    data: projectDetailsData,
    error: errorProjectDetails,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
    isSuccess: isSuccessProjectDetails,
  } = useMyWorkorders(projectId);

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
            {isLoadingProjectDetails && <CircularProgress color="inherit" />}
            {isErrorProjectDetails && (
              <ErrorMessage error={errorProjectDetails} />
            )}
            {isSuccessProjectDetails && (
              <WorkOrdersCardDetailsTable data={projectDetailsData} />
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
