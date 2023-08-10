import {
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardHeader,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { CallMade } from "@material-ui/icons";

export const ReportsAndDeliverablesCard = ({
  projectDetailsData,
  projectActionsData,
}: any) => {
  const theme = useTheme();
  const history = useHistory();

  const renderCardContent = () => {
    return (
      <>
        <CardHeader
          style={theme.cardHeader}
          subheader={
            <>
              <Typography variant="subtitle1" style={theme.dashboardCardTitle}>
                Reports and Deliverables
              </Typography>
              <Typography variant="body1" style={theme.boldText}>
                {projectDetailsData.number}
              </Typography>
              <Typography
                variant="body1"
                style={theme.boldText}
              >{`${projectActionsData.completed_actions} out of ${projectActionsData.total_actions}`}</Typography>
            </>
          }
          action={
            <IconButton
              onClick={() =>
                history.push(`${history.location.pathname}/reports`)
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
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table
                  size="small"
                  padding="none"
                  style={{ minWidth: 20 }}
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>BOM</TableCell>
                      <TableCell>Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectActionsData?.work_orders?.map(
                      (workOrderReport: any) => {
                        return (
                          <TableRow key={1}>
                            <TableCell>{workOrderReport.name}</TableCell>
                            <TableCell>{`${workOrderReport.completed_actions} out of ${workOrderReport.total_actions}`}</TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Grid container justify="flex-end" alignItems="flex-end"></Grid>
        </CardContent>
      </>
    );
  };

  return <Card style={theme.dashboardCard}>{renderCardContent()}</Card>;
};
