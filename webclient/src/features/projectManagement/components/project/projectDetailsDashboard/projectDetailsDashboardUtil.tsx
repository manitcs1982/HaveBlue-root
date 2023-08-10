import React from "react";
import { Typography, useTheme } from "@material-ui/core";
import moment from "moment";

export const useProjectSummaryMemoData = (
  mode: any,
  projectSummaryData: any
) => {
  const theme = useTheme();
  return React.useMemo(() => {
    if (projectSummaryData) {
      console.log("Project Summary", projectSummaryData);
      const columnNames = new Map<number, {}>([
        [
          0,
          {
            Header: () => (
              <Typography variant="caption" style={theme.boldText}>
                Work Order
              </Typography>
            ),
            accessor: "work_order_name",
          },
        ],
      ]);

      const transformedData = Object.keys(projectSummaryData.work_orders).map(
        (workOrderKey: any) => {
          const currentWorkOrder = projectSummaryData.work_orders[workOrderKey];

          const testSequencesTransform = Object.keys(
            currentWorkOrder.test_sequence_definitions
          ).reduce((accum: any, testSequenceKey: any) => {
            const currentTestSequence: any =
              currentWorkOrder.test_sequence_definitions[testSequenceKey];
            //Column generation
            if (!columnNames.has(currentTestSequence.name)) {
              columnNames.set(currentTestSequence.name, {
                Header: (
                  <Typography variant="caption" style={theme.boldText}>
                    {currentTestSequence.name}
                  </Typography>
                ),
                accessor: currentTestSequence.name,
                Cell: ({ cell }: any) => (
                  <Typography variant="caption">
                    {cell.value || "N/A"}
                  </Typography>
                ),
              });
            }

            if (mode.includes("days")) {
              accum = {
                ...accum,
                [currentTestSequence.name]:
                  currentTestSequence.last_action_datetime !== "" &&
                  currentTestSequence.last_action_datetime !== null
                    ? `${currentTestSequence.last_action_datetime} Days`
                    : "N/A",
              };
            } else if (mode.includes("percent")) {
              accum = {
                ...accum,
                [currentTestSequence.name]:
                  currentTestSequence.percent_complete !== "" &&
                  currentTestSequence.percent_complete !== null
                    ? `${currentTestSequence.percent_complete.toFixed(2)}%`
                    : "N/A",
              };
            } else if (mode.includes("operational")) {
              accum = {
                ...accum,
                [currentTestSequence.name]:
                  currentTestSequence.operational_efficiency !== "" &&
                  currentTestSequence.operational_efficiency !== null
                    ? `${currentTestSequence.operational_efficiency.toFixed(
                        2
                      )}%`
                    : "N/A",
              };
            }
            return accum;
          }, {});

          return {
            work_order_name: currentWorkOrder.name,
            ...testSequencesTransform,
          };
          //testSequencesKeys
        }
      );
      return {
        columnsSummary: Array.from(columnNames.values()) || [],
        dataSummary: transformedData,
      };

      /* console.log("Test seq trans", transformedData);
    console.log("columns", Array.from(columnNames.values()));
    setData(transformedData);
    setColumns(Array.from(columnNames.values()) || []); */
    } else return { columnsSummary: null, dataSummary: null };
  }, [mode, projectSummaryData, theme.boldText]);
};
