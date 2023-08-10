import React from "react";
import {
  Container,
  Typography,
  useTheme,
  LinearProgress,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";

import CameraAltIcon from "@material-ui/icons/CameraAlt";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import PrintIcon from "@material-ui/icons/Print";
import RefreshIcon from "@material-ui/icons/Refresh";

import { formatDate } from "../../../common/formatDate";
import { LSDBSplitButton } from "../../../common/LSDBSplitButton";
import {
  useResults,
  useTestPermissions,
  useUnitNotes,
} from "../../projectQueries";
import { useUnitsBySerialNumber } from "../../../testCommunication/common/testQueries";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { DiodeTestModal } from "../../../dataEgress/DiodeTestModal";
import { ELImageReviewModal } from "../../../dataEgress/ELImageReviewModal";
import { ColorimeterReviewModal } from "../../../dataEgress/ColorimeterModal";
import { VisualInspectionReviewModal } from "../../../dataEgress/VisualInspectionReviewModal";
import { LeakedDataModal } from "../../../dataEgress/LeakedDataModal";
import { IVReviewModal } from "../../../dataEgress/IVReview/IVReviewModal";
import { VisualizerModal } from "../../../testCommunication/common/VisualizerModal";
import { ViewAddNoteList } from "../../../common/ViewAddNotes";
import { ImageListModal } from "../../../common/imageViewerModal";
import { useAddNoteToUnit } from "../../projectManagementMutations";
import { useQueryClient } from "react-query";

import {
  useUnitsDispositions,
  usePatchUnit,
  useDispositionsByName,
} from "../../../common/services/dispositionServices";

import { toast } from "react-toastify";
import { useFetchContext } from "../../../common/FetchContext";

import { useAuthContext } from "../../../common/AuthContext";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../util/errorMessaging";
import { useHistory } from "react-router-dom";
import { StressDataModal } from "../../../dataEgress/StressDataModal";
import { ThreadedCreator } from "../../../common/threadedViewer/threadedCreator";

const useStyles = makeStyles(() => ({
  baseBorder: {
    borderStyle: "solid",
    borderWidth: "1px",
  },
}));

export const TravelerComponent = ({ serialNumber }: any) => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { dispatch } = useAuthContext();
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  const [isHistoricModalOpen, setIsHistoricModalOpen] = React.useState(false);
  const [currentHistoricData, setCurrentHistoricData] = React.useState(null);
  const [imageModal, setImageModal] = React.useState(false);

  const { mutateAsync: mutateAddNote } = useAddNoteToUnit();
  const { mutateAsync: mutatePatchUnit } = usePatchUnit();

  const {
    error: errorUnits,
    data: units,
    isError: isErrorUnits,
    isSuccess: isSuccessUnits,
    isLoading: isLoadingUnits,
  } = useUnitsBySerialNumber(serialNumber);

  const {
    error: errorResults,
    data: travelerResults,
    isError: isErrorResults,
    isSuccess: isSuccessResults,
    isLoading: isLoadingResults,
  } = useResults(units && units.length > 0 ? units[0].id : null);

  const {
    data: permission,
    isLoading: isLoadingPermission,
    isError: isErrorPermission,
    error: errorPermission,
  } = useTestPermissions();

  const {
    error: errorDispositions,
    data: dispositions,
    isSuccess: isSuccessDispositions,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
  } = useUnitsDispositions();

  const {
    data: dispositionPassed,
    isLoading: isLoadingDispositionPassed,
    isError: isErrorDispositionPassed,
    error: errorDispositionPassed,
    isSuccess: isSuccessDispositionPassed,
  } = useDispositionsByName("Pass");

  React.useEffect(() => {
    if (isSuccessUnits && units.length === 0) {
      toast.error(`No units found.`);
    }
  }, [isSuccessUnits, isSuccessResults, units, travelerResults]);

  const addTime = (dateString: any, duration: number) => {
    const oldDate = new Date(dateString);
    const newDate = new Date(oldDate.getTime() + duration * 60000);
    return formatDate(newDate.toString());
  };

  if (isErrorUnits || isErrorResults || isErrorDispositions) {
    return (
      <>
        {isErrorUnits && <ErrorMessage error={errorUnits} />}
        {isErrorResults && <ErrorMessage error={errorResults} />}
        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}
        {isErrorDispositionPassed && (
          <ErrorMessage error={errorDispositionPassed} />
        )}
      </>
    );
  }

  if (
    isLoadingUnits ||
    isLoadingResults ||
    isLoadingPermission ||
    isLoadingDispositions ||
    isLoadingDispositionPassed
  ) {
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

  const renderUnitDisposition = () => {
    if (travelerResults.disposition_name) {
      if (permission) {
        return (
          <LSDBSplitButton
            onItemSelection={submitDisposition}
            options={dispositions}
            idField="id"
            textField="name"
            selectedItemText={travelerResults.disposition_name}
          />
        );
      } else {
        return (
          <>
            <Typography variant="body2" align="center" display="inline">
              Disposition:
            </Typography>
            <Typography
              variant="body2"
              align="center"
              display="inline"
              style={{ color: "grey" }}
            >
              {travelerResults.disposition_name}
            </Typography>
          </>
        );
      }
    } else {
      return (
        <>
          <Typography variant="body2" align="center" display="inline">
            Disposition:
          </Typography>
          <Typography
            variant="body2"
            align="center"
            display="inline"
            style={{ color: "grey" }}
          >
            {"N/A"}
          </Typography>
        </>
      );
    }
  };

  const renderVisualizerModal = (procedure: any) => {
    const dispositionName = permission ? procedure.disposition_name : null;
    switch (procedure.visualizer) {
      case "el_image":
        return (
          <ELImageReviewModal
            id={procedure.id}
            disposition={dispositionName}
            name={procedure.procedure_definition_name}
            dispositionPassedId={dispositionPassed?.id}
            open_notes={procedure.open_notes}
            has_notes={procedure.has_notes}
          />
        );
      case "iv_curve":
        return (
          <IVReviewModal
            id={procedure.id}
            disposition={dispositionName}
            name={procedure.procedure_definition_name}
            dispositionPassedId={dispositionPassed?.id}
            open_notes={procedure.open_notes}
            has_notes={procedure.has_notes}
          />
        );
      case "wet_leakage":
        return (
          <LeakedDataModal
            id={procedure.id}
            disposition={dispositionName}
            name={procedure.procedure_definition_name}
            dispositionPassedId={dispositionPassed?.id}
            open_notes={procedure.open_notes}
            has_notes={procedure.has_notes}
          />
        );
      case "visual_inspection":
        return (
          <VisualInspectionReviewModal
            id={procedure.id}
            disposition={dispositionName}
            name={procedure.procedure_definition_name}
            dispositionPassedId={dispositionPassed?.id}
            open_notes={procedure.open_notes}
            has_notes={procedure.has_notes}
          />
        );
      case "diode":
        return (
          <DiodeTestModal
            id={procedure.id}
            disposition={dispositionName}
            name={procedure.procedure_definition_name}
            dispositionPassedId={dispositionPassed?.id}
            open_notes={procedure.open_notes}
            has_notes={procedure.has_notes}
          />
        );
      case "colorimeter":
        return (
          <ColorimeterReviewModal
            id={procedure.id}
            disposition={dispositionName}
            name={procedure.procedure_definition_name}
            dispositionPassedId={dispositionPassed?.id}
            open_notes={procedure.open_notes}
            has_notes={procedure.has_notes}
          />
        );
      case "stress":
        return (
          <StressDataModal
            id={procedure.id}
            disposition={dispositionName}
            name={procedure.procedure_definition_name}
            dispositionPassedId={dispositionPassed?.id}
            open_notes={procedure.open_notes}
            has_notes={procedure.has_notes}
          />
        );
      default:
        return (
          <Typography variant="body2" align="center">
            {procedure.procedure_definition_name}
          </Typography>
        );
    }
  };

  const renderProcedureName = (procedure: any) => {
    if (history.location.pathname.includes("virtual_traveler") && permission) {
      return (
        <Button
          style={{ textAlign: "center" }}
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentHistoricData(procedure);
            setIsHistoricModalOpen(true);
          }}
          fullWidth
        >
          <Typography variant="body2" align="center">
            {procedure.procedure_definition_name}
          </Typography>
        </Button>
      );
    }

    return (
      <Typography variant="body2" align="center">
        {procedure.procedure_definition_name}
      </Typography>
    );
  };

  const submitDisposition = async (selectedDisposition: any) => {
    try {
      await mutatePatchUnit({
        authAxios,
        id: units[0].id,
        field: "disposition",
        value: selectedDisposition.url,
      });
      toast.success("Disposition saved");
      queryClient.invalidateQueries("travelerResults");
    } catch (error) {
      queryClient.invalidateQueries("travelerResults");
      processErrorOnMutation(error, dispatch, history);
    }
  };

  return (
    <Container>
      {isSuccessResults &&
        isSuccessUnits &&
        isSuccessDispositions &&
        isSuccessDispositionPassed && (
          <>
            <Grid container direction="row">
              <Grid item xs={8} className={classes.baseBorder}>
                <Grid container>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Project Number
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    {travelerResults.project_number ? (
                      <Typography variant="body2" align="center">
                        {travelerResults.project_number}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        align="center"
                        style={{ color: "grey" }}
                      >
                        N/A
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Work Order
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    {travelerResults.work_order_name ? (
                      <Typography variant="body2" align="center">
                        {travelerResults.work_order_name}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        align="center"
                        style={{ color: "grey" }}
                      >
                        N/A
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      NTP Date
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    {travelerResults.start_datetime ? (
                      <Typography variant="body2" align="center">
                        {formatDate(travelerResults.start_datetime)}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        align="center"
                        style={{ color: "grey" }}
                      >
                        N/A
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Mpp
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.unit_type.module_property.nameplate_pmax}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Manufacturer
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.unit_type.manufacturer_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Voc
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.unit_type.module_property.voc}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Model
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.unit_type.model}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Isc
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.unit_type.module_property.isc}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Project Manager
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    {travelerResults.project_manager ? (
                      <Typography variant="body2" align="center">
                        {travelerResults.project_manager}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        align="center"
                        style={{ color: "grey" }}
                      >
                        N/A
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Vmp
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.unit_type.module_property.vmp}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Customer
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.customer_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Imp
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.unit_type.module_property.imp}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Calibration
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {
                        travelerResults.unit_type.module_property
                          .module_technology_name
                      }
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Voltage
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {travelerResults.unit_type.module_property.system_voltage}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Dimensions
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      {`${travelerResults.unit_type.module_property.module_height} x ${travelerResults?.unit_type.module_property.module_width}`}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} className={classes.baseBorder}>
                    <Typography variant="body2" align="center">
                      Bifacial
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.baseBorder}>
                    {travelerResults.unit_type.module_property.bifacial ===
                      true && (
                      <Typography variant="body2" align="center">
                        True
                      </Typography>
                    )}
                    {travelerResults.unit_type.module_property.bifacial ===
                      false && (
                      <Typography variant="body2" align="center">
                        False
                      </Typography>
                    )}
                    {travelerResults.unit_type.module_property.bifacial ===
                      null && (
                      <Typography
                        variant="body2"
                        align="center"
                        style={{ color: "grey" }}
                      >
                        {" N/A"}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={4} className={classes.baseBorder}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12} />
                  <Grid item xs={7}>
                    <Grid container alignItems="center" direction="column">
                      <Grid item xs={12}>
                        {travelerResults.test_sequence_definition_name ? (
                          <Typography variant="body2" align="center">
                            {travelerResults.test_sequence_definition_name}
                          </Typography>
                        ) : (
                          <Typography variant="body2" align="center">
                            No Test Sequence Found
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        {travelerResults.test_sequence_definition_version ? (
                          <Typography variant="body2" align="center">
                            {travelerResults.test_sequence_definition_version}
                          </Typography>
                        ) : null
                        }
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" align="center">
                          Unit Serial Number: {serialNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        {travelerResults.project_manager ? (
                          <Typography variant="body2" align="center">
                            Project Manager: {travelerResults.project_manager}
                          </Typography>
                        ) : (
                          <>
                            <Typography
                              variant="body2"
                              align="center"
                              display="inline"
                            >
                              Project Manager:
                            </Typography>
                            <Typography
                              variant="body2"
                              align="center"
                              display="inline"
                              style={{ color: "grey" }}
                            >
                              {" N/A"}
                            </Typography>
                          </>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        {travelerResults.intake_date ? (
                          <Typography variant="body2" align="center">
                            Intake Date:{" "}
                            {formatDate(travelerResults.intake_date)}
                          </Typography>
                        ) : (
                          <>
                            <Typography
                              variant="body2"
                              align="center"
                              display="inline"
                            >
                              Intake Date:
                            </Typography>
                            <Typography
                              variant="body2"
                              align="center"
                              display="inline"
                              style={{ color: "grey" }}
                            >
                              {" N/A"}
                            </Typography>
                          </>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        {renderUnitDisposition()}
                      </Grid>
                      <Grid item xs={12}>
                        {travelerResults.tib ? (
                          <Typography variant="body2" align="center">
                            TIB: {travelerResults.tib}
                          </Typography>
                        ) : (
                          <>
                            <Typography
                              variant="body2"
                              align="center"
                              display="inline"
                            >
                              TIB:
                            </Typography>
                            <Typography
                              variant="body2"
                              align="center"
                              display="inline"
                              style={{ color: "grey" }}
                            >
                              {" N/A"}
                            </Typography>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={5}>
                    <Grid
                      container
                      alignItems="center"
                      justify="space-between"
                      direction="row"
                      spacing={1}
                    >
                      <Grid item xs={5}>
                        <Tooltip title="View Notes">
                          <ViewAddNoteList
                            id={travelerResults.id}
                            type={1}
                            count={travelerResults.notes[0]?.count}
                            unread={travelerResults.notes[0]?.unread_count}
                            model={"unit"}
                            invalidate={[
                              "travelerResults",
                              ["unit_notes", travelerResults.id],
                            ]}
                            getNotes={useUnitNotes}
                          />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={1} />
                      <Grid item xs={6}>
                          <Tooltip title="View Images">
                            <Button
                              style={{ textAlign: "center" }}
                              variant="contained"
                              onClick={() => {setImageModal(!imageModal)}}
                              startIcon={<CameraAltIcon />}
                            />
                          </Tooltip>
                      </Grid>
                      <Grid item xs={6}>
                        <Tooltip title="Copy to Clipboard">
                          <CopyToClipboard
                            text={`https://lsdb.pvel.com/project_management/virtual_traveler/${serialNumber}`}
                            onCopy={() =>
                              toast.success(`Copied Link to Clipboard.`)
                            }
                          >
                            <Button
                              style={{ textAlign: "center" }}
                              variant="contained"
                              color="primary"
                              startIcon={<FileCopyIcon />}
                            />
                          </CopyToClipboard>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          style={{ textAlign: "center" }}
                          variant="contained"
                          disabled
                          startIcon={<PrintIcon />}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Tooltip title="Refresh Traveler">
                          <Button
                            style={{ textAlign: "center" }}
                            variant="contained"
                            color="primary"
                            startIcon={<RefreshIcon />}
                            onClick={() => {
                              queryClient.invalidateQueries("travelerResults");
                            }}
                          />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={5}>
                        <ThreadedCreator
                          id={travelerResults.id}
                          parentObject={travelerResults}
                          model={"unit"}
                          invalidate={[
                            "travelerResults",
                            ["unit_notes", travelerResults.id],
                          ]}
                          noteType={3}
                        />
                      </Grid>
                      <Grid item xs={1} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={2}
                className={classes.baseBorder}
                style={{ backgroundColor: "#eeeeee" }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  style={{ fontWeight: "bold" }}
                >
                  Procedure
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                className={classes.baseBorder}
                style={{ backgroundColor: "#eeeeee" }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  style={{ fontWeight: "bold" }}
                >
                  Operator
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                className={classes.baseBorder}
                style={{ backgroundColor: "#eeeeee" }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  style={{ fontWeight: "bold" }}
                >
                  Test Date
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                className={classes.baseBorder}
                style={{ backgroundColor: "#eeeeee" }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  style={{ fontWeight: "bold" }}
                >
                  Disposition
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                className={classes.baseBorder}
                style={{ backgroundColor: "#eeeeee" }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  style={{ fontWeight: "bold" }}
                >
                  Reviewer
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                className={classes.baseBorder}
                style={{ backgroundColor: "#eeeeee" }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  style={{ fontWeight: "bold" }}
                >
                  Review Date
                </Typography>
              </Grid>
            </Grid>

            <Grid container direction="row">
              {travelerResults.calibration_results?.map((leg: any) => (
                <React.Fragment key={leg.id}>
                  <Grid
                    item
                    xs={2}
                    className={classes.baseBorder}
                    style={{ backgroundColor: "orange" }}
                  >
                    <Typography
                      variant="body2"
                      align="center"
                      style={{ fontWeight: "bold" }}
                    >
                      {leg.linear_execution_group}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    className={classes.baseBorder}
                    style={{ backgroundColor: "orange" }}
                  >
                    <Typography
                      variant="body2"
                      align="center"
                      style={{ fontWeight: "bold" }}
                    >
                      {leg.name}
                    </Typography>
                  </Grid>

                  {leg.procedure_results?.map((procedure: any) => (
                    <React.Fragment key={procedure.id}>
                      <Grid item xs={2} className={classes.baseBorder}>
                        {procedure.completion_date && procedure.visualizer
                          ? renderVisualizerModal(procedure)
                          : renderProcedureName(procedure)}
                      </Grid>

                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.username ? (
                            <Typography variant="body2" align="center">
                              {procedure.username}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.completion_date ? (
                            <Typography variant="body2" align="center">
                              {formatDate(procedure.completion_date)}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.disposition_name ? (
                            <Typography variant="body2" align="center">
                              {procedure.disposition_name}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.reviewed_by_user ? (
                            <Typography variant="body2" align="center">
                              {procedure.reviewed_by_user}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.review_datetime ? (
                            <Typography variant="body2" align="center">
                              {formatDate(procedure.review_datetime)}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>
                      {procedure.visualizer === "stress" &&
                      procedure.start_datetime !== null ? (
                        <>
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {"Stressor Data"}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {`Start Date:`}
                            </Typography>
                            <Typography variant="body2" align="center">
                              {`${formatDate(procedure.start_datetime)}`}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {"Entered By:"}
                            </Typography>
                            <Typography variant="body2" align="center">
                              {procedure.username}
                            </Typography>
                          </Grid>
                          {procedure.end_datetime !== null ? (
                            <Grid
                              item
                              xs={2}
                              className={classes.baseBorder}
                              style={{ backgroundColor: "#eeeeee" }}
                            >
                              <Typography
                                variant="body2"
                                align="center"
                                style={{ fontWeight: "bold" }}
                              >
                                {"Exit Date"}
                              </Typography>
                              <Typography variant="body2" align="center">
                                {formatDate(procedure.end_datetime)}
                              </Typography>
                            </Grid>
                          ) : (
                            <Grid
                              item
                              xs={2}
                              className={classes.baseBorder}
                              style={{ backgroundColor: "#eeeeee" }}
                            >
                              <Typography
                                variant="body2"
                                align="center"
                                style={{ fontWeight: "bold" }}
                              >
                                {"Estimated Exit Date:"}
                              </Typography>
                              <Typography variant="body2" align="center">
                                {addTime(
                                  procedure.start_datetime,
                                  procedure.duration
                                )}
                              </Typography>
                            </Grid>
                          )}
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {"Exit User"}
                            </Typography>
                            <Typography variant="body2" align="center">
                              {procedure.exit_user
                                ? procedure.exit_user
                                : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {" "}
                            </Typography>
                          </Grid>
                        </>
                      ) : null}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}

              {travelerResults.sequences_results?.map((leg: any) => (
                <React.Fragment key={leg.id}>
                  <Grid
                    item
                    xs={2}
                    className={classes.baseBorder}
                    style={{ backgroundColor: "yellow" }}
                  >
                    <Typography
                      variant="body2"
                      align="center"
                      style={{ fontWeight: "bold" }}
                    >
                      {leg.linear_execution_group}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    className={classes.baseBorder}
                    style={{ backgroundColor: "#eeeeee" }}
                  >
                    <Typography
                      variant="body2"
                      align="center"
                      style={{ fontWeight: "bold" }}
                    >
                      {leg.name}
                    </Typography>
                  </Grid>

                  {leg.procedure_results?.map((procedure: any) => (
                    <React.Fragment key={procedure.id}>
                      <Grid item xs={2} className={classes.baseBorder}>
                        {procedure.completion_date && procedure.visualizer
                          ? renderVisualizerModal(procedure)
                          : renderProcedureName(procedure)}
                      </Grid>

                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.username ? (
                            <Typography variant="body2" align="center">
                              {procedure.username}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.completion_date ? (
                            <Typography variant="body2" align="center">
                              {formatDate(procedure.completion_date)}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.disposition_name ? (
                            <Typography variant="body2" align="center">
                              {procedure.disposition_name}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.reviewed_by_user ? (
                            <Typography variant="body2" align="center">
                              {procedure.reviewed_by_user}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} className={classes.baseBorder}>
                        <Typography variant="body2" align="center">
                          {procedure.review_datetime ? (
                            <Typography variant="body2" align="center">
                              {formatDate(procedure.review_datetime)}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ color: "grey" }}
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Grid>
                      {procedure.visualizer === "stress" &&
                      procedure.start_datetime !== null ? (
                        <>
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {"Stressor Data"}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {`Start Date:`}
                            </Typography>
                            <Typography variant="body2" align="center">
                              {`${formatDate(procedure.start_datetime)}`}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {"Entered By:"}
                            </Typography>
                            <Typography variant="body2" align="center">
                              {procedure.username}
                            </Typography>
                          </Grid>
                          {procedure.end_datetime !== null ? (
                            <Grid
                              item
                              xs={2}
                              className={classes.baseBorder}
                              style={{ backgroundColor: "#eeeeee" }}
                            >
                              <Typography
                                variant="body2"
                                align="center"
                                style={{ fontWeight: "bold" }}
                              >
                                {"Exit Date"}
                              </Typography>
                              <Typography variant="body2" align="center">
                                {formatDate(procedure.end_datetime)}
                              </Typography>
                            </Grid>
                          ) : (
                            <Grid
                              item
                              xs={2}
                              className={classes.baseBorder}
                              style={{ backgroundColor: "#eeeeee" }}
                            >
                              <Typography
                                variant="body2"
                                align="center"
                                style={{ fontWeight: "bold" }}
                              >
                                {"Estimated Exit Date:"}
                              </Typography>
                              <Typography variant="body2" align="center">
                                {addTime(
                                  procedure.start_datetime,
                                  procedure.duration
                                )}
                              </Typography>
                            </Grid>
                          )}
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {"Exit User"}
                            </Typography>
                            <Typography variant="body2" align="center">
                              {procedure.exit_user
                                ? procedure.exit_user
                                : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            className={classes.baseBorder}
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <Typography
                              variant="body2"
                              align="center"
                              style={{ fontWeight: "bold" }}
                            >
                              {" "}
                            </Typography>
                          </Grid>
                        </>
                      ) : null}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </Grid>
          </>
        )}
      <Dialog
        open={isHistoricModalOpen}
        onClose={() => {
          setIsHistoricModalOpen(false);
          setCurrentHistoricData(null);
        }}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"xl"}
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography variant="h4">Visualizer Modal</Typography>
        </DialogTitle>
        <DialogContent dividers={true}>
          <VisualizerModal
            historicData={currentHistoricData}
            unitData={units[0]}
            unitTypeData={travelerResults?.unit_type}
            closeHistoricModal={() => {
              setIsHistoricModalOpen(false);
              setCurrentHistoricData(null);
              queryClient.invalidateQueries("travelerResults");
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsHistoricModalOpen(false);
              setCurrentHistoricData(null);
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ImageListModal open={imageModal} setOpen={setImageModal} images={travelerResults.unit_images} />
    </Container>
  );
};
