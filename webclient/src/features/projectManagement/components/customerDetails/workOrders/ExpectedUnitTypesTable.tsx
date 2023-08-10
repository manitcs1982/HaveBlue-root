import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { useTable, useSortBy } from "react-table";
import Typography from "@material-ui/core/Typography";
import { useTheme, Grid, IconButton } from "@material-ui/core/";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { AddExpectedModal } from "./AddExpectedModal";

export const ExpectedUnitTypesTable = ({ data = [], number }: any) => {
  const theme = useTheme();
  const columns = React.useMemo(
    () => [
      {
        Header: "Expected Unit Type Id",
        accessor: "id",
      },
      {
        Header: "Model Type",
        accessor: "model",
      },
      {
        Header: "Expected",
        accessor: "expected_count",
      },
      {
        Header: "Received",
        accessor: "received_count",
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data,
      columns,
      initialState: {
        hiddenColumns: ["id"],
      },
    },
    useSortBy
  );
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={6}>
          <Typography variant="h5">Expected Unit Types</Typography>
        </Grid>
        <Grid item xs={2}>
          <AddExpectedModal project={number} />
        </Grid>
      </Grid>

      <TableContainer data-testid="tableContainer" component={Paper}>
        <MuiTable {...getTableProps()} size="small">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell {...column.getHeaderProps()}>
                    {column.render("Header")}

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
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
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
    </>
  );
};
