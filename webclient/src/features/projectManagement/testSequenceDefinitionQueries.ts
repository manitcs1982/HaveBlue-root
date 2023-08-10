import { QueryOptions, useQuery } from "react-query";
import { useFetchContext } from "../common/FetchContext";
import { urls } from "../common/urls";

export const useTestSequenceDefinitionDetails = (id: string) => {
  const { authAxios } = useFetchContext();

  const getTestSequenceDefinitionDetails = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.testSequenceDefinitions.mockTraveler(id)
    );
    return data;
  };

  return useQuery<any, any>(
    ["testSequenceDefinitionDetails", id],
    getTestSequenceDefinitionDetails,
    {
      enabled: id !== undefined && id !== null && id !== "",
    }
  );
};

export const useTestSequenceDefinition = (id: string) => {
  const { authAxios } = useFetchContext();

  const getTestSequenceDefinition = async (): Promise<any> => {
    const { data } = await authAxios.get(
      `test_sequence_definitions/${id}/tsd_full_view/`
    );

    return data;
  };

  return useQuery<any, any>(
    ["testSequenceDefinition", id],
    getTestSequenceDefinition,
    { enabled: id !== undefined && id !== null && id !== "" }
  );
};

export const useTestSequenceDefinitions = (
  options: QueryOptions<any, any> = {}
) => {
  const { authAxios } = useFetchContext();

  const getTestSequenceDefinitions = async (): Promise<any> => {
    const { data } = await authAxios.get("test_sequence_definitions?limit=-1");

    return data.results;
  };

  return useQuery<any, any>(
    ["test_sequence_definitions"],
    getTestSequenceDefinitions,
    options
  );
};
