import React from "react";
import Grid from "@material-ui/core/Grid";
import { useTravelerStyles } from "./TravelerStyles";
import Typography from "@material-ui/core/Typography";

export const TravelerMasterRow = ({ header, data }: any) => {
  const classes = useTravelerStyles();

  return (
    <>
      <Grid item xs={3} className={classes.baseBorder}>
        <Typography variant="body2" align="center">
          {header}
        </Typography>
      </Grid>
      <Grid item xs={3} className={classes.baseBorder}>
        {data ? (
          <Typography variant="body2" align="center">
            {data}
          </Typography>
        ) : (
          <Typography variant="body2" align="center" style={{ color: "grey" }}>
            N/A
          </Typography>
        )}
      </Grid>
    </>
  );
};
