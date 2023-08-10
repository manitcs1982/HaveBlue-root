import React from "react";
import { useTestSequenceDefinitionsDispositions } from "../../../common/services/dispositionServices";
import {
  useGroupsByGroupType,
  useUnitTypeFamilies,
} from "../../projectManagementQueries";
import { Field, Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import LSDBSelectField from "../../../common/LSDBSelectField";

const TSDForm = ({
  initialValues,
  submitForm,
  children,
  selectedProcedureDefinitionsIsEmpty,
}: {
  children?: React.ReactNode;
  initialValues?: any;
  submitForm: (values: FormikValues) => Promise<any> | Promise<void>;
  selectedProcedureDefinitionsIsEmpty: boolean;
}) => {
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
    React.useState(false);

  const dispositions = useTestSequenceDefinitionsDispositions();

  const groups = useGroupsByGroupType(2);

  const unitTypeFamilies = useUnitTypeFamilies();

  const handleClose = () => {
    setConfirmationDialogIsOpen(false);
  };

  const confirmEmptySubmission = (submitForm: any) => {
    submitForm();
    handleClose();
  };

  return (
    <>
      {dispositions.isSuccess &&
        groups.isSuccess &&
        unitTypeFamilies.isSuccess && (
          <Formik
            initialValues={
              initialValues
                ? initialValues
                : {
                    name: "",
                    shortName: "",
                    description: "",
                    disposition: 0,
                    group: 0,
                    unitTypeFamily: 0,
                    version: "",
                  }
            }
            validationSchema={Yup.object({
              name: Yup.string()
                .required("Name is required")
                .max(32, "Name can't be more than 32 characters long."),
              shortName: Yup.string().max(
                16,
                "Short name can't be more than 16 characters long."
              ),
              disposition: Yup.number().moreThan(
                0,
                "Select an appropriate disposition"
              ),
              description: Yup.string().max(
                128,
                "Description can't be more than 128 characters long."
              ),
              version: Yup.string()
                .required("Version is required")
                .max(32, "Version can't be more than 32 characters long."),
              group: Yup.number().moreThan(0, "Select an appropriate group"),
              unitTypeFamily: Yup.number().moreThan(
                0,
                "Select an appropriate unit type family"
              ),
            })}
            onSubmit={async (values) => submitForm(values)}
          >
            {({ submitForm, errors }) => (
              <React.Fragment>
                <Paper>
                  <Form>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      style={{
                        paddingLeft: 32,
                        paddingRight: 32,
                        paddingBottom: 32,
                      }}
                    >
                      <Grid item container xs={12} style={{ marginBottom: 32 }}>
                        <Grid item xs={8}>
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            fullWidth
                            component={TextField}
                            style={{ paddingRight: 32 }}
                            label="Name"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <Field
                            id="shortName"
                            name="shortName"
                            type="text"
                            fullWidth
                            component={TextField}
                            label="Short Name"
                          />
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          id="description"
                          name="description"
                          type="text"
                          component={TextField}
                          fullWidth
                          style={{ marginBottom: 32 }}
                          label="Description"
                        />
                      </Grid>

                      <Grid
                        item
                        container
                        xs={12}
                        spacing={1}
                        style={{ paddingBottom: 32 }}
                      >
                        <Grid item xs={8}>
                          <LSDBSelectField
                            fieldId="disposition"
                            fieldName="disposition"
                            fieldDisplayName="Disposition"
                            fullWidth={true}
                            errors={errors.disposition}
                            options={dispositions.data}
                            mappingFunction={(disposition) => (
                              <MenuItem value={disposition.id}>
                                {disposition.name}
                              </MenuItem>
                            )}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <Field
                            id="version"
                            name="version"
                            type="text"
                            component={TextField}
                            fullWidth
                            label="Version"
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        container
                        xs={12}
                        spacing={1}
                        style={{ paddingBottom: 32 }}
                      >
                        <Grid item xs={6}>
                          <LSDBSelectField
                            fieldId="group"
                            fieldName="group"
                            fieldDisplayName="Group"
                            fullWidth={true}
                            errors={errors.group}
                            options={groups.data}
                            mappingFunction={(group) => (
                              <MenuItem value={group.id}>{group.name}</MenuItem>
                            )}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <LSDBSelectField
                            fieldId="unitTypeFamily"
                            fieldName="unitTypeFamily"
                            fieldDisplayName="Unit Type Family"
                            fullWidth={true}
                            errors={errors.unitTypeFamily}
                            options={unitTypeFamilies.data}
                            mappingFunction={(unitTypeFamily) => (
                              <MenuItem value={unitTypeFamily.id}>
                                {unitTypeFamily.name}
                              </MenuItem>
                            )}
                          />
                          {/*<InputLabel htmlFor="group">
                            Unit Type Family
                          </InputLabel>
                          <Field
                            id="unitTypeFamily"
                            name="unitTypeFamily"
                            fullWidth
                            component={Select}
                            value={unitTypeFamilyValue}
                            onChange={(event: any) =>
                              setUnitTypeFamilyValue(event.target.value)
                            }
                          >
                            <MenuItem value={0}>Select a Module Type</MenuItem>
                            {unitTypeFamilies &&
                              unitTypeFamilies.map((unitTypeFamily: any) => (
                                <MenuItem value={unitTypeFamily.id}>
                                  {unitTypeFamily.name}
                                </MenuItem>
                              ))}
                          </Field>
                        </Grid>*/}
                        </Grid>

                        <Grid item container justifyContent="center" xs={12}>
                          {children}
                        </Grid>

                        <Grid
                          item
                          container
                          justifyContent="center"
                          style={{ marginTop: 32 }}
                          xs={12}
                        >
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                if (selectedProcedureDefinitionsIsEmpty) {
                                  setConfirmationDialogIsOpen(true);
                                } else {
                                  submitForm();
                                }
                              }}
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Form>
                </Paper>

                <Dialog open={confirmationDialogIsOpen} onClose={handleClose}>
                  <DialogTitle>
                    Confirmation of empty TSD submission
                  </DialogTitle>

                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to submit a TSD with no Procedure
                      Definitions?
                    </DialogContentText>
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => confirmEmptySubmission(submitForm)}
                      color="primary"
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
            )}
          </Formik>
        )}
    </>
  );
};

export default TSDForm;
