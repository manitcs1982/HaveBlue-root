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
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
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
import { useUnitTypeDetails } from "../../projectManagementQueries";
import { useAttachUnitToWorkOrder } from "../../projectManagementMutations";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../common/AuthContext";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../util/errorMessaging";

export const DeleteDatasheetsTable = () => {
  const history = useHistory();
  const { authAxios } = useFetchContext();
  const { dispatch } = useAuthContext();
  const { unitTypeId } = useParams() as {
    unitTypeId: string;
  };
  const theme = useTheme();
  const { state } = useCustomerDetailsContext();
  const [datasheets, setDatasheets] = React.useState([]);
  const {
    data: unitTypeDetailsData,
    error: errorUnitTypeDetailsData,
    isSuccess: isSuccessUnitTypeDetailsData,
    isLoading: isLoadingUnitTypeDetailsData,
    isError: isErrorUnitTypeDetailsData,
  } = useUnitTypeDetails(unitTypeId);
  const { mutateAsync: mutate } = useAttachUnitToWorkOrder();

  React.useEffect(() => {
    if (isSuccessUnitTypeDetailsData && unitTypeDetailsData) {
      setDatasheets(unitTypeDetailsData.datasheets);
    }
  }, [isSuccessUnitTypeDetailsData, unitTypeDetailsData]);

  const defaultColumn = useDefaultColumn();
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "name",
        accessor: "name",
        filter: generalFilter,
      },
      {
        Header: "File Size",
        accessor: "length",
        filter: generalFilter,
      },
      {
        Header: "Upload Date",
        accessor: "uploaded_datetime",
        filter: generalFilter,
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
      {
        data: datasheets,
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

  if (isLoadingUnitTypeDetailsData) {
    return (
      <Backdrop open={isLoadingUnitTypeDetailsData}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorUnitTypeDetailsData) {
    return <ErrorMessage error={errorUnitTypeDetailsData} />;
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
        workOrderId: state.activeWorkOrder,
        unitIds,
      });
      toast.success("Units were succesfully attached on work order");
    } catch (error) {
      toast.error("Error while attaching units to work order");
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
            <Typography variant="h3">Remove Datasheets </Typography>
          </Grid>
        </Grid>
        {!datasheets.length && (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            <strong>No Work Orders Available</strong>
          </Alert>
        )}
        {datasheets.length > 0 && (
          <>
            <Grid item xs={12}>
              <Paper style={{ marginTop: 32 }}>
                <TableContainer data-testid="tableContainer">
                  <MuiTable {...getTableProps()}>
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
    </div>
  );
};
