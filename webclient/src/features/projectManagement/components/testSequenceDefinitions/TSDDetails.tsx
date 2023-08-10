import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Select, TextField } from "formik-material-ui";
import ProcedureDefinitionsPicker from "./ProcedureDefinitions/ProcedureDefinitionsPicker";
import { ProcedureExecutionOrder } from "../../types/ProcedureExecutionOrder";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTestSequenceDefinitionsDispositions } from "../../../common/services/dispositionServices";
import {
  useGroupsByGroupType,
  useUnitTypeFamilies,
} from "../../projectManagementQueries";
import { useTestSequenceDefinition } from "../../testSequenceDefinitionQueries";
import { ErrorMessage } from "../../../common/ErrorMessage";
import {
  useAddProcedureDefinitionsToTestSequence,
  useRemoveProcedureDefinitionsFromTestSequence,
  useUpdateTestSequence,
} from "../../projectManagementMutations";
import { LSDBModal, useLSDBModalState } from "../../../common/LSDBModal";
import { WorkOrderTestSequenceTraveler } from "../customerDetails/workOrders/WorkOrderTestSequenceTraveler";
import ReceiptIcon from "@material-ui/icons/Receipt";
import TSDForm from "./TSDForm";
import LSDBColorPicker from "../../../common/LSDBColorPicker";
import {
  addProcedureDefinitionToList,
  removeProcedureDefinitionFromList,
} from "./ProcedureDefinitions/helpers";

const TSDDetails = () => {
  const { tsdId } = useParams<any>();
  const history = useHistory();

  const {
    openModal: isOpenModal,
    setOpenModal,
    handleModalAction,
  } = useLSDBModalState();
  const [selectedProcedureDefinitions, setSelectedProcedureDefinitions] =
    React.useState<ProcedureExecutionOrder[]>([]);
  const [tsdHexColor, setTsdHexColor] = React.useState("#000000");

  const { mutateAsync: updateTSD } = useUpdateTestSequence();
  const { mutateAsync: addProcedureDefinitionToTestSequence } =
    useAddProcedureDefinitionsToTestSequence();
  const { mutateAsync: removeProceduresFromTestSequence } =
    useRemoveProcedureDefinitionsFromTestSequence();

  const {
    data: testSequence,
    error: testSequenceError,
    isError: isErrorTestSequence,
    isLoading: isLoadingTestSequence,
  } = useTestSequenceDefinition(tsdId);

  React.useEffect(() => {
    if (
      testSequence &&
      testSequence.procedure_definitions &&
      testSequence.procedure_definitions.length !== 0
    ) {
      const procedureDefinitions: ProcedureExecutionOrder[] =
        testSequence.procedure_definitions.map((procedureDefinition: any) => {
          const procedureExecutionOrder: ProcedureExecutionOrder = {
            allow_skip: procedureDefinition.allow_skip,
            execution_group_name: procedureDefinition.execution_group_name,
            execution_group_number: procedureDefinition.execution_group_number,
            execution_condition: procedureDefinition.execution_condition,
            procedure_definition: procedureDefinition.procedure_definition.id,
            procedure_definition_name:
              procedureDefinition.procedure_definition.name,
          };

          return procedureExecutionOrder;
        });

      setTsdHexColor(testSequence.hex_color);
      setSelectedProcedureDefinitions(procedureDefinitions);
    }
  }, [testSequence]);

  const handleColorChange = (color: string) => {
    setTsdHexColor(color);
  };

  const addProcedureDefinitionToSelected = async (
    procedureDefinition: ProcedureExecutionOrder
  ) => {
    try {
      await addProcedureDefinitionToTestSequence({
        testSequenceId: tsdId,
        procedureDefinitions: [procedureDefinition],
      });

      setSelectedProcedureDefinitions((prevState) =>
        addProcedureDefinitionToList(prevState, procedureDefinition)
      );

      toast.success("Added Procedure Definition to Test Sequence");
    } catch (e) {
      toast.error("Error adding Procedure Definition to Test Sequence");
    }
  };

  const removeProcedureDefinitionFromSelected = async (
    procedureDefinition: ProcedureExecutionOrder
  ) => {
    try {
      await removeProceduresFromTestSequence({
        testSequenceId: tsdId,
        procedureDefinitions: [procedureDefinition],
      });

      await setSelectedProcedureDefinitions((prevState) =>
        removeProcedureDefinitionFromList(prevState, procedureDefinition)
      );
      toast.success("Deleted Procedure Definition");
    } catch (e) {
      toast.error("Error while deleting Procedure Definition");
    }
  };

  const editProcedureDefinitionInSelected = async (
    procedureDefinitionToEdit: ProcedureExecutionOrder,
    newProcedureDefinition: ProcedureExecutionOrder
  ) => {
    try {
      await removeProceduresFromTestSequence({
        testSequenceId: tsdId,
        procedureDefinitions: [procedureDefinitionToEdit],
      });

      await addProcedureDefinitionToTestSequence({
        testSequenceId: tsdId,
        procedureDefinitions: [newProcedureDefinition],
      });

      await setSelectedProcedureDefinitions((prevState) =>
        addProcedureDefinitionToList(
          removeProcedureDefinitionFromList(
            prevState,
            procedureDefinitionToEdit
          ),
          newProcedureDefinition
        )
      );
      toast.success("Edited Procedure Definition");
    } catch (e) {
      toast.error("Error while editing Procedure Definition");
    }
  };

  return (
    <React.Fragment>
      <LSDBModal
        title="Traveler"
        open={isOpenModal}
        handleAction={() => handleModalAction()}
      >
        <WorkOrderTestSequenceTraveler id={tsdId} />
      </LSDBModal>

      {testSequence && (
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Typography variant="h3">
                Test Sequence Definition Details
              </Typography>
            </Grid>

            <Grid item container justifyContent="center" xs={12}>
              <Grid item>
                <Button
                  style={{
                    textAlign: "center",
                    marginTop: 16,
                    marginBottom: 16,
                  }}
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenModal(true)}
                  fullWidth
                  startIcon={<ReceiptIcon />}
                >
                  Traveler
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TSDForm
                initialValues={{
                  name: testSequence.name,
                  shortName: testSequence.short_name,
                  description: testSequence.description,
                  version: testSequence.version,
                  disposition: testSequence.disposition,
                  group: testSequence.group,
                  unitTypeFamily: testSequence.unit_type_family,
                }}
                submitForm={async (values) => {
                  const { shortName, unitTypeFamily, ...pickedValues } = values;

                  const updatedTSD = {
                    ...pickedValues,
                    short_name: shortName,
                    unit_type_family: unitTypeFamily,
                    hex_color: tsdHexColor,
                  };

                  try {
                    const response = await updateTSD({ tsdId, updatedTSD });
                    console.log(response);

                    toast.success("Successfully updated TSD");
                    history.push(`${tsdId}`);
                  } catch (e) {
                    toast.error("Error updating TSD");
                  }
                }}
                selectedProcedureDefinitionsIsEmpty={
                  selectedProcedureDefinitions.length === 0
                }
              >
                <LSDBColorPicker
                  chipLabel="Test Sequence Definition Color"
                  onChange={handleColorChange}
                  initialHexColor={testSequence.hex_color}
                />
                <ProcedureDefinitionsPicker
                  tsdProcedureDefinitions={selectedProcedureDefinitions}
                  onAddItem={async (newProcedureDefinition) => {
                    await addProcedureDefinitionToSelected(
                      newProcedureDefinition
                    );
                  }}
                  onEditItem={async (
                    oldProcedureDefinition,
                    newProcedureDefinition
                  ) => {
                    console.log(`Editing existing item in tsd ${tsdId}`);
                    console.log({
                      existingItem: oldProcedureDefinition,
                      newItem: newProcedureDefinition,
                    });
                    await editProcedureDefinitionInSelected(
                      oldProcedureDefinition,
                      newProcedureDefinition
                    );
                  }}
                  onDeleteItem={async (procedureDefinitionToDelete) => {
                    await removeProcedureDefinitionFromSelected(
                      procedureDefinitionToDelete
                    );
                  }}
                />
              </TSDForm>
            </Grid>
          </Grid>
        </Container>
      )}
    </React.Fragment>
  );
};

export default TSDDetails;
