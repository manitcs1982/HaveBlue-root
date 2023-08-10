import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { IconButton, Link as MuiLink, useTheme } from "@material-ui/core/";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useExpanded,
} from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import { getNoteType } from "../../../../util/searchData";
import { ViewAddNoteList } from "../../../common/ViewAddNotes";
import { ThreadedCreator } from "../../../common/threadedViewer/threadedCreator";

import { useAddNoteToProject } from "../../projectManagementMutations";
import { useProjectNotes } from "../../projectQueries";
import { MyProjectsWorkOrderPage } from "./MyProjectsWorkOrderPage";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Link } from "react-router-dom";
import { renderHeader } from "../../../common/util";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const MyProjectsTable = ({ data }: any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();
  const { mutateAsync: mutateAddNote } = useAddNoteToProject();

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
        id: "Project",
        accessor: "number",
        Cell: ({ row }: any) => {
          return (
            <MuiLink
              component={Link}
              to={`/project_management/project_intelligence/${row.values.id}`}
            >
              {row.values.Project}
            </MuiLink>
          );
        },
        filter: generalFilter,
      },
      {
        id: "Disposition",
        accessor: "disposition_name",
        filter: generalFilter,
      },
      {
        id: "Customer",
        accessor: "customer_name",
        filter: generalFilter,
      },
      {
        id: "Intake Directives",
        Header: "Intake Directives",
        disableFilters: true,
        accessor: "notes",
        Cell: ({ cell, row }: any) => {
          console.log(cell.value);
          return (
            <ViewAddNoteList
              id={row.values.id}
              type={2}
              model={"project"}
              invalidate={[
                "my_projects",
                ["projectNotes", row.values.id],
                "active_projects",
              ]}
              count={
                cell.value[getNoteType("Intake Directive", cell.value)]?.count
              }
              getNotes={useProjectNotes}
              unreadNotes={
                cell.value[getNoteType("Intake Directive", cell.value)]
                  ?.unread_count
              }
            />
          );
        },
      },
      {
        id: "Notes",
        Header: "Notes",
        Cell: ({ row }: any) => {
          return (
            <ViewAddNoteList
              id={row.values.id}
              type={1}
              model={"project"}
              mutate={mutateAddNote}
              invalidate={[
                "my_projects",
                ["projectNotes", row.values.id],
                "active_projects",
              ]}
              count={
                row.values["Intake Directives"][
                  getNoteType("Note", row.values["Intake Directives"])
                ]?.count
              }
              getNotes={useProjectNotes}
              unreadNotes={
                row.values["Intake Directives"][
                  getNoteType("Note", row.values["Intake Directives"])
                ]?.unread_count
              }
            />
          );
        },
      },

      {
        id: "Add Tasks",
        Header: "Add Tasks",
        Cell: ({ row }: any) => {
          return (
            <ThreadedCreator
              id={row.values.id}
              parentObject={row.values}
              model={"project"}
              invalidate={[
                "my_projects",
                ["projectNotes", row.values.id],
                "active_projects",
              ]}
              noteType={8}
            />
          );
        },
      },
    ],
    [mutateAddNote]
  );

  const { getTableProps, visibleColumns, headerGroups, rows, prepareRow } =
    useTable(
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
                          {(column.id === "Intake Directives" ||
                            column.id === "Notes" ||
                            column.id === "Add Tasks") &&
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
                              column.id !== "expander" &&
                              column.id !== "Intake Directives" &&
                              column.id !== "Notes" &&
                              column.id !== "Add Tasks" && <CallSplitIcon />
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
                  {row.cells.map((cell) => {
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
                      <MyProjectsWorkOrderPage projectID={row.values.id} />
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
