import { motion } from "framer-motion";
import { BackButton } from "../../../../common/returnButton";

import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { WorkOrderActionsTable } from "./WorkOrderActionsTable";

import { useDefaultColumn } from "../../../../../util/filter";
import { useExpanded, useSortBy, useTable } from "react-table";

export const WorkOrderActionCountsTable = ({
  project,
  workOrderActions = [],
}: any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }: any) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowUpIcon />
            )}
          </span>
        ),
      },
      {
        Header: "BOM",
        accessor: "name",
        Cell: ({ cell }: any) => {
          return (
            <Typography variant="subtitle1" style={theme.boldText}>
              {cell.value}
            </Typography>
          );
        },
      },
      {
        Header: "Delivery Status",
        Cell: ({ row }: any) => {
          return (
            <Typography variant="subtitle1" style={theme.boldText}>
              {`${row.original.completed_actions} out of ${row.original.total_actions}`}
            </Typography>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, visibleColumns, headerGroups, rows, prepareRow } =
    useTable(
      {
        data: workOrderActions,
        columns,
        defaultColumn,
        initialState: {
          hiddenColumns: ["id"],
        },
      },
      useSortBy,
      useExpanded
    );

  return (
    <div style={theme.containerMargin}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid xs={12}>
          <Typography variant="h4">Work Order Actions</Typography>
        </Grid>

        <Grid xs={12}>
          <Paper>
            <TableContainer data-testid="tableContainer">
              <MuiTable {...getTableProps()}>
                <TableHead color="primary">
                  {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <TableCell>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={0}
                          >
                            <Grid
                              item
                              xs={12}
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              <Typography variant="h6">
                                {column.render("Header")}
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? " 🔽"
                                    : " 🔼"
                                  : ""}
                              </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => {
                    prepareRow(row);
                    return (
                      <>
                        <TableRow {...row.getRowProps()}>
                          {row.cells.map((cell: any) => {
                            return (
                              <TableCell {...cell.getCellProps()}>
                                {cell.render("Cell")}
                              </TableCell>
                            );
                          })}
                        </TableRow>

                        {row.isExpanded ? (
                          <TableRow>
                            <TableCell colSpan={visibleColumns.length}>
                              <WorkOrderActionsTable
                                reports={row.original.actions}
                                projectId={project.id}
                              />
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </>
                    );
                  })}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
