import React from "react";
import {
  Divider,
  Button,
  Grid,
  Typography,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import AttachFileIcon from '@material-ui/icons/AttachFile';

import { toast } from "react-toastify";

import RichTextEditor from "react-rte";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useQueryClient } from "react-query";
import { useFetchContext } from "../FetchContext";
import { useNote, useComments } from "../CommonQueries";
import { useSubmitComment, useUpdateNote } from "../CommonMutations";

import { ThreadedComments } from "./threadedComments";
import { ThreadedOwner } from "./threadedOwner";
import { ThreadedTaggedUsers } from "./threadedTaggedUsers";
import { ThreadedLabels } from "./threadedLabels";
import { ThreadedDisposition } from "./threadedDisposition";
import { ThreadedFileModal } from "./threadedFileModal";
import { ThreadedFileViewModal } from "./threadedFileViewer";
import { ThreadedAttached } from "./threadedAttached";
import ThreadedNoteType from "./threadedNoteType";

export const ThreadedViewer = ({ id, open, setOpen, showID }: any) => {
  const [openComment, setOpenComment] = React.useState(false);

  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = React.useState(
    RichTextEditor.createEmptyValue()
  );

  const { mutateAsync: mutateSubmitComment } = useSubmitComment();
  const { mutateAsync: mutateNote } = useUpdateNote();

  const [disposition, setDisposition] = React.useState({ name: "", id: -1 });
  const [usedLabels, setUsedLabels] = React.useState<any[]>([]);
  const [owner, setOwner] = React.useState({ username: "", id: -1 });
  const [taggedUsers, setTaggedUsers] = React.useState<any[]>([]);
  const [files, setFiles] = React.useState<any[]>([]);
  const [selectedNoteType, setSelectedNoteType] = React.useState(0);

  const {
    data: note,
    isError: isErrorNote,
    isLoading: isLoadingNote,
    error: errorNote,
    isSuccess: isSuccessNote,
  } = useNote(id);

  const {
    data: comments,
    isError: isErrorComments,
    isLoading: isLoadingComments,
    error: errorComments,
  } = useComments(id);

  const resetState = React.useCallback(() => {
    setDisposition({ name: note.disposition_name, id: note.disposition });
    setUsedLabels(note.labels);
    setOwner({ username: note.owner_name, id: note.owner });
    setTaggedUsers(note.tagged_users);
    setFiles(note.attachments);
    setSelectedNoteType(note.note_type);
  }, [
    note?.attachments,
    note?.disposition,
    note?.disposition_name,
    note?.labels,
    note?.note_type,
    note?.owner,
    note?.owner_name,
    note?.tagged_users,
  ]);

  React.useEffect(() => {
    if (note) {
      resetState();
    }
  }, [note, resetState]);

  React.useEffect(() => {
    if (
      note &&
      (owner.id !== note.owner ||
        disposition.id !== note.disposition ||
        selectedNoteType !== note.note_type)
    ) {
      setOpenComment(true);
    } else {
      setOpenComment(false);
    }
  }, [owner, disposition, selectedNoteType]);

  const addComment = async () => {
    if (newComment.toString("html") !== "") {
      try {
        await mutateSubmitComment({
          authAxios,
          subject: `Note Id: ${note.id} \n Parent Note Type: ${note.note_type_name} \n Comment`,
          text: newComment.toString("markdown"),
          note_type: 1,
          parent_note: note.id,
        });
        toast.success("Comment Added.");
        queryClient.invalidateQueries([note.id, "comments"]);
      } catch (error) {
        toast.error(`Comment failed to add: ${error}.`);
      }
    } else {
      toast.error("Comment field is empty.");
    }

    setNewComment(RichTextEditor.createEmptyValue());
    setOpenComment(false);
  };

  const handleChange = (value: any) => {
    setNewComment(value);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const renderWarn = () => {
    if (
      (owner.id !== note.owner ||
        disposition.id !== note.disposition ||
        selectedNoteType !== note.note_type) &&
      newComment.toString("markdown").length < 9
    ) {
      return (
        <Grid item xs={12} style={{ margin: 12 }}>
          <Typography variant="body2" display="inline">
            <b>
              The changes you are attempting to make require a comment of at
              least 7 characters.
            </b>
          </Typography>
        </Grid>
      );
    }
  };

  const renderUpdate = () => {
    if (
      disposition.id !== note.disposition ||
      usedLabels !== note.labels ||
      owner.id !== note.owner ||
      taggedUsers !== note.tagged_users ||
      selectedNoteType !== note.note_type ||
      newComment.toString("markdown").length > 2
    ) {
      if (
        (owner.id !== note.owner ||
          disposition.id !== note.disposition ||
          selectedNoteType !== note.note_type) &&
        newComment.toString("markdown").length < 9
      ) {
        return <Button disabled>Update</Button>;
      } else {
        return (
          <Button onClick={updateNote} color="primary">
            Update
          </Button>
        );
      }
    } else {
      return <Button disabled>Update</Button>;
    }
  };

  const renderComment = () => {
    if (openComment) {
      return (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid xs={9} item>
            <RichTextEditor
              value={newComment}
              onChange={handleChange}
              toolbarConfig={{
                display: [
                  "INLINE_STYLE_BUTTONS",
                  "BLOCK_TYPE_BUTTONS",
                  "BLOCK_TYPE_DROPDOWN",
                  "HISTORY_BUTTONS",
                ],
                INLINE_STYLE_BUTTONS: [
                  { label: "Bold", style: "BOLD" },
                  { label: "Italic", style: "ITALIC" },
                  { label: "Strikethrough", style: "STRIKETHROUGH" },
                  { label: "Monospace", style: "CODE" },
                  { label: "Underline", style: "UNDERLINE" },
                ],
                BLOCK_TYPE_DROPDOWN: [
                  { label: "Normal", style: "unstyled" },
                  { label: "Heading Large", style: "header-one" },
                  { label: "Heading Medium", style: "header-two" },
                  { label: "Heading Small", style: "header-three" },
                ],
                BLOCK_TYPE_BUTTONS: [
                  { label: "UL", style: "unordered-list-item" },
                  { label: "OL", style: "ordered-list-item" },
                  { label: "Blockquote", style: "blockquote" },
                ],
              }}
            />
          </Grid>
          {owner.id !== note.owner ||
          disposition.id !== note.disposition ||
          selectedNoteType !== note.note_type ? null : (
            <>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setNewComment(RichTextEditor.createEmptyValue());
                    setOpenComment(false);
                  }}
                >
                  CLEAR
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      );
    } else {
      return null;
    }
  };

  const updateNote = async () => {
    try {
      let newLabels = [];
      for (const label of usedLabels) {
        newLabels.push(label.id);
      }

      let alertUsers = [];
      for (const user of taggedUsers) {
        alertUsers.push(user.id);
      }

      if (
        owner.id !== note.owner ||
        disposition.id !== note.disposition ||
        selectedNoteType !== note.note_type ||
        newComment.toString("markdown").length > 2
      ) {
        await mutateNote({
          authAxios,
          id: id,
          owner: owner.id,
          disposition: disposition.id,
          labels: newLabels,
          tagged_users: alertUsers,
          note_type: selectedNoteType,
          comment: {
            text: newComment.toString("markdown"),
            subject: `Note Id: ${note.id} \n Parent Note Type: ${note.note_type_name} \n Comment`,
            note_type: 1,
            parent_note: note.id,
          },
        });
        setNewComment(RichTextEditor.createEmptyValue());
        setOpenComment(false);
      } else {
        await mutateNote({
          authAxios,
          id: id,
          owner: owner.id,
          disposition: disposition.id,
          labels: newLabels,
          tagged_users: alertUsers,
          note_type: selectedNoteType,
          comment: null,
        });
      }

      toast.success("Flag updated.");
    } catch (error) {
      resetState();
      toast.error(`Error occured while updating: ${error}`);
    }
  };

  if (isLoadingNote) {
    return (
      <Dialog
        open={isLoadingNote}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle id="scroll-dialog-title">Loading</DialogTitle>
        <DialogContent>
          <LinearProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"lg"}
        disableBackdropClick
      >
        <DialogTitle id="scroll-dialog-title">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={7}>
              <Typography variant="h6">{note?.note_type_name}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" display="inline">
                Note ID:
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <CopyToClipboard
                text={
                  note?.note_type === 8
                    ? `https://lsdb.pvel.com/operations_management/ops_agenda/${note?.id}`
                    : `https://lsdb.pvel.com/engineering/engineering_agenda/${note?.id}`
                }
                onCopy={() => toast.success(`Copied Link to Clipboard.`)}
              >
                <Button
                  style={{ textAlign: "center" }}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {note?.id}
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid item xs={1}>
              {files && files.length > 0 ? (
                <ThreadedFileViewModal files={files} locale={"top"} />
              ) : null}
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Divider variant="fullWidth" />
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item xs={9}>
              <>
                <ThreadedComments note={note} comments={comments} />
                {renderWarn()}
                {renderComment()}
              </>
            </Grid>
            <Grid
              item
              xs={3}
              style={{
                borderLeftStyle: "solid",
                borderWidth: "2px",
              }}
            >
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                spacing={1}
              >
                <Grid item xs={12}>
                  <ThreadedAttached attached={note.parent_objects} />
                </Grid>
                <Grid item xs={12}>
                  <ThreadedNoteType
                    noteType={selectedNoteType}
                    setNoteType={setSelectedNoteType}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ThreadedOwner
                    owner={owner}
                    setOwner={setOwner}
                    isNew={false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ThreadedTaggedUsers
                    taggedUsers={taggedUsers}
                    setTaggedUsers={setTaggedUsers}
                    isNew={false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ThreadedLabels
                    usedLabels={usedLabels}
                    setUsedLabels={setUsedLabels}
                    isNew={false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ThreadedDisposition
                    disposition={disposition}
                    setDisposition={setDisposition}
                    isNew={false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="stretch"
                    spacing={1}
                  >
                    <Grid item xs={6}>
                      <ThreadedFileModal
                        files={files}
                        setFiles={setFiles}
                        isNew={false}
                        noteid={note.id}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {files && files.length > 0 ? (
                        <ThreadedFileViewModal files={files} />
                      ) : (
                        <Button
                          disabled
                          variant="contained"
                          fullWidth
                        >
                          <AttachFileIcon />
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider variant="fullWidth" />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          {openComment ? (
            <Button
              disabled
            >
              Comment
            </Button>
          ) : (
            <Button
              color="secondary"
              onClick={() => {
                setOpenComment(!openComment);
              }}
            >
              Comment
            </Button>
          )}
          {renderUpdate()}
        </DialogActions>
      </Dialog>
    </div>
  );
};
