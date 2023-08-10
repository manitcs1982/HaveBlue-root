import React, { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";

export interface CustomerDetails {
  activeCustomerId: string | null;
  activeCustomerUrl: string | null;
  activeProjectId: string | null;
  activeProjectUrl: string | null;
  activeWorkOrder: string | null;
}

const initialState: CustomerDetails = {
  activeCustomerId: null,
  activeCustomerUrl: null,
  activeProjectId: null,
  activeProjectUrl: null,
  activeWorkOrder: null,
};

// Actions
type Action =
  | {
      type: "CUSTOMER_SELECTED";
      payload: { customerId: string; customerUrl: string };
    }
  | { type: "WORK_ORDER_SELECTED"; payload: string }
  | {
      type: "PROJECT_SELECTED";
      payload: { projectId: string; projectUrl: string };
    }
  | { type: "CLEAN_WORK_ORDER" }
  | { type: "CLEAN_PROJECT" }
  | { type: "CLEAN_ALL" };

// Reducer

const customerDetailsReducer = (
  draft: CustomerDetails,
  action: Action
): CustomerDetails => {
  switch (action.type) {
    case "CUSTOMER_SELECTED": {
      draft.activeCustomerId = action.payload.customerId;
      draft.activeCustomerUrl = action.payload.customerUrl;
      return draft;
    }
    case "WORK_ORDER_SELECTED": {
      draft.activeWorkOrder = action.payload;
      return draft;
    }
    case "PROJECT_SELECTED": {
      draft.activeProjectId = action.payload.projectId;
      draft.activeProjectUrl = action.payload.projectUrl;
      draft.activeWorkOrder = null;
      return draft;
    }

    case "CLEAN_PROJECT": {
      draft.activeProjectId = null;
      draft.activeProjectUrl = null;
      draft.activeWorkOrder = null;
      return draft;
    }
    case "CLEAN_WORK_ORDER": {
      draft.activeWorkOrder = null;
      return draft;
    }
    case "CLEAN_ALL": {
      return initialState;
    }
    default: {
      return draft;
    }
  }
};

interface CustomerDetailsContextProps {
  state: CustomerDetails;
  dispatch: React.Dispatch<Action>;
}

const CustomerDetailsContext = createContext<CustomerDetailsContextProps>(
  {} as CustomerDetailsContextProps
);

export const CustomerDetailsContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useImmerReducer(
    customerDetailsReducer,
    initialState
  );

  return (
    <CustomerDetailsContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerDetailsContext.Provider>
  );
};

export const useCustomerDetailsContext = () => {
  return useContext(CustomerDetailsContext);
};
