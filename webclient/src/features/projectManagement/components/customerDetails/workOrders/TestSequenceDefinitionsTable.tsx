import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/core/";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import { Alert, AlertTitle } from "@material-ui/lab";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  useTable,
  useSortBy,
  HeaderProps,
  useFilters,
  useRowSelect,
  useGlobalFilter,
  Row,
  Cell,
  useRowState,
} from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { generalFilter, useDefaultColumn } from "../../../../../util/filter";
import { useAddTestSequencesToWorkOrder } from "../../../projectManagementMutations";
import { toast } from "react-toastify";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ReceiptIcon from "@material-ui/icons/Receipt";
import findIndex from "lodash/findIndex";
import { useAuthContext } from "../../../../common/AuthContext";
import { useHistory } from "react-router-dom";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";
import { LSDBModal, useLSDBModalState } from "../../../../common/LSDBModal";
import { WorkOrderTestSequenceTraveler } from "./WorkOrderTestSequenceTraveler";
import { renderHeader } from "../../../../common/util";

export const TestSequenceDefinitionsTable = ({
  testSequences,
  workOrderDetails,
}: any) => {
  const theme = useTheme();
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const { mutateAsync: mutate, isLoading: isLoadingMutation } =
    useAddTestSequencesToWorkOrder();
  const defaultColumn = useDefaultColumn();
  const [open, setOpen] = React.useState(false);
  const { openModal, setOpenModal, handleModalAction } = useLSDBModalState();
  const [currentTestSequenceId, setCurrentTestSequenceId] =
    React.useState<any>(null);

  const data = React.useMemo(
    () =>
      testSequences.filter((test: any) => {
        return findIndex(
          workOrderDetails.test_sequence_definitions,
          function (workTest: any) {
            return workTest.test_sequence.id === test.id;
          }
        ) === -1
          ? true
          : false;
      }),
    [testSequences, workOrderDetails]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        id: "available",
        Header: "Units Required",
      },

      {
        id: "Test Name",
        accessor: "name",
        filter: generalFilter,
      },
      {
        id: "Version",
        accessor: "version",
        filter: generalFilter,
      },
      {
        id: "Disposition",
        accessor: "disposition_name",
        filter: generalFilter,
      },
      {
        Header: "Traveler",
        Cell: ({ cell, row }: any) => {
          return (
            <Button
              style={{ textAlign: "center" }}
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentTestSequenceId(row.values["id"]);
                setOpenModal(true);
              }}
              fullWidth={true}
              startIcon={<ReceiptIcon />}
            ></Button>
          );
        },

        filter: generalFilter,
      },
    ],
    [setOpenModal]
  );

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
      {
        data,
        columns,
        defaultColumn,
        initialState: {
          hiddenColumns: ["id", "test_sequence_definitions"],
        },
      },

      useFilters,
      useGlobalFilter,
      useSortBy,
      useRowSelect,
      useRowState,
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

  const submitTests = async () => {
    try {
      handleClose();
      const selectedTests = selectedFlatRows.map((d: any) => {
        const test = {
          test_sequence: d.values.id,
          units_required: d.state.cellState.available,
        };
        const element: HTMLInputElement = document.getElementById(
          `available-${d.id}`
        ) as HTMLInputElement;
        if (element !== null) element.value = "";
        return test;
      });
      const addedTests = await mutate({
        workOrderId: workOrderDetails.id,
        selectedTests,
      });

      console.log("Added Tests data", addedTests);
      toast.success("Tests were successfully added to work order");
    } catch (error) {
      toast.error("Error while adding tests to work order.");
      processErrorOnMutation(error, dispatch, history);
    }
  };

  if (!data.length) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        <strong>No Test Sequences Available</strong>
      </Alert>
    );
  }

  const renderCell = (cell: Cell<object, any>, index: number) => {
    if (cell.column.id === "available") {
      return (
        <TextField
          variant="filled"
          key={`TextField-${index}`}
          id={`available-${cell.row.id}`}
          onChange={(e) => cell.setState(e.currentTarget.value)}
        ></TextField>
      );
    }
    return cell.render("Cell");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoadingMutation) {
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <div style={theme.container}>
      {currentTestSequenceId && (
        <LSDBModal
          title="Traveler"
          open={openModal}
          handleAction={() => handleModalAction()}
        >
          <WorkOrderTestSequenceTraveler id={currentTestSequenceId} />
        </LSDBModal>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Adding Tests Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to add the selected tests to work order #
            {workOrderDetails.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitTests} color="primary">
            Ok
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography variant="h5">Available Test Sequences</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ marginTop: 32 }}>
            <TableContainer
              data-testid="tableContainer"
              style={{ maxHeight: 500 }}
            >
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
                        {row.cells.map((cell, index) => {
                          return (
                            <TableCell {...cell.getCellProps()}>
                              {renderCell(cell, index)}
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
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Submit
          </Button>
        </Grid>
      </Container>
    </div>
  );
};
