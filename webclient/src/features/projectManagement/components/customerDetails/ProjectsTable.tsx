import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import { IconButton, useTheme } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import { useCustomerDetailsContext } from "../../../common/CustomerDetailsContext";
import { renderHeader } from "../../../common/util";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const ProjectsTable = ({ data = [] }: any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();
  const { state, dispatch } = useCustomerDetailsContext();
  const history = useHistory();
  const { customerId } = useParams() as {
    customerId: string;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Project Id",
        accessor: "id",
      },
      {
        Header: "Url",
        accessor: "url",
      },
      {
        id: "Number",
        accessor: "number",
        filter: generalFilter,
      },
      {
        id: "Project Manager",
        accessor: "project_manager_name",
        filter: generalFilter,
      },
      {
        id: "Start Date",
        accessor: "start_date",
        filter: generalFilter,
      },
      {
        id: "Disposition",
        accessor: "disposition_name",
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
        hiddenColumns: ["id", "url"],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const openNewProjectForm = () => {
    history.push(`/project_management/customer/${customerId}/projects/add`);
  };
  const openEditProjectForm = (projectId: string | null) => () => {
    history.push(
      `/project_management/customer/${customerId}/projects/edit/${projectId}`
    );
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={10}>
          <Typography variant="h5">Projects</Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            style={theme.btnNew}
            variant="contained"
            color="primary"
            onClick={openNewProjectForm}
          >
            New
          </Button>
        </Grid>
        <Grid item xs={1} spacing={10}>
          {state.activeProjectId && (
            <Button
              style={theme.btnWarning}
              variant="contained"
              color="primary"
              onClick={openEditProjectForm(state.activeProjectId)}
            >
              Edit
            </Button>
          )}
        </Grid>
      </Grid>
      {!data.length && (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No Projects Available</strong>
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
                  <TableRow
                    {...row.getRowProps()}
                    selected={row.values.id === state.activeProjectId}
                    onClick={() => {
                      if (row.values.id === state.activeProjectId) {
                        dispatch({ type: "CLEAN_PROJECT" });
                      } else {
                        dispatch({
                          type: "PROJECT_SELECTED",
                          payload: {
                            projectId: row.values.id,
                            projectUrl: row.values.url,
                          },
                        });
                      }
                    }}
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
      )}
    </>
  );
};
