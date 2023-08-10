import React from "react";
import { Grid, Typography, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { DropzoneArea } from "material-ui-dropzone";
import { toast } from "react-toastify";

export const FlashFileModal = ({ fileArray, setFiles, open, setOpen }: any) => {
  const saveFiles = (files: any) => {
    setFiles(files);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(!open);
      }}
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
            <Typography variant="h4">Add Files</Typography>
          </Grid>
          <Grid item xs={12}>
            <DropzoneArea
              initialFiles={fileArray}
              acceptedFiles={[".xls", ".txt", ".mfr", ".csv"]}
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
          onClick={() => {
            setOpen(!open);
          }}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
