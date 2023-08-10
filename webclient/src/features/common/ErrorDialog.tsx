import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { LSDBError } from "./ErrorHandlingContext";
import { Grid, TextField, Typography } from "@material-ui/core";

export const ErrorDialog = ({
  title,
  error,
  multipleError,
  onClose,
}: {
  title: string | null;
  error: string | null;
  multipleError: LSDBError[] | null;
  onClose: () => void;
}) => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [stringError, setStringError] = useState<any>();

  useEffect(() => {
    if (multipleError) {
      const multipleErrorString = multipleError
        .map((err) => err.error)
        .join("\n");
      const lines = multipleErrorString.split("\n");
      const widthLines = lines.reduce(
        (a, b) => (a < b.length ? b.length : a),
        100
      );
      setHeight(lines.length);
      setWidth(widthLines);
      setStringError(multipleErrorString);
    } else {
      setStringError(error);
    }
  }, [error, multipleError]);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth={true}
      maxWidth="md"
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={error !== null || multipleError !== null}
    >
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <DialogContent
        style={{
          height: height * 50 + "px",
        }}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography variant="body2">
              Something bad happened. The details of the error are below. Please
              copy them and send them to systems support.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="ErrorDialog-error"
              disabled
              multiline
              rows={multipleError ? multipleError?.length * 2 : 3}
              style={{
                height: height * 14 + "px",
                width: width + "ex",
              }}
              defaultValue={stringError}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
