import React from "react";
import {
  Divider,
  Button,
  Tooltip,
  Paper,
  Grid,
  Typography,
  IconButton,
  Backdrop,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Fade,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FlagIcon from "@material-ui/icons/Flag";
import CloseIcon from "@material-ui/icons/Close";

import { toast } from "react-toastify";

import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

import RichTextEditor from "react-rte";

import { useQueryClient } from "react-query";
import { useFetchContext } from "../FetchContext";
import { processErrorOnMutation } from "../../../util/errorMessaging";
import { useLinkFileToNote } from "../CommonMutations";
import { usePostFile } from "../services/fileServices";
import { useAuthContext } from "../AuthContext";

import { ThreadedOwner } from "./threadedOwner";
import { ThreadedTaggedUsers } from "./threadedTaggedUsers";
import { ThreadedLabels } from "./threadedLabels";
import { ThreadedDisposition } from "./threadedDisposition";
import { ThreadedFileModal } from "./threadedFileModal";
import { ThreadedCreatedSuccessModal } from "./threadedCreatedSuccess";
import { useSubmitNote } from "../CommonMutations";
import ThreadedNoteType from "./threadedNoteType";

export const ThreadedCreator = ({
  id,
  mutationStatus,
  noteType,
  model,
  invalidate,
  typeable = true,
}: any) => {
  const [open, setOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [createdNote, setCreatedNote] = React.useState({});
  const { authAxios } = useFetchContext();
  const auth = useAuthContext();
  const queryClient = useQueryClient();

  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFile } = useLinkFileToNote();
  const { mutateAsync: mutate } = useSubmitNote();

  const [selectedNoteType, setSelectedNoteType] = React.useState<any>(1);
  const [text, setText] = React.useState(RichTextEditor.createEmptyValue());
  const [disposition, setDisposition] = React.useState({
    name: "Available",
    id: 16,
  });
  const [usedLabels, setUsedLabels] = React.useState<any[]>([]);
  const [owner, setOwner] = React.useState({
    username: auth.state.user,
    id: Number(auth.state.id),
  });
  const [taggedUsers, setTaggedUsers] = React.useState<any[]>([]);
  const [files, setFiles] = React.useState<any[]>([]);

  const [isLoading, setIsLoading] = React.useState<boolean>();

  const handleClose = () => {
    setOpen(!open);
  };

  const handleChange = (value: any) => {
    setText(value);
  };

  return (
    <>
      <ThreadedCreatedSuccessModal
        note={createdNote}
        open={successOpen}
        setOpen={setSuccessOpen}
      />
      <Tooltip title="Create Flag">
        <Button
          style={{ textAlign: "center" }}
          variant="contained"
          color="primary"
          onClick={handleClose}
          startIcon={<FlagIcon />}
          fullWidth
        ></Button>
      </Tooltip>
      <Formik
        initialValues={{
          subject: "",
        }}
        validationSchema={Yup.object({
          subject: Yup.string().required("Field must be required"),
        })}
        onSubmit={async (values, { resetForm }) => {
          setIsLoading(true);
          try {
            let newLabels = [];
            for (const label of usedLabels) {
              newLabels.push(label.id);
            }

            // let newLabels = [];
            // for (const label of usedLabels) {
            //   newLabels.push(label.id);
            // }

            let alertUsers = [];
            for (const user of taggedUsers) {
              alertUsers.push(user.id);
            }

            const newNote = await mutate({
              authAxios,
              id: id,
              model: model,
              subject: values.subject,
              text: text.toString("markdown"),
              note_type: selectedNoteType,
              owner: owner.id,
              disposition: disposition.id,
              labels: newLabels,
              groups: [],
              tagged_users: alertUsers,
            });
            setCreatedNote(newNote);
            let newFile = null;

            for (const file of files) {
              newFile = await mutatePostFile({ authAxios, file: file });
              await mutateLinkFile({
                authAxios,
                fileId: newFile.id,
                noteId: newNote.id,
              });
              toast.success(`File ${file.name} Uploaded.`);
            }

            for (const value in invalidate) {
              queryClient.invalidateQueries(invalidate[value]);
            }
            toast.success("Flag successfully created.");
            queryClient.invalidateQueries("tasks");
            queryClient.invalidateQueries("notes");
            queryClient.invalidateQueries("closedTasks");
            queryClient.invalidateQueries("closedFlags");
            queryClient.invalidateQueries("supportTickets");
            queryClient.invalidateQueries("travelerResults");
            queryClient.invalidateQueries("procedure_notes", {
              refetchInactive: true,
            });
            setSuccessOpen(true);
          } catch (err) {
            toast.error("Flag failed to be created");
            processErrorOnMutation(err);
          }
          handleClose();
          resetForm();
          setDisposition({ name: "", id: -1 });
          setUsedLabels([]);
          setOwner({ username: "", id: -1 });
          setTaggedUsers([]);
          setFiles([]);
          setText(RichTextEditor.createEmptyValue());
          setIsLoading(false);
        }}
      >
        {({ errors, touched, submitForm }: any) => {
          return (
            <Form>
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
                    spacing={1}
                  >
                    <Grid item xs={8}>
                      <Field
                        name="subject"
                        helperText={touched.subject ? errors.subject : ""}
                        error={touched.subject && Boolean(errors.subject)}
                        component={TextField}
                        data-testid="subject"
                        label="Note Subject"
                        placeholder="Add a Subject"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Fade
                        in={isLoading}
                        style={{ transitionDelay: isLoading ? "0ms" : "0ms" }}
                      >
                        <CircularProgress />
                      </Fade>
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
                    <Grid item xs={8} style={{ marginTop: "12px" }}>
                      <RichTextEditor
                        value={text}
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
                        {typeable && (
                          <Grid item xs={12}>
                            <ThreadedNoteType
                              noteType={selectedNoteType}
                              setNoteType={setSelectedNoteType}
                            />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <ThreadedOwner
                            owner={owner}
                            setOwner={setOwner}
                            isNew={true}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ThreadedTaggedUsers
                            taggedUsers={taggedUsers}
                            setTaggedUsers={setTaggedUsers}
                            isNew={true}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ThreadedLabels
                            usedLabels={usedLabels}
                            setUsedLabels={setUsedLabels}
                            isNew={true}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ThreadedDisposition
                            disposition={disposition}
                            setDisposition={setDisposition}
                            isNew={true}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ThreadedFileModal
                            files={files}
                            setFiles={setFiles}
                            isNew={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </DialogContent>
                <Divider variant="fullWidth" />
                <DialogActions>
                  <Button
                    disabled={!!isLoading}
                    onClick={handleClose}
                    color="primary"
                  >
                    Close
                  </Button>

                  <Button
                    disabled={!!isLoading}
                    color="secondary"
                    onClick={submitForm}
                  >
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
