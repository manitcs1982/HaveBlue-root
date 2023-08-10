import { AxiosInstance } from "axios";
import { useMutation } from "react-query";
import { useFetchContext } from "../../common/FetchContext";
import { urls } from "../../common/urls";

interface PostValidAssetProps {
  authAxios: AxiosInstance;
  unitId: string;
  asset_name: string;
}

interface StepResultToProcedureProps {
  authAxios: AxiosInstance;
  procedureResultId: string;
  step_definition: number;
  execution_number: string;
  disposition: string | undefined;
  start_datetime: string;
}

interface MeasurementResultToStepProps {
  authAxios: AxiosInstance;
  stepResultId: string;
  asset: string;
  start_datetime: string;
  measurement_definition: number;
  user: number;
  limit: number;
  software_definition: string;
  name: string;
  result_string: string | undefined;
  result_defect: string;
  measurement_type: number;
  order: number;
  disposition: string;
  report_order: number;
  measurement_result_type: number;
  measurement_result_type_field: string;
  within_limits: boolean;
}

interface LinkFileToMeasurementProps {
  authAxios: AxiosInstance;
  measurementId: string;
  fileId: string;
}

export const postValidateAsset = async ({
  authAxios,
  unitId,
  asset_name,
}: PostValidAssetProps): Promise<any> => {
  const { data } = await authAxios.post(urls.units.validAsset(unitId), {
    asset_name,
  });
  return data;
};

export const useValidateAsset = () => {
  return useMutation(postValidateAsset);
};

export const postValidateAssetSerial = async (params: any): Promise<any> => {
  const { authAxios, unitId, ...postParams } = params;
  const { data } = await authAxios.post(urls.units.validAsset(unitId), {
    ...postParams,
  });
  return data;
};

export const useValidateAssetSerial = () => {
  return useMutation(postValidateAssetSerial);
};

export const submitMeasurementResult = async (params: any): Promise<any> => {
  const { authAxios, measurementResultId, ...postParams } = params;
  const { data } = await authAxios.post(
    urls.measurementResults.submit(measurementResultId),
    {
      ...postParams,
    }
  );
  return data;
};

export const useSubmitMeasurementResult = () => {
  return useMutation(submitMeasurementResult);
};

export const submitStepResult = async (params: any): Promise<any> => {
  const { authAxios, stepResultId, ...postParams } = params;
  const { data } = await authAxios.post(urls.stepResults.submit(stepResultId), {
    ...postParams,
  });
  return data;
};

export const useSubmitStepResult = () => {
  return useMutation(submitStepResult);
};

export const submitProcedureResult = async (params: any): Promise<any> => {
  const { authAxios, procedureResultId, ...postParams } = params;
  const { data } = await authAxios.post(
    urls.procedureResults.submit(procedureResultId),
    {
      ...postParams,
    }
  );
  return data;
};

export const useSubmitProcedureResult = () => {
  return useMutation(submitProcedureResult);
};

export const addStepToProcedure = async ({
  authAxios,
  procedureResultId,
  step_definition,
  execution_number,
  disposition,
  start_datetime,
}: StepResultToProcedureProps): Promise<any> => {
  const { data } = await authAxios.post(
    urls.procedureResults.addStep(procedureResultId),
    {
      step_definition,
      execution_number,
      disposition,
      start_datetime,
    }
  );
  return data;
};

export const useAddStepToProcedure = () => {
  return useMutation(addStepToProcedure);
};

export const addMeasurementToStep = async ({
  authAxios,
  asset,
  start_datetime,
  stepResultId,
  measurement_definition,
  user,
  limit,
  software_definition,
  name,
  result_string,
  result_defect,
  measurement_type,
  order,
  report_order,
  disposition,
  measurement_result_type,
  measurement_result_type_field,
  within_limits,
}: MeasurementResultToStepProps): Promise<any> => {
  const { data } = await authAxios.post(
    urls.stepResults.addMeasurement(stepResultId),
    {
      authAxios,
      asset,
      start_datetime,
      stepResultId,
      measurement_definition,
      user,
      limit,
      software_definition,
      name,
      result_string,
      result_defect,
      measurement_type,
      order,
      disposition,
      report_order,
      measurement_result_type,
      measurement_result_type_field,
      within_limits,
    }
  );
  return data;
};

export const useAddMeasurementToStep = () => {
  return useMutation(addMeasurementToStep);
};

export const linkFileToMeasurement = async ({
  authAxios,
  measurementId,
  fileId,
}: LinkFileToMeasurementProps): Promise<any> => {
  const { data } = await authAxios.post(
    urls.measurementResults.linkFiles(measurementId),
    {
      id: fileId,
    }
  );
  return data;
};

export const useLinkFileToMeasurement = () => {
  return useMutation(linkFileToMeasurement);
};

export const useMutateRecordCompletion = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, any>({
    mutationFn: async (values: any): Promise<any> => {
      const { data } = await authAxios.post(
        urls.manageResults.recordCompletion,
        {
          ...values,
        }
      );
      return data;
    },
    ...options,
  });
};
