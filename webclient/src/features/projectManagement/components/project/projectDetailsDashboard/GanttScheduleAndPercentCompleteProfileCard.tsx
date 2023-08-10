import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  ListItem,
  ListItemText,
  List,
  IconButton,
  CardHeader,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { CallMade } from "@material-ui/icons";

export const GanttScheduleAndPercentCompleteProfileCard = () => {
  const theme = useTheme();
  const history = useHistory();

  const renderCardContent = () => {
    /*  if (isLoadingProjectDetails) {
      return <CardLoader />;
    }
    if (isErrorProjectDetails) {
      return <ErrorMessage error={errorProjectDetails} />;
    } */
    return (
      <>
        <CardHeader
          style={theme.cardHeader}
          subheader={
            <Typography variant="subtitle1" style={theme.dashboardCardTitle}>
              Gantt, Schedule and % Complete Profile
            </Typography>
          }
          action={
            <IconButton
              onClick={() => history.push(`${history.location.pathname}/gantt`)}
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
              <List dense>
                <ListItem>
                  <ListItemText
                    primary=" * Next Milestone event #1"
                    primaryTypographyProps={{
                      variant: "h6",
                      gutterBottom: true,
                      style: theme.boldText,
                    }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </>
    );
  };

  return <Card style={theme.dashboardCard}>{renderCardContent()}</Card>;
};
