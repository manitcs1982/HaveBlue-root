import { useProjects } from "../../intakeQueries";
import { useIsFetching } from "react-query";
import { UnitIntakeProjectsTable } from "./UnitIntakeProjectsTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import LinearProgress from "@material-ui/core/LinearProgress";
import { useTheme } from "@material-ui/core";

import { ErrorMessage } from "../../../common/ErrorMessage";

export const UnitIntakePage = () => {
  const isFetching = useIsFetching();
  const theme = useTheme();
  const {
    data: projectsData,
    error: errorProjectsData,
    isLoading: isLoadingProjectsData,
    isError: isErrorProjectsData,
    isSuccess: isSuccessProjectsData,
  } = useProjects();

  if (isLoadingProjectsData) {
    return (
      <Backdrop open={isLoadingProjectsData}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (isErrorProjectsData)
    return (
      <>{isErrorProjectsData && <ErrorMessage error={errorProjectsData} />}</>
    );

  return (
    <>
      {isFetching ? (
        <Typography variant="body2">Refreshing...</Typography>
      ) : null}

      {isLoadingProjectsData && (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={theme.container}
        >
          <Grid item xs={12} spacing={10}>
            <LinearProgress />
          </Grid>
        </Grid>
      )}

      {isSuccessProjectsData && <UnitIntakeProjectsTable data={projectsData} />}
    </>
  );
};
