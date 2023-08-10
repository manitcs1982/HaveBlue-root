import React from "react";
import { RouteProps, Route } from "react-router-dom";

const LoginLayout = ({ children, ...rest }: React.PropsWithChildren<{}>) => {
  return (
    <div className="page page-dashboard">
      <div className="main">{children}</div>
    </div>
  );
};

export const LoginLayoutRoute = ({
  component: Component,
  ...rest
}: RouteProps) => {
  if (!Component) return null;
  return (
    <Route
      {...rest}
      render={(props) => (
        <LoginLayout>
          <Component {...props} />
        </LoginLayout>
      )}
    />
  );
};
