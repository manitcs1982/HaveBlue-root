/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV:
      | "development"
      | "development-mock"
      | "production"
      | "test";
    readonly REACT_APP_API_HOST: string;
    readonly REACT_APP_API_MOCK: string;
    readonly REACT_APP_API_MOCK_HOST:string;
  }
}
