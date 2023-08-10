import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import { LoginLayoutRoute } from "./features/layout";
import { LoginPage } from "./features/auth/LoginPage";
import { ReactQueryDevtools } from "react-query/devtools";
import { LandingPage } from "./features/common/LandingPage";
import { PrivateRoute } from "./features/auth/PrivateRoute";
import { ForgotPassword } from "./features/auth/ForgotPassword";
import { ResetPassword } from "./features/auth/ResetPassword";
import { NotFound } from "./features/common/NotFound";
import { ProjectManagement } from "./features/layout/navigation/ProjectManagementRoutes";
import { OpsManagement } from "./features/layout/navigation/OpsManagementRoutes";
import { Operations } from "./features/layout/navigation/OperationsRoutes";
import { Engineering } from "./features/layout/navigation/EngineeringRoutes";
import { UserManagement } from "./features/layout/navigation/UserManagementRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <LoginLayoutRoute exact path="/" component={LoginPage} />
        <LoginLayoutRoute
          exact
          path="/forgot_password"
          component={ForgotPassword}
        />
        <LoginLayoutRoute
          exact
          path="/forgot_password/:accessToken"
          component={ResetPassword}
        />
        <PrivateRoute path="/home" component={LandingPage} />
        <PrivateRoute
          path="/project_management"
          component={ProjectManagement}
        />
        <PrivateRoute path="/operations" component={Operations} />
        <PrivateRoute path="/operations_management" component={OpsManagement} />
        <PrivateRoute path="/engineering" component={Engineering} />
        <PrivateRoute path="/profile_management" component={UserManagement} />

        <LoginLayoutRoute exact path="/not_found" component={NotFound} />
        <Redirect to="/not_found" />
      </Switch>
      <ReactQueryDevtools />
    </BrowserRouter>
  );
};

export default App;
