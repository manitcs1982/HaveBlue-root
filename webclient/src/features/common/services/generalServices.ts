import { useQuery } from "react-query";
import { useFetchContext } from "../FetchContext";

export const useDataFromUrl = (url: string, condition: string) => {
  const { authAxiosFromUrl } = useFetchContext();

  const getDataFromUrl = async (): Promise<any> => {
    const { data } = await authAxiosFromUrl.get(url);
    return data;
  };
  return useQuery(["dataFromUrl", url, condition], getDataFromUrl, {
    enabled:
      url !== undefined &&
      url !== null &&
      url !== "" &&
      (condition === undefined || condition === null || condition === ""),
  });
};

export const useNoop = (enabledValue: any) => {
  const { authAxios } = useFetchContext();

  const getNoop = async (): Promise<any> => {
    const { data } = await authAxios.get("noop/");
    return data.results;
  };
  return useQuery("noop", getNoop, {
    enabled:
      enabledValue !== undefined &&
      enabledValue !== null &&
      enabledValue !== "",
  });
};
