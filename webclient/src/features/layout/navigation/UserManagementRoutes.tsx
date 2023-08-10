import { useRouteMatch, Switch, Redirect } from "react-router-dom";
import { AdminRoute } from "../../auth/AdminRoute";
import { PrivateRoute } from "../../auth/PrivateRoute";
import { NewUser } from "../../userManagement/components/UserManagement/NewUser";
import { UserDetails } from "../../userManagement/components/UserManagement/UserDetails";
import { DefaultLayout } from "../DefaultLayout";
import { ProfileManagementList } from "./UserManagement";
import { UserManagementList } from "../../userManagement/components/UserManagement/UserManagement";
import { MyNotesPage } from "../../userManagement/components/MyNotes/myNotes";
import ProfilePage from "../../userManagement/components/MyProfile/ProfilePage";

export const UserManagement = () => {
  const { path } = useRouteMatch();

  return (
    <DefaultLayout>
      <Switch>
        <PrivateRoute
          exact
          path={`${path}`}
          component={ProfileManagementList}
        />
        <PrivateRoute
          exact
          path={`${path}/my_profile`}
          component={ProfilePage}
        />
        <AdminRoute
          exact
          path={`${path}/user_management`}
          component={UserManagementList}
        />
        <AdminRoute
          exact
          path={`${path}/user_management/new_user`}
          component={NewUser}
        />
        <AdminRoute
          exact
          path={`${path}/user_management/:userId`}
          component={UserDetails}
        />
        <PrivateRoute
          exact
          path={`${path}/my_agenda/:note_id?`}
          component={MyNotesPage}
        />
        <Redirect to="/not_found" />
      </Switch>
    </DefaultLayout>
  );
};
