import { useAuthContext } from "../common/AuthContext";
import { Route, Redirect, RouteProps, useHistory } from "react-router-dom";
import { useNoop } from "../common/services/generalServices";
import { Grid, LinearProgress, useTheme } from "@material-ui/core";
import { useGlobalLogout } from "../common/util";
import { toast } from "react-toastify";
export const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { isAuthenticated } = useAuthContext();
  const theme = useTheme();
  const history = useHistory();

  const { logout } = useGlobalLogout();
  const {
    data: noopData,
    error: errorNoop,
    isLoading: isLoadingNoop,
    isSuccess: isSuccessNoop,
    isError: isErrorNoop,
  } = useNoop(localStorage.getItem("token"));

  if (isLoadingNoop) {
    return (
      <div style={theme.containerMargin}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (isErrorNoop) {
    toast.error(`Error on your session.Please log in again.${errorNoop}`);
    logout();
    return (
      <Redirect to={{ pathname: "/", state: { from: history.location } }} />
    );
  }

  if (!Component) return null;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated()) {
          return <Component {...props} />;
        }
        logout();
        return (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        );
      }}
    />
  );
};
