import React from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Grid,
  LinearProgress,
  useTheme,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Paper,
  IconButton,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import ColorLensIcon from "@material-ui/icons/ColorLens";
import CloseIcon from "@material-ui/icons/Close";

import { useView, useDownloadProcedure } from "./dataEgressQueries";
import { mutateCharts, useAddNoteToResult } from "./dataEgressMutations";
import { useFetchContext } from "../common/FetchContext";
import { useAuthContext } from "../common/AuthContext";
import { ErrorMessage } from "../common/ErrorMessage";
import { ThreadedCreator } from "../common/threadedViewer/threadedCreator";
import { useRetestProcedure, useReviewProcedure } from "./dataEgressMutations";
import { useDispositionsByName } from "../common/services/dispositionServices";
import { useQueryClient } from "react-query";
import { processErrorOnMutation } from "../../util/errorMessaging";
import { calcAvg, calcSTD } from "../../util/equations";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "../common/ConfirmationDialog";

import { PositionChartOne } from "../testCommunication/colorimeter/PositionChartOne";
import { PositionChartTwo } from "../testCommunication/colorimeter/PositionChartTwo";
import { PositionChartThree } from "../testCommunication/colorimeter/PositionChartThree";
import {
  useTestPermissions,
  useTestPermissionsVerification,
} from "../projectManagement/projectQueries";
import { TravelerModalButton } from "./TravelerModalButton";
import { VisualizerNotesModal } from "./VisualizerNotesModal";

export const ColorimeterReviewModal = ({
  id,
  disposition,
  name,
  dispositionPassedId,
  open_notes,
  has_notes,
}: any) => {
  const theme = useTheme();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { dispatch } = useAuthContext();
  const { authAxios } = useFetchContext();
  const [open, setOpen] = React.useState(false);
  const [reviewData, setReviewData] = React.useState({ chart: 0, values: [] });
  const { mutateAsync: mutateRetestProcedure } = useRetestProcedure();
  const { mutateAsync: mutateReviewProcedure } = useReviewProcedure();
  const { mutateAsync: mutateNote } = useAddNoteToResult();

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

  const { data: dispositionPassed } = useDispositionsByName("Pass");
  const { data, isError, isLoading, isFetching, error, refetch } =
    useDownloadProcedure(id);
  React.useEffect(() => {
    if (viewData) {
      setReviewData(
        JSON.parse(
          viewData.step_results[0].measurement_results[0].result_string
        )
      );
    }
  }, [viewData, isSuccessView]);

  if (isLoadingView || isLoadingPermission) {
    return (
      <div style={theme.containerMargin}>
        <Grid container direction="row" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (isErrorView) {
    return <>{isErrorView && <ErrorMessage error={errorView} />}</>;
  }

  const handleClose = () => {
    setOpen(!open);
  };

  const downloadProcedure = async () => {
    if (id) {
      await refetch();
    }
  };

  const submitVerification = async (result: boolean) => {
    if (result) {
      try {
        await mutateReviewProcedure({
          authAxios,
          disposition: dispositionPassedId,
          procedure_result: viewData.id,
        });
        toast.success("Colorimeter Test Review Approved");
        setConfirmationDialogApproveOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while approving Colorimeter Test");
        processErrorOnMutation(error, dispatch, history);
        setConfirmationDialogApproveOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      }
    } else {
      try {
        await mutateRetestProcedure({
          authAxios,
          procedure_result: viewData.id,
        });
        toast.success("Colorimeter Test Review was sent for retesting");
        setConfirmationDialogRetestOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while retesting Colorimeter Test");
        processErrorOnMutation(error, dispatch, history);
        setConfirmationDialogRetestOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      }
    }
  };

  return (
    <>
      <TravelerModalButton
        disposition={disposition}
        name={name}
        handleClose={handleClose}
        open_notes={open_notes}
        has_notes={has_notes}
        type="colorimeter"
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"xl"}
      >
        <DialogTitle id="scroll-dialog-title">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={3}>
              <Typography variant="h6">
                {`Colorimeter Review - ${name}`}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadProcedure}
              >
                Download
              </Button>
            </Grid>
            <Grid item xs={4} />
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
                name={`Colorimeter Review - ${name}`}
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
          <Grid container direction="row" alignItems="flex-start" spacing={2}>
            <Grid item xs={7}>
              {reviewData.chart === 1 && (
                <PositionChartOne position={-1} colors={reviewData.values} />
              )}
              {reviewData.chart === 2 && (
                <PositionChartTwo position={-1} colors={reviewData.values} />
              )}
              {reviewData.chart === 3 && (
                <PositionChartThree position={-1} colors={reviewData.values} />
              )}
            </Grid>
            <Grid item xs={5}>
              <Paper style={{ marginTop: 32 }} elevation={1}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell> Position </TableCell>
                        <TableCell> L* </TableCell>
                        <TableCell> A* </TableCell>
                        <TableCell> B* </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reviewData.values.map((row: any) => (
                        <TableRow key={row.position}>
                          <TableCell>{row.position + 1}</TableCell>
                          <TableCell>{row.l_value}</TableCell>
                          <TableCell>{row.a_value}</TableCell>
                          <TableCell>{row.b_value}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell> Average </TableCell>
                        <TableCell>
                          {" "}
                          {calcAvg(reviewData.values, "l_value")}{" "}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {calcAvg(reviewData.values, "a_value")}{" "}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {calcAvg(reviewData.values, "b_value")}{" "}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell> Standard Deviation </TableCell>
                        <TableCell>
                          {" "}
                          {calcSTD(reviewData.values, "l_value")}{" "}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {calcSTD(reviewData.values, "a_value")}{" "}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {calcSTD(reviewData.values, "b_value")}{" "}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={8}></Grid>
            {permission && (
              <>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    style={theme.btnError}
                    onClick={() => setConfirmationDialogRetestOpen(true)}
                  >
                    Retest
                  </Button>
                </Grid>
                {disposition === "Requires Review" && (
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      style={theme.btnNew}
                      onClick={() => setConfirmationDialogApproveOpen(true)}
                    >
                      Approve
                    </Button>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
        <ConfirmationDialog
          id="Colorimeter-review-retest"
          keepMounted
          open={confirmationDialogRetestOpen}
          title="Colorimeter Review Retest Confirmation"
          content="Are you sure that you want to retest this Colorimeter Review?"
          onCancel={() => setConfirmationDialogRetestOpen(false)}
          onSubmit={() => submitVerification(false)}
        />
        <ConfirmationDialog
          id="iv-review-approve"
          keepMounted
          open={confirmationDialogApproveOpen}
          title="Colorimeter Review Approval Confirmation"
          content="Are you sure that you want to approve this Colorimeter Review?"
          onCancel={() => setConfirmationDialogApproveOpen(false)}
          onSubmit={() => submitVerification(true)}
        />
      </Dialog>
    </>
  );
};
