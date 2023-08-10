import React from "react";
import { Typography, Grid, Divider, Button, Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import NoteIcon from "@material-ui/icons/Note";

import { toast } from "react-toastify";

import { TextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

import { useQueryClient } from "react-query";
import { useFetchContext } from "./FetchContext";
import { processErrorOnMutation } from "../../util/errorMessaging";
import { formatDate } from "./formatDate";
import { NoteList } from "./noteList";

export const NotePopup = ({ type, id, getNotes, open, setOpen, header }: any) => {
  const [read, setRead] = React.useState(false);
  const handleClose = () => {
    setRead(true);
    setOpen(!open);
  };



  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"md"}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
      >
        <DialogTitle>{`${header}`}</DialogTitle>
        <Divider variant="fullWidth" />
        <DialogTitle id="scroll-dialog-title">Attached Notes</DialogTitle>
        <DialogContent>
          <Divider variant="fullWidth" />
          <NoteList id={id} type={type} getNotes={getNotes} markRead={read} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Acknowledge
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
