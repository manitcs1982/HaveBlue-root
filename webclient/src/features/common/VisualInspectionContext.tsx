import React, { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";

export interface Defect {
  observation: string;
  images: File[];
}

export interface VisualInspectionDetails {
  defects: Map<string, Defect>;
}

const initialState: VisualInspectionDetails = {
  defects: new Map<string, Defect>(),
};

// Actions
type Action =
  | {
      type: "DEFECT_CREATED";
      payload: { defectId: string; defect: Defect };
    }
  | { type: "DEFECT_REMOVED"; payload: { defectId: string } }
  | { type: "CLEANUP_VISUAL_INSPECTION" };

// Reducer

const visualInspectionDetailsReducer = (
  draft: VisualInspectionDetails,
  action: Action
): VisualInspectionDetails => {
  switch (action.type) {
    case "DEFECT_CREATED": {
      draft.defects.set(action.payload.defectId, action.payload.defect);
      return draft;
    }
    case "DEFECT_REMOVED": {
      draft.defects.delete(action.payload.defectId);
      return draft;
    }
    case "CLEANUP_VISUAL_INSPECTION":
      return initialState;
    default: {
      return draft;
    }
  }
};

interface VisualInspectionDetailsContextProps {
  state: VisualInspectionDetails;
  dispatch: React.Dispatch<Action>;
}

const VisualInspectionDetailsContext = createContext<VisualInspectionDetailsContextProps>(
  {} as VisualInspectionDetailsContextProps
);

export const VisualInspectionDetailsContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useImmerReducer(
    visualInspectionDetailsReducer,
    initialState
  );

  return (
    <VisualInspectionDetailsContext.Provider value={{ state, dispatch }}>
      {children}
    </VisualInspectionDetailsContext.Provider>
  );
};

export const useVisualInspectionDetailsContext = () => {
  return useContext(VisualInspectionDetailsContext);
};
