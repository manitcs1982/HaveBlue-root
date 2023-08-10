import React from "react";
import { IconButton, useTheme } from "@material-ui/core/";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import { Link } from "react-router-dom";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import { useCustomerDetailsContext } from "../../../common/CustomerDetailsContext";
import { renderHeader } from "../../../common/util";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const CustomerTable = ({ data }: any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();
  const { dispatch } = useCustomerDetailsContext();

  console.log(data);
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        id: "Customer",
        accessor: "name",
        Cell: ({ row }: any) => {
          return (
            <MuiLink
              onClick={() => dispatch({ type: "CLEAN_ALL" })}
              component={Link}
              to={`/project_management/customer/${row.values.id}`}
            >
              {row.values.Customer}
            </MuiLink>
          );
        },
        filter: generalFilter,
      },
      {
        id: "Projects",
        accessor: "project_numbers",
        Cell: ({ row }: any) => {
          return (
            <>
              {row.values.Projects?.map((value: any) => (
                <MuiLink
                  component={Link}
                  to={`/project_management/project_intelligence/${value.id}`}
                >
                  {` ${value.number}`}
                </MuiLink>
              ))}
            </>
          );
        },
        filter: generalFilter,
      },
    ],
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

  if (!data.length) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        <strong>No Customers Available</strong>
      </Alert>
    );
  }

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
  );
};
