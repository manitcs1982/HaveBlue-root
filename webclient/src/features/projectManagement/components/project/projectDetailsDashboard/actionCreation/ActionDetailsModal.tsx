import React from 'react';
import { useHistory } from "react-router-dom";
import {
  Container,
  Grid,
  MenuItem,
  LinearProgress,
  useTheme,
  Divider,
  Button,
  Tooltip,
  IconButton,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import { useQueryClient } from "react-query";
import { useFetchContext } from "../../../../../common/FetchContext";
import { ErrorMessage } from "../../../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../../../util/errorMessaging";
import { ThreadedFileModal } from "../../../../../common/threadedViewer/threadedFileModal";
import { ThreadedFileViewModal } from "../../../../../common/threadedViewer/threadedFileViewer";
import { CompleteActionModal } from "./CompleteAction";
import { formatDate } from "../../../../../common/formatDate";
import { ViewAddAttachmentsModal } from "../../../../../common/viewaddAttachmentsModal";
import { DatePicker } from "@material-ui/pickers";
import { useActionResult, useCheckActionCompletion } from "../../../../projectManagementQueries";
import { useUpdateActionDates, useLinkFileToAction, useMarkCompleteAction, useRevokeAction } from "../../../../projectManagementMutations";
import { toast } from "react-toastify";

const OVERRIDE_ON = 1
const OVERRIDE_OFF = 0

export const ActionDetailModal = ({ id, open, setOpen, workorder}: any) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = React.useState(null)
  const [promiseDate, setPromiseDate] = React.useState(null)
  const [etaDate, setETADate] = React.useState(null)
  const [completeOpen, setCompleteOpen] = React.useState(false)
  const [completePayload, setCompletePayload] = React.useState({})
  const [override, setOverride] = React.useState(OVERRIDE_OFF)

  const { mutateAsync: mutateLinkFile } = useLinkFileToAction();
  const { mutateAsync: mutateMarkCompete } = useMarkCompleteAction();
  const { mutateAsync: mutateRevoke } = useRevokeAction();

  const {
    mutateAsync: mutatePostActionDates,
    isLoading: isLoadingPostActionDates,
  } = useUpdateActionDates()

  const {
    data: action,
    isLoading: isLoadingAction,
    isError: isErrorAction,
    isSuccess: isSuccessAction,
    error: errorAction,
  } = useActionResult(id);

  const {
    data: completion,
    isLoading: isLoadingActionCompletion,
    error: errorActionCompletion,
    refetch: completedRefetch,
  } = useCheckActionCompletion(id);

  React.useEffect(() => {
    if (action) {
      setStartDate(action.start_datetime)
      setPromiseDate(action.promise_datetime)
      setETADate(action.eta_datetime)
    }
  }, [action]);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleDateChange = (date : any, onChange : any) => {
    onChange(date);
  }

  const updateDates = async () => {
    try {
      await mutatePostActionDates({ id, dates : {
        start_datetime: startDate,
        promise_datetime: promiseDate,
        eta_datetime: etaDate
      } });

      toast.success("Date was succesfully created");
    } catch (error) {
      toast.error("Error while updating date");
      processErrorOnMutation(error);
    }
  }

  const renderUpdate = () => {
    if (
      action.start_datetime !== startDate ||
      action.promise_datetime !== promiseDate ||
      action.eta_datetime !== etaDate
    ) {
        return (
          <Button onClick={updateDates} color="primary">
            Update
          </Button>
        );
      } else {
      return <Button disabled>Update</Button>;
    }
  }

  const markComplete = async(source : string) => {
    if (source === "mark") {
      let allCompleted = true;
      for (const key in action.completion_criteria) {
        if (!action.completion_criteria[key].criteria_completed) {
          allCompleted = false;
        }
      }

      if (allCompleted) {
        try {
          await mutateMarkCompete({ id, override : null, description: null });
          toast.success("Action has been completed");
        } catch (error) {
          toast.error("Error while completing action");
          processErrorOnMutation(error);
        }
      } else {
        setCompletePayload({override : 1})
        setOverride(OVERRIDE_ON)
        setCompleteOpen(!completeOpen)
      }

    } else if (source === "revoke") {
      setCompletePayload({})
      setOverride(OVERRIDE_OFF)
      setCompleteOpen(!completeOpen)
    }
  }

  if (isLoadingAction || id === "" || !action) {
    return(
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle id="scroll-dialog-title">
        </DialogTitle>
        <Divider variant="fullWidth" />
        <DialogContent>
        </DialogContent>
        <Divider variant="fullWidth" />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle id="scroll-dialog-title">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={8}>
              <Typography variant="h6" display="inline">
                Workorder: {action?.parent_object.str} - {action?.name} - {action?.disposition_name}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <ViewAddAttachmentsModal id={id} files={action.attachments} mutate={mutateLinkFile}/>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Divider variant="fullWidth" />
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid
              item
              xs={6}
              style={{
                borderRightStyle: "solid",
                borderWidth: "1px",
              }}>
              <Card style={{marginTop: 12}}>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h6">Description:</Typography>
                      <Typography variant="body2"> {action?.description} </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" display="inline">Execution Group:</Typography>
                      <Typography variant="body2" display="inline"> {action?.execution_group} </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" display="inline">Groups:</Typography>
                      {action?.groups.map((group : any) => (
                        <Typography variant="body2" display="inline"> {group.name}, </Typography>
                      ))}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Dates:</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <DatePicker
                        value={startDate}
                        format="MM/DD/yyyy"
                        label="Edit Start Date"
                        views={["year", "month", "date"]}
                        onChange={(date) => handleDateChange(date, setStartDate)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DatePicker
                        value={promiseDate}
                        format="MM/DD/yyyy"
                        label="Edit Promise Date"
                        views={["year", "month", "date"]}
                        onChange={(date) => handleDateChange(date, setPromiseDate)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DatePicker
                        value={etaDate}
                        format="MM/DD/yyyy"
                        label="Edit ETA Date"
                        views={["year", "month", "date"]}
                        onChange={(date) => handleDateChange(date, setETADate)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={6}
              // style={{
              //   borderLeftStyle: "solid",
              //   borderWidth: "1px",
              // }}
            >
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                spacing={1}
              >
                <Grid item xs={12}>
                  <Typography variant="h6">Completion Criteria</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>End Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {action?.completion_criteria?.map((criteria : any) => (
                          <TableRow key={criteria.id}>
                            <TableCell component="th" scope="row">
                              {criteria.action_completion_definition}
                            </TableCell>
                            <TableCell> {criteria.criteria_completed ? ("Completed") : ("Incomplete")} </TableCell>
                            <TableCell> {criteria.completed_datetime ? (formatDate(criteria.completed_datetime)) : ("N/A")} </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" onClick={() => {completedRefetch();}} color="primary">
                    Check Completion
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" onClick={() => {markComplete("mark");}} color="primary">
                    Mark Complete
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider variant="fullWidth" />
        <DialogActions>
          <Button onClick={() => {markComplete("revoke");}} color="secondary">
            REVOKE
          </Button>
          <div style={{flex: '1 0 0'}} />
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <div>
           {renderUpdate()}
          </div>
        </DialogActions>
      </Dialog>
      <CompleteActionModal id={id} open={completeOpen} setOpen={setCompleteOpen} payload={completePayload} mutate={override ? (mutateMarkCompete) : (mutateRevoke)} />
    </div>
  )
}
