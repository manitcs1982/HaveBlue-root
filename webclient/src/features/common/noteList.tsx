import React from "react";
import {
  Typography,
  Grid,
  Divider,
  Button,
  Tooltip,
  LinearProgress
} from "@material-ui/core";
import RichTextEditor from 'react-rte';
import { formatDate } from "./formatDate";
import { useFetchContext } from "./FetchContext";
import { useNoteRead } from "./CommonMutations";
import { toast } from "react-toastify";
import { ThreadedViewer } from "./threadedViewer/threadedViewer";
import { useNoteTypes } from "../projectManagement/projectQueries";
import { ErrorMessage } from "./ErrorMessage";

export const NoteList = ({id, type, getNotes, markRead} : any) => {
  const { authAxios } = useFetchContext();
  const { mutateAsync: mutateNoteRead } = useNoteRead();

  const [noteID, setNoteID] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const {
    error: errorNotes,
    data: notes,
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
  } = getNotes(id, type);

  const {
    data: noteTypesData = [],
    error: noteTypesError,
    isLoading: isLoadingNoteTypes,
    isError: isErrorNoteTypes,
  } = useNoteTypes("Threaded Notes");

  const isNoteType = (type : number) => {
    var isType = false
    for (const noteType of noteTypesData.results) {
      if (type === noteType.id) {
        isType = true
      }
    }
    return isType;
  }

  const readNote: (id : any) => Promise<void> = async (id : any) => {
    try {
      const data = await mutateNoteRead({
        authAxios,
        id,
      });
      toast.success(`Note \"${data.subject}\" was read at ${formatDate(data.read_datetime)}`)
    } catch (error) {
      toast.error(`Note not marked read: ${error}`)
    }
  }

  React.useEffect(() => {
    if (markRead) {
        notes.map((note : any) => {
          readNote(note.id);
        })
    }
  }, [markRead])

  if (
    isLoadingNotes ||
    isLoadingNoteTypes
  ) {
    return (
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
    );
  }

  if (isErrorNotes || isErrorNoteTypes) {
    return (
      <>
        {isErrorNotes && <ErrorMessage error={errorNotes} />}
        {isErrorNoteTypes && <ErrorMessage error={noteTypesError} />}
      </>
    );
  }

  return (
    <>
    {notes?.map((note: any) => (
      <>
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item xs={6} style={{ marginBottom: 4, marginTop: 8 }}>
            <Typography variant="body1" display="inline">
              <b>{note.subject}</b>
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ marginBottom: 4, marginTop: 8 }}>
            <Typography variant="body2" display="inline" align="right">
              From: {note.username}
            </Typography>
          </Grid>
          <Grid item xs={3} style={{ marginBottom: 4, marginTop: 8 }}>
            <Typography variant="body2" display="inline" align="right">
              At: {formatDate(note.datetime)}
            </Typography>
          </Grid>
          { isNoteType(note.note_type) ? (
            <Grid item xs={1} style={{ marginBottom: 4, marginTop: 8 }}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => {
                setNoteID(note.id);
                setOpen(true);
              }}
            >
              {note.id}
            </Button>
            </Grid>
          ) : null
          }
          <Grid item xs={12} style={{ marginBottom: 12 }}>
            <RichTextEditor
              value={RichTextEditor.createValueFromString(note.text, 'markdown')}
              readOnly={true}
            />
          </Grid>
        </Grid>
        <Divider variant="fullWidth" />
      </>
    ))}
    <ThreadedViewer id={noteID} open={open} setOpen={setOpen} />
    </>
  )
}
