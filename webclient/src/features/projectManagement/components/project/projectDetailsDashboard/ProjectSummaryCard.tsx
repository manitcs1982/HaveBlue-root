import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  makeStyles,
  IconButton,
  CardHeader,
  LinearProgress,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { CallMade } from "@material-ui/icons";
import { LSDBCoreDenseTable } from "../../../../common/LSDBCoreDenseTable";
import { useProjectSummaryMemoData } from "./projectDetailsDashboardUtil";

const useStyles = makeStyles({
  label: {
    fontWeight: "bold",
    fontSize: "12px",
  },
  labelPlacementStart: {
    marginLeft: 0,
  },
});

export const ProjectSummaryCard = ({ projectSummaryData }: any) => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const [columns, setColumns] = React.useState<any>([]);
  const [data, setData] = React.useState<any>([]);
  const [mode, setMode] = React.useState("days");

  const { columnsSummary, dataSummary } = useProjectSummaryMemoData(
    mode,
    projectSummaryData
  );

  React.useEffect(() => {
    if (columnsSummary && dataSummary) {
      setData(dataSummary);
      setColumns(columnsSummary);
    }
  }, [columnsSummary, dataSummary]);

  const renderCardContent = () => {
    return (
      <>
        <CardHeader
          style={theme.cardHeader}
          subheader={
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  style={theme.dashboardCardTitle}
                >
                  Project at Glance Summary
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="days"
                  onChange={(event) => setMode(event.target.value)}
                >
                  <FormControlLabel
                    classes={{
                      label: classes.label,
                      labelPlacementStart: classes.labelPlacementStart,
                    }}
                    value="days"
                    control={<Radio color="primary" size="small" />}
                    label="Days Since Last Action"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    classes={{ label: classes.label }}
                    value="percent"
                    control={<Radio color="primary" size="small" />}
                    label="% Complete"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    classes={{ label: classes.label }}
                    value="operational"
                    control={<Radio color="primary" size="small" />}
                    label="Operational Efficiency"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          }
          action={
            <IconButton
              onClick={() =>
                history.push(`${history.location.pathname}/summary`)
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
              {columns.length > 0 && data.length > 0 && (
                <LSDBCoreDenseTable columns={columns} data={data} />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </>
    );
  };

  return <Card style={theme.dashboardCard}>{renderCardContent()}</Card>;
};
