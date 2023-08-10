import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Grid, useTheme } from "@material-ui/core";
import { TextField as FormikTextField } from "formik-material-ui";
import { Field, Formik, Form } from "formik";

import * as Yup from "yup";
import { TravelerComponent } from "./TravelerComponent";
import { Variants } from "framer-motion";

export const VirtualTravelerPage = () => {
  const theme = useTheme();
  const formikRef = React.useRef<any>();
  const serialNumberRef = React.useRef<any>();
  const [clearedValues, setClearedValues] = React.useState(false);
  const history = useHistory();

  const { serial_number } = useParams() as { serial_number: string };

  React.useEffect(() => {
    if (clearedValues) {
      formikRef.current.resetForm();
      history.push(`/project_management/virtual_traveler/`);
      serialNumberRef.current.focus();

      setClearedValues(false);
    }
  }, [clearedValues, setClearedValues]);

  return (
    <div style={theme.containerMargin}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={3}>
          <Formik
            innerRef={formikRef}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              serialNumberForm: "",
            }}
            validationSchema={Yup.object({
              serialNumberForm: Yup.string().required("Field Cannot Be Empty"),
            })}
            onSubmit={async (values, formikBag) => {
              await formikBag.validateForm();

              history.push(
                `/project_management/virtual_traveler/${values.serialNumberForm}`
              );
            }}
          >
            {({ errors, touched, submitForm }) => {
              return (
                <Form>
                  <Grid container direction="row" alignItems="center">
                    <Grid item xs={6}>
                      <Field
                        id="serialNumberForm"
                        name="serialNumberForm"
                        helperText={
                          touched.serialNumberForm
                            ? errors.serialNumberForm
                            : ""
                        }
                        error={
                          touched.serialNumberForm &&
                          Boolean(errors.serialNumberForm)
                        }
                        component={FormikTextField}
                        data-testid="serialNumberForm"
                        label="Serial Number"
                        margin="dense"
                        InputProps={{
                          inputRef: serialNumberRef,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        data-testid="submitSerialNumber"
                        variant="contained"
                        color="primary"
                        onClick={submitForm}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      data-testid="clearSerialNumber"
                      variant="contained"
                      color="primary"
                      onClick={() => setClearedValues(true)}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Grid>
        <Grid item xs={9}>
          {serial_number && (
            <TravelerComponent serialNumber={serial_number.toUpperCase()} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};
