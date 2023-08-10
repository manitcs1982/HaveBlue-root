import React from "react";
import { Container, Grid, LinearProgress, Typography } from "@material-ui/core";
import { DefaultLayout } from "../layout/DefaultLayout";
import { ErrorMessage } from "./ErrorMessage";

import { PieCanvas } from "@nivo/pie";
import { BarCanvas } from "@nivo/bar";

import { useTestingStats, useNapaStats, useDCLStats } from "./CommonQueries";
import { mutateBarToPie } from "./CommonMutations";
import { FacilityGraph } from "./FacilityGraph";

export const LandingPage = () => {
  const [pie, setPie] = React.useState<any>([]);

  const {
    error: errorStats,
    data: statsData,
    isLoading: isLoadingStatsData,
    isError: isErrorStatsData,
    isSuccess: isSuccessStatsData,
  } = useTestingStats('');

  React.useEffect(() => {
    if (isSuccessStatsData) {
      setPie(mutateBarToPie({ data: statsData }));
      console.log(pie);
    }
  }, [statsData, isSuccessStatsData]);

  if (isLoadingStatsData) {
    return (
      <DefaultLayout>
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
      </DefaultLayout>
    );
  }

  if (isErrorStatsData) {
    return (
      <DefaultLayout>
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
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Container>
        <Typography variant="h4">Welcome to LSDB: Make Data That Matters</Typography>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={6}>
            <Typography variant="h6">Last 30 Days of Testing</Typography>
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
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Last 30 Days of Testing</Typography>         
            {pie.length > 0 ? (
              <PieCanvas
                data={pie}
                width={600}
                height={600}
                margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={3}
                colors={{ scheme: "paired" }}
                borderColor={{ from: "color", modifiers: [["darker", 0.6]] }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#333333"
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 140,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 60,
                    itemHeight: 14,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 14,
                    symbolShape: "circle",
                  },
                ]}
              />
            ) : null}
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
        <Grid item xs={6}>
          <Typography variant="h6">Last 30 Days of Napa Testing</Typography>
            <FacilityGraph queryCall={useNapaStats}/>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Last 30 Days of DCL Testing</Typography>
          <FacilityGraph queryCall={useDCLStats}/>
        </Grid>

        </Grid>
      </Container>
    </DefaultLayout>
  );
};
