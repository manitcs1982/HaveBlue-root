import React, { createContext, useContext } from "react";
import axios, { AxiosInstance } from "axios";
import { useAuthContext } from "./AuthContext";
import { getBaseUrl } from "../common/util";

interface FetchContextProps {
  authAxios: AxiosInstance;
  authAxiosFromUrl: AxiosInstance;
}

const FetchContext = createContext<FetchContextProps>({} as FetchContextProps);

export const FetchContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const { state } = useAuthContext();

  const authAxios = axios.create({
    baseURL: getBaseUrl(),
  });

  authAxios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Token ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const authAxiosFromUrl = axios.create();

  authAxiosFromUrl.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Token ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  authAxiosFromUrl.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const code = error && error.response ? error.response.status : 0;
      if (code === 401 || code === 403) {
        console.log("error code", code);
      }
      return Promise.reject(error);
    }
  );

  return (
    <FetchContext.Provider value={{ authAxios, authAxiosFromUrl }}>
      {children}
    </FetchContext.Provider>
  );
};

export const useFetchContext = () => {
  return useContext(FetchContext);
};
