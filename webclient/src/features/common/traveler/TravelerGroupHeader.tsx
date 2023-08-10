import React from "react";
import Grid from "@material-ui/core/Grid";
import { useTravelerStyles } from "./TravelerStyles";
import Typography from "@material-ui/core/Typography";

export const TravelerGroupHeader = ({ header }: any) => {
  const classes = useTravelerStyles();

  return (
    <Grid
      item
      xs={2}
      className={classes.baseBorder}
      style={{ backgroundColor: "#eeeeee" }}
    >
      <Typography variant="body2" align="center" style={{ fontWeight: "bold" }}>
        {header}
      </Typography>
    </Grid>
  );
};
