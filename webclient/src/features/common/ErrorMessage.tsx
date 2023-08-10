import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Alert, AlertTitle } from "@material-ui/lab";
import { toast } from "react-toastify";
import { useAuthContext } from "./AuthContext";
import { useQueryClient } from "react-query";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export const ErrorMessage = ({ error, errorCode }: any) => {
  const classes = useStyles();
  const { dispatch } = useAuthContext();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (error?.response?.status === 401) {
      toast.error(`Credentials expired.Please login again`);
      dispatch({ type: "LOGOUT" });
      queryClient.removeQueries();
    }
  }, [dispatch, error, queryClient]);

  if (error?.response?.status === 403 || errorCode === 403) {
    return (
      <>
        <Container component="main">
          <CssBaseline />
          <div className={classes.paper}>
            <Alert severity="error">
              <AlertTitle>Restricted area</AlertTitle>
              You are not allowed to perform this operation. Please check your
              credential permissions.
            </Alert>
          </div>
        </Container>
      </>
    );
  } else if (error?.response?.status === 401) {
    return null;
  } else if (error) {
    return (
      <>
        <Container component="main">
          <CssBaseline />
          <div className={classes.paper}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error?.detail}
            </Alert>
          </div>
        </Container>
      </>
    );
  } else {
    return null;
  }
};
