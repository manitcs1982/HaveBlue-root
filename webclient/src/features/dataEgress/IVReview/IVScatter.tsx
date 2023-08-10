import { ScatterPlotCanvas } from "@nivo/scatterplot";

export const Scatter = ({ chart }: any) => {
  return (
    <ScatterPlotCanvas
      data={chart}
      height={600}
      width={800}
      margin={{ top: 50, right: 120, bottom: 50, left: 60 }}
      xScale={{ type: "linear", min: 0 }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.3f"
      xFormat=" >-.3f"
      axisTop={null}
      axisRight={null}
      /*enableGridX={false}*/
      colors={{ scheme: "dark2" }}
      nodeSize={3}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Voltage",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Current",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      /*pointLabelYOffset={-12}*/
      /*useMesh={true}*/
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
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
  );
};
