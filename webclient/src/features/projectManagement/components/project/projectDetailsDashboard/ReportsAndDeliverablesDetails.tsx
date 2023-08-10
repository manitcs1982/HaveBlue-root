import { BackButton } from "../../../../common/returnButton";

import { Typography, Grid, useTheme } from "@material-ui/core";
import { WorkOrderActionCountsTable } from "./WorkOrderActionCountsTable";
import { ProjectActionCountsTable } from "./ProjectActionCountsTable";

export const ReportsAndDeliverablesDetails = ({
  project,
  projectActionsData,
}: any) => {
  const theme = useTheme();

  return (
    <div style={theme.containerMargin}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid xs={11}></Grid>
        <Grid item xs={1}>
          <BackButton />
        </Grid>
        <Grid xs={12}>
          <ProjectActionCountsTable
            projectActionCountsData={[
              {
                project_number: project.number,
                total_actions: projectActionsData.total_actions,
                completed_actions: projectActionsData.completed_actions,
              },
            ]}
            projectActionsData={projectActionsData.actions}
          />
        </Grid>
        <Grid xs={12}>
          <WorkOrderActionCountsTable
            project={project}
            workOrderActions={projectActionsData.work_orders}
          />
        </Grid>
      </Grid>
    </div>
  );
};
