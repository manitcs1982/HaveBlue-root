import { v4 as uuidv4 } from "uuid";
import { TesterUnits } from "./constants";

export const getDataFromMeasurementResults = (
  data: any,
  testerUnits: TesterUnits
) => {
  const measurementResults = data.step_results[0].measurement_results;

  const namesSet = new Set();
  const results: any[] = [];
  let resultType: any;
  let testerUnitType: any;
  let testerUnit: any;

  for (let measurementResult of measurementResults) {
    namesSet.add(measurementResult.name);
    resultType =
      measurementResult[measurementResult.measurement_result_type_field];
    resultType = resultType === -1 ? "∞" : resultType;

    if (resultType === true) {
      resultType = "Pass";
    } else if (resultType === false) {
      resultType = "Fail";
    } else if (resultType === null) {
      resultType = "N/A";
    } else if (resultType instanceof Array) {
      resultType = resultType[0];
    }

    testerUnit = testerUnits[measurementResult.name];

    testerUnitType =
      testerUnit === undefined || resultType === "N/A" ? "" : testerUnit;

    results.push({
      id: measurementResult.id,
      name: measurementResult.name,
      result:
        resultType instanceof String
          ? `${resultType} ${testerUnitType}`
          : resultType,
    });
  }

  const differenceOfResults = Object.keys(testerUnits).filter(
    (value: any) => !namesSet.has(value)
  );
  if (differenceOfResults.length > 0) {
    for (let name of differenceOfResults) {
      results.push({
        id: uuidv4(),
        name,
        result: "N/A",
      });
    }
  }

  return results;
};

export const formatDateWorkLog = (date: any) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const getNoteType = (type : string, array : any) => {
  for (const key in array) {
    if (array[key].type_name === type) {
      return key
    }
  }
  return -1;
}
