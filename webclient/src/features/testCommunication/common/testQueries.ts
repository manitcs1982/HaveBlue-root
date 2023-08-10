import { useFetchContext } from "../../common/FetchContext";
import { useQuery, UseQueryOptions } from "react-query";
import { urls } from "../../common/urls";

export const useAssetTypes = () => {
  const { authAxios } = useFetchContext();

  const getAssetTypes = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.assetTypes.all);
    return data.results;
  };
  return useQuery("assetTypes", getAssetTypes);
};

export const useTestCommunicationDetails = (type: string) => {
  const { authAxios } = useFetchContext();
  let assetTypeFilter = "";
  if (type.includes("wet_leakage")) {
    assetTypeFilter = "WET LEAKAGE";
  } else if (type.includes("diode_test")) {
    assetTypeFilter = "DIODE TESTER";
  } else if (type.includes("visual_inspection")) {
    assetTypeFilter = "VISUAL INSPECTION";
  } else if (type.includes("colorimeter")) {
    assetTypeFilter = "COLORIMETER";
  } else if (type.includes("el")) {
    assetTypeFilter = "Electroluminescence Test Station";
  } else if (type.includes("iv_curve")) {
    assetTypeFilter = "Flash Tester";
  } else {
    assetTypeFilter = "";
  }

  const getTestCommunicationDetails = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.assetTypes.byName(assetTypeFilter)
    );
    return data.results[0];
  };
  return useQuery(["testCommunication", type], getTestCommunicationDetails);
};

export const useUnitsByAsset = (
  assetId: number,
  options: UseQueryOptions<any, any> = {}
) => {
  const { authAxios } = useFetchContext();

  const getUnitsByAsset = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.units.byAsset(assetId));

    return data;
  };

  return useQuery<any, any>({ queryFn: getUnitsByAsset, ...options });
};

export const useUnitsBySerialNumber = (serialNumber: string | null) => {
  const { authAxios } = useFetchContext();

  const getUnitsBySerialNumber = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.units.bySerialNumber(serialNumber)
    );
    return data.results;
  };
  return useQuery(
    ["unitsBySerialNumber", serialNumber],
    getUnitsBySerialNumber,
    {
      enabled:
        serialNumber !== undefined &&
        serialNumber !== null &&
        serialNumber !== "",
    }
  );
};

export const useAvailableDefects = () => {
  const { authAxios } = useFetchContext();

  const getAvailableDefects = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.availableDefects.all);
    return data.results;
  };
  return useQuery("available_defects", getAvailableDefects);
};

export const useProcedureResult = (id: string) => {
  const { authAxios } = useFetchContext();

  const getProcedureResult = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.procedureResults.procedureDetails(id)
    );
    return data;
  };
  return useQuery(["procedure_result", id], getProcedureResult, {
    enabled: id !== undefined && id !== null && id !== "",
  });
};

export const useProcedureResultView = (id: number) => {
  const { authAxios } = useFetchContext();

  const getProcedureResults = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.procedureResults.view(id));
    return data;
  };

  return useQuery(["procedureResultsView", id], getProcedureResults, {
    enabled: id !== undefined && id !== null,
  });
};
export const useUsers = () => {
  const { authAxios } = useFetchContext();

  const getUsers = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.users.all);
    return data.results;
  };
  return useQuery(["users"], getUsers);
};
