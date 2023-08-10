import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export const NotFound = () => {
  const classes = useStyles();

  return (
    <>
      <Container component="main">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Page Not Found
          </Typography>
          <Typography variant="h5">
            The page you're looking for doesn't exist. Check for a typo in the
            URL, or go to the home site
          </Typography>
        </div>
      </Container>
    </>
  );
};
