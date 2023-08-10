import React from "react";
import { Button, Typography, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core";

import Timer from "react-compound-timer";

export const LSDBTimer = () => {
  const theme = useTheme();
  return (
    <Timer
      initialTime={120000}
      direction="backward"
      startImmediately={false}
      formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
    >
      {({ start, resume, pause, stop, reset }: any) => (
        <div style={theme.container}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={4} md={2}>
              <Typography variant="h4">
                <Timer.Minutes /> :
                <Timer.Seconds />
              </Typography>
            </Grid>
            <Grid item xs={4} md={2}>
              <Button variant="outlined" onClick={start}>
                Start
              </Button>
            </Grid>
            <Grid item xs={4} md={2}>
              <Button variant="outlined" onClick={pause}>
                Pause
              </Button>
            </Grid>
            <Grid item xs={4} md={2}>
              <Button variant="outlined" onClick={resume}>
                Resume
              </Button>
            </Grid>
            <Grid item xs={4} md={2}>
              <Button variant="outlined" onClick={stop}>
                Stop
              </Button>
            </Grid>
            <Grid item xs={4} md={2}>
              <Button variant="outlined" onClick={reset}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </Timer>
  );
};
