import React from "react";
import { Button, Grid, Paper } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { ProcedureExecutionOrder } from "../../../types/ProcedureExecutionOrder";
import { useAddProcedureDefinitionsToTestSequence } from "../../../projectManagementMutations";
import ProcedureDefinitionFormDialog from "./ProcedureDefinitionFormDialog";
import ProcedureDefinitionDeletionDialog from "./ProcedureDefinitionDeletionDialog";
import ProcedureDefinitionsList from "./ProcedureDefinitionsList";

const ProcedureDefinitionsPicker = ({
  tsdProcedureDefinitions,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: {
  tsdProcedureDefinitions: ProcedureExecutionOrder[];
  onAddItem: (newProcedureDefinition: ProcedureExecutionOrder) => void;
  onEditItem: (
    oldProcedureDefinition: ProcedureExecutionOrder,
    newProcedureDefinition: ProcedureExecutionOrder
  ) => void;
  onDeleteItem: (procedureDefinitionToDelete: ProcedureExecutionOrder) => void;
}) => {
  const { mutateAsync: addProcedureDefinitionToTestSequence } =
    useAddProcedureDefinitionsToTestSequence();

  const [procedureDefinitionDialogIsOpen, setProcedureDefinitionDialogIsOpen] =
    React.useState(false);
  const [
    deletionConfirmationDialogIsOpen,
    setDeletionConfirmationDialogIsOpen,
  ] = React.useState(false);
  const [editingMode, setEditingMode] = React.useState(false);
  const [procedureDefinitionToDelete, setProcedureDefinitionToDelete] =
    React.useState<ProcedureExecutionOrder>();
  const [procedureDefinitionToEdit, setProcedureDefinitionToEdit] =
    React.useState<ProcedureExecutionOrder>();

  const handleOpenCreationDialog = () => {
    setEditingMode(false);
    setProcedureDefinitionDialogIsOpen(true);
  };

  const handleOpenEditionDialog = (
    procedureDefinition: ProcedureExecutionOrder
  ) => {
    setEditingMode(true);
    setProcedureDefinitionToEdit(procedureDefinition);
    setProcedureDefinitionDialogIsOpen(true);
  };

  const handleCloseProcedureDefinitionDialog = () => {
    setProcedureDefinitionDialogIsOpen(false);
  };

  const handleOpenDeletionConfirmationDialog = (
    procedureDefinition: ProcedureExecutionOrder
  ) => {
    setProcedureDefinitionToDelete(procedureDefinition);
    setDeletionConfirmationDialogIsOpen(true);
  };

  const handleCloseDeletionConfirmationDialog = () => {
    setDeletionConfirmationDialogIsOpen(false);
  };

  return (
    <React.Fragment>
      {/* This is the list of Procedure Definition */}
      <Grid container direction="row" justifyContent="center">
        <Paper>
          <div style={{ margin: 16 }}>
            <ProcedureDefinitionsList
              procedureDefinitions={tsdProcedureDefinitions}
              onClickEditItem={handleOpenEditionDialog}
              onClickDeleteItem={handleOpenDeletionConfirmationDialog}
            />
            {/*<Grid item container justifyContent="center" xs={12}>
              <Grid item>
                <Typography variant="h6">
                  List of Picked Procedure Definitions
                </Typography>
              </Grid>
            </Grid>

            <Grid item container justifyContent="center" xs={12}>
              <Grid item>
                {tsdProcedureDefinitions &&
                tsdProcedureDefinitions.length !== 0 ? (
                  <List>
                    {tsdProcedureDefinitions
                      .sort(
                        (
                          firstItem: ProcedureExecutionOrder,
                          secondItem: ProcedureExecutionOrder
                        ) => {
                          if (firstItem && secondItem) {
                            return (
                              firstItem.execution_group_number -
                              secondItem.execution_group_number
                            );
                          }

                          return 0;
                        }
                      )
                      .map((procedureDefinition) => (
                        <ProcedureDefinitionItem
                          procedureDefinitionItem={procedureDefinition}
                          onClickEditItem={(procedureDefinitionItem) => {
                            handleOpenEditionDialog(procedureDefinitionItem);
                          }}
                          onClickDeleteItem={(procedureDefinitionItem) => {
                            handleOpenDeletionConfirmationDialog(
                              procedureDefinitionItem
                            );
                          }}
                        />
                      ))}
                  </List>
                ) : (
                  <p>No Picked Procedure Definitions yet!</p>
                )}
              </Grid>
            </Grid>*/}

            <Grid item container justifyContent="center" xs={12}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenCreationDialog}
                >
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </Grid>

      {/* This is the dialog to create and add a ProcedureDefinition */}
      <ProcedureDefinitionFormDialog
        dialogIsOpen={procedureDefinitionDialogIsOpen}
        onCloseDialog={handleCloseProcedureDefinitionDialog}
        editingInfo={{
          editingMode,
          procedureDefinition: procedureDefinitionToEdit!,
        }}
        onSubmitProcedureDefinition={(
          existingProcedureDefinition,
          procedureDefinition
        ) => {
          if (editingMode && existingProcedureDefinition) {
            onEditItem(existingProcedureDefinition, procedureDefinition);
          } else {
            onAddItem(procedureDefinition);
          }
        }}
      />

      {/*This is the dialog to delete a ProcedureDefinition*/}
      <ProcedureDefinitionDeletionDialog
        dialogIsOpen={deletionConfirmationDialogIsOpen}
        onClose={handleCloseDeletionConfirmationDialog}
        procedureDefinitionToDelete={procedureDefinitionToDelete!}
        onConfirmDeletion={(procedureDefinitionToDelete) => {
          onDeleteItem(procedureDefinitionToDelete);
          handleCloseDeletionConfirmationDialog();
        }}
      />
    </React.Fragment>
  );
};

export default ProcedureDefinitionsPicker;
