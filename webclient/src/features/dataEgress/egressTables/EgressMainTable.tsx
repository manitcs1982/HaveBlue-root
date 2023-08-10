import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { IconButton, useTheme } from "@material-ui/core/";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useExpanded,
} from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { generalFilter, useDefaultColumn } from "../../../util/filter";
import { EgressSubTable } from "./EgressSubTable";
import { TravelerModal } from "../../common/travelerModal";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { renderHeader } from "../../common/util";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const EgressMainTable = ({ rowData }: any) => {
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
        id: "Project",
        accessor: "project_number",
        filter: generalFilter,
      },
      {
        id: "Work Order",
        accessor: "work_order_name",
        filter: generalFilter,
      },
      {
        id: "Serial",
        accessor: "serial_number",
        filter: generalFilter,
        Cell: ({ cell }: any) => {
          return <TravelerModal serialNumber={cell.value} />;
        },
      },
      {
        id: "Sequence",
        accessor: "test_sequence_definition_name",
        filter: generalFilter,
      },
      {
        id: "Status",
        Header: "Status",
        Cell: ({ row }: any) => {
          console.log(row);
          var verified = 0;
          var completed = 0;
          var total = row.original.procedure_results.length;

          row.original.procedure_results.map((procedure: any) => {
            if (
              procedure.verified_by !== null ||
              procedure.verified_by !== undefined
            ) {
              verified += 1;
            }
            if (
              procedure.disposition_name === "Completed" ||
              procedure.disposition_name === "Passed"
            ) {
              completed += 1;
            }
          });

          return (
            <Typography variant="body2">
              {verified}/{completed}/{total}
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
        data: rowData,
        columns,
        defaultColumn,
        initialState: {
          hiddenColumns: ["id"],
        },
      },

      useFilters,
      useGlobalFilter,
      useSortBy,
      useExpanded
    );

  return (
    <TableContainer
      data-testid="tableContainer"
      style={theme.tableContainer}
      component={Paper}
    >
      <MuiTable stickyHeader {...getTableProps()} size="small">
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell style={theme.noLeftRightPadding}>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={0}
                  >
                    <Grid item xs={12} {...column.getHeaderProps()}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={0}
                      >
                        <Typography variant="subtitle1">
                          {column.id === "Status" && column.render("Header")}
                        </Typography>
                        {column.canFilter ? column.render("Filter") : null}
                        <Grid item xs={2}>
                          <IconButton
                            type="submit"
                            aria-label="search"
                            size="small"
                            {...column.getSortByToggleProps()}
                          >
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ArrowDropDownIcon />
                              ) : (
                                <ArrowDropUpIcon />
                              )
                            ) : (
                              column.id !== "expander" && <CallSplitIcon />
                            )}
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <>
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
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
                      <EgressSubTable rowData={row.original} />
                    </TableCell>
                  </TableRow>
                ) : null}
              </>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
