import { useFetchContext } from "../common/FetchContext";
import { urls } from "../common/urls";
import { useQuery, UseQueryOptions } from "react-query";
import { ServerTemplate } from "./types/Template";

export const useTemplates = (
  options: UseQueryOptions<ServerTemplate[], any> = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<ServerTemplate[], any>({
    queryKey: "templates",
    queryFn: async () => {
      const { data } = await authAxios.get(urls.templates.all);

      return data.results;
    },
    ...options,
  });
};

export const useTemplate = (
  id: string,
  options: UseQueryOptions<any, any> = {}
) => {
  const { authAxios } = useFetchContext();

  const getTemplate = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.templates.details(id));

    return data;
  };

  return useQuery<any, any>({
    queryKey: `template/${id}`,
    queryFn: getTemplate,
    ...options,
  });
};

export const useFileFormats = (options: UseQueryOptions<any, any> = {}) => {
  const { authAxios } = useFetchContext();

  const getFileTypes = async () => {
    const { data } = await authAxios.get(urls.fileFormats.all);

    return data.results;
  };

  return useQuery<any, any>({
    queryKey: "fileFormats",
    queryFn: getFileTypes,
    ...options,
  });
};
