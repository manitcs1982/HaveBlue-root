import React from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import {
  useAddProcedureDefinitionsToTestSequence,
  useCreateTestSequence,
} from "../../projectManagementMutations";
import TSDForm from "./TSDForm";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import ProcedureDefinitionsPicker from "./ProcedureDefinitions/ProcedureDefinitionsPicker";
import { ProcedureExecutionOrder } from "../../types/ProcedureExecutionOrder";
import LSDBColorPicker from "../../../common/LSDBColorPicker";
import {
  addProcedureDefinitionToList,
  removeProcedureDefinitionFromList,
} from "./ProcedureDefinitions/helpers";

const NewTSD = () => {
  const history = useHistory();

  const [selectedProcedureDefinitions, setSelectedProcedureDefinitions] =
    React.useState<ProcedureExecutionOrder[]>([]);
  const [tsdHexColor, setTsdHexColor] = React.useState("#000000");

  const { mutateAsync: createTestSequence } = useCreateTestSequence();
  const { mutateAsync: addProcedureDefinitionsToTestSequence } =
    useAddProcedureDefinitionsToTestSequence();

  const addProcedureDefinitionToSelectedList = (
    procedureDefinition: ProcedureExecutionOrder
  ) => {
    setSelectedProcedureDefinitions((prevState) =>
      addProcedureDefinitionToList(prevState, procedureDefinition)
    );
  };

  const removeProcedureDefinitionFromSelectedList = (
    procedureDefinition: ProcedureExecutionOrder
  ) => {
    setSelectedProcedureDefinitions((prevState) =>
      removeProcedureDefinitionFromList(prevState, procedureDefinition)
    );
  };

  const editProcedureDefinitionInSelectedList = (
    procedureDefinitionToEdit: ProcedureExecutionOrder,
    newProcedureDefinition: ProcedureExecutionOrder
  ) => {
    setSelectedProcedureDefinitions((prevState) =>
      addProcedureDefinitionToList(
        removeProcedureDefinitionFromList(prevState, procedureDefinitionToEdit),
        newProcedureDefinition
      )
    );
  };

  const handleColorChange = (color: string) => {
    setTsdHexColor(color);
  };

  return (
    <React.Fragment>
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography variant="h3">New Test Sequence Definition</Typography>
          </Grid>

          <Grid item xs={12}>
            <TSDForm
              submitForm={async (values) => {
                console.log({ values, hex_color: tsdHexColor });
                try {
                  await createTestSequence(
                    {
                      name: values.name,
                      short_name: values.shortName,
                      description: values.description,
                      disposition: values.disposition,
                      version: values.version,
                      group: values.group,
                      unit_type_family: values.unitTypeFamily,
                      hex_color: tsdHexColor,
                    },
                    {
                      onSuccess: async ({ id }) => {
                        toast.success(`Created test sequence ${id}`);

                        if (selectedProcedureDefinitions.length !== 0) {
                          try {
                            await addProcedureDefinitionsToTestSequence(
                              {
                                testSequenceId: id,
                                procedureDefinitions:
                                  selectedProcedureDefinitions,
                              },
                              {
                                onSuccess: () => {
                                  toast.success(
                                    "Added selected procedure definitions to test sequence"
                                  );
                                },
                              }
                            );
                          } catch (err) {
                            toast.error(
                              "Failed to add procedure definition to test sequence"
                            );
                          }
                        }

                        history.push(`${id}`);
                      },
                    }
                  );
                } catch (e) {
                  toast.error("Failed to create Test Sequence Definition");
                }
              }}
              selectedProcedureDefinitionsIsEmpty={
                selectedProcedureDefinitions.length === 0
              }
            >
              <LSDBColorPicker
                chipLabel="Test Sequence Definition Color"
                onChange={handleColorChange}
              />
              <ProcedureDefinitionsPicker
                tsdProcedureDefinitions={selectedProcedureDefinitions}
                onAddItem={(newProcedureDefinition) => {
                  console.log("Adding new item to a new TSD");
                  console.log({ item: newProcedureDefinition });
                  addProcedureDefinitionToSelectedList(newProcedureDefinition);
                }}
                onEditItem={(
                  oldProcedureDefinition,
                  newProcedureDefinition
                ) => {
                  console.log("Editing existing item on a new TSD");
                  console.log({
                    oldPD: oldProcedureDefinition,
                    newPD: newProcedureDefinition,
                  });
                  editProcedureDefinitionInSelectedList(
                    oldProcedureDefinition,
                    newProcedureDefinition
                  );
                }}
                onDeleteItem={(procedureDefinitionToDelete) => {
                  console.log("Deleting item on a new TSD");
                  console.log({ item: procedureDefinitionToDelete });
                  removeProcedureDefinitionFromSelectedList(
                    procedureDefinitionToDelete
                  );
                }}
              />
            </TSDForm>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default NewTSD;
