import NewModelPage from "../../../common/NewModelPage";
import React from "react";
import { useCreateTemplate } from "../../adminMutations";
import { Template } from "../../types/Template";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import TemplateForm from "./TemplateForm";

const NewTemplate = () => {
  const history = useHistory();
  const { mutateAsync: postNewTemplate } = useCreateTemplate();

  return (
    <NewModelPage pageTitle="New Template">
      <TemplateForm
        submitForm={async (values, editorValue) => {
          const newTemplate: Template = {
            body_source: editorValue,
            group: values.group,
            subject_source: values.subject,
            name: values.name,
            description: values.description,
            disposition: values.disposition,
            format: values.format,
          };

          try {
            await postNewTemplate(newTemplate, {
              onSuccess: ({ id }) => {
                toast.success("Created template");
                history.push(`${id}`);
              },
            });
          } catch (e) {
            toast.error(`Error while creating template`);
          }
        }}
      />
      {/*<Formik
        initialValues={{
          name: "",
          description: "",
          disposition: 0,
          subject: "",
          format: 0,
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("Name is required"),
          description: Yup.string().required("Description is required"),
          disposition: Yup.number().moreThan(
            0,
            "Select an appropriate disposition"
          ),
          format: Yup.number().moreThan(0, "Select an appropriate format"),
          subject: Yup.string().required("Subject is required"),
        })}
        onSubmit={async (values) => {
          const newTemplate: Template = {
            body_source: editorValue,
            group: 0,
            subject_source: values.subject,
            name: values.name,
            description: values.description,
            disposition: values.disposition,
            format: values.format,
          };

          try {
            await postNewTemplate(newTemplate, {
              onSuccess: ({ id }) => {
                toast.success("Created template");
                history.push(`${id}`);
              },
            });
          } catch (e) {
            toast.error(`Error while creating template`);
          }
        }}
      >
        {({ submitForm, errors, values }) => (
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
                  options={[]}
                  mappingFunction={(disposition: any) => (
                    <MenuItem value={disposition.id}>
                      {disposition.name}
                    </MenuItem>
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
                      options={[]}
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
                  onChangeCb={(value: any) => (editorValue = value)}
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
      </Formik>*/}
    </NewModelPage>
  );
};

export default NewTemplate;
