import React from "react";
import { useRouteMatch, Switch, Redirect } from "react-router-dom";
import { DefaultLayout } from "../DefaultLayout";
import { PrivateRoute } from "../../auth/PrivateRoute";
import { OperationsList } from "./Operations";
import { VisualInspectionPage } from "../../testCommunication/visualInspection/VisualInspectionPage";
import { WetLeakagePage } from "../../testCommunication/wetLeakage/WetLeakagePage";
import { DiodeTestPage } from "../../testCommunication/diodeTest/DiodeTestPage";
import { ColorTestPage } from "../../testCommunication/colorimeter/ColorTestPage";
import { Intake } from "../../intake/IntakeRoutes";

export const Operations = () => {
  const { path } = useRouteMatch();

  return (
    <DefaultLayout>
      <Switch>
        <PrivateRoute exact path={`${path}`} component={OperationsList} />
        <PrivateRoute path={`${path}/wet_leakage`} component={WetLeakagePage} />
        <PrivateRoute path={`${path}/diode_test`} component={DiodeTestPage} />
        <PrivateRoute
          path={`${path}/visual_inspection`}
          component={VisualInspectionPage}
        />
        <PrivateRoute path={`${path}/colorimeter`} component={ColorTestPage} />
        <PrivateRoute path={`${path}/intake`} component={Intake} />
        <Redirect to="/not_found" />
      </Switch>
    </DefaultLayout>
  );
};
