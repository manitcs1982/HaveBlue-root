import { useQuery, UseQueryOptions } from "react-query";
import { useFetchContext } from "../../../common/FetchContext";
import moment from "moment";
import { urls } from "../../../common/urls";

export const useUnitsInProgress = () => {
  const { authAxios } = useFetchContext();

  const getUnitsInProgress = async (): Promise<any> => {
    const { data } = await authAxios.get("units/in_progress/");
    return data;
  };
  return useQuery("unitsInProgress", getUnitsInProgress);
};

export const useStressors = () => {
  const { authAxios } = useFetchContext();

  const getStressors = async (): Promise<any> => {
    const { data } = await authAxios.get("stressors/");
    return data.results;
  };
  return useQuery("stressors", getStressors);
};

export const useStressQueue = () => {
  const { authAxios } = useFetchContext();

  const getStressQueue = async (): Promise<any> => {
    const { data } = await authAxios.get("units/stress_queue/");
    return data;
  };
  return useQuery("stressQueue", getStressQueue);
};

export const useCharacterizationQueue = () => {
  const { authAxios } = useFetchContext();

  const getCharacterizationQueue = async (): Promise<any> => {
    const { data } = await authAxios.get("units/characterization_queue/");
    return data;
  };
  return useQuery("characterizationQueue", getCharacterizationQueue);
};

export const useCharacterizationQueueByAssetName = (assetName: string) => {
  const { authAxios } = useFetchContext();

  const getCharacterizationQueueByAssetName = async (): Promise<any> => {
    const { data } = await authAxios.get(
      `units/characterization_queue/?asset_name=${assetName}`
    );
    let assetKeys = Object.keys(data);
    let result = assetKeys.reduce((accum: any, assetKey: any) => {
      return [...accum, ...data[assetKey]];
    }, []);
    return result;
  };
  return useQuery(
    "characterizationQueueByAssetName",
    getCharacterizationQueueByAssetName
  );
};

export const useEndofLifeQueue = (options: UseQueryOptions<any, any> = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: "endOfLifeQueue",
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.units.endOfLifeQueue);

      return data;
    },
    ...options,
  });
};

export const useUnitsByAssetId = (assetId: string) => {
  const { authAxios } = useFetchContext();

  const getUnitsByAssetId = async (): Promise<any> => {
    const { data } = await authAxios.get(`assets/${assetId}/units/`);
    return data;
  };
  return useQuery(["unitsByAssetId", assetId], getUnitsByAssetId, {
    enabled: assetId !== undefined && assetId !== null && assetId !== "",
  });
};

export const useTodoDownload = () => {
  const { authAxios } = useFetchContext();

  const getTodoDownload = async (): Promise<any> => {
    const response = await authAxios.get(`units/todo_queue/`, {
      responseType: "blob",
    });

    const downloadUrl = URL.createObjectURL(response.data);
    let a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${moment().format("MMM-DD-YYYY-HHMMSS")}.xls`;
    document.body.appendChild(a);
    a.click();
  };

  return useQuery("downloadTodo", getTodoDownload, {
    enabled: false,
  });
};
