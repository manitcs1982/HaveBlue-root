import React from "react";
import Grid from "@material-ui/core/Grid";
import { useTravelerStyles } from "./TravelerStyles";

export const TravelerNotesContainer = ({ children }: any) => {
  const classes = useTravelerStyles();

  return (
    <Grid item xs={4} className={classes.baseBorder}>
      <Grid container>{children}</Grid>
    </Grid>
  );
};
