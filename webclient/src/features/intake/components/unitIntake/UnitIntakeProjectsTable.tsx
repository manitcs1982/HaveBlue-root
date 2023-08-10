import React from "react";
import { IconButton, Link as MuiLink } from "@material-ui/core";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useTheme } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import { getNoteType } from "../../../../util/searchData";
import { formatDate } from "../../../common/formatDate";
import { useProjectNotes } from "../../../projectManagement/projectQueries";
import { ViewAddNoteList } from "../../../common/ViewAddNotes";

import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { renderHeader } from "../../../common/util";

export const UnitIntakeProjectsTable = ({ data = [] }: any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();
  const history = useHistory();

  const columns = React.useMemo(
    () => [
      {
        id: "Work Order Id",
        accessor: "id",
      },
      {
        id: "Work Order Url",
        accessor: "url",
      },
      {
        id: "Project Id",
        accessor: "project_id",
      },
      {
        id: "Project Url",
        accessor: "project",
      },
      {
        id: "Number",
        accessor: "project_number",
        filter: generalFilter,
        Cell: ({ cell, row }: any) => {
          return (
            <MuiLink
              component={Link}
              to={`/operations/intake/unit/${row.values.Number}/${row.values["Project Id"]}/${row.values["Work Order"]}/${row.values["Work Order Id"]}`}
            >
              {cell.value}
            </MuiLink>
          );
        },
      },
      {
        id: "Work Order",
        accessor: "name",
        filter: generalFilter,
      },
      {
        id: "Project Manager",
        accessor: "project_manager_name",
        filter: generalFilter,
      },
      {
        id: "Start Date",
        accessor: "start_datetime",
        filter: generalFilter,
        Cell: ({ row }: any) => {
          return (
            <Typography variant="body2" align="left">
              {formatDate(row.values["Start Date"])}
            </Typography>
          );
        },
      },
      {
        id: "Disposition",
        accessor: "disposition_name",
        filter: generalFilter,
      },
      {
        id: "Intake Directives",
        Header: "Intake Directives",
        accessor: "project_notes",
        disableFilters: true,
        Cell: ({ cell, row }: any) => {
          return (
            <>
              {cell.value ? (
                <ViewAddNoteList
                  id={row.values["Work Order Id"]}
                  type={2}
                  model={"project"}
                  invalidate={[
                    "my_projects",
                    ["project_notes", row.values["Work Order Id"]],
                  ]}
                  count={cell.value[getNoteType("SRI_Note", cell.value)]?.count}
                  getNotes={useProjectNotes}
                />
              ) : null}
            </>
          );
        },
      },
      {
        id: "Notes",
        Header: "Notes",
        disableFilters: true,
        Cell: ({ row }: any) => {
          return (
            <>
              {row.values.Notes ? (
                <ViewAddNoteList
                  id={row.values["Work Order Id"]}
                  type={1}
                  model={"project"}
                  invalidate={[
                    "my_projects",
                    ["project_notes", row.values["Work Order Id"]],
                  ]}
                  count={
                    row.values.Notes[getNoteType("Note", row.values.Notes)]
                      ?.count
                  }
                  getNotes={useProjectNotes}
                />
              ) : null}
            </>
          );
        },
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
        hiddenColumns: [
          "Work Order Id",
          "Work Order Url",
          "Project Id",
          "Project Url",
        ],
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
        <strong>No Projects Available</strong>
      </Alert>
    );
  }

  return (
    <div style={theme.container}>
      <Typography variant="h3">Projects</Typography>
      <TableContainer
        data-testid="tableContainer"
        component={Paper}
        style={theme.tableContainer}
      >
        <MuiTable stickyHeader {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell>
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
                            {(column.id === "Intake Directives" ||
                              column.id === "Notes") &&
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
                                column.id !== "Intake Directives" &&
                                column.id !== "Notes" && <CallSplitIcon />
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
                <TableRow
                  {...row.getRowProps()}
                  /*hover={true}
                  onClick={() =>{
                    history.push(`/operations/intake/unit/${row.values.project_number}/${row.values.project_id}/${row.values.name}/${row.values.id}`);
                  }

                }*/
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
    </div>
  );
};
