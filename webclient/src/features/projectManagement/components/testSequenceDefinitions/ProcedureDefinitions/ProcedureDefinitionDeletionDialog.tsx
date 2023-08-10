import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { ProcedureExecutionOrder } from "../../../types/ProcedureExecutionOrder";

const ProcedureDefinitionDeletionDialog = ({
  dialogIsOpen,
  onClose,
  procedureDefinitionToDelete,
  onConfirmDeletion,
}: {
  dialogIsOpen: boolean;
  onClose: () => void;
  procedureDefinitionToDelete: ProcedureExecutionOrder;
  onConfirmDeletion: (
    procedureDefinitionToDelete: ProcedureExecutionOrder
  ) => void;
}) => {
  return (
    <Dialog open={dialogIsOpen} onClose={onClose}>
      <DialogTitle>Confirm deletion</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          {procedureDefinitionToDelete?.procedure_definition_name}?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>

        <Button
          color="primary"
          onClick={() => {
            onConfirmDeletion(procedureDefinitionToDelete);
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcedureDefinitionDeletionDialog;
