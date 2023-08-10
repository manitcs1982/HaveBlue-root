import { DialogTitle } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { DropzoneArea } from "material-ui-dropzone";

export const UnitIntakeImageDialog = ({
  open,
  handleClose,
  activeSerialNumber,
  serialNumberAttachments,
  setSerialNumberAttachments,
}: any) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="intake-image-dialog"
      aria-describedby="intake-image-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add Images</DialogTitle>
      <DialogContent>
        <DropzoneArea
          key={activeSerialNumber}
          initialFiles={serialNumberAttachments[activeSerialNumber]}
          acceptedFiles={["image/*"]}
          filesLimit={
            process.env.REACT_APP_FILE_LIMIT
              ? parseInt(process.env.REACT_APP_FILE_LIMIT)
              : 20
          }
          maxFileSize={12000000}
          onChange={(files) => {
            var serialNumberAttachmentsTemp = {
              ...serialNumberAttachments,
              [activeSerialNumber]: files,
            };
            setSerialNumberAttachments(serialNumberAttachmentsTemp);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
