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
  IconButton,
  TextField,
  MenuItem,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FlashOnOutlinedIcon from "@material-ui/icons/FlashOnOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { useView } from "../dataEgressQueries";
import { mutateCharts, useAddNoteToResult } from "../dataEgressMutations";
import { useFetchContext } from "../../common/FetchContext";
import { useAuthContext } from "../../common/AuthContext";
import { ErrorMessage } from "../../common/ErrorMessage";
import { ThreadedCreator } from "../../common/threadedViewer/threadedCreator";
import { useRetestProcedure, useReviewProcedure } from "../dataEgressMutations";
import { useDispositionsByName } from "../../common/services/dispositionServices";
import { useQueryClient } from "react-query";
import { processErrorOnMutation } from "../../../util/errorMessaging";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "../../common/ConfirmationDialog";

import { IVCurve } from "./IVCurve";
import { Scatter } from "./IVScatter";
import { AssetNameViewer } from "../../common/AssetNameViewer";
import {
  useTestPermissions,
  useTestPermissionsVerification,
} from "../../projectManagement/projectQueries";
import { TravelerModalButton } from "../TravelerModalButton";
import { VisualizerNotesModal } from "../VisualizerNotesModal";

export const IVReviewModal = ({
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
  const [charts, setCharts] = React.useState<any[]>([]);
  const { mutateAsync: mutateRetestProcedure } = useRetestProcedure();
  const { mutateAsync: mutateReviewProcedure } = useReviewProcedure();
  const { mutateAsync: mutateNote } = useAddNoteToResult();
  const [multiplier, setMultiplier] = React.useState(0);
  const [chartType, setChartType] = React.useState(1);

  const [confirmationDialogRetestOpen, setConfirmationDialogRetestOpen] =
    React.useState(false);
  const [confirmationDialogApproveOpen, setConfirmationDialogApproveOpen] =
    React.useState(false);

  const IV_CHART = 1;
  const SCATTER_CHART = 2;

  const {
    data: viewData,
    error: errorView,
    isLoading: isLoadingView,
    isError: isErrorView,
    isSuccess: isSuccessView,
  } = useView(id, open);

  const { data: permission, isLoading: isLoadingPermission } =
    useTestPermissionsVerification(id, open);

  React.useEffect(() => {
    if (viewData && viewData.iv_curves) {
      var tempCharts = mutateCharts({ curves: viewData.iv_curves });
      setCharts(tempCharts);
      console.log(charts);

      viewData.iv_curves[0].multiplier
        ? setMultiplier(viewData.iv_curves[0].multiplier)
        : setMultiplier(1);
    }
  }, [viewData, isSuccessView]);

  const renderChart = () => {
    if (chartType == IV_CHART) {
      return <IVCurve chart={charts} />;
    } else if (chartType == SCATTER_CHART) {
      return <Scatter chart={charts} />;
    }
  };

  const handleChartType = (event: any) => {
    setChartType(event.target.value);
  };

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
    return <ErrorMessage error={errorView} />;
  }

  const handleClose = () => {
    setOpen(!open);
  };

  const deviation = (expected: number, result: number, multiplier: number) => {
    var temp = (result / multiplier / expected - 1) * 100;

    return temp.toFixed(2);
  };

  const submitVerification = async (result: boolean) => {
    if (result) {
      try {
        await mutateReviewProcedure({
          authAxios,
          disposition: dispositionPassedId,
          procedure_result: viewData.id,
        });
        toast.success("Flash Test Review Approved");
        setConfirmationDialogApproveOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while approving Flash Test");
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
        toast.success("Flash Test Review was sent for retesting");
        setConfirmationDialogRetestOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while retesting Flash Test");
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
        type="iv"
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
            <Grid item xs={6}>
              <Typography variant="h6">
                {`Flash Test Data Review - ${name}`};
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="chart-select"
                select
                label="Chart Type"
                value={chartType}
                onChange={handleChartType}
                fullWidth
              >
                <MenuItem value={1}> Curve </MenuItem>
                <MenuItem value={2}> Scatter </MenuItem>
              </TextField>
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
                name={`Flash Test Review - ${name}`}
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
          {viewData && Object.keys(viewData).length !== 0 && (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={4}
            >
              <Grid item xs={3}>
                <AssetNameViewer procedureResults={viewData} />
              </Grid>
              <Grid item xs={9} />

              <Grid item xs={6}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>PMP</TableCell>
                        <TableCell>VOC</TableCell>
                        <TableCell>VMP</TableCell>
                        <TableCell>ISC</TableCell>
                        <TableCell>IMP</TableCell>
                        <TableCell>Irradiance</TableCell>
                        <TableCell>Temperature</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>STC Nameplate</TableCell>
                        <TableCell>
                          {viewData.unit_type.module_property.nameplate_pmax}
                        </TableCell>
                        <TableCell>
                          {viewData.unit_type.module_property.voc}
                        </TableCell>
                        <TableCell>
                          {viewData.unit_type.module_property.vmp}
                        </TableCell>
                        <TableCell>
                          {viewData.unit_type.module_property.isc}
                        </TableCell>
                        <TableCell>
                          {viewData.unit_type.module_property.imp}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Scaled Nameplate</TableCell>
                        <TableCell>
                          {(
                            viewData.unit_type.module_property.nameplate_pmax *
                            multiplier
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {(
                            viewData.unit_type.module_property.voc * multiplier
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {(
                            viewData.unit_type.module_property.vmp * multiplier
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {(
                            viewData.unit_type.module_property.isc * multiplier
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {(
                            viewData.unit_type.module_property.imp * multiplier
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Measurement Results</TableCell>
                        <TableCell>
                          {viewData.flash_values.Pmp?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {viewData.flash_values.Voc?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {viewData.flash_values.Vmp?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {viewData.flash_values.Isc?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {viewData.flash_values.Imp?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {viewData.flash_values.Irradiance?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {viewData.flash_values.Temperature?.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Deviation from Scaled Nameplate</TableCell>
                        <TableCell>
                          {deviation(
                            viewData.unit_type.module_property.nameplate_pmax,
                            viewData.flash_values.Pmp,
                            viewData.iv_curves[0].multiplier
                          )}
                          %
                        </TableCell>
                        <TableCell>
                          {deviation(
                            viewData.unit_type.module_property.voc,
                            viewData.flash_values.Voc,
                            viewData.iv_curves[0].multiplier
                          )}
                          %
                        </TableCell>
                        <TableCell>
                          {deviation(
                            viewData.unit_type.module_property.vmp,
                            viewData.flash_values.Vmp,
                            multiplier
                          )}
                          %
                        </TableCell>
                        <TableCell>
                          {deviation(
                            viewData.unit_type.module_property.isc,
                            viewData.flash_values.Isc,
                            multiplier
                          )}
                          %
                        </TableCell>
                        <TableCell>
                          {deviation(
                            viewData.unit_type.module_property.imp,
                            viewData.flash_values.Imp,
                            multiplier
                          )}
                          %
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={6}>
                {viewData && charts.length > 0 ? renderChart() : null}
              </Grid>

              <Grid item xs={8} />
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
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>

        <ConfirmationDialog
          id="IV-review-retest"
          keepMounted
          open={confirmationDialogRetestOpen}
          title="IV Review Retest Confirmation"
          content="Are you sure that you want to retest this IV Review?"
          onCancel={() => setConfirmationDialogRetestOpen(false)}
          onSubmit={() => submitVerification(false)}
        />
        <ConfirmationDialog
          id="iv-review-approve"
          keepMounted
          open={confirmationDialogApproveOpen}
          title="IV Review Approval Confirmation"
          content="Are you sure that you want to approve this IV Review?"
          onCancel={() => setConfirmationDialogApproveOpen(false)}
          onSubmit={() => submitVerification(true)}
        />
      </Dialog>
    </>
  );
};
