import { Route, RouteProps } from "react-router";
import { useAuthContext } from "../common/AuthContext";
import { ErrorMessage } from "../common/ErrorMessage";
import { useIsSuperuser } from "../userManagement/userQueries";

export const AdminRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { state } = useAuthContext();
  const userIsSuperuser = useIsSuperuser(`${state.id}`);

  if (!Component) return null;
  if (userIsSuperuser.isLoading) {
    return <p>Loading...</p>;
  } else {
    if (userIsSuperuser.isError) {
      const err = `${userIsSuperuser.error}`;
      const errorCode = err.substring(err.length - 4);
      return <ErrorMessage error={{ response: { status: +errorCode } }} />;
    } else {
      if (userIsSuperuser.data) {
        return (
          <Route
            {...rest}
            render={(props) => {
              return <Component {...props} />;
            }}
          />
        );
      } else {
        return <ErrorMessage errorCode={403} />;
      }
    }
  }
};
