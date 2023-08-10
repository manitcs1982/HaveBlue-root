import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ReceiptIcon from "@material-ui/icons/Receipt";

import { TravelerComponent } from "../projectManagement/components/virtualTraveler/TravelerComponent";

export const TravelerModal = ({ serialNumber }: any) => {
  const [travelerOpen, setTravelerOpen] = React.useState(false);

  const handleTraveler = () => {
    setTravelerOpen(!travelerOpen);
  };

  return (
    <div>
      <Button
        style={{ textAlign: "center" }}
        variant="contained"
        color="primary"
        onClick={() => handleTraveler()}
        fullWidth={true}
        startIcon={<ReceiptIcon />}
      >
        {serialNumber}
      </Button>
      <Dialog
        open={travelerOpen}
        onClose={() => handleTraveler()}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"xl"}
      >
        <DialogTitle id="scroll-dialog-title">
          Traveler: {serialNumber}
        </DialogTitle>
        <DialogContent dividers={true}>
          {travelerOpen && (
            <TravelerComponent serialNumber={serialNumber.toUpperCase()} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleTraveler()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
