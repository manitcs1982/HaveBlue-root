import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Container,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  MenuItem } from "@material-ui/core";
import { motion } from "framer-motion";
import { Chart } from "react-google-charts";
import { LineCanvas } from "@nivo/line";
import { CallMade } from "@material-ui/icons";
import { useBurndown, useGantt } from "../../../projectManagementQueries";
import { mutateGantt } from "../../../../common/CommonMutations";
import { BackButton } from "../../../../common/returnButton";

export const BurndownDetails = ({projectId} : any) => {
  const theme = useTheme();
  enum ChartTypes {
    BURNDOWN,
    GANTT
  }
  const [chartType, setChartType] = React.useState(ChartTypes.BURNDOWN)
  const [dataGantt, setDataGantt] = React.useState([])

  const {
    data: burndownData = [],
    error: errorBurndownData,
    isLoading: isLoadingBurndownData,
    isError: isErrorBurndownData,
    isSuccess: isSuccessBurndownData,
  } = useBurndown(projectId);

  const {
    data: ganttData,
    error: errorGanttData,
    isLoading: isLoadingGanttData,
    isError: isErrorGanttData,
    isSuccess: isSuccessGanttData,
  } = useGantt(projectId);

  React.useEffect(() => {
    if (ganttData) {
      setDataGantt(mutateGantt(ganttData))
    }
  }, [ganttData])

  const setChart = (event : any) => {
    setChartType(Number(event.target.value));
  }

  const setGantt = (event : any) => {
    setDataGantt(mutateGantt(event.target.value))
  }

  const renderChart = () => {
    if (chartType === ChartTypes.BURNDOWN) {
      return(
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
          <LineCanvas
            data={burndownData}
            height={600}
            width={1200}
            margin={{ top: 30, right: 120, bottom: 90, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.3f"
            axisTop={null}
            axisRight={null}
            enablePoints={true}
            /*enableGridX={false}*/
            colors={{ scheme: "dark2" }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legend: "Date",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Remaining Work Hours",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            lineWidth={1}
            pointSize={3}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            /*pointLabelYOffset={-12}*/
            /*useMesh={true}*/
            legends={[
              {
                anchor: "top",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: -25,
                itemsSpacing: 80,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
          </Grid>
        </Grid>
      )
    } else if (chartType === ChartTypes.GANTT) {
      return (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
            <TextField
              id="standard-select-currency"
              select
              label="WorkOrder"
              value={dataGantt}
              onChange={setGantt}
              helperText="Select Workorder"
            >
              {ganttData.map((chart : any) => (
                <MenuItem key={chart.id} value={chart.data}>
                  {chart.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Chart
              style={{ height: 500 }}
              width={"100%"}
              height={"500px"}
              chartType="Gantt"
              loader={<div>Loading Chart</div>}
              data={dataGantt}
              options={{
                height: 500,
                gantt: {
                  trackHeight: 30,
                  arrow: {
                    angle: 100,
                    width: 3,
                    color: "cyan",
                    radius: 0
                  },
                },
                criticalPathEnabled: false,
                sortTasks: false,
              }}
              rootProps={{ "data-testid": "2" }}
            />
          </Grid>
        </Grid>
      )
    } else {
      return null
    }
  }

  if (isLoadingBurndownData || isLoadingGanttData) {
    return (
      <>
      <div style={theme.container}>
        <Container>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid xs={12}>
              <Typography variant="h3">Gantt or Burndown Charts</Typography>
            </Grid>
            <Grid xs={12}>
              <LinearProgress />
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
    );
  }

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
            <Typography variant="h3">Gantt or Burndown Charts</Typography>
          </Grid>
          <Grid item xs={1}>
            <BackButton />
          </Grid>
          <Grid xs={12}>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="chart" name="charttype" value={chartType} onChange={setChart}>
                <FormControlLabel value={ChartTypes.BURNDOWN} control={<Radio />} label="Burndown" />
                <FormControlLabel value={ChartTypes.GANTT} control={<Radio />} label="Gantt" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid xs={12}>
            {renderChart()}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
