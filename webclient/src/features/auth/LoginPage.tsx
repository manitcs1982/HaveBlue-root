import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MuiLink from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { login } from "./authServices";
import { useAuthContext } from "../common/AuthContext";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { updateBuild } from "../common/util";
import { Copyright } from "../common/Copyright";
import { processErrorOnMutation } from "../../util/errorMessaging";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  forgotPass: {
    float: "right",
    color: "#369b47 !important",
    margin: 13,
    fontFamily: "Open Sans",
    fontSize: 16,
  },
}));

export const LoginPage = () => {
  const classes = useStyles();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { dispatch, isAuthenticated } = useAuthContext();
  const history = useHistory();
  const REDIRECT_ON_LOGIN = "redirect_on_login";

  const loginRedirect = React.useCallback(() => {
    const redirectLocation = localStorage.getItem(REDIRECT_ON_LOGIN);
    if (redirectLocation === null) {
      history.push("/home");
    } else {
      history.push(JSON.parse(redirectLocation));
    }
    localStorage.removeItem(REDIRECT_ON_LOGIN);
  }, [history]);

  React.useEffect(() => {
    if (isAuthenticated()) {
      loginRedirect();
    }
  }, [history, isAuthenticated, loginRedirect]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch({ type: "LOGIN_PENDING" });
      const data = await login(username, password);
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      loginRedirect();

      // Force Refresh on version mismatch
      updateBuild(process.env.REACT_APP_LSDB_BUILD, data.build);
    } catch (err) {
      toast.error("Login failed.");
      processErrorOnMutation(err, dispatch, history);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              data-testid="login-email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              data-testid="login-password"
              type="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              data-testid="login-submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <MuiLink to="/forgot_password" component={Link}>
                  Forgot your password?
                </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </form>
        </div>

        <Copyright />
      </Container>
    </>
  );
};
