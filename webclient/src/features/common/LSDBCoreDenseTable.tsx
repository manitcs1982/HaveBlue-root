import React from "react";
import { Typography, Grid, useTheme } from "@material-ui/core";
import { useTable, Column, useSortBy } from "react-table";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";

export const LSDBCoreDenseTable = React.memo(
  ({ columns, data = [] }: { columns: Column<object>[]; data: any }) => {
    const tableColumns = React.useMemo(() => columns, [columns]);
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
      useTable(
        {
          data,

          columns: tableColumns,
          initialState: {
            hiddenColumns: ["id"],
          },
        },
        useSortBy
      );

    return (
      <TableContainer data-testid="tableContainer" style={{ maxHeight: 150 }}>
        <MuiTable
          {...getTableProps()}
          size="small"
          padding="none"
          style={{ minWidth: 20 }}
        >
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
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
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        <Typography variant="caption">
                          {cell.render("Cell")}
                        </Typography>
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
  }
);
