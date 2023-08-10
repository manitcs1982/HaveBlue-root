import React from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { useCreateLabel, useLabels } from "../../projectQueries";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { useFetchContext } from "../../../common/FetchContext";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { LabelDisplay } from "./LabelsTable";
import LSDBColorPicker from "../../../common/LSDBColorPicker";

export const TagCreation = () => {
  const { authAxios } = useFetchContext();
  const [hexColor, setHexColor] = React.useState("#000000");
  const { mutateAsync: mutate } = useCreateLabel();
  const queryClient = useQueryClient();

  const handleColorChange = (color: string) => {
    console.log(color);
    setHexColor(color);
  };

  const {
    data: labels = [],
    isLoading: isLoadingLabels,
    isError: isErrorLabels,
    error: errorLabels,
  } = useLabels();

  if (isLoadingLabels) {
    return (
      <Backdrop open={isLoadingLabels}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorLabels) {
    return <ErrorMessage error={errorLabels} />;
  }

  return (
    <Container>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3">New Label</Typography>
        </Grid>
      </Grid>
      <Formik
        initialValues={{ name: "", description: "", hexColor: "#ffffff" }}
        validationSchema={Yup.object({
          name: Yup.string().required("Name is required"),
          description: Yup.string().required("Description is required"),
          hexColor: Yup.string().required("Color is required"),
        })}
        onSubmit={async (values) => {
          console.log(`Hex Color: ${hexColor}`);
          try {
            await mutate(
              {
                labelData: {
                  name: values.name,
                  description: values.description,
                  hex_color: hexColor,
                },
                authAxios,
              },
              {
                onSuccess: () => {
                  toast.success("Successfully registed label");
                  queryClient.invalidateQueries("labels");
                },
              }
            );
          } catch (error) {
            toast.error("Error while creating label");
          }
        }}
      >
        {({ submitForm, values }) => {
          return (
            <>
              <Paper>
                <Form>
                  <Container maxWidth="md">
                    <Typography variant="h6" style={{ marginTop: 12 }}>
                      <b>
                        {" "}
                        Please use the search columns below to find an
                        appropriate label before creating an new one.{" "}
                      </b>
                    </Typography>
                    <Field
                      id="name"
                      type="text"
                      name="name"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32, marginTop: 32 }}
                      placeholder="A descriptive name for the new label"
                      label="Label Name"
                    />

                    <Field
                      id="description"
                      type="text"
                      name="description"
                      fullWidth
                      component={TextField}
                      style={{ marginBottom: 32 }}
                      placeholder="A description for the label"
                      label="Label Description"
                    />

                    <LSDBColorPicker
                      chipLabel="Label Color"
                      onChange={handleColorChange}
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
              <LabelDisplay labels={labels} />
            </>
          );
        }}
      </Formik>
    </Container>
  );
};
