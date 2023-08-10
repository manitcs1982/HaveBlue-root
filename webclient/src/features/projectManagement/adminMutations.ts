import { useFetchContext } from "../common/FetchContext";
import { useMutation, UseMutationOptions } from "react-query";
import { urls } from "../common/urls";
import { Template } from "./types/Template";

export const useCreateTemplate = (
  options: UseMutationOptions<any, any, Template> = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, Template>({
    mutationFn: async (newTemplate) => {
      const { data } = await authAxios.post(urls.templates.add, newTemplate);

      return data;
    },
    ...options,
  });
};

export const useUpdateTemplate = (
  options: UseMutationOptions<
    any,
    any,
    { id: string; updatedTemplate: Template }
  > = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, { id: string; updatedTemplate: Template }>({
    mutationFn: async ({ id, updatedTemplate }) => {
      const { data } = await authAxios.patch(
        urls.templates.details(id),
        updatedTemplate
      );

      return data;
    },
    ...options,
  });
};
