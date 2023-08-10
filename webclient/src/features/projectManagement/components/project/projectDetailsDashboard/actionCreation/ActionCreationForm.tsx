import React from "react";
import { Container, Button, Grid, MenuItem } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { Field } from "formik";

import { DateTimePicker } from "formik-material-ui-pickers";

export const ActionCreationForm = ({
  errors,
  touched,
  submitForm,
  resetForm,
  dispositions,
  actionDefinitionsData,
  groups,
}: any) => {
  return (
    <>
      <Field
        id="name"
        type="text"
        name="name"
        fullWidth
        component={TextField}
        helperText={touched.name ? errors.name : ""}
        error={touched.name && Boolean(errors.name)}
        style={{ marginBottom: 32 }}
        label="Name"
        data-testid="name"
      ></Field>
      <Field
        name="description"
        helperText={touched.description ? errors.description : ""}
        error={touched.description && Boolean(errors.description)}
        component={TextField}
        data-testid="description"
        label="Description"
        style={{ marginBottom: 32 }}
        placeholder="Write a description"
        fullWidth
        margin="dense"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Field
        id="disposition"
        type="text"
        name="disposition"
        select={true}
        fullWidth
        helperText={touched.disposition ? errors.disposition : ""}
        error={touched.disposition && Boolean(errors.disposition)}
        component={TextField}
        data-testid="disposition"
        placeholder="Choose a disposition"
        label="Disposition"
        style={{ marginBottom: 32 }}
      >
        {dispositions?.map((disposition: any) => (
          <MenuItem key={disposition.id} value={disposition.id}>
            {disposition.name}
          </MenuItem>
        ))}
      </Field>
      <Field
        name="action_definition"
        helperText={touched.action_definition ? errors.action_definition : ""}
        error={touched.action_definition && Boolean(errors.action_definition)}
        component={TextField}
        select={true}
        data-testid="action_definition"
        label="Action Definition"
        style={{ marginBottom: 32 }}
        fullWidth
        margin="dense"
        InputLabelProps={{
          shrink: true,
        }}
      >
        {actionDefinitionsData?.map((actionResult: any) => (
          <MenuItem value={actionResult.id}>{actionResult.name}</MenuItem>
        ))}
      </Field>
      <Field
        id="execution_group"
        type="number"
        name="execution_group"
        fullWidth
        helperText={touched.execution_group ? errors.execution_group : ""}
        error={touched.execution_group && Boolean(errors.execution_group)}
        component={TextField}
        data-testid="execution_group"
        label="Execution Group"
        style={{ marginBottom: 32 }}
      ></Field>
      <Field
        id="groups"
        type="text"
        name="groups"
        select={true}
        SelectProps={{
          multiple: true,
        }}
        fullWidth
        helperText={touched.groups ? errors.groups : ""}
        error={touched.groups && Boolean(errors.groups)}
        component={TextField}
        data-testid="groups"
        label="Groups"
        style={{ marginBottom: 32 }}
      >
        {groups?.map((group: any) => (
          <MenuItem key={group.id} value={group.id}>
            {group.name}
          </MenuItem>
        ))}
      </Field>
      <Field
        id="promise_datetime"
        type="text"
        name="promise_datetime"
        fullWidth
        component={DateTimePicker}
        format="YYYY-MM-DD HH:mm:ss"
        helperText={touched.promise_datetime ? errors.promise_datetime : ""}
        error={touched.promise_datetime && Boolean(errors.promise_datetime)}
        style={{ marginBottom: 32 }}
        label="Promise Datetime"
        data-testid="promise_datetime"
      ></Field>
      <Field
        id="eta_datetime"
        type="text"
        name="eta_datetime"
        fullWidth
        component={DateTimePicker}
        format="YYYY-MM-DD HH:mm:ss"
        helperText={touched.eta_datetime ? errors.eta_datetime : ""}
        error={touched.eta_datetime && Boolean(errors.eta_datetime)}
        style={{ marginBottom: 32 }}
        label="Eta Datetime"
        data-testid="eta_datetime"
      ></Field>
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
            data-testid="submitWorkOrderAction"
            variant="contained"
            color="primary"
            onClick={submitForm}
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => resetForm()}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
