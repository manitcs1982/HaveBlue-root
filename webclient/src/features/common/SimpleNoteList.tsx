import React from "react";
import {
  Typography,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import RichTextEditor from "react-rte";
import { formatDate } from "./formatDate";
import { ThreadedViewer } from "./threadedViewer/threadedViewer";

export const SimpleNoteList = ({ notes }: any) => {
  const [currentNoteId, setCurrentNoteId] = React.useState(null);

  const openSimpleNoteListModal = (value: boolean) => {
    if (!value) {
      setCurrentNoteId(null);
    } else {
      setCurrentNoteId(currentNoteId);
    }
  };

  return (
    <>
      {notes?.map((note: any) => (
        <>
          <Grid container direction="row" alignItems="flex-start" spacing={2}>
            <Grid item xs={2} style={{ marginBottom: 4, marginTop: 8 }}>
              <Typography variant="body1" display="inline">
                <b>{note.subject}</b>
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ marginBottom: 4, marginTop: 8 }}>
              <Typography variant="body2" display="inline" align="right">
                <b>From: {note.username}</b>
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ marginBottom: 4, marginTop: 8 }}>
              <Typography variant="body2" display="inline" align="right">
                <b>Type: {note.note_type_name}</b>
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ marginBottom: 4, marginTop: 8 }}>
              <Typography variant="body2" display="inline" align="right">
                <b>Status: {note.disposition_name}</b>
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ marginBottom: 4, marginTop: 8 }}>
              <Typography variant="body2" display="inline" align="right">
                <b>At: {formatDate(note.datetime)}</b>
              </Typography>
            </Grid>
            <Grid item xs={11} style={{ marginBottom: 12 }}>
              <RichTextEditor
                value={RichTextEditor.createValueFromString(
                  note.text,
                  "markdown"
                )}
                readOnly={true}
              />
            </Grid>
            <Grid item xs={1} style={{ marginBottom: 12 }}>
              <Tooltip title="Edit Flag">
                <IconButton
                  onClick={() => setCurrentNoteId(note.id)}
                  aria-label="edit-flag"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Divider variant="fullWidth" />
        </>
      ))}
      <ThreadedViewer
        id={currentNoteId}
        open={currentNoteId !== null}
        setOpen={openSimpleNoteListModal}
      />
    </>
  );
};
