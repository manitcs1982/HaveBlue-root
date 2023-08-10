import React from "react";
import {
  Grid,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Divider
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { toast } from "react-toastify";
import { processErrorOnMutation } from "../../../../../../util/errorMessaging";

export const CompleteActionModal = ({id, mutate, payload, open, setOpen} : any ) => {
  const [description, setDescription] = React.useState("");

  const handleChange = (event : any) => {
    setDescription(event.target.value);
  };

  const handleClose = () => {
    setOpen(!open);
    setDescription("");
  }

  const submit = async() => {
    console.log(mutate)
    try {
      let toSubmit = { id: id, ...payload, description: description}
      await mutate(toSubmit)
      toast.success("Action successfully marked")
    } catch (error) {
      toast.error("Error while updating Action");
      processErrorOnMutation(error);
    }
  }

  return(
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography variant="h4">
            {payload.override ? ("OVERRIDE ACTION") : ("REVOKE ACTION")}
          </Typography>
        </DialogTitle>
        <Divider variant="fullWidth" />
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item xs={12}>
              <Typography variant="body2">
                Before marking this action as {payload.override ? ("complete") : ("revoked")}, please enter a description in the text box below then click the Submit button.
              </Typography>
            </Grid>
            <Grid item xs={12}>
             <TextField id="standard-name" label="Description" value={description} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider variant="fullWidth" />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={submit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
