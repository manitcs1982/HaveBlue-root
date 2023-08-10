import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  useTheme,
  IconButton,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MuiTable from "@material-ui/core/Table";
import MuiLink from "@material-ui/core/Link";
import { useTable, useFilters, useSortBy } from "react-table";
import { useMemo } from "react";
import Typography from "@material-ui/core/Typography";
import {
  generalFilter,
  useDefaultColumn,
  CheckboxColumnFilter,
  booleanFilter,
} from "../../../../util/filter";
import { Link } from "react-router-dom";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const UserTable = ({ data = [] }: any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Username",
        accessor: "username",
        Cell: ({ row }: any) => (
          <MuiLink
            component={Link}
            to={`/profile_management/user_management/${row.values.id}`}
          >
            {row.values.username}
          </MuiLink>
        ),
        filter: generalFilter,
      },
      {
        Header: "E-mail",
        accessor: "email",
        filter: generalFilter,
      },
      {
        Header: "Last Name",
        accessor: "last_name",
        filter: generalFilter,
      },
      {
        Header: "First Name",
        accessor: "first_name",
        filter: generalFilter,
      },
      {
        Header: "Is Superuser",
        accessor: "is_superuser",
        Cell: ({ row }: any) => {
          return <p>{row.values.is_superuser ? "Yes" : "No"}</p>;
        },
        Filter: CheckboxColumnFilter,
        filter: booleanFilter,
      },
      {
        Header: "Is Active",
        accessor: "is_active",
        Cell: ({ row }: any) => {
          return <p>{row.values.is_active ? "Yes" : "No"}</p>;
        },
        Filter: CheckboxColumnFilter,
        filter: booleanFilter,
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id"],
      },
    },
    useFilters,
    useSortBy
  );

  if (!data.length) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        <strong>No Users Available</strong>
      </Alert>
    );
  }

  return (
    <TableContainer
      data-testid="tableContainer"
      style={theme.tableContainer}
      component={Paper}
    >
      <MuiTable stickyHeader {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps}>
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
                          {(column.id === "is_active" ||
                            column.id === "is_superuser") &&
                            column.render("Header")}
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
                              column.id !== "is_active" &&
                              column.id !== "is_superuser" && <CallSplitIcon />
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
                {row.cells.map((cell) => (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
