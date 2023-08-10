import React from "react";
import ButtonBase from "@material-ui/core/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  IconButton,
  Button,
} from "@material-ui/core";
import MuiTable from "@material-ui/core/Table";
import { useProcedureResultView } from "../testCommunication/common/testQueries";
import {
  useAddNoteToResult,
  useRetestProcedure,
  useReviewProcedure,
} from "./dataEgressMutations";
import { ErrorMessage } from "../common/ErrorMessage";
import { ThreadedCreator } from "../common/threadedViewer/threadedCreator";
import { useDefaultColumn, generalFilter } from "../../util/filter";
import { useTable, useFilters, useSortBy } from "react-table";
import CloseIcon from "@material-ui/icons/Close";
import { useView } from "./dataEgressQueries";
import CachedIcon from "@material-ui/icons/Cached";
import {
  useTestPermissions,
  useTestPermissionsVerification,
} from "../projectManagement/projectQueries";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { useFetchContext } from "../common/FetchContext";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { processErrorOnMutation } from "../../util/errorMessaging";
import { useAuthContext } from "../common/AuthContext";
import { useHistory } from "react-router-dom";
import { TravelerModalButton } from "./TravelerModalButton";
import { VisualizerNotesModal } from "./VisualizerNotesModal";
import { LSDBCoreTable } from "../common/LSDBCoreTable";

export const StressDataModal = ({
  id,
  name,
  disposition,
  dispositionPassedId,
  open_notes,
  has_notes,
}: {
  id: any;
  name: any;
  disposition: any;
  dispositionPassedId?: any;
  open_notes: any;
  has_notes: any;
}) => {
  const history = useHistory();
  const { mutateAsync: mutateRetestProcedure } = useRetestProcedure();
  const { mutateAsync: mutateReviewProcedure } = useReviewProcedure();
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();
  const { dispatch } = useAuthContext();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [procedureResultData, setProcedureResultData] = React.useState([]);
  const [confirmationDialogRetestOpen, setConfirmationDialogRetestOpen] =
    React.useState(false);
  const [confirmationDialogApproveOpen, setConfirmationDialogApproveOpen] =
    React.useState(false);
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();
  const { mutateAsync: mutateNote } = useAddNoteToResult();
  const NOT_AVAILABLE = "N/A";

  const {
    data: procedureData,
    error: procedureError,
    isLoading: isLoadingProcedure,
    isError: isErrorProcedure,
    isSuccess: isSuccessProcedure,
  } = useView(id, isOpen);

  const { data: permission, isLoading: isLoadingPermission } =
    useTestPermissionsVerification(id, isOpen);

  React.useEffect(() => {
    if (isSuccessProcedure) {
      setProcedureResultData(procedureData.step_results);
    }
  }, [isSuccessProcedure, procedureData]);

  const columns = React.useMemo(
    () => [
      { Header: "Id", accesor: "id" },
      { Header: "Step Name", accessor: "name", filter: generalFilter },
      {
        Header: "Start Date/Time",
        accessor: (row: any) =>
          (row.measurement_results[0].measurement_result_type_field ===
          "result_datetime"
            ? row.start_datetime
            : row.start_datetime) || NOT_AVAILABLE,
        filter: generalFilter,
      },
      {
        Header: "Metadata",
        accessor: (row: any) => {
          let result = "";
          let resultType =
            row.measurement_results[0].measurement_result_type_field;
          resultType === "result_datetime"
            ? (result = "Date (see Start Date/Time)")
            : (result = row.measurement_results[0][resultType]);
          return result;
        },
      },
      {
        Header: "Asset",
        accessor: "measurement_results[0].asset_name",
      },
      {
        Header: "User",
        accessor: "measurement_results[0].username",
        filter: generalFilter,
      },
    ],
    []
  );

  if (isLoadingProcedure || isLoadingPermission) {
    return (
      <div style={theme.containerMargin}>
        <Grid>
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (isErrorProcedure) {
    return <ErrorMessage error={procedureError} />;
  }

  const toggleOpenState = () => {
    setIsOpen((value) => !value);
  };

  const submitVerification = async (result: boolean) => {
    if (result) {
      try {
        await mutateReviewProcedure({
          authAxios,
          disposition: dispositionPassedId,
          procedure_result: procedureData.id,
        });
        toast.success("Colorimeter Test Review Approved");
        setConfirmationDialogApproveOpen(false);
        setIsOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while approving Colorimeter Test");
        processErrorOnMutation(error, dispatch, history);
        setConfirmationDialogApproveOpen(false);
        setIsOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      }
    } else {
      try {
        await mutateRetestProcedure({
          authAxios,
          procedure_result: procedureData.id,
        });
        toast.success("Colorimeter Test Review was sent for retesting");
        setConfirmationDialogRetestOpen(false);
        setIsOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while retesting Colorimeter Test");
        processErrorOnMutation(error, dispatch, history);
        setConfirmationDialogRetestOpen(false);
        setIsOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      }
    }
  };

  return (
    <React.Fragment>
      <TravelerModalButton
        disposition={disposition}
        name={name}
        handleClose={toggleOpenState}
        open_notes={open_notes}
        has_notes={has_notes}
        type="stress"
      />
      <Dialog open={isOpen} onClose={toggleOpenState} fullWidth maxWidth="lg">
        <DialogTitle id="scroll-dialog-title">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={8}>
              <Typography variant="h6">{`Stress Data - ${name}`};</Typography>
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
                name={`Stress Data Review - ${name}`}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={toggleOpenState}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers={true}>
          {procedureData?.supersede && (
            <Typography variant="body2" align="center">
              SUPERSEDED
            </Typography>
          )}

          <Typography variant="body1">
            Heading: {procedureData?.procedure_definition_name}
          </Typography>
          <Typography variant="body1">
            Disposition: {procedureData?.disposition_name}
          </Typography>
          <Typography variant="body1">
            Start Date/Time: {procedureData?.start_datetime || NOT_AVAILABLE}
          </Typography>
          <Typography variant="body1">
            End Date/Time: {procedureData?.end_datetime || NOT_AVAILABLE}
          </Typography>

          {procedureResultData && (
            <LSDBCoreTable columns={columns} data={procedureResultData} />
          )}
        </DialogContent>
        <ConfirmationDialog
          id="stress-review-retest"
          keepMounted
          open={confirmationDialogRetestOpen}
          title="Stress Review Retest Confirmation"
          content="Are you sure that you want to retest this Stress Review?"
          onCancel={() => setConfirmationDialogRetestOpen(false)}
          onSubmit={() => submitVerification(false)}
        />
        <ConfirmationDialog
          id="stress-review-approve"
          keepMounted
          open={confirmationDialogApproveOpen}
          title="Stress Review Approval Confirmation"
          content="Are you sure that you want to approve this Stress Review?"
          onCancel={() => setConfirmationDialogApproveOpen(false)}
          onSubmit={() => submitVerification(true)}
        />
      </Dialog>
    </React.Fragment>
  );
};
