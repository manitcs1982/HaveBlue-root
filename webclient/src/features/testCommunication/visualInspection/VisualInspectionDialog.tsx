import React from "react";
import { Grid, Typography, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useVisualInspectionDetailsContext } from "../../common/VisualInspectionContext";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { DropzoneArea } from "material-ui-dropzone";
import { toast } from "react-toastify";

export const VisualInspectionDialog = ({
  defectId,
  setDefectId,
  isOpen,
  setOpen,
}: any) => {
  const { state, dispatch } = useVisualInspectionDetailsContext();
  const [observation, setObservation] = React.useState<any>("");
  const [files, setFiles] = React.useState<any>([]);

  React.useEffect(() => {
    if (state.defects.has(defectId)) {
      const currentDefect = state.defects.get(defectId);
      setFiles(currentDefect?.images);
      setObservation(currentDefect?.observation);
    }
  }, [defectId, files, state.defects]);

  const saveObservation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObservation(e.target.value);
  };

  const saveFiles = (files: any) => {
    setFiles(files);
  };

  const handleClose = () => {
    setOpen(false);
    cleanup();
  };

  const cleanup = () => {
    setDefectId("");
    setObservation("");
    setFiles([]);
  };

  const saveDefect = () => {
    if (observation === "" || files.length === 0) {
      toast.error("Observation and files are mandatory for saving a defect.");
      return;
    }
    dispatch({
      type: "DEFECT_CREATED",
      payload: {
        defectId: defectId,
        defect: { observation, images: files },
      },
    });
    cleanup();
    setOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography variant="h4">Observation</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="standard-multiline-flexible"
              variant="outlined"
              multiline
              fullWidth
              rows={4}
              inputProps={
                {
                  // maxLength: 32,
                }
              }
              value={observation}
              onChange={saveObservation}
              placeholder="Please include as much detail about the observed defect as possible including measurements where applicable."
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Add Photo</Typography>
          </Grid>
          <Grid item xs={12}>
            <DropzoneArea
              key={defectId}
              initialFiles={files}
              acceptedFiles={["image/*"]}
              filesLimit={
                process.env.REACT_APP_FILE_LIMIT
                  ? parseInt(process.env.REACT_APP_FILE_LIMIT)
                  : 20
              }
              maxFileSize={12000000}
              onChange={saveFiles}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={saveDefect}
          color="primary"
          disabled={observation === "" || files.length === 0}
        >
          Done
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
