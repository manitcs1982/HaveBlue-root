import React from "react";
import { useRouteMatch, Switch, Redirect } from "react-router-dom";
import { DefaultLayout } from "../DefaultLayout";
import { PrivateRoute } from "../../auth/PrivateRoute";
import { OpsManagementList } from "./OpsManagement";
import { DataLandingPage } from "../../dataEgress/dataLandingPage";
import { ProductivityLog } from "../../projectManagement/components/productivityLog/prodLogPage";
import { StressReadyStatus } from "../../projectManagement/components/stressStatus/StressReadyStatus";
import { StressEntryPage } from "../../projectManagement/components/stressEntry/StressEntryPage";
import { OpsQueuesMainPage } from "../../projectManagement/components/opsQueues/OpsQueuesMainPage";
import { StressExitPage } from "../../projectManagement/components/stressEntry/StressExitPage";
import { StressEntryDetailsContextProvider as StressEntry } from "../../projectManagement/components/stressEntry/StressEntryContext";
import { OpsAgendaPage } from "../../projectManagement/components/opsAgenda/OpsAgendaPage";
import { TagCreation } from "../../projectManagement/components/tagCreation/TagCreation";
import TemplatesPage from "../../projectManagement/components/templates/TemplatesPage";
import TemplateDetails from "../../projectManagement/components/templates/TemplateDetails";
import NewTemplate from "../../projectManagement/components/templates/NewTemplate";

export const OpsManagement = () => {
  const { path } = useRouteMatch();

  return (
    <DefaultLayout>
      <StressEntry>
        <Switch>
          <PrivateRoute exact path={`${path}`} component={OpsManagementList} />
          <PrivateRoute
            path={`${path}/data_verification`}
            component={DataLandingPage}
          />
          <PrivateRoute
            path={`${path}/stress_entry_queue`}
            component={StressReadyStatus}
          />
          <PrivateRoute
            exact
            path={`${path}/work_log`}
            component={ProductivityLog}
          />
          <PrivateRoute
            exact
            path={`${path}/stress_entry`}
            component={StressEntryPage}
          />
          <PrivateRoute
            exact
            path={`${path}/stress_exit`}
            component={StressExitPage}
          />
          <PrivateRoute
            exact
            path={`${path}/ops_queues`}
            component={OpsQueuesMainPage}
          />
          <PrivateRoute
            exact
            path={`${path}/templates`}
            component={TemplatesPage}
          />
          <PrivateRoute
            exact
            path={`${path}/templates/new_template`}
            component={NewTemplate}
          />
          <PrivateRoute
            exact
            path={`${path}/templates/:templateId`}
            component={TemplateDetails}
          />
          <PrivateRoute
            exact
            path={`${path}/ops_agenda/:note_id?`}
            component={OpsAgendaPage}
          />
          <PrivateRoute
            exact
            path={`${path}/ops_agenda/new_label`}
            component={TagCreation}
          />
          <Redirect to="/not_found" />
        </Switch>
      </StressEntry>
    </DefaultLayout>
  );
};
