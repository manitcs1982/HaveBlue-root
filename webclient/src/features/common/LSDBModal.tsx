import { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export const useLSDBModalState = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleModalAction = () => {
    setOpenModal(!openModal);
  };

  return { openModal, setOpenModal, handleModalAction };
};

export const LSDBModal = ({ open, handleAction, title, children }: any) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleAction}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"xl"}
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers={true}>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleAction} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
