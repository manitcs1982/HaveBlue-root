import React from "react";
import Grid from "@material-ui/core/Grid";

export const TravelerContainer = ({ children }: any) => (
  <Grid container direction="row">
    {children}
  </Grid>
);
