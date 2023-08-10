import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

export const LSDBreadcrumb = () => {
  const location = useLocation();
  var currentRoutes: any[];
  currentRoutes = location.pathname.split("/").filter((x) => x);

  const makeCrumb = (
    route: any,
    index: any,
    last: any,
    to: any,
    currentRoutes: any[]
  ) => {
    const regexSearcher = /_/g;

    if (
      route === "edit" ||
      route === "projects" ||
      route === "work_orders" ||
      currentRoutes[index - 1] === "edit" ||
      currentRoutes[index - 1] === "projects" ||
      currentRoutes[index - 1] === "work_orders"
    ) {
      return (
        <Button key={index} color="inherit" disabled>
          {route.replaceAll(regexSearcher, " ")}
        </Button>
      );
    }

    return last ? (
      <Button key={index} color="inherit" disabled>
        {route.replaceAll(regexSearcher, " ")}
      </Button>
    ) : (
      <Button color="primary" component={Link} to={to}>
        {route.replaceAll(regexSearcher, " ")}
      </Button>
    );
  };

  if (currentRoutes[0] === "home") {
    console.log("Base occurance?");
    return (
      <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: 15 }}>
        <Button color="primary" component={Link} to={"/home"}>
          Home
        </Button>
      </Breadcrumbs>
    );
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: 15 }}>
      <Button color="primary" component={Link} to={"/home"}>
        Home
      </Button>

      {currentRoutes.map((route, index) => {
        const last = index === currentRoutes.length - 1;
        const to = `/${currentRoutes.slice(0, index + 1).join("/")}`;
        return makeCrumb(route, index, last, to, currentRoutes);
      })}
    </Breadcrumbs>
  );
};
