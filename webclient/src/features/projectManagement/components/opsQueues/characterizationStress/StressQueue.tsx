import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTheme, makeStyles, Theme } from "@material-ui/core";

import { useStressQueue } from "../opsQueuesQueries";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { LSDBVerticalTabs } from "../../../../common/LSDBVerticalTabs";
import { StressCaracterizationTable } from "./StressCharacterizationTable";

const useStyles = makeStyles(() => ({
  tab: {
    marginRight: "300px",
    fontSize: "11px",
    textAlign: "left",
  },
}));

export const StressQueue = () => {
  const theme = useTheme();

  const { data = [], error, isLoading, isError } = useStressQueue();

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
    <LSDBVerticalTabs
      title="Stress Queue"
      data={data}
      useStyles={useStyles}
      component={StressCaracterizationTable}
    />
  );
};
