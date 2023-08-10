import React from "react";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import PrintIcon from "@material-ui/icons/Print";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

import { useTravelerStyles } from "./TravelerStyles";
import Typography from "@material-ui/core/Typography";
import { ViewAddNoteList } from "../ViewAddNotes";
import { useAddNoteToUnit } from "../../projectManagement/projectManagementMutations";

export const TravelerNotes = ({ id, notes }: any) => {
  const classes = useTravelerStyles();
  const { mutateAsync: mutateAddNote } = useAddNoteToUnit();

  return (
    <Grid item xs={3}>
      <Grid container alignItems="center" direction="column" spacing={1}>
        <Grid item xs={12} />
        <Grid item xs={12}>
          <Tooltip title="View Notes">
            <ViewAddNoteList
              id={id}
              notes={notes}
              mutate={mutateAddNote}
              invalidate={"travelerResults"}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Tooltip title="View Images (WIP)">
            <Button
              style={{ textAlign: "center" }}
              variant="contained"
              disabled
              startIcon={<CameraAltIcon />}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Tooltip title="Copy to Clipboard">
            <CopyToClipboard
              text={``}
              onCopy={() => toast.success(`Copied Link to Clipboard.`)}
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
        <Grid item xs={12}>
          <Button
            style={{ textAlign: "center" }}
            variant="contained"
            disabled
            startIcon={<PrintIcon />}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
