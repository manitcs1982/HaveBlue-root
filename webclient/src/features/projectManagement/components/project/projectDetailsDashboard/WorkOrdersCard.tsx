import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  CardHeader,
  Avatar,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useHistory, useParams } from "react-router-dom";
import { CallMade } from "@material-ui/icons";
import { useProjectDetails } from "../../../projectManagementQueries";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { WorkOrdersTableCard } from "./WorkOrdersTableCard";
import { useMyWorkorders } from "../../../projectQueries";
import { CardLoader } from "../../../../common/CardLoader";

export const WorkOrdersCard = () => {
  const theme = useTheme();
  const history = useHistory();
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

  const renderCardContent = () => {
    if (isLoadingProjectDetails) {
      return <CardLoader />;
    }
    if (isErrorProjectDetails) {
      return <ErrorMessage error={errorProjectDetails} />;
    }
    return (
      <>
        <CardHeader
          style={theme.cardHeader}
          subheader={
            <Typography variant="subtitle1" style={theme.dashboardCardTitle}>
              Work Orders
            </Typography>
          }
          action={
            <IconButton
              onClick={() =>
                history.push(`${history.location.pathname}/work_orders`)
              }
            >
              <CallMade style={theme.cardGoToDetailButton} />
            </IconButton>
          }
        ></CardHeader>
        <CardContent>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Typography variant="h6" style={theme.dashboardCardTitle}>
                <WorkOrdersTableCard data={projectDetailsData} />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </>
    );
  };

  return <Card style={theme.dashboardCard}>{renderCardContent()}</Card>;
};
