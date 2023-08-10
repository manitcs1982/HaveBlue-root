import moment from "moment";
import { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";

export interface StressEntryDetails {
  selectedStressType: any;
  selectedStressProcedure: any;
  submittedSerialNumber: string;
  cleared: boolean;
  stage: number;
  scannedUnits: any;
  checkedUnits: Map<string, any>;
  checkedUnitsTable: any[];
  permission: any;
  stressEntryDate: any;
  mode: number | null;
}

const initialState: StressEntryDetails = {
  cleared: false,
  stage: 0,
  selectedStressType: null,
  selectedStressProcedure: null,
  scannedUnits: new Map(),
  checkedUnits: new Map(),
  checkedUnitsTable: [],
  submittedSerialNumber: "",
  permission: null,
  stressEntryDate: moment().format("YYYY-MM-DD HH:mm:ss"),
  mode: null,
};

// Actions
type Action =
  | { type: "SET_SUBMITTED_SERIAL_NUMBER"; payload: { serialNumber: string } }
  | { type: "SET_SELECTED_STRESS_TYPE"; payload: { selectedStressType: any } }
  | {
      type: "SET_SELECTED_STRESS_PROCEDURE";
      payload: { selectedStressProcedure: any };
    }
  | {
      type: "NEXT_STAGE";
    }
  | { type: "PREVIOUS_STAGE" }
  | { type: "ADD_SCANNED_UNIT"; payload: { unit: any } }
  | { type: "REMOVE_SCANNED_UNIT"; payload: { id: string } }
  | {
      type: "ADD_CHECKED_UNIT";
      payload: { unit: any; procedureResult: any; sibling: any };
    }
  | {
      type: "SET_UPDATED_CHECKED_UNITS_TABLE";
      payload: { updatedCheckedUnitsTable: any[]; serialNumber: string };
    }
  | {
      type: "SET_UPDATED_METADATA";
      payload: { metadata: string; serialNumber: string };
    }
  | { type: "CLEAN_STRESS_ENTRY" }
  | { type: "CLEAN_SCANNED_UNITS" }
  | {
      type: "SET_STRESS_ENTRY_DATE";
      payload: { date: any };
    }
  | {
      type: "SET_PERMISSION";
      payload: { permission: any };
    }
  | {
      type: "SET_MODE";
      payload: number | null;
    };

// Reducer

const stressEntryDetailsReducer = (
  draft: StressEntryDetails,
  action: Action
): StressEntryDetails => {
  switch (action.type) {
    case "SET_SUBMITTED_SERIAL_NUMBER": {
      draft.submittedSerialNumber = action.payload.serialNumber;
      return draft;
    }
    case "SET_SELECTED_STRESS_TYPE": {
      draft.selectedStressType = action.payload.selectedStressType;
      return draft;
    }
    case "SET_SELECTED_STRESS_PROCEDURE": {
      draft.selectedStressProcedure = action.payload.selectedStressProcedure;
      return draft;
    }
    case "ADD_SCANNED_UNIT": {
      draft.scannedUnits.set(
        action.payload.unit.serial_number,
        action.payload.unit
      );
      return draft;
    }
    case "REMOVE_SCANNED_UNIT": {
      draft.submittedSerialNumber = "";
      draft.scannedUnits.delete(action.payload.id);
      return draft;
    }

    case "ADD_CHECKED_UNIT": {
      draft.checkedUnits.set(action.payload.unit.serial_number, {
        ...action.payload.procedureResult,
        sibling: action.payload.sibling,
      });
      draft.checkedUnitsTable.push({
        ...action.payload.unit,
        procedureType: draft.selectedStressProcedure?.name,
      });
      return draft;
    }
    case "SET_UPDATED_CHECKED_UNITS_TABLE": {
      draft.checkedUnitsTable = action.payload.updatedCheckedUnitsTable;
      draft.checkedUnits.delete(action.payload.serialNumber);
      return draft;
    }
    case "SET_UPDATED_METADATA": {
      const currentCheckedUnit = draft.checkedUnits.get(
        action.payload.serialNumber
      );
      draft.checkedUnits.set(action.payload.serialNumber, {
        ...currentCheckedUnit,
        metadata: action.payload.metadata,
      });
      return draft;
    }
    case "SET_STRESS_ENTRY_DATE": {
      draft.stressEntryDate = action.payload.date.format("YYYY-MM-DD HH:mm:ss");
      return draft;
    }
    case "SET_MODE": {
      draft.mode = action.payload;
      return draft;
    }
    case "SET_PERMISSION": {
      draft.permission = action.payload.permission ? true : false;
      return draft;
    }
    case "NEXT_STAGE": {
      draft.stage++;
      return draft;
    }
    case "PREVIOUS_STAGE": {
      draft.stage++;
      return draft;
    }
    case "CLEAN_STRESS_ENTRY":
      let currentState = draft.mode;
      draft = { ...initialState, mode: currentState };

      return draft;
    case "CLEAN_SCANNED_UNITS":
      draft.scannedUnits.clear();
      draft.submittedSerialNumber = "";
      return draft;
    default: {
      return draft;
    }
  }
};

interface StressEntryDetailsContextProps {
  state: StressEntryDetails;
  dispatch: React.Dispatch<Action>;
}

const StressEntryDetailsContext = createContext<StressEntryDetailsContextProps>(
  {} as StressEntryDetailsContextProps
);

export const StressEntryDetailsContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useImmerReducer(
    stressEntryDetailsReducer,
    initialState
  );

  return (
    <StressEntryDetailsContext.Provider value={{ state, dispatch }}>
      {children}
    </StressEntryDetailsContext.Provider>
  );
};

export const useStressEntryContext = () => {
  return useContext(StressEntryDetailsContext);
};
