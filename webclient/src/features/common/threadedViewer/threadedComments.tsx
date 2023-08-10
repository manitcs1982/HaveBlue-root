import React from "react";
import {
  Typography,
  Grid,
  Divider,
  Button,
  Tooltip,
  LinearProgress
} from "@material-ui/core";

import InfoIcon from '@material-ui/icons/Info';
import RichTextEditor from 'react-rte';

import { formatDate } from "../formatDate";

export const ThreadedComments = ({note, comments} : any) => {

  const printNote = (note : any) => {
    if (note.note_type_name === "Note") {
      return(
        <>
        <Grid item xs={1} />
        <Grid item xs={2} style={{ marginBottom: 4}}>
          <Typography variant="body2" display="inline" align="right">
            From: {note.username}
          </Typography>
        </Grid>
        <Grid item xs={2} style={{ marginBottom: 4}}>
          <Typography variant="body2" display="inline" align="right">
            At: {formatDate(note.datetime)}
          </Typography>
        </Grid>
        <Grid item xs={7} />
          <Grid item xs={1} />
          <Grid item xs={11} style={{ marginBottom: 4 }}>
          <RichTextEditor
            value={RichTextEditor.createValueFromString(note.text, 'markdown')}
            readOnly={true}
          />
          </Grid>
        </>
      )
    } else if (note.note_type_name === "SystemLog") {
      return(
        <>
          <Grid item xs={1} />
          <Grid item xs={1}>
            <InfoIcon />
          </Grid>
          <Grid item xs={10} style={{ marginBottom: 4, marginTop: 4 }}>
            <Typography variant="body2" display="inline">
              <i>{`${note.text} by ${note.username} at ${formatDate(note.datetime)}`}</i>
            </Typography>
          </Grid>
        </>
      )
    }
  }

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={9}>
          <Typography variant="h6">
            {note !== undefined ? note.subject : "No note"}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2">
            {`User: ${note.username}`}
          </Typography>
          <Typography variant="body2">
            {`Date: ${formatDate(note.datetime)}`}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "12px"}}>
          <RichTextEditor
            value={RichTextEditor.createValueFromString(note.text, 'markdown')}
            readOnly={true}
          />
        </Grid>
        {comments?.map((note: any) => (
          <>
            {printNote(note)}
          </>
        ))}
      </Grid>
    </>
  )
}
