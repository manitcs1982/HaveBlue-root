import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreateIcon from '@material-ui/icons/Create';

import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import RichTextEditor from 'react-rte';


export const AddNewNote = ({notes, addNote} : any) => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(RichTextEditor.createEmptyValue());

  const handleClose = () => {
      setOpen(!open);
  }

  const handleChange = (value : any) => {
    setText(value);
  }

  return(
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
         text: ""
       }}
       validationSchema={Yup.object({
         subject: Yup.string().required("Field must be required"),
         //text: Yup.string().required("Field must be required"),
       })}
       onSubmit={async (values, {resetForm}) => {
         var note = {subject: values.subject, text: text};
         var tempNotes = [...notes, note];
         addNote(tempNotes);
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
             <RichTextEditor
               value={text}
               onChange={handleChange}
               toolbarConfig={{
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
                 ]}}
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
}
