import React from "react";
import { Container, Grid, LinearProgress, Typography } from "@material-ui/core";
import { ErrorMessage } from "./ErrorMessage";

import { BarCanvas } from "@nivo/bar";

export const FacilityGraph = ({queryCall}:any) => {
    const {
        error: errorStats,
        data: statsData,
        isLoading: isLoadingStatsData,
        isError: isErrorStatsData,
        isSuccess: isSuccessStatsData,
      } = queryCall();

  if (isLoadingStatsData) {
    return (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
    );
  }
  if (isErrorStatsData) {
    return (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <ErrorMessage error={errorStats} />
          </Grid>
        </Grid>
    );
  }
  return (
      <BarCanvas
      data={statsData}
      width={600}
      height={700}
      keys={[
        "Diode Test",
        "Wet Leakage Current Test",
        "Visual Inspection",
        "EL Image at 0.1x Isc",
        "EL Image at 1.0x Isc",
        "I-V Curve at LIC (Front)",
        "I-V Curve at STC (Front)",
        "I-V Curve at STC (Rear)",
        "Colorimeter",
      ]}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 75, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "paired" }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={undefined}
      axisRight={undefined}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 90,
        legend: "",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Tests Per Day",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />

  )
}
