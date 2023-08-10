import React, { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { ErrorDialog } from "./ErrorDialog";

export interface LSDBError {
  error: string | null;
}

export interface ErrorHandling {
  errorTitle: string | null;
  error: string | null;
  multipleErrors: LSDBError[] | null;
  active: boolean;
}

const initialState: ErrorHandling = {
  errorTitle: null,
  error: null,
  multipleErrors: null,
  active: false,
};

// Actions
type Action =
  | {
      type: "ERROR_THROWN";
      payload: { errorTitle: string; error: string };
    }
  | {
      type: "MULTIPLE_ERRORS_THROWN";
      payload: { errorTitle: string; errors: LSDBError[] };
    }
  | { type: "CLEANUP_ERRORS" };

// Reducer

const errorHandlingReducer = (
  draft: ErrorHandling,
  action: Action
): ErrorHandling => {
  switch (action.type) {
    case "ERROR_THROWN": {
      draft.errorTitle = action.payload.errorTitle;
      draft.error = action.payload.error;
      draft.active = true;
      return draft;
    }
    case "MULTIPLE_ERRORS_THROWN": {
      draft.errorTitle = action.payload.errorTitle;
      draft.multipleErrors = action.payload.errors;
      draft.active = true;
      return draft;
    }
    case "CLEANUP_ERRORS":
      return initialState;
    default: {
      return draft;
    }
  }
};

interface ErrorHandlingContextProps {
  state: ErrorHandling;
  dispatch: React.Dispatch<Action>;
}

const ErrorHandlingContext = createContext<ErrorHandlingContextProps>(
  {} as ErrorHandlingContextProps
);

export const ErrorHandlingContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useImmerReducer(errorHandlingReducer, initialState);

  return (
    <ErrorHandlingContext.Provider value={{ state, dispatch }}>
      {children}
      {state.active && (
        <ErrorDialog
          title={state.errorTitle}
          error={state.error}
          multipleError={state.multipleErrors}
          onClose={() => dispatch({ type: "CLEANUP_ERRORS" })}
        />
      )}
    </ErrorHandlingContext.Provider>
  );
};

export const useErrorHandlingContext = () => {
  return useContext(ErrorHandlingContext);
};
