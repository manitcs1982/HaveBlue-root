import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { useTable, useSortBy, Cell, useRowSelect, Row } from "react-table";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  useTheme,
} from "@material-ui/core/";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import { useFetchContext } from "../../../../common/FetchContext";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import {
  useAssignTestSequenceToUnit,
  useDetachUnitToWorkOrder,
  useResoakUnit,
} from "../../../projectManagementMutations";
import { useAssignUnitsByWorkOrder } from "../../../projectManagementQueries";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";
import { useAuthContext } from "../../../../common/AuthContext";
import { useErrorHandlingContext } from "../../../../common/ErrorHandlingContext";
import { TravelerModal } from "../../../../common/travelerModal";
import isEmpty from "lodash/isEmpty";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { TestSequenceDefinitionModal } from "./TestSequenceDefinitionModal";

export const WorkOrderUnitsCardDetailsTable = ({
  workOrderId,
  workOrderName,
}: any) => {
  const theme = useTheme();
  const history = useHistory();
  const { dispatch } = useAuthContext();
  const queryClient = useQueryClient();
  const { state: stateError, dispatch: dispatchError } =
    useErrorHandlingContext();
  const [selectedUnit, setSelectedUnit] = React.useState<any>(null);
  const { authAxios } = useFetchContext();
  const { mutateAsync: mutate } = useDetachUnitToWorkOrder();
  const { mutateAsync: mutateResoak } = useResoakUnit();
  const {
    mutateAsync: mutateAssignTestSequenceToUnit,
    isLoading: isLoadingMutateAssignTestSequenceToUnit,
  } = useAssignTestSequenceToUnit();
  const [assignedTestSequences, setAssignedTestSequences] = React.useState<any>(
    {}
  );
  const [tableData, setTableData] = React.useState<any>([]);
  const [availableSequences, setAvailableSequences] = React.useState<any>([]);
  const [testSequenceDefinitionModalOpen, setTestSequenceDefinitionModalOpen] =
    React.useState<any>(false);

  const {
    data: workOrderUnitsData,
    isError: isErrorWorkOrderUnits,
    isSuccess: isSuccessWorkOrderUnits,
    error: errorWorkOrderUnits,
    isLoading: isLoadingWorkOrderUnits,
    isFetching: isFetchingWorkOrderUnits,
  } = useAssignUnitsByWorkOrder(workOrderId);

  React.useEffect(() => {
    if (isSuccessWorkOrderUnits) {
      setTableData(workOrderUnitsData.units);
      setAvailableSequences(workOrderUnitsData.available_sequences);
    }
  }, [isSuccessWorkOrderUnits, workOrderUnitsData]);

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
      {
        Header: "Detach Unit",
        Cell: ({ row }: any) => {
          return (
            <Button
              variant="contained"
              style={theme.btnError}
              onClick={async () => {
                try {
                  await mutate({
                    authAxios,
                    workOrderId: workOrderId,
                    unitIds: [row.values.id],
                  });
                  toast.success(
                    `Unit with number ${row.values.serial_number} was succesfully detached`
                  );
                  queryClient.invalidateQueries([
                    "assignUnitsByWorkOrder",
                    workOrderId,
                  ]);
                } catch (error) {
                  toast.error("Error while detaching units.");
                  processErrorOnMutation(error, dispatch, history);
                }
              }}
            >
              Detach
            </Button>
          );
        },
      },
      {
        Header: "Resoak",
        Cell: ({ row }: any) => {
          return (
            <Button
              variant="contained"
              style={theme.btnWarning}
              onClick={async () => {
                try {
                  await mutateResoak({
                    authAxios,
                    unit: row.values.id,
                  });
                  toast.success(
                    `Unit with number ${selectedUnit.serial_number} was succesfully set to resoak.`
                  );
                  queryClient.invalidateQueries([
                    "assignUnitsByWorkOrder",
                    workOrderId,
                  ]);
                } catch (error) {
                  toast.error("Error while adding resoak.");
                  processErrorOnMutation(error, dispatch, history);
                }
              }}
            >
              Add 10K Light Soak
            </Button>
          );
        },
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
      data: tableData,
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

  if (isLoadingWorkOrderUnits || isFetchingWorkOrderUnits) {
    return (
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
    );
  }

  if (isErrorWorkOrderUnits) {
    return <ErrorMessage error={errorWorkOrderUnits} />;
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
              {availableSequences.map((availableSequence: any) => (
                <MenuItem value={availableSequence.id}>
                  {availableSequence.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      } else {
        return (
          <Typography variant="body1">
            {cell.row.values.assigned_test_sequence_name}
          </Typography>
        );
      }
    } else if (cell.column.Header === "Serial Number") {
      return <TravelerModal serialNumber={cell.value} />;
    } else {
      return cell.render("Cell");
    }
  };

  const attachUnit = () => {
    history.push(`${history.location.pathname}/${workOrderId}/attach`);
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
        authAxios,
        workOrderId: workOrderId,
        assignmentData: unitsWithAssignedTestSequences,
      });
      queryClient.invalidateQueries(["assignUnitsByWorkOrder", workOrderId]);
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
      queryClient.invalidateQueries(["assignUnitsByWorkOrder", workOrderId]);
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

  const openTestSequenceDefinitionModal = () => {
    setTestSequenceDefinitionModalOpen(true);
  };

  const closeTestSequenceDefinitionModal = () => {
    setTestSequenceDefinitionModalOpen(false);
  };

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
          <Typography variant="h4">{`${workOrderName} Units`}</Typography>
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
          <Button onClick={attachUnit} style={theme.btnNew}>
            Attach New Unit
          </Button>
          {selectedUnit && (
            <Button
              onClick={openTestSequenceDefinitionModal}
              style={theme.btnNew}
            >
              Append test sequence definition
            </Button>
          )}
        </Grid>
      </Grid>

      {!tableData.length && (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No Work Order Units Available</strong>
        </Alert>
      )}
      {tableData.length > 0 && (
        <TableContainer
          data-testid="tableContainer"
          component={Paper}
          style={{ maxHeight: 440 }}
        >
          <MuiTable {...getTableProps()} stickyHeader>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
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
      <TestSequenceDefinitionModal
        unit={selectedUnit}
        isOpen={testSequenceDefinitionModalOpen}
        handleClose={closeTestSequenceDefinitionModal}
      />
    </div>
  );
};
