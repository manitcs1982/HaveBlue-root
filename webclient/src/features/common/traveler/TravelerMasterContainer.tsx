import React from "react";
import Grid from "@material-ui/core/Grid";
import { useTravelerStyles } from "./TravelerStyles";

export const TravelerMasterContainer = ({ children }: any) => {
  const classes = useTravelerStyles();

  return (
    <Grid item xs={8} className={classes.baseBorder}>
      <Grid container>{children}</Grid>
    </Grid>
  );
};
