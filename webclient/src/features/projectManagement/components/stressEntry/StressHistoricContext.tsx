import moment from "moment";
import { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";

export interface StressHistoricDetails {
  stressEntrySibling: any;
  stressExitSibling: any;
  asset: any;
  permission: any;
  stressDisposition: any;
  stressEntryDate: any;
  stressEntryReviewer: any;
  stressEntryReviewDate: any;
  stressEntryMetadata: null;
  stressExitDate: any;
  stressExitReviewer: any;
  stressExitReviewDate: any;
  stressExitMetadata: null;
}

const initialState: StressHistoricDetails = {
  stressEntrySibling: null,
  stressExitSibling: null,
  asset: null,
  permission: null,
  stressDisposition: null,
  stressEntryDate: moment().format("YYYY-MM-DD HH:mm:ss"),
  stressEntryReviewer: null,
  stressEntryReviewDate: null,
  stressEntryMetadata: null,
  stressExitDate: moment().format("YYYY-MM-DD HH:mm:ss"),
  stressExitReviewer: null,
  stressExitReviewDate: null,
  stressExitMetadata: null,
};

// Actions
type Action =
  | {
      type: "SET_ASSET";
      payload: { asset: any };
    }
  | {
      type: "SET_SIBLINGS";
      payload: { stressEntrySibling: any; stressExitSibling: any };
    }
  | {
      type: "SET_STRESS_DISPOSITION";
      payload: { disposition: any };
    }
  | {
      type: "SET_STRESS_ENTRY_DATE";
      payload: { date: any };
    }
  | {
      type: "SET_STRESS_ENTRY_REVIEWER";
      payload: { reviewer: any };
    }
  | {
      type: "SET_STRESS_ENTRY_REVIEW_DATE";
      payload: { date: any };
    }
  | {
      type: "SET_STRESS_ENTRY_METADATA";
      payload: { metadata: any };
    }
  | {
      type: "SET_STRESS_EXIT_DATE";
      payload: { date: any };
    }
  | {
      type: "SET_STRESS_EXIT_REVIEWER";
      payload: { reviewer: any };
    }
  | {
      type: "SET_STRESS_EXIT_REVIEW_DATE";
      payload: { date: any };
    }
  | {
      type: "SET_STRESS_EXIT_METADATA";
      payload: { metadata: any };
    }
  | { type: "CLEAN_STRESS" }
  | {
      type: "SET_PERMISSION";
      payload: { permission: any };
    };

// Reducer

const stressHistoricDetailsReducer = (
  draft: StressHistoricDetails,
  action: Action
): StressHistoricDetails => {
  switch (action.type) {
    case "SET_SIBLINGS": {
      draft.stressEntrySibling = action.payload.stressEntrySibling;
      draft.stressExitSibling = action.payload.stressExitSibling;
      return draft;
    }

    case "SET_ASSET": {
      draft.asset = action.payload.asset;
      return draft;
    }

    case "SET_STRESS_DISPOSITION": {
      draft.stressDisposition = action.payload.disposition;
      return draft;
    }

    case "SET_STRESS_ENTRY_DATE": {
      draft.stressEntryDate = action.payload.date.format("YYYY-MM-DD HH:mm:ss");
      return draft;
    }
    case "SET_STRESS_ENTRY_REVIEWER": {
      draft.stressEntryReviewer = action.payload.reviewer;
      return draft;
    }
    case "SET_STRESS_ENTRY_REVIEW_DATE": {
      draft.stressEntryReviewDate = action.payload.date.format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return draft;
    }
    case "SET_STRESS_ENTRY_METADATA": {
      draft.stressEntryMetadata = action.payload.metadata;
      return draft;
    }
    case "SET_STRESS_EXIT_DATE": {
      draft.stressExitDate = action.payload.date.format("YYYY-MM-DD HH:mm:ss");
      return draft;
    }
    case "SET_STRESS_EXIT_REVIEWER": {
      draft.stressExitReviewer = action.payload.reviewer;
      return draft;
    }
    case "SET_STRESS_EXIT_REVIEW_DATE": {
      draft.stressExitReviewDate = action.payload.date.format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return draft;
    }
    case "SET_STRESS_EXIT_METADATA": {
      draft.stressExitMetadata = action.payload.metadata;
      return draft;
    }

    case "SET_PERMISSION": {
      draft.permission = action.payload.permission ? true : false;
      return draft;
    }
    case "CLEAN_STRESS":
      return initialState;
    default: {
      return draft;
    }
  }
};

interface StressHistoricDetailsContextProps {
  state: StressHistoricDetails;
  dispatch: React.Dispatch<Action>;
}

const StressHistoricDetailsContext =
  createContext<StressHistoricDetailsContextProps>(
    {} as StressHistoricDetailsContextProps
  );

export const StressHistoricDetailsContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useImmerReducer(
    stressHistoricDetailsReducer,
    initialState
  );

  return (
    <StressHistoricDetailsContext.Provider value={{ state, dispatch }}>
      {children}
    </StressHistoricDetailsContext.Provider>
  );
};

export const useStressHistoricContext = () => {
  return useContext(StressHistoricDetailsContext);
};
