import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  Button,
  IconButton,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { CallMade } from "@material-ui/icons";

export const ClientActionsCard = () => {
  const theme = useTheme();
  const history = useHistory();
  const { projectId } = useParams() as {
    projectId: string;
  };

  return (
    <Card style={theme.dashboardCard}>
      <CardContent>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Button
              onClick={() => {
                history.push(`${history.location.pathname}/deliverables`);
              }}
              variant="contained"
              style={theme.btnNew}
            >
              Client Data Deliverable
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" style={theme.btnNew}>
              Run Client Update
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
