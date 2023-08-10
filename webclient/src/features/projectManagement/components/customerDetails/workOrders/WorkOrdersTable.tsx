import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  Row,
  useRowState,
} from "react-table";
import { useHistory, useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import { IconButton, useTheme } from "@material-ui/core/";
import { useCustomerDetailsContext } from "../../../../common/CustomerDetailsContext";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { WorkOrderAssignment } from "./WorkOrderAssignment";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const WorkOrdersTable = ({ data = [] }: any) => {
  const { state, dispatch } = useCustomerDetailsContext();
  const theme = useTheme();
  const history = useHistory();
  const { customerId } = useParams() as {
    projectId: string;
    customerId: string;
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }: { row: Row }) => {
          return (
            <span {...row.getToggleRowExpandedProps()}>
              {row.isExpanded ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowUpIcon />
              )}
            </span>
          );
        },
      },

      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Plan",
        accessor: "test_sequence_definition_name",
      },
      {
        Header: "NTP Date",
        accessor: "start_datetime",
      },
      {
        Header: "Disposition",
        accessor: "disposition_name",
      },
    ],
    []
  );

  const { getTableProps, visibleColumns, headerGroups, rows, prepareRow } =
    useTable(
      {
        data,
        columns,
        initialState: {
          hiddenColumns: ["id"],
        },
      },
      useRowState,
      useFilters,
      useSortBy,
      useExpanded
    );
  const openNewWorkOrderForm = () => {
    history.push(
      `/project_management/customer/${customerId}/projects/${state.activeProjectId}/work_orders/add/`
    );
  };

  const openEditWorkOrderForm = (id: string) => () => {
    history.push(
      `/project_management/customer/${customerId}/projects/${state.activeProjectId}/work_orders/edit/${id}`
    );
  };

  const renderExpandedRow = (row: Row) => {
    if (row.isExpanded) {
      dispatch({
        type: "WORK_ORDER_SELECTED",
        payload: row.values.id,
      });
      return (
        <TableRow>
          <TableCell colSpan={visibleColumns.length}>
            <WorkOrderAssignment workOrderId={row.values.id} />
          </TableCell>
        </TableRow>
      );
    }
    return null;
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={10}>
          <Typography variant="h5">Work Orders</Typography>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={openNewWorkOrderForm} style={theme.btnNew}>
            New
          </Button>
        </Grid>
        <Grid item xs={1}>
          {state.activeWorkOrder && (
            <Button
              onClick={openEditWorkOrderForm(state.activeWorkOrder)}
              style={theme.btnWarning}
            >
              Edit
            </Button>
          )}
        </Grid>
      </Grid>
      {!data.length && (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No Work Orders Available</strong>
        </Alert>
      )}
      {data.length > 0 && (
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
                  <>
                    <TableRow
                      {...row.getRowProps()}
                      selected={row.values.id === state.activeWorkOrder}
                      onClick={() => {
                        if (row.values.id === state.activeWorkOrder) {
                          dispatch({ type: "CLEAN_WORK_ORDER" });
                        } else {
                          dispatch({
                            type: "WORK_ORDER_SELECTED",
                            payload: row.values.id,
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

                    {renderExpandedRow(row)}
                  </>
                );
              })}
            </TableBody>
          </MuiTable>
        </TableContainer>
      )}
    </>
  );
};
