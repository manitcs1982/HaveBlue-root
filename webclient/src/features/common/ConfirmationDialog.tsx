import { makeStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { Typography } from "@material-ui/core";

export interface ConfirmationDialogProps {
  id: string;
  keepMounted: boolean;
  content: string;
  title: string;
  open: boolean;
  onCancel: () => void;
  onSubmit: (() => Promise<void>) & (() => Promise<any>);
}

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      width: "80%",
      maxHeight: 435,
    },
  })
);

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { onSubmit, onCancel, content, title, open } = props;
  const classes = useStyles();

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      className={classes.paper}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
