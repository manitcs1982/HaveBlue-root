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
import LinearProgress from "@material-ui/core/LinearProgress";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  useTable,
  useSortBy,
  HeaderProps,
  useFilters,
  useRowSelect,
  useGlobalFilter,
  Row,
  useRowState,
} from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { generalFilter, useDefaultColumn } from "../../../../../util/filter";
import { useDeleteTestSequencesToWorkOrder } from "../../../projectManagementMutations";
import { toast } from "react-toastify";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../../../common/AuthContext";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";
import { WorkOrderTestSequenceTraveler } from "./WorkOrderTestSequenceTraveler";
import { LSDBModal, useLSDBModalState } from "../../../../common/LSDBModal";
import { renderHeader } from "../../../../common/util";

export const WorkOrderSequenceDefinitionsTable = ({
  data = [],
  workOrderId,
}: any) => {
  const theme = useTheme();

  const history = useHistory();
  const { dispatch } = useAuthContext();
  const { mutateAsync: mutate, isLoading: isLoadingMutation } =
    useDeleteTestSequencesToWorkOrder();

  const defaultColumn = useDefaultColumn();
  const { openModal, setOpenModal, handleModalAction } = useLSDBModalState();
  const [open, setOpen] = React.useState(false);
  const [currentTestSequenceId, setCurrentTestSequenceId] =
    React.useState<any>(null);

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "test_sequence.id",
      },
      {
        id: "Units Required",
        accessor: "units_required",
        filter: generalFilter,
      },

      {
        id: "Test Name",
        accessor: "test_sequence.name",
        filter: generalFilter,
      },
      {
        id: "Version",
        accessor: "test_sequence.version",
        filter: generalFilter,
      },
      {
        id: "Disposition",
        accessor: "test_sequence.disposition_name",
        filter: generalFilter,
      },
      {
        Header: "Traveler",
        Cell: ({ row }: any) => {
          return (
            <Button
              style={{ textAlign: "center" }}
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentTestSequenceId(row.values["test_sequence.id"]);
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
          hiddenColumns: ["test_sequence.id"],
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

  const deleteTests = async () => {
    try {
      handleClose();
      const testSequences = selectedFlatRows.map((d: any) => {
        return {
          test_sequence: d.values["test_sequence.id"],
        };
      });

      await mutate({
        workOrderId,
        testSequences,
      });

      toast.success("Tests were successfully deleted to work order");
    } catch (error) {
      toast.error("Error while deleting tests to work order");
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
          Deleting Tests Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete the selected tests to work order #
            {workOrderId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteTests} color="primary">
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
            <Typography variant="h5">Work Order Test Sequences</Typography>
          </Grid>
        </Grid>
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
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Delete
          </Button>
        </Grid>
        <div id="sequenceDialog"></div>
      </Container>
    </div>
  );
};
