import React from "react";
import { Divider, Button, Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import NoteIcon from "@material-ui/icons/Note";

import { toast } from "react-toastify";

import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import RichTextEditor from "react-rte";

import { useQueryClient } from "react-query";
import { useFetchContext } from "./FetchContext";
import { processErrorOnMutation } from "../../util/errorMessaging";
import { NoteList } from "./noteList";
import { useSubmitNote } from "./CommonMutations";

export const ViewAddNoteList = ({
  count,
  type,
  id,
  unreadNotes,
  invalidate,
  getNotes,
  model,
}: any) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <div>
      {count > 0 ? (
        <Tooltip title="View Notes">
          <Button
            style={{ textAlign: "center" }}
            variant="contained"
            color="primary"
            onClick={handleClose}
            startIcon={<NoteIcon />}
            fullWidth
          >
            {unreadNotes}
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="View Notes">
          <Button
            style={{ textAlign: "center" }}
            variant="contained"
            color="inherit"
            onClick={handleClose}
            startIcon={<NoteIcon />}
            fullWidth
          >
            {unreadNotes}
          </Button>
        </Tooltip>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle id="scroll-dialog-title">Attached Notes</DialogTitle>
        <DialogContent>
          <Divider variant="fullWidth" />
          <NoteList id={id} type={type} getNotes={getNotes} markRead={false} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <PostNewNote
            id={id}
            type={type}
            invalidate={invalidate}
            model={model}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

const PostNewNote = ({ id, type, model, invalidate }: any) => {
  const { authAxios } = useFetchContext();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [text, setText] = React.useState(RichTextEditor.createEmptyValue());
  const { mutateAsync: mutate } = useSubmitNote();

  const handleClose = () => {
    setOpen(!open);
  };

  const handleChange = (value: any) => {
    setText(value);
  };

  return (
    <div>
      <Button
        style={{ textAlign: "center" }}
        color="primary"
        onClick={handleClose}
      >
        Add Note
      </Button>
      <>
        <Formik
          initialValues={{
            subject: "",
            //text: "",
          }}
          validationSchema={Yup.object({
            subject: Yup.string().required("Field must be required"),
            //text: Yup.string().required("Field must be required"),
          })}
          onSubmit={async (values, { resetForm }) => {
            try {
              console.log(model)
              await mutate({
                authAxios,
                id: id,
                model: model,
                subject: values.subject,
                text: text.toString("markdown"),
                note_type: type,
                owner: 0,
                disposition: 0,
                labels: [],
                groups: [],
                tagged_users: [],
              });
              for (const value in invalidate) {
                queryClient.invalidateQueries(invalidate[value]);
              }
            } catch (err) {
              toast.error("Note failed to be added");
              processErrorOnMutation(err);
            }
            toast.success("Note successfully added.");
            handleClose();
            resetForm();
          }}
        >
          {({ errors, touched, submitForm }) => (
            <Form>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth={true}
                maxWidth={"md"}
              >
                <DialogTitle id="scroll-dialog-title">
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
                </DialogTitle>
                <DialogContent dividers={true}>
                  <RichTextEditor value={text} onChange={handleChange} toolbarConfig={{
                    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
                    INLINE_STYLE_BUTTONS: [
                      {label: 'Bold', style: 'BOLD'},
                      {label: 'Italic', style: 'ITALIC'},
                      {label: 'Strikethrough', style: 'STRIKETHROUGH'},
                      {label: 'Monospace', style: 'CODE'},
                      {label: 'Underline', style: 'UNDERLINE'},
                    ],
                    BLOCK_TYPE_DROPDOWN: [
                      {label: 'Normal', style: 'unstyled'},
                      {label: 'Heading Large', style: 'header-one'},
                      {label: 'Heading Medium', style: 'header-two'},
                      {label: 'Heading Small', style: 'header-three'}
                    ],
                    BLOCK_TYPE_BUTTONS: [
                      {label: 'UL', style: 'unordered-list-item'},
                      {label: 'OL', style: 'ordered-list-item'},
                      {label: 'Blockquote', style: 'blockquote'},
                    ]}} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Close
                  </Button>
                  <Button onClick={submitForm} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </Form>
          )}
        </Formik>
      </>
    </div>
  );
};
