import React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core/";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { ErrorMessage } from "../../../common/ErrorMessage";

import { useMyProjects } from "../../projectQueries";
import { MyProjectsTable } from "./myProjectsTable";

import CircularProgress from "@material-ui/core/CircularProgress";

export const MyProjectsPage = () => {
  const [archived, setArchived] = React.useState(false);

  const {
    data = [],
    error,
    isLoading,
    isError,
    isSuccess,
  } = useMyProjects(archived);

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isError) {
    return <>{isError && <ErrorMessage error={error} />}</>;
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={10}>
          <Typography variant="h3"> My Projects </Typography>
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={archived}
                onChange={() => {
                  setArchived(!archived);
                }}
                name="archived"
              />
            }
            label="View Inactive"
          />
        </Grid>
        <Grid item xs={12}>
          {isSuccess && <MyProjectsTable data={data} />}
        </Grid>
      </Grid>
    </>
  );
};
