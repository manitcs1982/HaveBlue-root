import { Disposition } from "../types/disposition.type";
import { useMutation, useQuery } from "react-query";
import { useFetchContext } from "../../common/FetchContext";
import { urls } from "../urls";

export const useDispositions = () => {
  const { authAxios } = useFetchContext();

  const getDispositions = async (): Promise<Disposition[]> => {
    const { data } = await authAxios.get(urls.dispositions.all);
    return data.results;
  };
  return useQuery("dispositions", getDispositions);
};

export const useUnitsDispositions = () => {
  const { authAxios } = useFetchContext();

  const getDispositions = async (): Promise<Disposition[]> => {
    const { data } = await authAxios.get(urls.dispositions.units);
    return data.dispositions;
  };
  return useQuery("unitsDispositions", getDispositions);
};

export const useNotesDispositions = () => {
  const { authAxios } = useFetchContext();

  const getDispositions = async (): Promise<Disposition[]> => {
    const { data } = await authAxios.get(urls.dispositions.notes);
    return data.dispositions;
  };
  return useQuery("notesDispositions", getDispositions);
};

export const useWorkOrderUnitsDispositions = () => {
  const { authAxios } = useFetchContext();

  const getWorkOrderUnitsDispositions = async (): Promise<Disposition[]> => {
    const { data } = await authAxios.get(urls.dispositions.workOrderUnits);
    return data.dispositions;
  };
  return useQuery("workOrderUnitsDispositions", getWorkOrderUnitsDispositions);
};

export const useMeasurementsDispositions = () => {
  const { authAxios } = useFetchContext();

  const getMeasurementsDispositions = async (): Promise<Disposition[]> => {
    const { data } = await authAxios.get(urls.dispositions.measurementResults);
    return data.dispositions;
  };
  return useQuery("measurementsDispositions", getMeasurementsDispositions);
};

export const useCrateDispositions = () => {
  const { authAxios } = useFetchContext();

  const getCrateDispositions = async (): Promise<Disposition[]> => {
    const { data } = await authAxios.get(urls.dispositions.crates);
    return data.dispositions;
  };
  return useQuery("crateDispositions", getCrateDispositions);
};

export const useWorkOrderDispositions = () => {
  const { authAxios } = useFetchContext();

  const getWorkOrderDispositions = async (): Promise<Disposition[]> => {
    const { data } = await authAxios.get(urls.dispositions.workOrders);
    return data.dispositions;
  };
  return useQuery("workOrderDispositions", getWorkOrderDispositions);
};

export const useTestSequenceDefinitionsDispositions = () => {
  const { authAxios } = useFetchContext();

  const getTestSequenceDefinitionsDispositions = async (): Promise<
    Disposition[]
  > => {
    const { data } = await authAxios.get(
      "test_sequence_definitions/dispositions/?limit=-1"
    );

    return data.dispositions;
  };

  return useQuery(
    "testSequenceDefinitionsDispositions",
    getTestSequenceDefinitionsDispositions
  );
};

export const useDispositionsByName = (name: string) => {
  const { authAxios } = useFetchContext();

  const getDispositionsByName = async (): Promise<Disposition> => {
    const { data } = await authAxios.get(urls.dispositions.byName(name));
    return data.results[0];
  };
  return useQuery<Disposition>(
    ["dispositionsByName", name],
    getDispositionsByName
  );
};

export const useDispositionsByNameAndEnabled = (
  name: string,
  enabled: boolean
) => {
  const { authAxios } = useFetchContext();

  const getDispositionsByNameAndEnabled = async (): Promise<Disposition> => {
    const { data } = await authAxios.get(urls.dispositions.byName(name));
    return data.results[0];
  };
  return useQuery<Disposition>(
    [`dispositionsByNameAndEnabled`, { name, enabled }],
    getDispositionsByNameAndEnabled,
    {
      enabled: enabled !== undefined && enabled !== null && undefined !== "",
    }
  );
};

export const patchUnit = async ({
  authAxios,
  id,
  field,
  value,
}: any): Promise<any> => {
  const { data } = await authAxios.patch(urls.units.unitDetails(id), {
    [field]: value,
  });
  return data;
};

export const usePatchUnit = () => {
  return useMutation(patchUnit);
};
