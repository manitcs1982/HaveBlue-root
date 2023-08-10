import React from "react";
import { Typography, Grid, useTheme } from "@material-ui/core";
import { useTable, Column, useFilters, useSortBy } from "react-table";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { useDefaultColumn } from "../../../util/filter";

export const LSDBHighlightTable = ({
  columns,
  data = [],
  hiddenColumns = [],
  highlightCondition,
  highlightColor,
}: {
  columns: Column<object>[];
  data: any;
  hiddenColumns?: string[];
  highlightCondition: (row: any) => boolean;
  highlightColor: string;
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
    <div style={theme.containerMargin}>
      <Paper style={{ marginTop: 32 }}>
        <TableContainer
          data-testid="tableContainer"
          style={theme.tableContainer}
        >
          <MuiTable stickyHeader {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell {...column.getHeaderProps()}>
                      <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        spacing={1}
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
                        <Grid item xs={12}>
                          {column.canFilter ? column.render("Filter") : null}
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
                  <TableRow
                    style={{
                      backgroundColor: highlightCondition(row)
                        ? highlightColor
                        : "",
                    }}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <TableCell {...cell.getCellProps()}>
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
      </Paper>
    </div>
  );
};
