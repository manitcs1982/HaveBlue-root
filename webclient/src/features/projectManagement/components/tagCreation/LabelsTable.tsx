import React from "react";
import { Grid, useTheme, Paper, Typography, Chip, LinearProgress,  } from "@material-ui/core";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  Cell,
} from "react-table";

import { generalFilter, useDefaultColumn } from "../../../../util/filter";

export const LabelDisplay = ({filterLabel, labels} : any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();

  const labelText = ( hexColor : any ) => {
    let r = parseInt(hexColor.substr(1, 2), 16);
    let g = parseInt(hexColor.substr(3, 2), 16);
    let b = parseInt(hexColor.substr(5, 2), 16);
    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return (brightness > 125 ? "black" : "white");
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Color",
        accessor: "hex_color"
      },
      {
        Header: "Label",
        accessor: "name",
        filter: generalFilter,
        Cell: ({ row }: any) => (
            <Chip
              size="medium"
              label={row.values.name}
              style={{
                backgroundColor: row.values.hex_color,
                color: labelText(row.values.hex_color),
                marginBottom: 32,
              }}
            />
        ),
      },
      {
        Header: "Description",
        accessor: "description"
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data: labels.results,
      columns,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id", "hex_color"],
      },
    },

    useFilters,
    useGlobalFilter,
    useSortBy
  );

  return (
    <Paper style={{ marginTop: 64 }}>
      <TableContainer data-testid="tableContainer" style={theme.tableContainer}>
        <MuiTable stickyHeader {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell>
                    <Grid
                      container
                      direction="row"
                      /*justify="space-between"*/
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
                      <Grid item xs={12}>
                        {column.canFilter ? column.render("Filter") : null}
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
                </>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );

}
