import { ProcedureExecutionOrder } from "../../../types/ProcedureExecutionOrder";

export const addProcedureDefinitionToList = (
  list: ProcedureExecutionOrder[],
  procedureDefinition: ProcedureExecutionOrder
): ProcedureExecutionOrder[] => {
  return [...list, procedureDefinition];
};

export const removeProcedureDefinitionFromList = (
  list: ProcedureExecutionOrder[],
  procedureDefinition: ProcedureExecutionOrder
): ProcedureExecutionOrder[] => {
  return list.filter(
    (existingProcedureDefinition) =>
      existingProcedureDefinition !== procedureDefinition
  );
};
