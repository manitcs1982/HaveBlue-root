import React from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  MenuItem,
  Button,
  Typography,
  Grid,
  Backdrop,
  CircularProgress,
  Paper,
  List,
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import { TextField } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { DropzoneArea } from "material-ui-dropzone";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { Customer } from "../../../common/types/customer.type";
import { useCustomers } from "../../../projectManagement/projectManagementQueries";
import { useCrateDispositions } from "../../../common/services/dispositionServices";
import {
  useCrateDetails,
  useCrateNotes,
  useProjects,
} from "../../intakeQueries";
import { useUpdateCrate, useLinkFileToCrate } from "../../intakeMutations";
import { useFetchContext } from "../../../common/FetchContext";
import { useAuthContext } from "../../../common/AuthContext";
import { ViewNote } from "../../../common/ViewNoteDialog";
import { ViewAddNoteList } from "../../../common/ViewAddNotes";

import { usePostFile } from "../../../common/services/fileServices";

import { ErrorMessage } from "../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../util/errorMessaging";
import { ImageDownloader } from "../../../common/ImageDownloader";
import { ImageDownloaderVariants } from "../../../common/enums";

export const EditCratePage = () => {
  const { authAxios } = useFetchContext();
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const { id } = useParams() as {
    id: string;
  };
  const { mutateAsync: mutateUpdateCrate } = useUpdateCrate();
  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFileToCrate } = useLinkFileToCrate();
  const {
    error: errorCustomers,
    data: customers,
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers,
  } = useCustomers();
  const {
    error: errorDispositions,
    data: dispositions,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
  } = useCrateDispositions();

  const {
    error: errorCrateDetails,
    data: crateDetails,
    isLoading: isLoadingCrateDetails,
    isError: isErrorCrateDetails,
  } = useCrateDetails(id, customers, dispositions);

  const {
    error: errorProjects,
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
  } = useProjects();

  const [files, setFiles] = React.useState([]);

  const [viewNote, setViewNote] = React.useState(false);

  const [selectedNote, setSelectedNote] = React.useState({});

  const handleClose = () => {
    setViewNote(!viewNote);
  };

  const handleClick = (e: any) => {
    setSelectedNote(e);
    handleClose();
  };

  if (
    isErrorCustomers ||
    isErrorDispositions ||
    isErrorCrateDetails ||
    isErrorProjects
  ) {
    return (
      <>
        {isErrorCrateDetails && <ErrorMessage error={errorCrateDetails} />}
        {isErrorDispositions && <ErrorMessage error={errorDispositions} />}
        {isErrorCustomers && <ErrorMessage error={errorCustomers} />}
        {isErrorProjects && <ErrorMessage error={errorProjects} />}
      </>
    );
  }

  if (
    isLoadingCrateDetails ||
    isLoadingDispositions ||
    isLoadingCustomers ||
    isLoadingProjects
  ) {
    return (
      <Backdrop
        open={
          isLoadingCrateDetails ||
          isLoadingDispositions ||
          isLoadingCustomers ||
          isLoadingProjects
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const handleFileChange = (uploadedFiles: any) => {
    setFiles(uploadedFiles);
  };

  return (
    <>
      <Formik
        initialValues={{
          shippedBy: crateDetails?.shipped_by,
          crateNameId: crateDetails?.name,
          project: crateDetails?.project,
          agent: crateDetails?.shipping_agent,
          dateTimeReceived: crateDetails?.received_date,
          disposition: crateDetails?.disposition,
        }}
        validationSchema={Yup.object({
          shippedBy: Yup.string().required("Field must be required"),
          agent: Yup.string().required("Field must be required"),
          crateNameId: Yup.string().required("Field must be required"),
          project: Yup.string(),
          dateTimeReceived: Yup.string().required("Field must be required"),
          disposition: Yup.string().required("Field must be required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            console.log("Form values", JSON.stringify(values));

            const editedCrateData = await mutateUpdateCrate({
              authAxios,
              name: values.crateNameId,
              project: values.project,
              shipped_by: values.shippedBy,
              shipping_agent: values.agent,
              disposition: values.disposition,
              received_date: values.dateTimeReceived,
              id,
            });
            if (files.length > 0) {
              for (let file of files) {
                const postedFile = await mutatePostFile({ authAxios, file });
                await mutateLinkFileToCrate({
                  authAxios,
                  fileId: postedFile.id,
                  crateId: editedCrateData.id,
                });
              }
            }

            setSubmitting(false);
            toast.success("Crate was succesfully updated");
          } catch (error) {
            toast.error("Error while modifying crate");
            processErrorOnMutation(error, dispatch, history);
          }
        }}
      >
        {({ errors, touched, submitForm }) => (
          <Form>
            <Container maxWidth="sm">
              <Field
                id="shippedBy"
                type="text"
                name="shippedBy"
                select={true}
                fullWidth
                component={TextField}
                helperText={touched.shippedBy ? errors.shippedBy : ""}
                error={touched.shippedBy && Boolean(errors.shippedBy)}
                style={{ marginBottom: 32 }}
                label="Shipped By"
                data-testid="shippedById"
              >
                {customers?.map((customer: Customer) => (
                  <MenuItem key={customer.id} value={customer.url}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Field>

              <Field
                name="agent"
                helperText={touched.agent ? errors.agent : ""}
                error={touched.agent && Boolean(errors.agent)}
                component={TextField}
                data-testid="agent"
                label="Shipping Agent"
                style={{ marginBottom: 32 }}
                placeholder="Add Shipping Agent"
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Field
                name="crateNameId"
                helperText={touched.crateNameId ? errors.crateNameId : ""}
                error={touched.crateNameId && Boolean(errors.crateNameId)}
                component={TextField}
                data-testid="crateNameId"
                label="Crate Name/Id"
                style={{ marginBottom: 32 }}
                placeholder="Write a crate name"
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Field
                id="project"
                type="text"
                name="project"
                select={true}
                fullWidth
                component={TextField}
                helperText={touched.project ? errors.project : null}
                error={touched.project && Boolean(errors.project)}
                style={{ marginBottom: 32 }}
                label="Project"
                data-testid="project"
              >
                {projects?.map((project: any) => (
                  <MenuItem key={project.id} value={project.project}>
                    {project.project_number}
                  </MenuItem>
                ))}
              </Field>

              <Grid
                container
                spacing={3}
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <Field
                    name="dateTimeReceived"
                    component={DateTimePicker}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ marginBottom: 32 }}
                    label="Date Received"
                    inputVariant="outlined"
                    data-testid="dateReceivedId"
                  />
                </Grid>
              </Grid>

              <ViewAddNoteList
                id={id}
                type={1}
                model={"crate"}
                invalidate={[
                  ["crateNotes", id],
                  ["crateDetails", id],
                ]}
                count={crateDetails.notes[0]?.count}
                getNotes={useCrateNotes}
              />

              <Field
                id="disposition"
                type="text"
                data-testid="dispositionId"
                name="disposition"
                helperText={touched.disposition ? errors.disposition : ""}
                error={touched.disposition && Boolean(errors.disposition)}
                component={TextField}
                select={true}
                label="Disposition"
                style={{ marginBottom: 32, marginTop: 12 }}
                fullWidth
              >
                {dispositions?.map((disposition) => (
                  <MenuItem key={disposition.id} value={disposition.url}>
                    {disposition.name}
                  </MenuItem>
                ))}
              </Field>

              {crateDetails?.crate_images.length > 0 && (
                <>
                  <Typography gutterBottom variant="subtitle1">
                    Uploaded Files
                  </Typography>
                  <Paper>
                    <List component="nav" aria-label="main mailbox folders">
                      {crateDetails?.crate_images.map((image: any) => (
                        <ListItem>
                          <ImageDownloader
                            url={image.file}
                            name={image.name}
                            label={image.name}
                            variant={ImageDownloaderVariants.ListItem}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </>
              )}
              <Typography gutterBottom variant="subtitle1">
                Upload Image(s) optional
              </Typography>
              <DropzoneArea
                acceptedFiles={["image/*", ".pdf"]}
                onChange={(files) => handleFileChange(files)}
                filesLimit={
                  process.env.REACT_APP_FILE_LIMIT
                    ? parseInt(process.env.REACT_APP_FILE_LIMIT)
                    : 20
                }
                maxFileSize={12000000}
                data-testid="fileUploadCrate"
              />

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
                    data-testid="submitCrateId"
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
                <Grid item xs={12}>
                  <Button
                    data-testid="return"
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/operations/intake/crate`}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Form>
        )}
      </Formik>
      <ViewNote note={selectedNote} open={viewNote} handleClose={handleClose} />
    </>
  );
};
