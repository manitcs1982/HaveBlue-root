import {
  Grid,
  Backdrop,
  CircularProgress,
  LinearProgress,
} from "@material-ui/core";

import { EgressMainTable } from "./egressTables/EgressMainTable";

import { ErrorMessage } from "../common/ErrorMessage";

import { useVerifyData } from "./dataEgressQueries";

export const DataLandingPage = () => {

  const {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  } = useVerifyData();

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isFetching) {
    return (
        <Grid
          container
          direction="row"
          /*justify="flex-start"*/
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return (
      <EgressMainTable rowData={data} />
  );
};
