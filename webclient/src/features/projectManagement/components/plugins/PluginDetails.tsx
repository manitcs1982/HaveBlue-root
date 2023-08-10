import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useGroups, usePlugin } from "../../projectManagementQueries";
import {
  Button,
  ButtonBase,
  Container,
  Checkbox,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
  TextField as MaterialTextField,
  FormGroup,
  FormControlLabel
} from "@material-ui/core";
import { ErrorMessage } from "../../../common/ErrorMessage";
import Editor from "@monaco-editor/react";
import * as Yup from "yup";
import { PostPlugin } from "../../types/Plugin";
import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-material-ui";
import { useDispositions } from "../../../common/services/dispositionServices";
import {
  useRunPlugin,
  useTestPlugin,
  useUpdatePlugin,
} from "../../projectManagementMutations";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import CodeIcon from "@material-ui/icons/Code";
import moment from "moment";

const PluginDetails = () => {
  const { pluginId } = useParams<any>();
  const [inputVariables, setInputVariables] = React.useState<string>("");
  const [pluginExecutionOutput, setPluginExecutionOutput] =
    React.useState<string>("This is the code execution output");
  const [isErrorInputVariables, setIsErrorInputVariables] =
    React.useState<boolean>(false);
  const editorRef = React.useRef(null);
  const [serialize, setSerialize] = React.useState(true)
  const history = useHistory();
  const { mutateAsync: putUpdatedPlugin } = useUpdatePlugin();
  const { mutateAsync: testPlugin } = useTestPlugin();
  const { mutateAsync: runPlugin } = useRunPlugin();

  const handleChange = (event : any) => {
    setSerialize(event.target.checked);
  }

  const {
    data: pluginData,
    error: pluginError,
    isLoading: isLoadingPlugin,
    isError: isErrorPlugin,
  } = usePlugin(pluginId);

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

  if (isLoadingPlugin || isLoadingDispositions || isLoadingGroups) {
    return (
      <React.Fragment>
        <LinearProgress />
      </React.Fragment>
    );
  }

  if (isErrorPlugin || isErrorDispositions || isErrorGroups) {
    return (
      <React.Fragment>
        {isErrorPlugin && <ErrorMessage error={pluginError} />}
        {isErrorDispositions && <ErrorMessage error={dispositionsError} />}
        {isErrorGroups && <ErrorMessage error={groupsError} />}
      </React.Fragment>
    );
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid container item xs={12}>
          {pluginData !== undefined && (
            <React.Fragment>
              <Grid container item xs={12}>
                <Grid item xs={10}>
                  <Typography variant="h3">
                    Details for plugin {pluginData.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary">
                    Review Plugin
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">
                  Author: {pluginData.author_name}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">
                  Reviewer:
                  {pluginData.reviewed_by_user === null ? (
                    <span style={{ color: "#adadad" }}> N/A </span>
                  ) : (
                    pluginData.reviewer_name
                  )}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Formik
                  initialValues={{
                    name: pluginData.name,
                    description: pluginData.description,
                    disposition: pluginData.disposition,
                    revision: pluginData.revision,
                    group: pluginData.group,
                    restricted: pluginData.restricted,
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().required("Name is required"),
                    description: Yup.string().required(
                      "Description is required"
                    ),
                    disposition: Yup.string(),
                    revision: Yup.number().required("revision is required"),
                    group: Yup.string(),
                    restricted: Yup.boolean(),
                  })}
                  onSubmit={async (values) => {
                    let sourceCode = "";

                    if (editorRef !== null && editorRef.current !== null) {
                      // @ts-ignore
                      sourceCode = editorRef.current.getValue();
                    }

                    const modifiedPlugin: PostPlugin = {
                      author: pluginData.author,
                      name: values.name,
                      description: values.description,
                      disposition: values.disposition,
                      group: values.group,
                      revision: values.revision,
                      source_code: sourceCode,
                      restricted: values.restricted,
                      reviewed_by_user: pluginData.reviewed_by_user,
                      reviewed_datetime: pluginData.review_datetime,
                    };

                    try {
                      await putUpdatedPlugin(
                        { pluginId, updatedPlugin: modifiedPlugin },
                        {
                          onSuccess: ({ id }) => {
                            toast.success("Modified plugin successfully");
                            history.push(`${id}`);
                          },
                        }
                      );
                    } catch (error) {
                      toast.error("Error while updating plugin");
                    }
                  }}
                >
                  {({ submitForm }) => {
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
                              style={{ marginTop: 16, marginBottom: 32 }}
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

                            <InputLabel htmlFor="disposition">
                              Disposition
                            </InputLabel>
                            <Field
                              id="disposition"
                              name="disposition"
                              fullWidth
                              component={Select}
                              style={{ marginBottom: 32 }}
                            >
                              <MenuItem value="0">
                                Select a disposition
                              </MenuItem>
                              {dispositionsData !== undefined &&
                                dispositionsData.map((disposition) => (
                                  <MenuItem value={disposition.id}>
                                    {disposition.name}
                                  </MenuItem>
                                ))}
                            </Field>

                            <Field
                              id="revision"
                              name="revision"
                              type="text"
                              component={TextField}
                              style={{ marginBottom: 32 }}
                              label="revision"
                            />

                            <InputLabel htmlFor="group">Group</InputLabel>
                            <Field
                              id="group"
                              name="group"
                              fullWidth
                              component={Select}
                              style={{ marginBottom: 32 }}
                            >
                              <MenuItem value="0">Select a group</MenuItem>
                              {groupsData !== undefined &&
                                groupsData.map((group: any) => (
                                  <MenuItem value={group.id}>
                                    {group.name}
                                  </MenuItem>
                                ))}
                            </Field>

                            <InputLabel>Source Code</InputLabel>
                            <Editor
                              height="30vh"
                              language="python"
                              theme="vs-dark"
                              value={pluginData.source_code}
                              onMount={handleEditorDidMount}
                            />

                            {/*
                            <Field
                              id="restricted"
                              name="restricted"
                              type="checkbox"
                              disabled={
                                !(
                                  userData.groups.includes(8) ||
                                  userData.groups.includes(4)
                                )
                              }
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
            </React.Fragment>
          )}
        </Grid>

        <Grid
          item
          container
          xs={12}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography variant="h3">Code Actions</Typography>
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Container>
                <Grid
                  container
                  item
                  xs={12}
                  style={{ paddingTop: 16, paddingBottom: 16 }}
                >
                  <Grid item xs={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={serialize}
                          onChange={handleChange}
                          name="image_check"
                          color="primary"
                        />
                      }
                      label="Serialize"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Tooltip title="This runs the _test method on the plugin">
                      <ButtonBase
                        style={{
                          padding: "5px 15px",
                          border: "1px solid #e2da2c",
                          borderRadius: "5%",
                        }}
                        onClick={async () => {
                          setIsErrorInputVariables(false);
                          await testPlugin({pluginId, serialize}, {
                            onSuccess: (data) => {
                              if (serialize) {
                                setPluginExecutionOutput(JSON.stringify(data))
                              } else {
                                // var binaryData = [];
                                // binaryData.push(data);
                                // const downloadUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/x-zip-compressed"}));
                                // console.log(downloadUrl)
                                // let a = document.createElement("a");
                                // a.href = downloadUrl;
                                // a.download = `${moment().format("MMM-DD-YYYY-HHMMSS")}.zip`;
                                // document.body.appendChild(a);
                                // a.click();
                              }
                          }});
                        }}
                      >
                        <DeveloperModeIcon style={{ color: "#C4BC27" }} />
                        <span style={{ color: "#e2da2c" }}>TEST PLUGIN</span>
                      </ButtonBase>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={2}>
                    <Tooltip title="This runs the _run method on the plugin. For this to work you need to input the variables this method expects to receive.">
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<CodeIcon />}
                        onClick={async () => {
                          let variablesToParse = "{}";
                          if (inputVariables !== "") {
                            variablesToParse = inputVariables;
                          }

                          try {
                            setIsErrorInputVariables(false);
                            const jsonVariables = JSON.parse(variablesToParse);
                            await runPlugin(
                              { pluginId, inputVariables: jsonVariables, serialize },
                              {
                                onSuccess: (data) => {
                                  if (serialize) {
                                    setPluginExecutionOutput(JSON.stringify(data))
                                  }
                                }
                              }
                            );
                          } catch (e) {
                            setIsErrorInputVariables(true);
                            setPluginExecutionOutput(e.message);
                          }
                        }}
                      >
                        Run Plugin
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={7}>
                    <MaterialTextField
                      label="Input Variables"
                      error={isErrorInputVariables}
                      onChange={(event) => {
                        setInputVariables(event.target.value);
                        setIsErrorInputVariables(false);
                      }}
                      helperText={`This should be in JSON. Example for a function requiring variables a and b, both numbers: {"a": 3, "b": 4}`}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5">Output</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    {pluginExecutionOutput}
                  </Typography>
                </Grid>
              </Container>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PluginDetails;
