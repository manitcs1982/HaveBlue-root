import React from "react";
import {
  Button,
  Grid,
  LinearProgress,
  useTheme,
  Slider,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { useImage, useView } from "./dataEgressQueries";
import { ErrorMessage } from "../common/ErrorMessage";
import { ImageDownloader } from "../common/ImageDownloader";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  getFirstStepResultByName,
  getAllStepResultsByName,
  getFirstMeasurementResultByName,
} from "./dataEgressUtil";
import { useDispositionsByName } from "../common/services/dispositionServices";
import { toast } from "react-toastify";
import { processErrorOnMutation } from "../../util/errorMessaging";
import { useAuthContext } from "../common/AuthContext";
import { useFetchContext } from "../common/FetchContext";
import { ThreadedCreator } from "../common/threadedViewer/threadedCreator";
import { useHistory } from "react-router-dom";
import {
  useRetestProcedure,
  useReviewProcedure,
  useAddNoteToResult,
} from "./dataEgressMutations";
import { useQueryClient } from "react-query";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { AssetNameViewer } from "../common/AssetNameViewer";
import {
  useTestPermissions,
  useTestPermissionsVerification,
} from "../projectManagement/projectQueries";
import { TravelerModalButton } from "./TravelerModalButton";
import { VisualizerNotesModal } from "./VisualizerNotesModal";

const degreeRotationMarks = [
  {
    value: -180,
    label: "-180°",
  },
  {
    value: -90,
    label: "-90°",
  },
  {
    value: 0,
    label: "0°",
  },
  {
    value: 90,
    label: "90°",
  },
  {
    value: 180,
    label: "180°",
  },
];

export const VisualInspectionReviewModal = ({
  id,
  disposition,
  name,
  dispositionPassedId,
  open_notes,
  has_notes,
}: any) => {
  const theme = useTheme();
  const history = useHistory();
  const { dispatch } = useAuthContext();
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [brightness, setBrightness] = React.useState<number | number[]>(100);
  const [contrast, setContrast] = React.useState<number | number[]>(100);
  const [rotate, setRotate] = React.useState<number | number[]>(0);
  const [currentDefect, setCurrentDefect] = React.useState<any>(null);
  const [defects, setDefects] = React.useState<any>(null);
  const [areNoDefectsObserved, setAreNoDefectsObserved] = React.useState(false);

  const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);
  const [currentImage, setCurrentImage] = React.useState<any>(null);
  const [confirmationDialogRetestOpen, setConfirmationDialogRetestOpen] =
    React.useState(false);
  const [confirmationDialogApproveOpen, setConfirmationDialogApproveOpen] =
    React.useState(false);

  const {
    data: rawImage,
    isLoading: isLoadingRawImage,
    isSuccess: isSuccessRawImage,
  } = useImage(currentImage);

  const {
    data: viewData,
    error: errorView,
    isLoading: isLoadingView,
    isSuccess: isSuccessLoadingView,
    isError: isErrorView,
  } = useView(id, open);

  const { data: permission, isLoading: isLoadingPermission } =
    useTestPermissionsVerification(id, open);

  const { mutateAsync: mutateRetestProcedure } = useRetestProcedure();
  const { mutateAsync: mutateReviewProcedure } = useReviewProcedure();
  const { mutateAsync: mutateNote } = useAddNoteToResult();

  const transformVisualInspectionValues = React.useCallback(
    (stepResultDefect: any) => {
      const nameMeasurement: any = getFirstMeasurementResultByName(
        stepResultDefect,
        "Visual Inspection Defect"
      );
      const observationMeasurement: any = getFirstMeasurementResultByName(
        stepResultDefect,
        "Visual Inspection Observation"
      );
      const imagesMeasurement: any = getFirstMeasurementResultByName(
        stepResultDefect,
        "Visual Inspection Photo"
      );

      if (
        !nameMeasurement?.result_defect_name &&
        !observationMeasurement?.result_string &&
        !imagesMeasurement?.result_files
      ) {
        return;
      }

      const name = nameMeasurement.result_defect_name;
      const observation = observationMeasurement.result_string;

      const images = imagesMeasurement.result_files;
      return { name, observation, images };
    },
    []
  );

  React.useEffect(() => {
    if (isSuccessLoadingView && viewData) {
      const inspectModuleStepResult = getFirstStepResultByName(
        viewData,
        "Inspect Module"
      );

      const noDefectsObserved = getFirstMeasurementResultByName(
        inspectModuleStepResult,
        "Defects Observed?"
      );

      if (noDefectsObserved && noDefectsObserved.result_boolean) {
        //No Defects Option chosen
        setAreNoDefectsObserved(true);
      } else if (viewData && !noDefectsObserved.result_boolean) {
        //Defects option chosen
        const allStepResultDefects = getAllStepResultsByName(
          viewData,
          "Record Visual Defect"
        );

        const defectsArray = allStepResultDefects.map(
          (stepResultDefect: any) => {
            return transformVisualInspectionValues(stepResultDefect);
          }
        );
        console.log("The defects Array", defectsArray);
        setDefects(defectsArray);
        setCurrentDefect(defectsArray[0]);
        setCurrentImage(defectsArray[0]?.images[0]);
      }
    }
  }, [isSuccessLoadingView, transformVisualInspectionValues, viewData]);

  if (isLoadingView || isLoadingRawImage || isLoadingPermission) {
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

  const renderImage = () => {
    if (isLoadingRawImage) {
      return (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <LinearProgress />
        </Grid>
      );
    } else if (currentImage && isSuccessRawImage && rawImage) {
      return (
        <>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Zoom>
              <img
                src={rawImage}
                alt={currentImage.alt}
                className="img"
                style={{
                  maxWidth: "30em",
                  maxHeight: "30em",
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                  transform: `rotate(${rotate}deg)`,
                }}
              />
            </Zoom>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <>
              <TextField
                id="standard-multiline-flexible"
                variant="outlined"
                multiline
                fullWidth
                rows={15}
                value={currentDefect.observation}
                disabled
              />
            </>
          </Grid>
        </>
      );
    }
  };

  const renderImageControls = () => {
    return (
      <>
        <Grid item xs={3}>
          <Typography id="non-linear-slider" gutterBottom>
            Brightness
          </Typography>
          <Slider
            defaultValue={30}
            aria-labelledby="discrete-slider-brightness"
            min={1}
            max={200}
            value={brightness}
            onChange={(e, value) => {
              setBrightness(value);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography id="non-linear-slider" gutterBottom>
            Contrast
          </Typography>
          <Slider
            defaultValue={30}
            aria-labelledby="discrete-slider-brightness"
            min={1}
            max={200}
            value={contrast}
            onChange={(e, value) => {
              setContrast(value);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography id="non-linear-slider" gutterBottom>
            Rotate
          </Typography>
          <Slider
            aria-labelledby="discrete-slider-rotate"
            min={-180}
            max={180}
            marks={degreeRotationMarks}
            value={rotate}
            step={90}
            onChange={(e, value) => {
              setRotate(value);
            }}
          />
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setBrightness(100);
              setContrast(100);
              setRotate(0);
            }}
          >
            Reset
          </Button>
        </Grid>
      </>
    );
  };

  const renderImageNavigationControls = () => {
    return (
      <>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Button
            disabled={currentImageIndex === 0}
            variant="contained"
            color="primary"
            onClick={() => {
              setCurrentImageIndex(0);
              setCurrentImage(currentDefect.images[0]);
            }}
          >
            Go to Start
          </Button>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={currentImageIndex === 0}
            onClick={() => {
              let newImageIndex = currentImageIndex - 1;
              if (newImageIndex < 0) newImageIndex = 0;
              setCurrentImageIndex(newImageIndex);
              setCurrentImage(currentDefect.images[newImageIndex]);
            }}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Button
            disabled={currentImageIndex === currentDefect.images.length - 1}
            variant="contained"
            color="primary"
            onClick={() => {
              let newImageIndex = currentImageIndex + 1;
              if (newImageIndex >= currentDefect.images.length)
                newImageIndex = currentDefect.images.length - 1;
              setCurrentImageIndex(newImageIndex);
              setCurrentImage(currentDefect.images[newImageIndex]);
            }}
          >
            Next
          </Button>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Button
            disabled={currentImageIndex === currentDefect.images.length - 1}
            variant="contained"
            color="primary"
            onClick={() => {
              let newImageIndex = currentDefect.images.length - 1;
              setCurrentImageIndex(newImageIndex);
              setCurrentImage(currentDefect.images[newImageIndex]);
            }}
          >
            Go Last
          </Button>
        </Grid>
      </>
    );
  };

  const submitVerification = async (result: boolean) => {
    if (result) {
      try {
        await mutateReviewProcedure({
          authAxios,
          disposition: dispositionPassedId,
          procedure_result: viewData.id,
        });
        toast.success("Visual Inspection Review Approved");
        setConfirmationDialogApproveOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while approving visual inspection");
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
        toast.success("Visual Inspection Review was send for retesting");
        setConfirmationDialogRetestOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while retesting visual inspection");
        processErrorOnMutation(error, dispatch, history);
        setConfirmationDialogRetestOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      }
    }
  };

  const renderDefectsView = () => {
    if (!areNoDefectsObserved) {
      return (
        <>
          {renderImage()}

          {currentDefect?.images?.length > 1 && renderImageControls()}

          {currentDefect?.images?.length > 1 && renderImageNavigationControls()}
        </>
      );
    } else {
      return (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="h1">No Defects Observed</Typography>
        </Grid>
      );
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
        type="visual_inspection"
      />

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
            spacing={2}
          >
            <Grid item xs={8}>
              <Typography variant="h6">
                {`Visual Inspection Review - ${name}`};
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
                name={`Visual Inspection Review - ${name}`}
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
            spacing={10}
          >
            <Grid item xs={6}>
              {defects && !areNoDefectsObserved && (
                <FormControl>
                  <InputLabel id="defect-list-select">Defect List</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currentDefect?.name}
                  >
                    {defects.map((defect: any) => (
                      <MenuItem
                        value={defect?.name}
                        onClick={() => {
                          setCurrentDefect(defect);
                          setCurrentImageIndex(0);
                          setCurrentImage(defect?.images[0]);
                        }}
                      >
                        {defect?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={2}>
              {defects && !areNoDefectsObserved && (
                <ImageDownloader
                  url={currentImage.file}
                  name={currentImage.name}
                  label="DOWNLOAD IMAGE"
                />
              )}
            </Grid>
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
            {renderDefectsView()}

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
          id="visual-inspection-retest"
          keepMounted
          open={confirmationDialogRetestOpen}
          title="Visual Inspection Retest Confirmation"
          content="Are you sure that you want to retest this Visual Inspection?"
          onCancel={() => setConfirmationDialogRetestOpen(false)}
          onSubmit={() => submitVerification(false)}
        />
        <ConfirmationDialog
          id="visual-inspection-approve"
          keepMounted
          open={confirmationDialogApproveOpen}
          title="Visual Inspection Approval Confirmation"
          content="Are you sure that you want to approve this Visual Inspection?"
          onCancel={() => setConfirmationDialogApproveOpen(false)}
          onSubmit={() => submitVerification(true)}
        />
      </Dialog>
    </>
  );
};
