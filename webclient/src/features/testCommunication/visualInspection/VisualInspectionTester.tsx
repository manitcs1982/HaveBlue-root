import React from "react";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
  useTheme,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import moment from "moment";
import { toast } from "react-toastify";

import CameraAltIconOutlined from "@material-ui/icons/CameraAltOutlined";
import ChatIconOutlined from "@material-ui/icons/ChatOutlined";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import ChatIcon from "@material-ui/icons/Chat";
import find from "lodash/find";

import { useFetchContext } from "../../common/FetchContext";
import { useVisualInspectionDetailsContext } from "../../common/VisualInspectionContext";
import { useAvailableDefects } from "../common/testQueries";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { VisualInspectionDialog } from "./VisualInspectionDialog";
import { usePostFile } from "../../common/services/fileServices";
import {
  Cell,
  Column,
  HeaderProps,
  Row,
  useFilters,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { generalFilter, useDefaultColumn } from "../../../util/filter";
import {
  useAddStepToProcedure,
  useLinkFileToMeasurement,
  useSubmitMeasurementResult,
  useSubmitProcedureResult,
  useSubmitStepResult,
} from "../common/testMutations";
import { useAuthContext } from "../../common/AuthContext";
import { useHistory } from "react-router-dom";
import { ErrorMessage } from "../../common/ErrorMessage";
import { ConfirmationDialog } from "../../common/ConfirmationDialog";
import { useQueryClient } from "react-query";
import measurementSubmission from "../common/measurementSubmission";
import TesterTypes from "../common/TesterTypes";
import CharacterizationQueueDialog from "../common/CharacterizationQueueDialog";
import { renderHeader } from "../../common/util";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const VisualInspectionTester = ({
  procedureResultData,
  assetData,
  setClearedValues,
  dispositionRequiresReview,
  historicUser,
  historicDate,
  historicData,
  historicDisposition,
  closeHistoricModal,
  startDateTime,
}: any) => {
  const defaultColumn = useDefaultColumn();
  const history = useHistory();
  const { authAxios } = useFetchContext();
  const { state, dispatch } = useVisualInspectionDetailsContext();
  const { dispatch: authDispatch } = useAuthContext();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const [noDefectsObserved, setNoDefectsObserved] = React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState(false);
  const [currentDefectId, setCurrentDefectId] = React.useState("");
  const { mutateAsync: mutateAddStepToProcedure } = useAddStepToProcedure();
  const { mutateAsync: mutateSubmitMeasurementResult } =
    useSubmitMeasurementResult();
  const { mutateAsync: mutateSubmitStepResult } = useSubmitStepResult();
  const { mutateAsync: mutateSubmitProcedureResult } =
    useSubmitProcedureResult();

  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFileToMeasurement } =
    useLinkFileToMeasurement();
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    React.useState(false);

  const [tableDefects, setTableDefects] = React.useState([]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Url",
        accessor: "url",
      },
      {
        id: "Category Name",
        accessor: "category",
        filter: generalFilter,
      },
      {
        id: "Name",
        accessor: "short_name",
        filter: generalFilter,
      },

      {
        id: "Description",
        accessor: "description",
        filter: generalFilter,
      },
      {
        id: "actions",
      },
    ],
    []
  );

  const {
    error: errorDefects,
    data: defects = [],
    isLoading: isLoadingDefects,
    isError: isErrorDefects,
    isSuccess: isSuccessDefects,
  } = useAvailableDefects();

  React.useEffect(() => {
    if (isSuccessDefects) {
      setTableDefects(defects);
    }
  }, [isSuccessDefects, defects]);

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data: tableDefects,
      columns,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id", "url"],
      },
    },
    useFilters,
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

  function displayObservationModal(row: any) {
    setOpen(true);
    console.log("The row", row);
  }

  function checkSelectedRow(event: any, row: any) {
    if (!event.target.checked) {
      dispatch({
        type: "DEFECT_REMOVED",
        payload: { defectId: row.values.id },
      });
    }
  }

  const renderCell = (cell: Cell<object, any>) => {
    if (cell.column.id === "actions") {
      if (cell.row.isSelected) {
        return (
          <Button
            variant="contained"
            startIcon={
              state.defects.has(cell.row.values.id) ? (
                <ChatIcon />
              ) : (
                <ChatIconOutlined />
              )
            }
            endIcon={
              state.defects.has(cell.row.values.id) ? (
                <CameraAltIcon />
              ) : (
                <CameraAltIconOutlined />
              )
            }
            onClick={() => {
              setCurrentDefectId(cell.row.values.id);
              displayObservationModal(cell.row);
            }}
          />
        );
      }
      return null;
    }
    return cell.render("Cell");
  };

  const handleChangeNoDefectsObserved = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNoDefectsObserved(event.target.checked);
  };

  const submitResults = async () => {
    await measurementSubmission({
      testerType: TesterTypes.VisualInspection,
      setConfirmationDialogOpen,
      setSubmissionStatus,
      historicData,
      historicDate,
      historicUser,
      historicDisposition,
      startDateTime: historicDate,
      assetData,
      procedureResultData,
      dispositionRequiresReview,
      closeHistoricModal,
      history,
      dispatch: authDispatch,
      authAxios,
      mutateSubmitMeasurementResult,
      mutateSubmitStepResult,
      mutateSubmitProcedureResult,
      mutatePostFile,
      mutateLinkFileToMeasurement,
      mutateAddStepToProcedure,
      noDefectsObserved,
      visualInspectionDetailsState: state,
    });
    setClearedValues(true);
  };

  if (submissionStatus && !historicData) {
    return (
      <Backdrop open={submissionStatus}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (submissionStatus && historicData) {
    return (
      <div style={theme.containerMargin}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (isLoadingDefects) {
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

  if (isErrorDefects) {
    return <ErrorMessage error={errorDefects} />;
  }

  return (
    <>
      <VisualInspectionDialog
        defectId={currentDefectId}
        setDefectId={setCurrentDefectId}
        isOpen={open}
        setOpen={setOpen}
      />
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={6} md={4}>
          <CharacterizationQueueDialog
            historicData={historicData}
            procedureResultData={procedureResultData}
            assetData={assetData}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={noDefectsObserved}
                onChange={handleChangeNoDefectsObserved}
                name="noDefectsObserved"
                color="primary"
              />
            }
            label="No Defects Observed"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            disabled={!(state.defects.size > 0 || noDefectsObserved)}
            style={theme.btnSubmit}
            onClick={() => setConfirmationDialogOpen(true)}
          >
            Submit measurement
          </Button>
        </Grid>
        {!defects.length && (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            <strong>No defects available</strong>
          </Alert>
        )}
        {defects.length > 0 && !noDefectsObserved && (
          <Grid item xs={12} md={12}>
            <TableContainer
              data-testid="tableContainer"
              style={{ maxHeight: 500, marginTop: 10 }}
              component={Paper}
            >
              <MuiTable {...getTableProps()} size="small">
                <TableHead>
                  {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, index) => (
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
                                  {renderHeader(column)}
                                </Typography>
                                {column.canFilter
                                  ? column.render("Filter")
                                  : null}
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
                                      column.id !== "selection" &&
                                      column.id !== "actions" && (
                                        <CallSplitIcon />
                                      )
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
                        selected={state.defects.has(row.values.id)}
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
          </Grid>
        )}
      </Grid>
      <ConfirmationDialog
        id="visual-inspection-confirmation"
        keepMounted
        open={confirmationDialogOpen}
        title="Visual Inspection Confirmation"
        content="Are you sure that you want to submit this Visual Inspection?"
        onCancel={() => setConfirmationDialogOpen(false)}
        onSubmit={submitResults}
      />
    </>
  );
};
