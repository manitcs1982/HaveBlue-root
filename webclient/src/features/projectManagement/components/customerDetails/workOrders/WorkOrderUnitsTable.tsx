import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { useTable, useSortBy, Cell, useRowSelect, Row } from "react-table";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  useTheme,
} from "@material-ui/core/";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import { useCustomerDetailsContext } from "../../../../common/CustomerDetailsContext";
import { toast } from "react-toastify";
import {
  useAssignTestSequenceToUnit,
  useDetachUnitToWorkOrder,
  useResoakUnit,
} from "../../../projectManagementMutations";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";
import { useAuthContext } from "../../../../common/AuthContext";
import { useErrorHandlingContext } from "../../../../common/ErrorHandlingContext";
import { TravelerModal } from "../../../../common/travelerModal";
import isEmpty from "lodash/isEmpty";
import { useAssignUnitsByWorkOrder } from "../../../projectManagementQueries";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const WorkOrderUnitsTable = ({ workOrderId }: any) => {
  const theme = useTheme();
  const history = useHistory();
  const { dispatch } = useAuthContext();
  const { state: stateError, dispatch: dispatchError } =
    useErrorHandlingContext();
  const [selectedUnit, setSelectedUnit] = React.useState<any>(null);
  const { state } = useCustomerDetailsContext();

  const { mutateAsync: mutate } = useDetachUnitToWorkOrder();
  const { mutateAsync: mutateResoak } = useResoakUnit();
  const {
    mutateAsync: mutateAssignTestSequenceToUnit,
    isLoading: isLoadingMutateAssignTestSequenceToUnit,
  } = useAssignTestSequenceToUnit();
  const [assignedTestSequences, setAssignedTestSequences] = React.useState<any>(
    {}
  );

  const [workOrderUnitsTableData, setWorkOrderUnitsTableData] =
    React.useState<any>([]);
  const [
    workOrderUnitsAvailableTestSequences,
    setWorkOrderUnitsAvailableSequences,
  ] = React.useState<any>([]);
  const {
    data: workOrderUnitsData,
    isError: isErrorWorkOrderUnits,
    isSuccess: isSuccessWorkOrderUnits,
    error: errorWorkOrderUnits,
    isLoading: isLoadingWorkOrderUnits,
  } = useAssignUnitsByWorkOrder(state.activeWorkOrder);

  React.useEffect(() => {
    if (
      isSuccessWorkOrderUnits &&
      workOrderUnitsData.units &&
      workOrderUnitsData?.available_sequences
    ) {
      setWorkOrderUnitsTableData(workOrderUnitsData.units);
      setWorkOrderUnitsAvailableSequences(
        workOrderUnitsData.available_sequences
      );
    }
  }, [
    isSuccessWorkOrderUnits,
    workOrderUnitsData?.available_sequences,
    workOrderUnitsData?.units,
  ]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Assigned Test Sequence",
        accessor: "assigned_test_sequence_name",
      },
      {
        Header: "Serial Number",
        accessor: "serial_number",
      },

      {
        Header: "Type",
        accessor: "unit_type",
      },
      {
        id: "assignTestSequences",
        Header: "Assign Test Sequences",
      },
    ],
    []
  );

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    toggleAllRowsSelected,
  } = useTable(
    {
      data: workOrderUnitsTableData,
      columns,
      initialState: {
        hiddenColumns: ["id", "assigned_test_sequence_name"],
      },
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",

          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }: { row: Row<any> }) => (
            <div>
              <Checkbox
                {...row.getToggleRowSelectedProps()}
                onClick={(e) => checkSelectedRow(e, row)}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  if (isErrorWorkOrderUnits) {
    return <ErrorMessage error={errorWorkOrderUnits} />;
  }

  if (isLoadingWorkOrderUnits) {
    return (
      <div style={theme.containerMargin}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      </div>
    );
  }

  function checkSelectedRow(event: any, row: any) {
    if (row.isSelected) {
      setSelectedUnit(null);
    } else {
      setSelectedUnit(row.values);
    }
    toggleAllRowsSelected(false);
    row.toggleRowSelected();
  }

  const captureTestSequence = (e: any, cell: Cell<object, any>) => {
    if (e.target.value === 0) {
      const { [cell.row.values.id]: propValue, ...rest } =
        assignedTestSequences;
      setAssignedTestSequences(rest);
    } else {
      const updatedAssignedUnits = {
        [cell.row.values.id]: e.target.value,
        ...assignedTestSequences,
      };
      setAssignedTestSequences(updatedAssignedUnits);
    }
  };

  const renderCell = (cell: Cell<object, any>) => {
    if (cell.column.id === "assignTestSequences") {
      if (cell.row.values.assigned_test_sequence_name === null) {
        return (
          <FormControl
            style={{
              margin: theme.spacing(1),
              minWidth: 300,
            }}
          >
            <InputLabel id="demo-simple-select-helper-label">
              Select a test sequence
            </InputLabel>
            <Select
              variant="filled"
              defaultValue={0}
              key={`available-${cell.row.id}`}
              id={`available-${cell.row.id}`}
              onChange={(e) => captureTestSequence(e, cell)}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              {workOrderUnitsAvailableTestSequences.map(
                (availableSequence: any) => (
                  <MenuItem value={availableSequence.id}>
                    {availableSequence.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        );
      } else {
        return <>{cell.row.values.assigned_test_sequence_name}</>;
      }
    } else if (cell.column.Header === "Serial Number") {
      return <TravelerModal serialNumber={cell.value} />;
    } else {
      return cell.render("Cell");
    }
  };

  const attachUnit = () => {
    history.push(
      `/project_management/customer/${state.activeCustomerId}/projects/${state.activeProjectId}/attach`
    );
  };

  const detachUnit = async () => {
    try {
      await mutate({
        workOrderId: state.activeWorkOrder,
        unitIds: [selectedUnit.id],
      });
      toast.success(
        `Unit with number ${selectedUnit.serial_number} was succesfully detached`
      );
    } catch (error) {
      toast.error("Error while detaching units.");
      processErrorOnMutation(error, dispatch, history);
    }
  };

  const resoak = async () => {
    try {
      await mutateResoak({
        unit: selectedUnit.id,
        workOrderId: state.activeWorkOrder,
      });
      toast.success(
        `Unit with number ${selectedUnit.serial_number} was succesfully set to resoak.`
      );
    } catch (error) {
      toast.error("Error while adding resoak.");
      processErrorOnMutation(error, dispatch, history);
    }
  };

  const assignTestSequences = async () => {
    const unitsWithAssignedTestSequences = Object.keys(
      assignedTestSequences
    ).map((key) => {
      return { unit: key, test_sequence: assignedTestSequences[key] };
    });
    console.log("Everything", unitsWithAssignedTestSequences);
    try {
      const assignedSequencesData = await mutateAssignTestSequenceToUnit({
        workOrderId: state.activeWorkOrder,
        assignmentData: unitsWithAssignedTestSequences,
      });
      if (
        !assignedSequencesData.available_sequences &&
        assignedSequencesData instanceof Array
      ) {
        dispatchError({
          type: "MULTIPLE_ERRORS_THROWN",
          payload: {
            errors: assignedSequencesData,
            errorTitle: "Errors on test sequence assignment process.",
          },
        });
        setAssignedTestSequences({});
        return;
      }
      toast.success(`Test sequences were correctly assigned to units.`);
      setAssignedTestSequences({});
    } catch (error) {
      toast.error("Error while assigning test sequences to units");
      processErrorOnMutation(error, dispatch, history);
    }
  };

  if (isLoadingMutateAssignTestSequenceToUnit) {
    return (
      <div style={theme.container}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <CircularProgress color="inherit" />
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <div style={theme.container}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={12}>
          <Typography variant="h5">Work Order Units</Typography>
        </Grid>
        <Grid item xs={12}>
          {!isEmpty(assignedTestSequences) && (
            <Button
              style={theme.btnAssign}
              onClick={(e) => assignTestSequences()}
            >
              Assign Test Sequences
            </Button>
          )}
          {selectedUnit && (
            <>
              <Button onClick={detachUnit} style={theme.btnWarning}>
                Detach Selected Unit
              </Button>

              <Button onClick={attachUnit} style={theme.btnError}>
                Complete Testing for Unit
              </Button>

              <Button onClick={resoak} style={theme.btnWarning}>
                Add 10K Light Soak to Unit
              </Button>

              <Button onClick={detachUnit} style={theme.btnWarning}>
                Move Work Order
              </Button>
            </>
          )}
          <Button onClick={attachUnit} style={theme.btnNew}>
            Attach New Unit
          </Button>
        </Grid>
      </Grid>

      {!workOrderUnitsTableData.length && (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No Work Order Units Available</strong>
        </Alert>
      )}
      {workOrderUnitsTableData.length > 0 && (
        <TableContainer
          data-testid="tableContainer"
          component={Paper}
          style={{ maxHeight: 440 }}
        >
          <MuiTable {...getTableProps()} stickyHeader size="small">
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
                          column.id !== "selection" && <CallSplitIcon />
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
                  <TableRow
                    {...row.getRowProps()}
                    selected={row.values.id === selectedUnit?.id}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {renderCell(cell)}
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
    </div>
  );
};
