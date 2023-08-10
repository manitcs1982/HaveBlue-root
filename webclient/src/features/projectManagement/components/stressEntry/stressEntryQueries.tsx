import { useQuery } from "react-query";
import { useFetchContext } from "../../../common/FetchContext";
import { STRESSOR_CHECK_IN_MODE } from "./constants";

export const useStressTypes = () => {
  const { authAxios } = useFetchContext();

  const getStressTypes = async (): Promise<any> => {
    const { data } = await authAxios.get("/assets/stressors/");
    return data;
  };
  return useQuery("stressTypes", getStressTypes);
};

export const useStressProcedures = (id: string, mode: number | null) => {
  const { authAxios } = useFetchContext();

  const getStressProcedures = async (): Promise<any> => {
    const { data } = await authAxios.get(`/assets/${id}/procedures`);
    return data;
  };
  return useQuery(["stressTypes", id, mode], getStressProcedures, {
    enabled: id !== undefined && id !== null && mode === STRESSOR_CHECK_IN_MODE,
  });
};
