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
  TextField,
  IconButton,
} from "@material-ui/core";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import CameraIcon from "@material-ui/icons/Camera";
import CloseIcon from "@material-ui/icons/Close";

import { useImage, useView } from "./dataEgressQueries";
import { useAddNoteToResult } from "./dataEgressMutations";
import { ErrorMessage } from "../common/ErrorMessage";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import camelCase from "lodash/camelCase";
import { useDispositionsByName } from "../common/services/dispositionServices";
import { ImageDownloader } from "../common/ImageDownloader";
import { toast } from "react-toastify";
import { processErrorOnMutation } from "../../util/errorMessaging";
import { useAuthContext } from "../common/AuthContext";
import { useFetchContext } from "../common/FetchContext";
import { ThreadedCreator } from "../common/threadedViewer/threadedCreator";
import { useHistory } from "react-router-dom";
import { useRetestProcedure, useReviewProcedure } from "./dataEgressMutations";
import { useQueryClient } from "react-query";
import { getDataFromMeasurementResults } from "../../util/searchData";
import { EL_IMAGE_REVIEW_TEST_UNITS as ELImageReviewTestUnits } from "../../util/constants";
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

export const ELImageReviewModal = ({
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
  const [ELImageReviewValues, setELImageReviewValues] =
    React.useState<any>(null);

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

  const handleClose = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    if (isSuccessLoadingView && viewData) {
      const results = getDataFromMeasurementResults(
        viewData,
        ELImageReviewTestUnits
      );

      const transformedResults = results.reduce((accum, iterator) => {
        if (
          iterator.name === "EL Image (grayscale)" ||
          iterator.name === "EL Image (raw)"
        ) {
          if (!accum.images) {
            accum = { ...accum, images: [iterator.result] };
          } else {
            accum = { ...accum, images: [...accum.images, iterator.result] };
          }
        } else {
          accum = { ...accum, [camelCase(iterator.name)]: iterator.result };
        }
        return accum;
      }, {});
      if (
        transformedResults &&
        transformedResults.images[0] &&
        transformedResults.images[0].name === "EL Image (grayscale)"
      ) {
        const temp = transformedResults.images[0];
        transformedResults.images[0] = transformedResults.images[1];
        transformedResults.images[1] = temp;
      }
      setELImageReviewValues(transformedResults);
      setCurrentImage(transformedResults.images[0]);
    }
  }, [isSuccessLoadingView, viewData]);

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
        </>
      );
    } else if (
      currentImage === undefined ||
      currentImage === null ||
      currentImage === "N/A"
    ) {
      return (
        <>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Typography variant="h3">N/A</Typography>
          </Grid>
        </>
      );
    }
  };

  const renderELReviewValues = () => {
    return (
      <>
        <Grid item xs={6} style={{ textAlign: "center" }}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={4}
          >
            <Grid item xs={6}>
              <TextField
                id="exposure-count"
                variant="outlined"
                fullWidth
                value={
                  ELImageReviewValues?.exposureCount !== null
                    ? ELImageReviewValues?.exposureCount
                    : "N/A"
                }
                InputLabelProps={{ shrink: true }}
                label="Exposure Count"
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="iso"
                variant="outlined"
                fullWidth
                value={
                  ELImageReviewValues?.iso !== null
                    ? ELImageReviewValues?.iso
                    : "N/A"
                }
                InputLabelProps={{ shrink: true }}
                label="ISO"
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="aperture"
                variant="outlined"
                fullWidth
                value={
                  ELImageReviewValues?.aperture !== null
                    ? ELImageReviewValues?.aperture
                    : "N/A"
                }
                InputLabelProps={{ shrink: true }}
                label="Aperture"
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="injection-current"
                variant="outlined"
                fullWidth
                value={
                  ELImageReviewValues?.injectionCurrent !== null
                    ? ELImageReviewValues?.injectionCurrent
                    : "N/A"
                }
                InputLabelProps={{ shrink: true }}
                label="Injection Current"
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="exposure_time"
                variant="outlined"
                fullWidth
                value={
                  ELImageReviewValues?.exposureTime !== null
                    ? ELImageReviewValues?.exposureTime
                    : "N/A"
                }
                InputLabelProps={{ shrink: true }}
                label="Exposure Time"
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
      </>
    );
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
              setCurrentImage(ELImageReviewValues?.images[0]);
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
              setCurrentImage(ELImageReviewValues?.images[newImageIndex]);
            }}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Button
            disabled={
              currentImageIndex === ELImageReviewValues?.images.length - 1
            }
            variant="contained"
            color="primary"
            onClick={() => {
              let newImageIndex = currentImageIndex + 1;
              if (newImageIndex >= ELImageReviewValues?.images.length)
                newImageIndex = ELImageReviewValues?.images.length - 1;
              setCurrentImageIndex(newImageIndex);
              setCurrentImage(ELImageReviewValues?.images[newImageIndex]);
            }}
          >
            Next
          </Button>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Button
            disabled={
              currentImageIndex === ELImageReviewValues?.images.length - 1
            }
            variant="contained"
            color="primary"
            onClick={() => {
              let newImageIndex = ELImageReviewValues?.images.length - 1;
              setCurrentImageIndex(newImageIndex);
              setCurrentImage(ELImageReviewValues?.images[newImageIndex]);
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
        toast.success("EL Image Review Approved");
        setConfirmationDialogApproveOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while approving EL Image");
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
        toast.success("EL Image Review was send for retesting");
        setConfirmationDialogRetestOpen(false);
        setOpen(false);
        queryClient.invalidateQueries("verify_data");
        queryClient.invalidateQueries("travelerResults");
      } catch (error) {
        toast.error("Error while retesting EL Image");
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
        type="el"
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
                {`EL Image Review - ${name}`}
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
                name={`EL Image Review - ${name}`}
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
              <Typography variant="h6">{currentImage?.name}</Typography>
            </Grid>
            <Grid item xs={2}>
              <ImageDownloader
                url={currentImage?.file}
                name={currentImage?.name}
                label="DOWNLOAD IMAGE"
                disabled={isLoadingRawImage}
              />
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
            {renderImage()}
            {renderELReviewValues()}
            <Grid item xs={9} />
            <Grid item xs={3}>
              <AssetNameViewer procedureResults={viewData} />
            </Grid>
            {renderImageControls()}
            {renderImageNavigationControls()}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
        <ConfirmationDialog
          id="el-review-retest"
          keepMounted
          open={confirmationDialogRetestOpen}
          title="EL Image Retest Confirmation"
          content="Are you sure that you want to retest this EL Review?"
          onCancel={() => setConfirmationDialogRetestOpen(false)}
          onSubmit={() => submitVerification(false)}
        />
        <ConfirmationDialog
          id="el-review-approve"
          keepMounted
          open={confirmationDialogApproveOpen}
          title="EL Review Approval Confirmation"
          content="Are you sure that you want to approve this EL Review?"
          onCancel={() => setConfirmationDialogApproveOpen(false)}
          onSubmit={() => submitVerification(true)}
        />
      </Dialog>
    </>
  );
};
