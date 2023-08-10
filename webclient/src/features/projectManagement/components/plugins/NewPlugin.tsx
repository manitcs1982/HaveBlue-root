import React from "react";
import {
  Button,
  Container,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import Editor from "@monaco-editor/react";
import { useDispositions } from "../../../common/services/dispositionServices";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { useGroups } from "../../projectManagementQueries";
import { useCreatePlugin } from "../../projectManagementMutations";
import { PostPlugin } from "../../types/Plugin";
import { useAuthContext } from "../../../common/AuthContext";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import LSDBSelectField from "../../../common/LSDBSelectField";

const NewPlugin = () => {
  const editorRef = React.useRef(null);
  const history = useHistory();
  const { state } = useAuthContext();
  const { mutateAsync: postNewPlugin } = useCreatePlugin();

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const {
    data: dispositionsData,
    error: dispositionsError,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
  } = useDispositions();

  const {
    data: groupsData,
    error: groupsError,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
  } = useGroups();

  if (isLoadingDispositions || isLoadingGroups) {
    return (
      <React.Fragment>
        <LinearProgress />
      </React.Fragment>
    );
  }

  if (isErrorDispositions || isErrorGroups) {
    return (
      <React.Fragment>
        {isErrorDispositions && <ErrorMessage error={dispositionsError} />}
        {isErrorGroups && <ErrorMessage error={groupsError} />}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Container>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h3">New Plugin</Typography>
          </Grid>

          <Grid item xs={12}>
            <Formik
              initialValues={{
                name: "",
                description: "",
                disposition: 0,
                revision: 0,
                group: 0,
                restricted: false,
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Name is required"),
                description: Yup.string().required("Description is required"),
                disposition: Yup.number().moreThan(
                  0,
                  "Select an appropriate disposition"
                ),
                revision: Yup.number().required("Revision is required"),
                group: Yup.number().moreThan(0, "Select an appropriate group"),
                //restricted: Yup.boolean(),
              })}
              onSubmit={async (values) => {
                let sourceCode = "";

                if (editorRef !== null && editorRef.current !== null) {
                  // @ts-ignore
                  sourceCode = editorRef.current.getValue();
                }

                const newPlugin: PostPlugin = {
                  author: state.id !== null ? +state.id : 1,
                  description: values.description,
                  disposition: +values.disposition,
                  group: +values.group,
                  name: values.name,
                  restricted: false,
                  source_code: sourceCode,
                  revision: values.revision,
                };

                try {
                  await postNewPlugin(newPlugin, {
                    onSuccess: ({ id }) => {
                      toast.success(`Created plugin`);
                      history.push(`${id}`);
                    },
                  });
                } catch (error) {
                  toast.error("Error while creating plugin");
                }
              }}
            >
              {({ submitForm, errors, values }) => {
                return (
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
                          placeholder="Name of the plugin"
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
                          options={dispositionsData}
                          mappingFunction={(disposition) => (
                            <MenuItem value={disposition.id}>
                              {disposition.name}
                            </MenuItem>
                          )}
                        />

                        <Field
                          id="revision"
                          name="revision"
                          type="text"
                          component={TextField}
                          style={{ marginBottom: 32 }}
                          label="revision"
                        />

                        <LSDBSelectField
                          fieldId="group"
                          fieldName="group"
                          fieldDisplayName="Group"
                          fullWidth={true}
                          errors={errors.group}
                          options={groupsData}
                          mappingFunction={(group: any) => (
                            <MenuItem value={group.id}>{group.name}</MenuItem>
                          )}
                        />

                        <InputLabel>Source Code</InputLabel>
                        <Editor
                          height="30vh"
                          language="python"
                          theme="vs-dark"
                          onMount={handleEditorDidMount}
                        />

                        {/*
                          <Field
                            id="restricted"
                            name="restricted"
                            type="checkbox"
                            fullWidth
                            component={CheckboxWithLabel}
                            style={{ marginTop: 32, marginBottom: 32 }}
                            Label={{
                              label: "Restricted",
                            }}
                          />
                        */}

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
                );
              }}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default NewPlugin;
