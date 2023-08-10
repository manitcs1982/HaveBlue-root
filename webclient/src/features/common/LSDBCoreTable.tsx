import React from "react";
import { Typography, Grid, useTheme, IconButton } from "@material-ui/core";
import { useTable, Column, useFilters, useSortBy } from "react-table";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { useDefaultColumn } from "../../util/filter";
import { renderHeader } from "./util";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import includes from "lodash/includes";

const defaultPropGetter = () => ({});

export const LSDBCoreTable = ({
  columns,
  data = [],
  hiddenColumns = [],
  noGeneralFilterColumns = [],
  getCellProps = defaultPropGetter,
}: {
  columns: Column<object>[];
  data: any;
  hiddenColumns?: string[];
  noGeneralFilterColumns?: string[];
  getCellProps?: any;
}) => {
  const tableColumns = React.useMemo(() => columns, [columns]);
  const defaultColumn = useDefaultColumn();
  const theme = useTheme();
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        data,
        columns: tableColumns,
        defaultColumn,
        initialState: {
          hiddenColumns: hiddenColumns,
        },
      },
      useFilters,
      useSortBy
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
              {headerGroup.headers.map((column: any) => (
                <TableCell
                  {...column.getHeaderProps({
                    className: column.headerClassName,
                    style: {
                      minWidth: column.minWidth,
                      width: column.width,
                      maxWidth: column.maxWidth,
                      ...column.headerStyle,
                    },
                  })}
                >
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
                              !includes(noGeneralFilterColumns, column.id) && (
                                <CallSplitIcon />
                              )
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
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <TableCell
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                          style: {
                            minWidth: cell.column.minWidth,
                            width: cell.column.width,
                            maxWidth: cell.column.maxWidth,
                            ...cell.column.style,
                          },
                        },
                        getCellProps(cell),
                      ])}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
