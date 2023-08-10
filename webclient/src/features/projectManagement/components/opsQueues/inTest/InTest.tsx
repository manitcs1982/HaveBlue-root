import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTheme, makeStyles, Theme } from "@material-ui/core";

import { useUnitsInProgress } from "../opsQueuesQueries";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { LSDBVerticalTabs } from "../../../../common/LSDBVerticalTabs";
import { InTestTable } from "./InTestTable";

const useStyles = makeStyles(() => ({
  tab: {
    marginRight: "100px",
    fontSize: "11px",
    textAlign: "left",
  },
}));

export const InTest = () => {
  const theme = useTheme();

  const { data = [], error, isLoading, isError } = useUnitsInProgress();

  if (isLoading) {
    return (
      <div style={theme.containerMargin}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <CircularProgress color="inherit" />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <LSDBVerticalTabs
        title="In Test"
        data={data}
        useStyles={useStyles}
        component={InTestTable}
      />
    </>
  );
};
