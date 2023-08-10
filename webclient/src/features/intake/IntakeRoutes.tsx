import { useRouteMatch, Switch } from "react-router-dom";

import {
  NewCratePage,
  CrateIntakePage,
  EditCratePage,
} from "./components/crateIntake";
import { UnitIntakePage } from "./components/unitIntake";
import { IntakeLandingPage } from "./components/IntakeLandingPage";
import { UnitIntakeSelectedProject } from "./components/unitIntake/UnitIntakeSelectedProject";

import { PrivateRoute } from "../auth/PrivateRoute";

export const Intake = () => {
  const { path } = useRouteMatch();

  return (
      <Switch>
        <PrivateRoute exact path={`${path}`} component={IntakeLandingPage} />
        <PrivateRoute
          exact
          path={`${path}/crate`}
          component={CrateIntakePage}
        />
        <PrivateRoute
          exact
          path={`${path}/crate/new`}
          component={NewCratePage}
        />
        <PrivateRoute
          exact
          path={`${path}/crate/edit/:id`}
          component={EditCratePage}
        />
        <PrivateRoute exact path={`${path}/unit`} component={UnitIntakePage} />
        <PrivateRoute
          exact
          path={`${path}/unit/:project/:projectid/:workOrder/:workOrderid`}
          component={UnitIntakeSelectedProject}
        />
      </Switch>
  );
};
