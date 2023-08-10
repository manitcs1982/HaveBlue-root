import { Variants } from "framer-motion";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router";
import { useAuthContext } from "./AuthContext";

export const getBaseUrl = () => {
  return process.env.REACT_APP_API_MOCK === "true"
    ? process.env.REACT_APP_API_MOCK_HOST
    : process.env.REACT_APP_API_HOST;
};

export const updateBuild = (
  clientBuild: string | undefined,
  serverBuild: string | undefined
) => {
  if (clientBuild !== undefined && serverBuild !== undefined) {
    if (!clientBuild.includes(serverBuild)) {
      refreshCacheAndReload();
    }
  }
};

const refreshCacheAndReload = () => {
  if (caches) {
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
      }
    });
  }
  window.location.reload();
};

export const combineStyles = (...styles: any): any => {
  return (theme: any) => {
    const outStyles = styles.map((arg: any) => {
      // Apply the "theme" object for style functions.
      if (typeof arg === "function") {
        return arg(theme);
      }
      // Objects need no change.
      return arg;
    });

    return outStyles.reduce((acc: any, val: any) => Object.assign(acc, val));
  };
};

export const FlagAnimationVariants: Variants = {
  initialFlagButton: {
    background: "#ffe5e5",
    opacity: 1,
  },
  animateFlagButton: {
    background: "orange",
    opacity: 0.3,
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

export const useGlobalLogout = () => {
  const REDIRECT_ON_LOGIN = "redirect_on_login";
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const queryClient = useQueryClient();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    queryClient.clear();
    localStorage.setItem(REDIRECT_ON_LOGIN, JSON.stringify(history.location));
  };
  return { logout };
};

export const stringSanitize = (value: string) => {
  const regex = /^[0-9a-zA-Z_-][0-9a-zA-Z_\- ]*$/;
  return regex.test(value);
};

export const renderHeader = (column: any) => {
  if (
    column.id === "selection" ||
    column.id === "available" ||
    column.id === "Days Since Last Update" ||
    column.id === "Days Open" ||
    column.id === "Creation Date"
  ) {
    return column.render("Header");
  }
  return null;
};

export default combineStyles;
