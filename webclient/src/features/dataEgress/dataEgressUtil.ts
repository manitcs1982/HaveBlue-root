import find from "lodash/find";
import filter from "lodash/filter";

export const getFirstStepResultByName = (
  procedureResult: any,
  name: string
) => {
  return find(procedureResult.step_results, ["name", name]);
};

export const getAllStepResultsByName = (procedureResult: any, name: string) => {
  return filter(procedureResult.step_results, ["name", name]);
};

export const getFirstMeasurementResultByName = (
  stepResult: any,
  name: string
) => {
  return find(stepResult.measurement_results, ["name", name]);
};
