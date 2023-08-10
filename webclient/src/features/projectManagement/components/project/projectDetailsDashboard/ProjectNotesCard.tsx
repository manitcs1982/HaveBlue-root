import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  RadioGroup,
  Radio,
  makeStyles,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardHeader,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { CallMade } from "@material-ui/icons";

const useStyles = makeStyles({
  label: {
    fontWeight: "bold",
    fontSize: "12px",
  },
});

export const ProjectNotesCard = ({ noteCount }: any) => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();

  const renderCardContent = () => {
    /* if (isLoadingProjectDetails) {
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
              Project Notes
            </Typography>
          }
          action={
            <IconButton
              onClick={() => history.push(`${history.location.pathname}/notes`)}
            >
              <CallMade style={theme.cardGoToDetailButton} />
            </IconButton>
          }
        />
        <CardContent>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid xs={12}>
              <TableContainer>
                <Table
                  size="small"
                  padding="none"
                  style={{ minWidth: 20 }}
                  aria-label="a dense table"
                >
                  <TableBody>
                    <TableRow key={1}>
                      <TableCell>Count</TableCell>
                      <TableCell>
                        {noteCount !== undefined && noteCount}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
      </>
    );
  };

  return <Card style={theme.dashboardCard}>{renderCardContent()}</Card>;
};
