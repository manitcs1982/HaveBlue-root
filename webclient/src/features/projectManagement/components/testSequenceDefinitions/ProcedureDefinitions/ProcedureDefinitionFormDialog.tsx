import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import * as Yup from "yup";

import { useProcedureDefinitions } from "../../../projectManagementQueries";
import LSDBSelectField from "../../../../common/LSDBSelectField";
import { ProcedureExecutionOrder } from "../../../types/ProcedureExecutionOrder";

type EditingProps = {
  editingMode: boolean;
  procedureDefinition: ProcedureExecutionOrder;
};

type ProcedureDefinitionValues = {
  executionGroupName: string;
  executionGroupNumber: number;
  allowSkip: boolean;
  procedureDefinition: number;
  executionCondition: string;
};

const ProcedureDefinitionFormDialog = ({
  dialogIsOpen,
  onCloseDialog,
  onSubmitProcedureDefinition,
  editingInfo,
}: {
  dialogIsOpen: boolean;
  onCloseDialog: () => void;
  onSubmitProcedureDefinition: (
    existingProcedureDefinition: ProcedureExecutionOrder | undefined,
    procedureDefinition: ProcedureExecutionOrder
  ) => void;
  editingInfo?: EditingProps;
}) => {
  const procedureDefinitions = useProcedureDefinitions(true);

  return (
    <Dialog open={dialogIsOpen} onClose={onCloseDialog} fullWidth maxWidth="lg">
      <DialogTitle>
        {editingInfo && editingInfo.editingMode
          ? "Edit the Procedure Definition"
          : "Add a new Procedure Definition"}
      </DialogTitle>

      {procedureDefinitions.isSuccess && (
        <Formik
          initialValues={
            editingInfo &&
            editingInfo.editingMode &&
            editingInfo.procedureDefinition
              ? {
                  executionGroupName:
                    editingInfo.procedureDefinition.execution_group_name,
                  executionGroupNumber:
                    editingInfo.procedureDefinition.execution_group_number,
                  allowSkip: editingInfo.procedureDefinition.allow_skip,
                  procedureDefinition:
                    editingInfo.procedureDefinition.procedure_definition,
                  executionCondition:
                    editingInfo.procedureDefinition.execution_condition || "",
                }
              : {
                  executionGroupName: "",
                  executionGroupNumber: 0,
                  allowSkip: false,
                  procedureDefinition: 0,
                  executionCondition: "",
                }
          }
          validationSchema={Yup.object({
            executionGroupName: Yup.string()
              .required("Execution Group Name is required")
              .max(
                128,
                "Execution Group Name can't be more than 128 characters long"
              ),
            executionGroupNumber: Yup.number().required(
              "Execution Group Number is required"
            ),
            executionCondition: Yup.string().max(
              256,
              "The Execution Condition can't be more than 256 characters"
            ),
            allowSkip: Yup.boolean().required("Allow Skip is required"),
            procedureDefinition: Yup.number().moreThan(
              0,
              "Select an appropriate Procedure Definition"
            ),
          })}
          onSubmit={(values: ProcedureDefinitionValues, { setSubmitting }) => {
            let previousProcedureDefinition:
              | ProcedureExecutionOrder
              | undefined = editingInfo?.procedureDefinition;

            const newProcedureDefinition: ProcedureExecutionOrder = {
              allow_skip: values.allowSkip,
              execution_condition: values.executionCondition,
              execution_group_name: values.executionGroupName,
              execution_group_number: values.executionGroupNumber,
              procedure_definition: values.procedureDefinition,
              procedure_definition_name: procedureDefinitions.data.find(
                (procedureDefinition) =>
                  procedureDefinition.id === values.procedureDefinition
              )!.name,
            };

            onSubmitProcedureDefinition(
              previousProcedureDefinition,
              newProcedureDefinition
            );
            setSubmitting(false);
            onCloseDialog();
          }}
        >
          {({ submitForm, errors }) => (
            <>
              <DialogContent>
                <Paper>
                  <Form>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      style={{ paddingBottom: 32 }}
                    >
                      <Grid
                        item
                        container
                        justifyContent="center"
                        spacing={1}
                        xs={12}
                        style={{ paddingBottom: 32 }}
                      >
                        <Grid item xs={4}>
                          <Field
                            id="executionGroupName"
                            name="executionGroupName"
                            type="text"
                            component={TextField}
                            fullWidth
                            label="Execution Group Name"
                            placeholder="A name to identify the execution group"
                          />
                        </Grid>

                        <Grid item xs={3}>
                          <Field
                            id="executionGroupNumber"
                            name="executionGroupNumber"
                            type="number"
                            fullWidth
                            component={TextField}
                            label="Execution Group Number"
                            placeholder="A number to identify the execution group"
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        container
                        justifyContent="center"
                        xs={7}
                        spacing={1}
                        style={{ paddingBottom: 32 }}
                      >
                        <Field
                          id="executionCondition"
                          name="executionCondition"
                          type="text"
                          component={TextField}
                          fullWidth
                          label="Execution Condition"
                          placeholder="A condition which will be evaluated to determine if the procedure should be added to this TSD"
                        />
                      </Grid>

                      <Grid
                        item
                        container
                        justifyContent="center"
                        spacing={1}
                        xs={12}
                      >
                        <Grid item xs={3}>
                          <Field
                            id="allowSkip"
                            name="allowSkip"
                            type="checkbox"
                            component={CheckboxWithLabel}
                            Label={{ label: "Allow Skip?" }}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <LSDBSelectField
                            fieldId="procedureDefinition"
                            fieldName="procedureDefinition"
                            fieldDisplayName="Procedure Definition"
                            fullWidth
                            errors={errors.procedureDefinition}
                            options={procedureDefinitions.data}
                            mappingFunction={(procedureDefinition) => (
                              <MenuItem value={procedureDefinition.id}>
                                {procedureDefinition.name}
                              </MenuItem>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Form>
                </Paper>
              </DialogContent>

              <DialogActions>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                >
                  {editingInfo && editingInfo.editingMode
                    ? "Update Procedure Definition"
                    : "Add Procedure Definition"}
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      )}
    </Dialog>
  );
};

export default ProcedureDefinitionFormDialog;
