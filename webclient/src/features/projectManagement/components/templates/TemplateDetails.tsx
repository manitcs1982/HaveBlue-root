import { useHistory, useParams } from "react-router-dom";
import NewModelPage from "../../../common/NewModelPage";
import { Template } from "../../types/Template";
import { toast } from "react-toastify";
import { LinearProgress, Typography } from "@material-ui/core";
import React from "react";
import { useTemplate } from "../../adminQueries";
import { useUpdateTemplate } from "../../adminMutations";
import { ErrorMessage } from "../../../common/ErrorMessage";
import TemplateForm from "./TemplateForm";

const TemplateDetails = () => {
  const { templateId } = useParams<any>();
  const history = useHistory();
  const { mutateAsync: updateTemplate } = useUpdateTemplate();

  const templateQuery = useTemplate(templateId, {
    enabled: templateId && templateId !== 0,
  });

  const editorValue = React.useRef<string>("");

  React.useEffect(() => {
    if (templateQuery.isSuccess) {
      editorValue.current = templateQuery.data.body_source;
    }
  }, [templateQuery.data, templateQuery.isSuccess]);

  if (templateQuery.isLoading) {
    return <LinearProgress />;
  }

  if (templateQuery.isError) {
    return (
      <>
        {templateQuery.isError && <ErrorMessage error={templateQuery.error} />}
      </>
    );
  }

  return (
    <NewModelPage pageTitle="Template Details">
      {templateQuery.isSuccess && templateQuery.data ? (
        <TemplateForm
          initialValues={{
            name: templateQuery.data.name,
            description: templateQuery.data.description,
            disposition: templateQuery.data.disposition,
            subject: templateQuery.data.subject_source,
            format: templateQuery.data.format,
            group: templateQuery.data.group,
          }}
          initialEditorValue={templateQuery.data.body_source}
          submitForm={async (values, editorValue) => {
            const updatedTemplate: Template = {
              name: values.name,
              description: values.description,
              disposition: values.disposition,
              group: values.group,
              format: values.format,
              subject_source: values.subject,
              body_source: editorValue,
            };

            try {
              await updateTemplate(
                { id: templateId, updatedTemplate },
                {
                  onSuccess: ({ id }) => {
                    toast.success("Updated template");
                    history.push(`${id}`);
                  },
                }
              );
            } catch (e) {
              toast.error(`Error while updating template`);
            }
          }}
        />
      ) : (
        <Typography variant="h4">No Template with ID {templateId}</Typography>
      )}
      {/*{templateQuery.isSuccess &&
        dispositionQuery.isSuccess &&
        fileTypesQuery.isSuccess && (
          <Formik
            initialValues={{
              name: templateQuery.data.name,
              description: templateQuery.data.description,
              disposition: templateQuery.data.disposition,
              subject: templateQuery.data.subject_source,
              format: templateQuery.data.format,
              group: templateQuery.data.group,
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
              group: Yup.number().moreThan(0, "Select an appropriate group"),
            })}
            onSubmit={async (values) => {
              const updatedTemplate: Template = {
                name: values.name,
                description: values.description,
                disposition: values.disposition,
                group: templateQuery.data.group,
                format: values.format,
                subject_source: values.subject,
                body_source: editorValue.current,
              };

              try {
                await updateTemplate(
                  { id: templateId, updatedTemplate },
                  {
                    onSuccess: ({ id }) => {
                      toast.success("Updated template");
                      history.push(`${id}`);
                    },
                  }
                );
              } catch (e) {
                toast.error(`Error while updating template`);
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
                      options={dispositionQuery.data}
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
                          options={fileTypesQuery.data}
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
                      value={templateQuery.data.body_source}
                      onChangeCb={(value: any) => (editorValue.current = value)}
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
        )}*/}
    </NewModelPage>
  );
};

export default TemplateDetails;
