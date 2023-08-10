import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useImmerReducer } from "use-immer";

export interface Auth {
  id: string | null;
  user: string | null;
  expires_in: string | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string;
  build: string;
}

const initialState: Auth = {
  id: localStorage.getItem("id") || null,
  user: localStorage.getItem("user") || null,
  expires_in: localStorage.getItem("expires_in") || null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: false,
  isLoading: false,
  error: "",
  build: "",
};

// Actions
type Action =
  | { type: "LOGIN_PENDING" }
  | { type: "LOGIN_SUCCESS"; payload: Auth }
  | { type: "LOGIN_REJECTED"; payload: any }
  | { type: "LOGOUT" }
  | { type: "REFRESH_LOGIN" }
  | { type: "REFRESH_TOKEN"; payload: { token: string } };

// Reducer

const authReducer = (draft: Auth, action: Action): Auth => {
  switch (action.type) {
    case "LOGIN_PENDING": {
      draft.error = "";
      draft.isLoading = true;
      draft.isLoggedIn = false;
      draft.isLoading = false;
      return draft;
    }
    case "LOGIN_SUCCESS": {
      draft.isLoggedIn = true;
      draft.isLoading = false;
      draft.id = action.payload.id;
      draft.token = action.payload.token;
      draft.user = action.payload.user;
      draft.expires_in = action.payload.expires_in;
      draft.build = action.payload.build;
      setAuthInfo(
        action.payload.id,
        action.payload.token,
        action.payload.user,
        action.payload.expires_in
      );
      return draft;
    }
    case "LOGIN_REJECTED": {
      draft.error = "Incorrect username or password!";
      draft.isLoggedIn = false;
      draft.isLoading = false;
      return draft;
    }
    case "REFRESH_LOGIN": {
      const storedId = localStorage.getItem("id") || null;
      draft.id = storedId;
      draft.token = localStorage.getItem("token") || null;
      draft.user = localStorage.getItem("user") || null;
      draft.expires_in = localStorage.getItem("expires_in") || null;
      return draft;
    }

    case "REFRESH_TOKEN": {
      draft.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      return draft;
    }

    case "LOGOUT": {
      logout();
      draft.expires_in = null;
      draft.id = null;
      draft.isLoading = false;
      draft.isLoggedIn = false;
      draft.token = null;
      draft.user = null;
      return draft;
    }
    default: {
      return draft;
    }
  }
};

const setAuthInfo = (
  id: string | null,
  token: string | null,
  user: string | null,
  expires_in: string | null
) => {
  token && localStorage.setItem("token", token);
  user && localStorage.setItem("user", user);
  id && localStorage.setItem("id", id);
  expires_in && localStorage.setItem("expires_in", expires_in);
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("id");
  localStorage.removeItem("expires_in");
  localStorage.removeItem("redirect_on_login");
};

interface AuthContextProps {
  state: Auth;
  dispatch: React.Dispatch<Action>;
  isAuthenticated: Function;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useImmerReducer(authReducer, initialState);

  const isAuthenticated = () => {
    if (!localStorage.getItem("token") || !localStorage.getItem("expires_in")) {
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
