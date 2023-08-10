import React from "react";
import { toast } from "react-toastify";
import { useTable } from "react-table";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { ConfirmationDialog } from "../common/ConfirmationDialog";

import { ErrorMessage } from "../common/ErrorMessage";
import { useView } from "./dataEgressQueries";
import { useFetchContext } from "../common/FetchContext";
import { useAuthContext } from "../common/AuthContext";
import { ThreadedCreator } from "../common/threadedViewer/threadedCreator";
import { useRetestProcedure, useReviewProcedure } from "./dataEgressMutations";
import { processErrorOnMutation } from "../../util/errorMessaging";
import { getDataFromMeasurementResults } from "../../util/searchData";
import { WET_LEAKAGE_TEST_UNITS as wetLeakageTestUnits } from "../../util/constants";
import { AssetNameViewer } from "../common/AssetNameViewer";
import { useTestPermissionsVerification } from "../projectManagement/projectQueries";
import { TravelerModalButton } from "./TravelerModalButton";
import { VisualizerNotesModal } from "./VisualizerNotesModal";

export const LeakedDataModal = ({
  id,
  disposition,
  name,
  dispositionPassedId,
  open_notes,
  has_notes,
}: any) => {
  const { dispatch } = useAuthContext();
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const history = useHistory();
  const { mutateAsync: mutateRetestProcedure } = useRetestProcedure();
  const { mutateAsync: mutateReviewProcedure } = useReviewProcedure();

  const [open, setOpen] = React.useState(false);
  const [confirmationDialogRetestOpen, setConfirmationDialogRetestOpen] =
    React.useState(false);
  const [confirmationDialogApproveOpen, setConfirmationDialogApproveOpen] =
    React.useState(false);

  const {
    data: viewData,
    error: errorView,
    isLoading: isLoadingView,
    isError: isErrorView,
    isSuccess: isSuccessView,
  } = useView(id, open);

  const { data: permission, isLoading: isLoadingPermission } =
    useTestPermissionsVerification(id, open);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Result",
        accessor: "result",
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: isSuccessView
      ? getDataFromMeasurementResults(viewData, wetLeakageTestUnits)
      : [],
    initialState: {
      hiddenColumns: ["id"],
    },
  });

  if (isLoadingView || isLoadingPermission) {
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

  if (isErrorView) {
    return <ErrorMessage error={errorView} />;
  }

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRetestAction = async () => {
    try {
      await mutateRetestProcedure({
        authAxios,
        procedure_result: viewData.id,
      });
      toast.success("Wet Leakage Review was sent for retesting");
      setConfirmationDialogRetestOpen(false);
      setOpen(false);
      queryClient.invalidateQueries("verify_data");
      queryClient.invalidateQueries("travelerResults");
    } catch (error) {
      toast.error("Error while retesting wet leakage");
      setConfirmationDialogRetestOpen(false);
      setOpen(false);
      processErrorOnMutation(error, dispatch, history);
    }
  };

  const handlePassAction = async () => {
    try {
      await mutateReviewProcedure({
        authAxios,
        disposition: dispositionPassedId,
        procedure_result: viewData.id,
      });
      toast.success("Wet Leakage Review Approved");
      setConfirmationDialogApproveOpen(false);
      setOpen(false);
      queryClient.invalidateQueries("verify_data");
      queryClient.invalidateQueries("travelerResults");
    } catch (error) {
      toast.error("Error while approving wet leakage");
      setConfirmationDialogApproveOpen(false);
      setOpen(false);
      processErrorOnMutation(error, dispatch, history);
    }
  };

  return (
    <div>
      <TravelerModalButton
        disposition={disposition}
        name={name}
        handleClose={handleClose}
        open_notes={open_notes}
        has_notes={has_notes}
        type="wet_leakage"
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle id="scroll-dialog-title">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={8}>
              <Typography variant="h6">
                {`Wet Leakage Review - ${name}`};
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" display="inline">
                Flag Result:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <ThreadedCreator
                id={id}
                noteType={3}
                model={"procedure"}
                invalidate={[""]}
                typeable={false}
              />
            </Grid>
            <Grid item xs={1}>
              <VisualizerNotesModal
                procedureId={id}
                name={`Wet Leakage Review - ${name}`}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers={true}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <MaUTable {...getTableProps()}>
                <TableHead>
                  {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <TableCell {...column.getHeaderProps()}>
                          <Typography variant="h6">
                            {column.render("Header")}
                          </Typography>
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
                  {permission && (
                    <Box
                      style={{
                        width: "100%",
                        marginTop: "12px",
                        textAlign: "center",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                      component="tr"
                    >
                      <Box component="td" display="inline" p={1} m={1}>
                        <Button
                          style={{ textAlign: "center" }}
                          variant="contained"
                          color="secondary"
                          onClick={() => setConfirmationDialogRetestOpen(true)}
                        >
                          Retest
                        </Button>
                      </Box>

                      {disposition === "Requires Review" && (
                        <Box component="td" display="inline" p={1} m={1}>
                          <Button
                            style={{ textAlign: "center" }}
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              setConfirmationDialogApproveOpen(true)
                            }
                          >
                            Pass
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                </TableBody>
              </MaUTable>
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <AssetNameViewer procedureResults={viewData} />
            </Grid>
            <Grid item xs={4} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
        <ConfirmationDialog
          id="wet-leakage-retest"
          keepMounted
          open={confirmationDialogRetestOpen}
          title="Wet Leakage Retest Confirmation"
          content="Are you sure that you want to retest this Diode Test?"
          onCancel={() => setConfirmationDialogRetestOpen(false)}
          onSubmit={() => handleRetestAction()}
        />
        <ConfirmationDialog
          id="wet-leakage-approve"
          keepMounted
          open={confirmationDialogApproveOpen}
          title="Wet Leakage Approval Confirmation"
          content="Are you sure that you want to approve this Diode Test?"
          onCancel={() => setConfirmationDialogApproveOpen(false)}
          onSubmit={() => handlePassAction()}
        />
      </Dialog>
    </div>
  );
};
