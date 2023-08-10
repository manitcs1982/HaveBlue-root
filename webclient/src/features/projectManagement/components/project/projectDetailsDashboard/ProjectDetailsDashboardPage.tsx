import {
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  CircularProgress,
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { TestResultFlagsAndThreadedResponsesCard } from "./TestResultFlagsAndThreadedResponsesCard";
import { BurndownChartsCard } from "./BurndownChartsCard";
import { ClientActionsCard } from "./ClientActionsCard";
import { ProjectFilesCard } from "./ProjectFilesCard";
import { ProjectNotesCard } from "./ProjectNotesCard";
import { ProjectSummaryCard } from "./ProjectSummaryCard";
import { ReportsAndDeliverablesCard } from "./ReportsAndDeliverablesCard";
import { WorkOrdersCard } from "./WorkOrdersCard";
import { GanttScheduleAndPercentCompleteProfileCard } from "./GanttScheduleAndPercentCompleteProfileCard";
import { ProjectSummaryDetails } from "./ProjectSummaryDetails";
import { ProjectNotesDetails } from "./ProjectNotesDetails";
import { ProjectFilesDetails } from "./ProjectFilesDetails";
import { BurndownDetails } from "./BurndownDetails";
import { GanttScheduleAndPercentCompleteProfileDetails } from "./GanttScheduleAndPercentCompleteProfileDetails";
import { TestResultFlagsAndThreadedResponsesDetails } from "./TestResultFlagsAndThreadedResponsesDetails";
import { AnimatePresence, motion } from "framer-motion";
import { ReportsAndDeliverablesDetails } from "./ReportsAndDeliverablesDetails";
import { WorkOrdersDetails } from "./WorkOrdersDetails";
import { useProjectById } from "../../../../common/CommonQueries";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { useProjectSummary } from "../../../projectManagementQueries";
import { ClientDeliverablesDetails } from "./ClientDeliverablesDetails";
import { useProjectActions } from "../../../projectManagementQueries";
import { NewWorkOrderAction } from "./actionCreation/NewWorkOrderAction";
import { NewProjectAction } from "./actionCreation/NewProjectAction";
import React from "react";

export const ProjectDetailsDashboardPage = () => {
  const theme = useTheme();
  const { section, projectId, workOrderId } = useParams() as {
    projectId: string;
    section: string;
    workOrderId: string;
  };
  const [openProjectActions, setOpenProjectActions] = React.useState(false);
  const [openWorkOrderActions, setOpenWorkOrderActions] = React.useState(false);

  const {
    data: projectDetailsData,
    error: errorProjectDetails,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
    isSuccess: isSuccessProjectDetails,
    refetch: projectDetailsFetch,
    isFetching: isRefetchingProjectDetails,
  } = useProjectById(projectId);

  const {
    data: projectSummaryData,
    error: errorProjectSummary,
    isLoading: isLoadingProjectSummary,
    isError: isErrorProjectSummary,
    isSuccess: isSuccessProjectSummary,
    isFetching: isRefetchingProjectSummary,
  } = useProjectSummary(projectId);

  const {
    data: projectActionsData,
    error: errorProjectActions,
    isLoading: isLoadingProjectActions,
    isError: isErrorProjectActions,
    isSuccess: isSuccessProjectActions,
    isFetching: isRefetchingProjectActions,
  } = useProjectActions(projectId);

  console.log(projectDetailsFetch);

  if (
    isLoadingProjectDetails ||
    isLoadingProjectSummary ||
    isLoadingProjectActions ||
    isRefetchingProjectDetails ||
    isRefetchingProjectSummary ||
    isRefetchingProjectActions
  ) {
    return (
      <Backdrop
        open={
          isLoadingProjectDetails ||
          isLoadingProjectSummary ||
          isLoadingProjectActions ||
          isRefetchingProjectDetails ||
          isRefetchingProjectSummary ||
          isRefetchingProjectActions
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorProjectDetails || isErrorProjectSummary || isErrorProjectActions) {
    return (
      <>
        {isErrorProjectDetails && <ErrorMessage error={errorProjectDetails} />}

        {isErrorProjectSummary && <ErrorMessage error={errorProjectSummary} />}

        {isErrorProjectActions && <ErrorMessage error={errorProjectActions} />}
      </>
    );
  }

  const checkPresence = () => {
    switch (section) {
      case "flags":
        return (
          <motion.div
            animate
            layoutId={"card-container-flags"}
            style={theme.cardAnimation}
          >
            <TestResultFlagsAndThreadedResponsesDetails id={projectId} />
          </motion.div>
        );
      case "reports":
        return (
          <motion.div
            animate
            layoutId={"card-container-reports"}
            style={theme.cardAnimation}
          >
            <ReportsAndDeliverablesDetails
              project={projectDetailsData}
              projectActionsData={projectActionsData}
            />
          </motion.div>
        );
      case "work_orders":
        return (
          <motion.div
            animate
            layoutId={"card-container-workOrders"}
            style={theme.cardAnimation}
          >
            <WorkOrdersDetails />
          </motion.div>
        );
      case "summary":
        return (
          <motion.div
            animate
            layoutId={"card-container-summary"}
            style={theme.cardAnimation}
          >
            <ProjectSummaryDetails projectSummaryData={projectSummaryData} />
          </motion.div>
        );
      case "notes":
        return (
          <motion.div
            animate
            layoutId={"card-container-notes"}
            style={theme.cardAnimation}
          >
            <ProjectNotesDetails id={projectId} />
          </motion.div>
        );
      case "burndown":
        return (
          <motion.div
            animate
            layoutId={"card-container-burndown"}
            style={theme.cardAnimation}
          >
            <BurndownDetails projectId={projectId} />
          </motion.div>
        );
      case "files":
        return (
          <motion.div
            animate
            layoutId={"card-container-files"}
            style={theme.cardAnimation}
          >
            <ProjectFilesDetails
              files={projectDetailsData.attachments}
              id={projectDetailsData.id}
              projectFetch={projectDetailsFetch}
              actions={projectDetailsData.actions}
              crates={projectDetailsData.crates}
              units={projectDetailsData.units}
            />
          </motion.div>
        );
      case "gantt":
        return (
          <motion.div
            animate
            layoutId={"card-container-gantt"}
            style={theme.cardAnimation}
          >
            <GanttScheduleAndPercentCompleteProfileDetails />
          </motion.div>
        );
      case "deliverables":
        return (
          <motion.div
            animate
            layoutId={"card-container-deliverables"}
            style={theme.cardAnimation}
          >
            <ClientDeliverablesDetails />
          </motion.div>
        );
    }
  };

  const handleClose = () => {
    setOpenProjectActions(false);
    setOpenWorkOrderActions(false);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid item md={12} xs={12}>
          <Card style={theme.dashboardCard}>
            <CardContent>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item xs={8}>
                  <Typography variant="h6" style={theme.dashboardCardTitle}>
                    {`${projectDetailsData.customer_name} ${
                      projectDetailsData.number
                    } Status: ${projectSummaryData.project_percent_complete.toFixed(
                      2
                    )}% Complete`}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    style={theme.btnNew}
                    size="small"
                    onClick={() => setOpenProjectActions(true)}
                  >
                    New Project Action
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    style={theme.btnNew}
                    size="small"
                    onClick={() => setOpenWorkOrderActions(true)}
                  >
                    New Work Order Action
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <motion.div layoutId={`card-container-flags`}>
            <TestResultFlagsAndThreadedResponsesCard
              notes={projectDetailsData.notes}
            />
          </motion.div>
        </Grid>
        <Grid item md={6} xs={12}>
          <motion.div layoutId={`card-container-summary`}>
            <ProjectSummaryCard projectSummaryData={projectSummaryData} />
          </motion.div>
        </Grid>
        <Grid item md={3} xs={12}>
          <motion.div layoutId={`card-container-reports`}>
            <ReportsAndDeliverablesCard
              projectDetailsData={projectDetailsData}
              projectActionsData={projectActionsData}
            />
          </motion.div>
        </Grid>
        <Grid item md={3} xs={12}>
          <motion.div layoutId={`card-container-notes`}>
            <ProjectNotesCard noteCount={projectDetailsData.note_count} />
          </motion.div>
        </Grid>
        <Grid item md={6} xs={12}>
          <motion.div layoutId={`card-container-burndown`}>
            <BurndownChartsCard projectId={projectDetailsData.id} />
          </motion.div>
        </Grid>
        <Grid item md={3} xs={12}>
          <motion.div layoutId={`card-container-files`}>
            <ProjectFilesCard
              files={projectDetailsData.attachments}
              actions={projectDetailsData.actions}
              crates={projectDetailsData.crates}
              units={projectDetailsData.units}
            />
          </motion.div>
        </Grid>
        <Grid item md={3} xs={12}>
          <motion.div layoutId={`card-container-gantt`}>
            <GanttScheduleAndPercentCompleteProfileCard />
          </motion.div>
        </Grid>
        <Grid item md={6} xs={12}>
          <motion.div layoutId={`card-container-workOrders`}>
            <WorkOrdersCard />
          </motion.div>
        </Grid>
        <Grid item md={3} xs={12}>
          <motion.div layoutId={"card-container-deliverables"}>
            <ClientActionsCard />
          </motion.div>
        </Grid>
      </Grid>
      <AnimatePresence>{checkPresence()}</AnimatePresence>
      <Dialog
        open={openProjectActions || openWorkOrderActions}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle id="scroll-dialog-title">
          {openProjectActions && "New Project Action"}
          {openWorkOrderActions && "New Work Order Action"}
        </DialogTitle>
        <DialogContent>
          <Divider variant="fullWidth" />
          {openProjectActions && (
            <NewProjectAction projectId={projectId} closeModal={handleClose} />
          )}
          {openWorkOrderActions && (
            <NewWorkOrderAction
              projectId={projectId}
              closeModal={handleClose}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
