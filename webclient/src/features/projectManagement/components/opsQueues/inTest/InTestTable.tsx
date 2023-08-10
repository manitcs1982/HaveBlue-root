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

import { generalFilter, useDefaultColumn } from "../../../../../util/filter";

import { InTestUnitsTable } from "./InTestUnitsTable";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import moment from "moment";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { renderHeader } from "../../../../common/util";

export const InTestTable = ({ data }: any) => {
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
        id: "Asset Name",
        accessor: "asset_name",
        filter: generalFilter,
      },
      {
        id: "Asset Id",
        accessor: "asset_id",
      },
      {
        id: "Procedure definition",
        accessor: "procedure_definition",
        filter: generalFilter,
      },
      {
        id: "Start datetime",
        accessor: "start_datetime",
        filter: generalFilter,
        Cell: ({ value }: any) => moment(value).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        id: "End datetime (ETA)",
        accessor: "eta_datetime",
        filter: generalFilter,
        Cell: ({ value }: any) => moment(value).format("YYYY-MM-DD HH:mm:ss"),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    visibleColumns,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
  } = useTable(
    {
      data: data,
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
                        <Typography variant="subtitle2">
                          {renderHeader(column)}
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
                              <CallSplitIcon />
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
                  {row.cells.map((cell, index) => {
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
                      <InTestUnitsTable assetId={row.values["Asset Id"]} />
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
