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
  Link,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FlagIcon from "@material-ui/icons/Flag";
import CloseIcon from "@material-ui/icons/Close";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useEmailNote } from "../CommonQueries";

export const ThreadedCreatedSuccessModal = ({note, open, setOpen}: any) => {

  const { data, isError, isLoading, isFetching, error, refetch } = useEmailNote(note.id);

  const sendEmail = async () => {
    await refetch();
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(!open)}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth={true}
      maxWidth={"lg"}
    >
      <DialogTitle id="scroll-dialog-title">
        Ticket
        {
          <CopyToClipboard
            text={
              note?.note_type === 8
                ? `https://lsdb.pvel.com/operations_management/ops_agenda/${note?.id}`
                : `https://lsdb.pvel.com/engineering/engineering_agenda/${note?.id}`
            }
            onCopy={() => toast.success(`Copied Link to Clipboard.`)}
          >
            <Button
              style={{ textAlign: "center", margin: "5px" }}
              variant="contained"
              color="primary"
            >
              {note?.id}
            </Button>
          </CopyToClipboard>
        }
        Successfully Created
      </DialogTitle>
      <Divider variant="fullWidth" />
      <DialogContent>
      <Typography variant="body2" display="inline">
        Your ticket has been successfully created! You can press the button above to copy a link to it, or click {<Link underline="hover" onClick={() => sendEmail()}>here</Link>} to have it emailed to you.
      </Typography>
      </DialogContent>
      <Divider variant="fullWidth" />
      <DialogActions>
        <Button
          onClick={() => setOpen(!open)}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
