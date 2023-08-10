import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core";
import {
  useTable,
  useSortBy,
  HeaderProps,
  useFilters,
  useRowSelect,
  useGlobalFilter,
  Row,
} from "react-table";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import { useHistory, useParams } from "react-router-dom";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useCustomerDetailsContext } from "../../../common/CustomerDetailsContext";
import { useFetchContext } from "../../../common/FetchContext";
import { useAuthContext } from "../../../common/AuthContext";
import { useAvailableUnits } from "../../projectManagementQueries";
import { useAttachUnitToWorkOrder } from "../../projectManagementMutations";
import { toast } from "react-toastify";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../util/errorMessaging";
import { TravelerModal } from "../../../common/travelerModal";
import { renderHeader } from "../../../common/util";

export const AvailableUnitsTable = () => {
  const history = useHistory();
  const { authAxios } = useFetchContext();
  const { projectId, customerId, workOrderId } = useParams() as {
    projectId: string;
    customerId: string;
    workOrderId: string;
  };
  const theme = useTheme();
  const { state } = useCustomerDetailsContext();
  const { dispatch } = useAuthContext();
  const {
    data = [],
    error,
    isFetching,
    isError,
  } = useAvailableUnits(projectId);

  const { mutateAsync: mutate } = useAttachUnitToWorkOrder();

  const defaultColumn = useDefaultColumn();
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        id: "Serial Number",
        accessor: "serial_number",
        filter: generalFilter,
      },
      {
        id: "Manufacturer",
        accessor: "manufacturer",
        filter: generalFilter,
      },
      {
        id: "Model",
        accessor: "model",
        filter: generalFilter,
      },
      {
        id: "Bom",
        accessor: "bom",
        filter: generalFilter,
      },
      {
        id: "Location",
        accessor: "location_name",
        filter: generalFilter,
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
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
      useSortBy,
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
              <div>
                <Checkbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }: { row: Row<any> }) => (
              <div>
                <Checkbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    );

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  const submitUnits = async () => {
    try {
      const unitIds = selectedFlatRows
        .map((d) => d.original)
        .map((row: any) => row.id)
        .reduce((accum, id) => {
          return { ...accum, [id]: true };
        }, {});

      await mutate({
        authAxios,
        workOrderId: state.activeWorkOrder || workOrderId,
        unitIds,
      });

      if (history.location.pathname.includes("customer")) {
        history.push(`/project_management/customer/${customerId}`);
      } else {
        history.push(`/project_management/project_intelligence/${projectId}`);
      }

      toast.success("Units were succesfully attached on work order");
    } catch (error) {
      toast.error("Error while attaching units to work order.");
      processErrorOnMutation(error, dispatch, history);
    }
  };

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography variant="h5">Available Units </Typography>
          </Grid>
        </Grid>
        {!data.length && (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            <strong>No Work Orders Available</strong>
          </Alert>
        )}
        {data.length > 0 && (
          <>
            <Grid item xs={12}>
              <Paper style={{ marginTop: 32 }}>
                <TableContainer data-testid="tableContainer">
                  <MuiTable {...getTableProps()} size="small">
                    <TableHead>
                      {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <TableCell>
                              <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                spacing={1}
                              >
                                <Grid
                                  item
                                  xs={12}
                                  {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                  )}
                                >
                                  <Typography variant="subtitle1">
                                    {renderHeader(column)}
                                    {column.isSorted
                                      ? column.isSortedDesc
                                        ? " 🔽"
                                        : " 🔼"
                                      : ""}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  {column.canFilter
                                    ? column.render("Filter")
                                    : null}
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
              </Paper>
            </Grid>

            <Grid item xs={1}>
              <Button variant="contained" color="primary" onClick={submitUnits}>
                Submit
              </Button>
            </Grid>
          </>
        )}
      </Container>

      {isFetching ? (
        <Typography variant="body2">Refreshing...</Typography>
      ) : null}
    </div>
  );
};
