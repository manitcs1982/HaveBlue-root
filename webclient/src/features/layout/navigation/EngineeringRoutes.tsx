import React from "react";
import { useRouteMatch, Switch, Redirect } from "react-router-dom";
import { DefaultLayout } from "../DefaultLayout";
import { PrivateRoute } from "../../auth/PrivateRoute";
import { EngineeringList } from "./Engineering";
import { UnitTypesPage } from "../../projectManagement/components/unitTypes/UnitTypesPage";
import { NewUnitTypePage } from "../../projectManagement/components/unitTypes/NewUnitTypePage";
import { DetailsUnitTypePage } from "../../projectManagement/components/unitTypes/DetailsUnitTypePage";
import { EditUnitTypePage } from "../../projectManagement/components/unitTypes/EditUnitTypePage";
import { AddDatasheetsPage } from "../../projectManagement/components/unitTypes/AddDatasheetsPage";
import { DeleteDatasheetsTable } from "../../projectManagement/components/unitTypes/DeleteDatasheetsTable";
import { EngineeringAgendaPage } from "../../projectManagement/components/engineeringAgenda/EngineeringAgendaPage";
import PluginsPage from "../../projectManagement/components/plugins/PluginsPage";
import PluginDetails from "../../projectManagement/components/plugins/PluginDetails";
import NewPlugin from "../../projectManagement/components/plugins/NewPlugin";
import TSDList from "../../projectManagement/components/testSequenceDefinitions/TSDList";
import TSDDetails from "../../projectManagement/components/testSequenceDefinitions/TSDDetails";
import NewTSD from "../../projectManagement/components/testSequenceDefinitions/NewTSD";

export const Engineering = () => {
  const { path } = useRouteMatch();

  return (
    <DefaultLayout>
      <Switch>
        <PrivateRoute exact path={`${path}`} component={EngineeringList} />
        <PrivateRoute exact path={`${path}/plugins`} component={PluginsPage} />
        <PrivateRoute
          exact
          path={`${path}/plugins/new_plugin`}
          component={NewPlugin}
        />
        <PrivateRoute
          exact
          path={`${path}/plugins/:pluginId`}
          component={PluginDetails}
        />
        <PrivateRoute
          exact
          path={`${path}/test_sequence_definitions`}
          component={TSDList}
        />
        <PrivateRoute
          exact
          path={`${path}/test_sequence_definitions/new_tsd`}
          component={NewTSD}
        />
        <PrivateRoute
          exact
          path={`${path}/test_sequence_definitions/:tsdId`}
          component={TSDDetails}
        />
        <PrivateRoute
          exact
          path={`${path}/engineering_agenda/:note_id?`}
          component={EngineeringAgendaPage}
        />
        <PrivateRoute
          exact
          path={`${path}/unit_type`}
          component={UnitTypesPage}
        />
        <PrivateRoute
          exact
          path={`${path}/unit_type/new`}
          component={NewUnitTypePage}
        />
        <PrivateRoute
          exact
          path={`${path}/unit_type/:unitTypeId`}
          component={DetailsUnitTypePage}
        />
        <PrivateRoute
          exact
          path={`${path}/unit_type/:unitTypeId/edit`}
          component={EditUnitTypePage}
        />
        <PrivateRoute
          exact
          path={`${path}/unit_type/:unitTypeId/add_datasheets`}
          component={AddDatasheetsPage}
        />
        <PrivateRoute
          exact
          path={`${path}/unit_type/:unitTypeId/delete_datasheets`}
          component={DeleteDatasheetsTable}
        />
        {<Redirect to="/not_found" />}
      </Switch>
    </DefaultLayout>
  );
};
