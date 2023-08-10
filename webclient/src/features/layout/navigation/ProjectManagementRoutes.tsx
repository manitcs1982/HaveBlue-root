import { useRouteMatch, Switch, Redirect } from "react-router-dom";
import { DefaultLayout } from "../DefaultLayout";
import { ProjectManagementList } from "./ProjectManagement";
import { CustomersPage } from "../../projectManagement/components/customer";
import { CustomerDetailsPage } from "../../projectManagement/components/customerDetails";
import { PrivateRoute } from "../../auth/PrivateRoute";
import { NewCustomer } from "../../projectManagement/components/customer/NewCustomer";
import { EditCustomer } from "../../projectManagement/components/customer/EditCustomer";
import { NewWorkOrderPage } from "../../projectManagement/components/customerDetails/workOrders/NewWorkOrderPage";
import { EditWorkOrderPage } from "../../projectManagement/components/customerDetails/workOrders/EditWorkOrderPage";
import { EditProject } from "../../projectManagement/components/customerDetails/EditProject";
import { NewProject } from "../../projectManagement/components/customerDetails/NewProject";
import { AvailableUnitsTable } from "../../projectManagement/components/customerDetails/AvailableUnitsTable";
import { ProjectsPage } from "../../projectManagement/components/project/ProjectsPage";
import { VirtualTravelerPage } from "../../projectManagement/components/virtualTraveler/VirtualTravelerPage";
import { MyProjectsPage } from "../../projectManagement/components/myprojects/myProjectLandingPage";
import { ActiveProjectsPage } from "../../projectManagement/components/myprojects/activeProjectsPage";
import { StressHistoricDetailsContextProvider as StressHistoricDetails } from "../../projectManagement/components/stressEntry/StressHistoricContext";
import { DownloadPage } from "../../common/services/downloadPage";

import { ProjectDetailsDashboardPage } from "../../projectManagement/components/project/projectDetailsDashboard/ProjectDetailsDashboardPage";
import { AnimateSharedLayout } from "framer-motion";
import ReportWritersAgenda from "../../projectManagement/components/reportWritersAgenda/ReportWritersAgenda";

export const ProjectManagement = () => {
  const { path } = useRouteMatch();

  return (
    <DefaultLayout>
      <AnimateSharedLayout>
        <StressHistoricDetails>
          <Switch>
            <PrivateRoute
              exact
              path={`${path}`}
              component={ProjectManagementList}
            />
            <PrivateRoute
              exact
              path={`${path}/customer`}
              component={CustomersPage}
            />
            <PrivateRoute
              exact
              path={`${path}/customer/add`}
              component={NewCustomer}
            />
            <PrivateRoute
              exact
              path={`${path}/customer/:customerId`}
              component={CustomerDetailsPage}
            />
            <PrivateRoute
              exact
              path={`${path}/customer/edit/:customerId`}
              component={EditCustomer}
            />
            <PrivateRoute
              exact
              path={`${path}/customer/:customerId/projects/add`}
              component={NewProject}
            />
            <PrivateRoute
              exact
              path={`${path}/customer/:customerId/projects/edit/:projectId`}
              component={EditProject}
            />
            <PrivateRoute
              exact
              path={[
                `${path}/customer/:customerId/projects/:projectId/attach`,
                `${path}/project_intelligence/:projectId/work_orders/:workOrderId/attach`,
              ]}
              component={AvailableUnitsTable}
            />
            <PrivateRoute
              exact
              path={[
                `${path}/customer/:customerId/projects/:projectId/work_orders/add`,
                `${path}/project_intelligence/:projectId/work_orders/add`,
              ]}
              component={NewWorkOrderPage}
            />
            <PrivateRoute
              exact
              path={[
                `${path}/customer/:customerId/projects/:projectId/work_orders/edit/:workOrderId`,
                `${path}/project_intelligence/:projectId/work_orders/edit/:workOrderId`,
              ]}
              component={EditWorkOrderPage}
            />
            <PrivateRoute
              exact
              path={`${path}/projects`}
              component={ProjectsPage}
            />
            <PrivateRoute
              exact
              path={`${path}/virtual_traveler/:serial_number?`}
              component={VirtualTravelerPage}
            />
            <PrivateRoute
              exact
              path={`${path}/my_projects`}
              component={MyProjectsPage}
            />
            <PrivateRoute
              exact
              path={`${path}/active_projects`}
              component={ActiveProjectsPage}
            />

            <PrivateRoute
              exact
              path={[
                `${path}/project_intelligence/:projectId?`,
                `${path}/project_intelligence/:projectId/:section`,
              ]}
              component={ProjectDetailsDashboardPage}
            />

            <PrivateRoute
              exact
              path={[`${path}/download_file/:fileID?`]}
              component={DownloadPage}
            />

            <PrivateRoute
              exact
              path={`${path}/report_writers_agenda`}
              component={ReportWritersAgenda}
            />

            <Redirect to="/not_found" />
          </Switch>
        </StressHistoricDetails>
      </AnimateSharedLayout>
    </DefaultLayout>
  );
};
