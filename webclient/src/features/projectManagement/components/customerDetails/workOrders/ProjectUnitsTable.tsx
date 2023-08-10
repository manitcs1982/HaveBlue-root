import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { IconButton, useTheme } from "@material-ui/core/";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import { DefaultColumnFilter, generalFilter } from "../../../../../util/filter";
import { TravelerModal } from "../../../../common/travelerModal";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Alert, AlertTitle } from "@material-ui/lab";
import { renderHeader } from "../../../../common/util";

import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const ProjectUnitsTable = ({ data = [] }: any) => {
  const theme = useTheme();
  const columns = React.useMemo(
    () => [
      {
        Header: "Project Unit Id",
        accessor: "id",
      },
      {
        id: "Name",
        accessor: "name",
        filter: generalFilter,
      },
      {
        id: "Model",
        accessor: "model_number",
        filter: generalFilter,
      },
      {
        id: "Description",
        accessor: "description",
        filter: generalFilter,
      },
      {
        id: "Serial Number",
        accessor: "serial_number",
        filter: generalFilter,
      },
    ],
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data,
      columns,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id"],
      },
    },

    useFilters,
    useGlobalFilter,
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
        <Grid item xs={12}>
          <Typography variant="h5">Project Units</Typography>
        </Grid>
      </Grid>

      {!data.length && (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No Work Order Units Available</strong>
        </Alert>
      )}
      {data.length > 0 && (
        <TableContainer data-testid="tableContainer" component={Paper}>
          <MuiTable {...getTableProps()} size="small">
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
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {cell.column.Header === "Serial Number" ? (
                            <TravelerModal serialNumber={cell.value} />
                          ) : (
                            cell.render("Cell")
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </MuiTable>
        </TableContainer>
      )}
    </>
  );
};
