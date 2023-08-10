import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CreateIcon from "@material-ui/icons/Create";
import { toast } from "react-toastify";

import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

import { useQueryClient } from "react-query";
import { useFetchContext } from "./FetchContext";
import { processErrorOnMutation } from "../../util/errorMessaging";

export const PostNewNote = ({ id, mutate, invalidate }: any) => {
  const { authAxios } = useFetchContext();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Button
        style={{ textAlign: "center" }}
        variant="contained"
        color="primary"
        onClick={handleClose}
        fullWidth={true}
        startIcon={<CreateIcon />}
      >
        Add Note
      </Button>
      <>
        <Formik
          initialValues={{
            subject: "",
            text: "",
          }}
          validationSchema={Yup.object({
            subject: Yup.string().required("Field must be required"),
            text: Yup.string().required("Field must be required"),
          })}
          onSubmit={async (values, { resetForm }) => {
            try {
              await mutate({
                authAxios,
                id: id,
                note: { subject: values.subject, text: values.text },
              });
              queryClient.invalidateQueries(invalidate);
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
                  <Field
                    name="text"
                    helperText={touched.text ? errors.text : ""}
                    error={touched.text && Boolean(errors.text)}
                    component={TextField}
                    data-testid="text"
                    label="Note Text"
                    placeholder="Add Your Note"
                    multiline
                    rows={8}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
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
