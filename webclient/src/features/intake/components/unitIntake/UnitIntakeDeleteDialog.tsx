import { DialogTitle, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

export const UnitIntakeDeleteDialog = ( {
  open,
  handleClose,
  activeSerialNumber,
  serialNumberAttachments,
  setSerialNumberAttachments,
  setActiveSerialNumber,
  serialNumbers,
  setSerialNumbers
} : any ) => {

  const theme = useTheme();

  const deleteSerialNumber = () => {
    delete serialNumberAttachments[activeSerialNumber];
    setSerialNumberAttachments(serialNumberAttachments);
    setSerialNumbers(
      serialNumbers.filter(
        (number : any) => number !== activeSerialNumber
      )
    );
    setActiveSerialNumber("");
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="intake-image-dialog"
      aria-describedby="intake-image-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Delete Serial Number {activeSerialNumber}?
      </DialogTitle>
      <DialogContent>
        You are about to delete serial number {activeSerialNumber}. Would you like to proceed?
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
        >
         Cancel
        </Button>
        <Button
          onClick={deleteSerialNumber}
          style={theme.btnError}
        >
         Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
