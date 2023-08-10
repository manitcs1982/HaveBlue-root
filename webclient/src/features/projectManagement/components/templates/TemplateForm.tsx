import * as Yup from "yup";
import { Button, Container, Grid, MenuItem, Paper } from "@material-ui/core";
import { Field, Form, Formik, FormikValues } from "formik";
import { TextField } from "formik-material-ui";
import LSDBSelectField from "../../../common/LSDBSelectField";
import LSDBMonacoEditor from "../../../common/LSDBMonacoEditor";
import React from "react";
import { useDispositions } from "../../../common/services/dispositionServices";
import { useFileFormats } from "../../adminQueries";
import { useGroups } from "../../projectManagementQueries";

const TemplateForm = ({
  initialValues,
  initialEditorValue = "",
  submitForm,
}: {
  initialValues?: any;
  initialEditorValue?: string;
  submitForm: (values: FormikValues, editorValue: string) => Promise<any>;
}) => {
  const editorValue = React.useRef("");

  const dispositionsQuery = useDispositions();
  const fileFormatsQuery = useFileFormats();
  const groupsQuery = useGroups();

  React.useEffect(() => {
    if (initialEditorValue !== "") {
      editorValue.current = initialEditorValue;
    }
  }, [initialEditorValue]);

  return (
    <>
      {dispositionsQuery.isSuccess &&
        fileFormatsQuery.isSuccess &&
        groupsQuery.isSuccess && (
          <Formik
            initialValues={
              initialValues
                ? initialValues
                : {
                    name: "",
                    description: "",
                    disposition: 0,
                    subject: "",
                    group: 0,
                    format: 0,
                  }
            }
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required"),
              description: Yup.string().required("Description is required"),
              disposition: Yup.number().moreThan(
                0,
                "Select an appropriate disposition"
              ),
              format: Yup.number().moreThan(0, "Select an appropriate format"),
              subject: Yup.string().required("Subject is required"),
              group: Yup.number().moreThan(0, "Select an appropriate group"),
            })}
            onSubmit={(values) => submitForm(values, editorValue.current)}
          >
            {({ submitForm, errors }) => (
              <Paper>
                <Form>
                  <Container maxWidth="md">
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      placeholder="Name of the template"
                      label="Name"
                    />

                    <Field
                      id="description"
                      name="description"
                      type="text"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      label="Description"
                    />

                    <LSDBSelectField
                      fieldId="disposition"
                      fieldName="disposition"
                      fieldDisplayName="Disposition"
                      fullWidth={true}
                      errors={errors.disposition}
                      options={dispositionsQuery.data}
                      mappingFunction={(disposition) => (
                        <MenuItem value={disposition.id}>
                          {disposition.name}
                        </MenuItem>
                      )}
                    />

                    <LSDBSelectField
                      fieldId="group"
                      fieldName="group"
                      fieldDisplayName="Group"
                      fullWidth={true}
                      errors={errors.group}
                      options={groupsQuery.data}
                      mappingFunction={(group) => (
                        <MenuItem value={group.id}>{group.name}</MenuItem>
                      )}
                    />

                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <LSDBSelectField
                          fieldId="format"
                          fieldName="format"
                          fieldDisplayName="Format"
                          fullWidth={false}
                          errors={errors.format}
                          options={fileFormatsQuery.data}
                          mappingFunction={(format: any) => (
                            <MenuItem value={format.id}>{format.name}</MenuItem>
                          )}
                        />
                      </Grid>

                      <Grid item xs={10}>
                        <Field
                          id="subject"
                          name="subject"
                          type="text"
                          fullWidth
                          component={TextField}
                          label="Subject"
                          placeholder="The subject for the email"
                        />
                      </Grid>
                    </Grid>

                    <LSDBMonacoEditor
                      title="Template Body"
                      editorLanguage="html"
                      value={editorValue.current}
                      onChangeCb={(value: any) => {
                        editorValue.current = value;
                      }}
                    />

                    <Grid
                      container
                      spacing={3}
                      direction="row"
                      justifyContent="space-around"
                      alignItems="center"
                      style={{ paddingBottom: 32 }}
                    >
                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            submitForm();
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </Container>
                </Form>
              </Paper>
            )}
          </Formik>
        )}
    </>
  );
};

export default TemplateForm;
