import { useIsFetching } from "react-query";
import { useHistory } from "react-router-dom";
import {
  Container,
  MenuItem,
  Button,
  Grid,
  Backdrop,
  CircularProgress,
  LinearProgress,
  useTheme,
} from "@material-ui/core";
import { TextField, CheckboxWithLabel } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { useFetchContext } from "../../../common/FetchContext";

import {
  useCustomers,
  useModuleTechnologies,
  useUnitTypeFamilies,
} from "../../projectManagementQueries";

import { useCreateUnitType } from "../../projectManagementMutations";
import moment from "moment";

import { useAuthContext } from "../../../common/AuthContext";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../util/errorMessaging";

export const NewUnitTypePage = () => {
  const { dispatch } = useAuthContext();
  const isFetching = useIsFetching();
  const theme = useTheme();
  const history = useHistory();

  const { mutateAsync: mutate } = useCreateUnitType();
  const {
    error: errorCustomers,
    data: customers,
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers,
  } = useCustomers();

  const {
    error: errorModuleTechnologies,
    data: moduleTechnologies,
    isLoading: isLoadingModuleTechnologies,
    isError: isErrorModuleTechnologies,
  } = useModuleTechnologies();

  const {
    error: errorUnitTypeFamilies,
    data: unitTypeFamilies,
    isLoading: isLoadingUnitTypeFamilies,
    isError: isErrorUnitTypeFamilies,
  } = useUnitTypeFamilies();

  if (
    isLoadingCustomers ||
    isLoadingModuleTechnologies ||
    isLoadingUnitTypeFamilies
  ) {
    return (
      <Backdrop
        open={
          isLoadingCustomers ||
          isLoadingModuleTechnologies ||
          isLoadingUnitTypeFamilies
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (
    isErrorCustomers ||
    isErrorModuleTechnologies ||
    isErrorUnitTypeFamilies
  ) {
    return (
      <>
        {isErrorCustomers && <ErrorMessage error={errorCustomers} />}
        {isErrorModuleTechnologies && (
          <ErrorMessage error={errorModuleTechnologies} />
        )}
        {isErrorUnitTypeFamilies && (
          <ErrorMessage error={errorUnitTypeFamilies} />
        )}
      </>
    );
  }

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <Formik
              initialValues={{
                manufacturer: "",
                description: "",
                notes: "",
                model: "",
                number_of_cells: "",
                nameplate_pmax: "",
                module_width: "",
                module_height: "",
                system_voltage: "",
                auditor: "",
                audit_date: "",
                audit_report_id: "",
                isc: "",
                voc: "",
                imp: "",
                vmp: "",
                alpha_isc: "",
                beta_voc: "",
                gamma_pmp: "",
                cells_in_series: "",
                cells_in_parallel: "",
                cell_area: "",
                unit_type_family: "",
                module_technology: "",
                bifacial: null,
              }}
              validationSchema={Yup.object({
                manufacturer: Yup.string().required("Field must be required"),
                description: Yup.string(),
                notes: Yup.string(),
                model: Yup.string().required("Field must be required"),
                number_of_cells: Yup.number().required(
                  "Field must be required"
                ),
                nameplate_pmax: Yup.string().required("Field must be required"),
                module_width: Yup.string().required("Field must be required"),
                module_height: Yup.string().required("Field must be required"),
                system_voltage: Yup.string().required("Field must be required"),
                auditor: Yup.string(),
                audit_date: Yup.string().nullable(),
                audit_report_id: Yup.string(),
                isc: Yup.string().required("Field must be required"),
                voc: Yup.string().required("Field must be required"),
                imp: Yup.string().required("Field must be required"),
                vmp: Yup.string().required("Field must be required"),
                alpha_isc: Yup.string().required("Field must be required"),
                beta_voc: Yup.string().required("Field must be required"),
                gamma_pmp: Yup.string().required("Field must be required"),
                cells_in_series: Yup.string(),
                cells_in_parallel: Yup.string(),
                cell_area: Yup.string(),
                unit_type_family: Yup.string().required(
                  "Field must be required"
                ),
                module_technology: Yup.string().required(
                  "Field must be required"
                ),
                bifacial: Yup.boolean().nullable(),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await mutate({
                    manufacturer: values.manufacturer,
                    description: values.description,
                    notes: values.notes,
                    model: values.model,
                    bom: "",
                    number_of_cells: values.number_of_cells,
                    nameplate_pmax: values.nameplate_pmax,
                    module_width: values.module_width,
                    module_height: values.module_height,
                    system_voltage: values.system_voltage,
                    auditor: values.auditor,
                    audit_date: moment(values.audit_date).format("YYYY-MM-DD"),
                    audit_report_id: values.audit_report_id,
                    isc: values.isc,
                    voc: values.voc,
                    imp: values.imp,
                    vmp: values.vmp,
                    alpha_isc: values.alpha_isc,
                    beta_voc: values.beta_voc,
                    gamma_pmp: values.gamma_pmp,
                    cells_in_series: values.cells_in_series,
                    cells_in_parallel: values.cells_in_parallel,
                    cell_area: values.cell_area,
                    unit_type_family: values.unit_type_family,
                    module_technology: values.module_technology,
                    bifacial: values.bifacial,
                  });

                  setSubmitting(false);
                  history.push(`/engineering/unit_type`);

                  toast.success("Unit Type was succesfully created");
                } catch (error) {
                  toast.error("Error while creating unit type.");
                  processErrorOnMutation(error, dispatch, history);
                }
              }}
            >
              {({ errors, touched, submitForm, values }) => (
                <Form>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    spacing={4}
                  >
                    {isFetching ? (
                      <Grid item xs={12}>
                        <LinearProgress />
                      </Grid>
                    ) : null}
                    <Grid item xs={4}>
                      <Field
                        name="model"
                        helperText={touched.model ? errors.model : ""}
                        error={touched.model && Boolean(errors.model)}
                        component={TextField}
                        data-testid="model"
                        label="Model"
                        style={{ marginBottom: 32 }}
                        placeholder="Type a model"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="description"
                        name="description"
                        label="Description"
                        component={TextField}
                        helperText={
                          touched.description ? errors.description : ""
                        }
                        error={
                          touched.description && Boolean(errors.description)
                        }
                        style={{ marginBottom: 32 }}
                        placeholder="Write a description"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="notes"
                        name="notes"
                        label="Notes"
                        component={TextField}
                        helperText={touched.notes ? errors.notes : ""}
                        error={touched.notes && Boolean(errors.notes)}
                        style={{ marginBottom: 32 }}
                        placeholder="Write some notes"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        id="manufacturer"
                        type="text"
                        data-testid="manufacturer"
                        name="manufacturer"
                        helperText={
                          touched.manufacturer ? errors.manufacturer : ""
                        }
                        error={
                          touched.manufacturer && Boolean(errors.manufacturer)
                        }
                        component={TextField}
                        select={true}
                        label="Manufacturer"
                        style={{ marginBottom: 32 }}
                        fullWidth
                      >
                        {customers?.map((customer: any) => (
                          <MenuItem key={customer.id} value={customer.url}>
                            {customer.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={4}>
                      <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        spacing={4}
                      >
                        <Grid item xs={8}>
                          <Field
                            id="unit_type_family"
                            type="text"
                            data-testid="unit_type_family"
                            name="unit_type_family"
                            helperText={
                              touched.unit_type_family
                                ? errors.unit_type_family
                                : ""
                            }
                            error={
                              touched.unit_type_family &&
                              Boolean(errors.unit_type_family)
                            }
                            component={TextField}
                            select={true}
                            label="Unit Type Family"
                            style={{ marginBottom: 32 }}
                            fullWidth
                          >
                            {unitTypeFamilies?.map((unitTypeFamily: any) => (
                              <MenuItem
                                key={unitTypeFamily.id}
                                value={unitTypeFamily.url}
                              >
                                {unitTypeFamily.name}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            id="bifacial"
                            type="checkbox"
                            name="bifacial"
                            component={CheckboxWithLabel}
                            Label={{ label: "Bifacial?" }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        id="module_technology"
                        type="text"
                        data-testid="module_technology"
                        name="module_technology"
                        helperText={
                          touched.module_technology
                            ? errors.module_technology
                            : ""
                        }
                        error={
                          touched.module_technology &&
                          Boolean(errors.module_technology)
                        }
                        component={TextField}
                        select={true}
                        label="Module Technology"
                        style={{ marginBottom: 32 }}
                        fullWidth
                      >
                        {moduleTechnologies?.map((moduleTechnology: any) => (
                          <MenuItem
                            key={moduleTechnology.id}
                            value={moduleTechnology.url}
                          >
                            {moduleTechnology.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="number_of_cells"
                        name="number_of_cells"
                        label="Number of Cells"
                        component={TextField}
                        type="number"
                        helperText={
                          touched.number_of_cells ? errors.number_of_cells : ""
                        }
                        error={
                          touched.number_of_cells &&
                          Boolean(errors.number_of_cells)
                        }
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="nameplate_pmax"
                        name="nameplate_pmax"
                        label="Nameplate Pmax"
                        component={TextField}
                        type="number"
                        helperText={
                          touched.nameplate_pmax ? errors.nameplate_pmax : ""
                        }
                        error={
                          touched.nameplate_pmax &&
                          Boolean(errors.nameplate_pmax)
                        }
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="module_width"
                        name="module_width"
                        label="Module Width"
                        component={TextField}
                        type="number"
                        helperText={
                          touched.module_width ? errors.module_width : ""
                        }
                        error={
                          touched.module_width && Boolean(errors.module_width)
                        }
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="module_height"
                        name="module_height"
                        label="Module Height"
                        component={TextField}
                        type="number"
                        helperText={
                          touched.module_height ? errors.module_height : ""
                        }
                        error={
                          touched.module_height && Boolean(errors.module_height)
                        }
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="system_voltage"
                        name="system_voltage"
                        label="System Voltage"
                        component={TextField}
                        type="number"
                        helperText={
                          touched.system_voltage ? errors.system_voltage : ""
                        }
                        error={
                          touched.system_voltage &&
                          Boolean(errors.system_voltage)
                        }
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="auditor"
                        name="auditor"
                        label="Auditor"
                        component={TextField}
                        helperText={touched.auditor ? errors.auditor : ""}
                        error={touched.auditor && Boolean(errors.auditor)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="audit_date"
                        name="audit_date"
                        label="Audit Date"
                        component={DatePicker}
                        format="YYYY-MM-DD"
                        helperText={touched.audit_date ? errors.audit_date : ""}
                        error={touched.audit_date && Boolean(errors.audit_date)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="audit_report_id"
                        name="audit_report_id"
                        label="Audit Report Id"
                        component={TextField}
                        helperText={
                          touched.audit_report_id ? errors.audit_report_id : ""
                        }
                        error={
                          touched.audit_report_id &&
                          Boolean(errors.audit_report_id)
                        }
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="isc"
                        name="isc"
                        label="ISC"
                        component={TextField}
                        type="number"
                        helperText={touched.isc ? errors.isc : ""}
                        error={touched.isc && Boolean(errors.isc)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="voc"
                        name="voc"
                        label="VOC"
                        component={TextField}
                        type="number"
                        helperText={touched.voc ? errors.voc : ""}
                        error={touched.voc && Boolean(errors.voc)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="imp"
                        name="imp"
                        label="IMP"
                        component={TextField}
                        type="number"
                        helperText={touched.imp ? errors.imp : ""}
                        error={touched.imp && Boolean(errors.imp)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="vmp"
                        name="vmp"
                        label="VMP"
                        component={TextField}
                        type="number"
                        helperText={touched.vmp ? errors.vmp : ""}
                        error={touched.vmp && Boolean(errors.vmp)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="alpha_isc"
                        name="alpha_isc"
                        label="Alpha ISC (%/C)"
                        component={TextField}
                        type="number"
                        helperText={touched.alpha_isc ? errors.alpha_isc : ""}
                        error={touched.alpha_isc && Boolean(errors.alpha_isc)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="beta_voc"
                        name="beta_voc"
                        label="Beta VOC (%/C)"
                        component={TextField}
                        type="number"
                        helperText={touched.beta_voc ? errors.beta_voc : ""}
                        error={touched.beta_voc && Boolean(errors.beta_voc)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="gamma_pmp"
                        name="gamma_pmp"
                        label="Gamma PMP (%/C)"
                        component={TextField}
                        type="number"
                        helperText={touched.gamma_pmp ? errors.gamma_pmp : ""}
                        error={touched.gamma_pmp && Boolean(errors.gamma_pmp)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="cells_in_series"
                        name="cells_in_series"
                        label="Cells in series"
                        component={TextField}
                        type="number"
                        helperText={
                          touched.cells_in_series ? errors.cells_in_series : ""
                        }
                        error={
                          touched.cells_in_series &&
                          Boolean(errors.cells_in_series)
                        }
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="cells_in_parallel"
                        name="cells_in_parallel"
                        label="Cells in parallel"
                        component={TextField}
                        type="number"
                        helperText={
                          touched.cells_in_parallel
                            ? errors.cells_in_parallel
                            : ""
                        }
                        error={
                          touched.cells_in_parallel &&
                          Boolean(errors.cells_in_parallel)
                        }
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        data-testid="cell_area"
                        name="cell_area"
                        label="Cell Area"
                        component={TextField}
                        type="number"
                        helperText={touched.cell_area ? errors.cell_area : ""}
                        error={touched.cell_area && Boolean(errors.cell_area)}
                        style={{ marginBottom: 32 }}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        container
                        spacing={3}
                        direction="row"
                        justify="space-around"
                        alignItems="center"
                        style={{ marginTop: 32 }}
                      >
                        <Grid item xs={2}>
                          <Button
                            data-testid="submitWorkOrder"
                            variant="contained"
                            color="primary"
                            onClick={submitForm}
                          >
                            Submit
                          </Button>
                        </Grid>
                        <Grid item xs={2}>
                          <Button variant="contained" color="secondary">
                            Clear
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
