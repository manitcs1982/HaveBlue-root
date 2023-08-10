import { useFetchContext } from "../common/FetchContext";
import { useQuery } from "react-query";
import { Customer } from "../common/types/customer.type";
import { Disposition } from "../common/types/disposition.type";
import { AxiosError } from "axios";
import { urls } from "../common/urls";

export interface Crate {
  id: number;
  url: string;
  name: string;
  disposition_name: string;
  shipped_by_name: string;
}

interface ProjectManager {
  administrationComment: string;
  email: string;
  firstName: string;
  id: string;
  isPermanentUser: boolean;
  lastname: string;
  notes: string;
  registrationComment: string;
}

export interface Project {
  customer: Customer;
  disposition: Disposition;
  id: string;
  projectId: string;
  projectManager: ProjectManager;
  projectManagerId: string;
  startDate: string;
  totalUnits: number;
  unitsReceived: number;
}

export const useCrates = () => {
  const { authAxios } = useFetchContext();

  const getCrates = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.crates.all);
    return data.results;
  };
  return useQuery("crates", getCrates);
};

export const useLocations = () => {
  const { authAxios } = useFetchContext();

  const getLocations = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.locations.all);
    return data.results;
  };

  return useQuery("locations", getLocations);
};

export const useCrateDetails = (
  id: string,
  customers: any,
  dispositions: any
) => {
  const { authAxios } = useFetchContext();

  const getCrateDetails = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.crates.details(id));
    return data;
  };
  return useQuery(
    ["crateDetails", id, customers, dispositions],
    getCrateDetails,
    {
      enabled:
        customers !== undefined &&
        customers !== null &&
        dispositions !== undefined &&
        dispositions !== null,
    }
  );
};

export const useCrateNotes = (id: string, type: number | null) => {
  const { authAxios } = useFetchContext();

  const getCrateNotes = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.crates.notes(id, type));
    return data;
  };
  return useQuery(["crateNotes", id], getCrateNotes, {
    enabled: id !== undefined && id !== null,
  });
};

export const useProjects = () => {
  const { authAxios } = useFetchContext();

  const getProjects = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.workOrders.intakeUnits);
    return data;
  };
  return useQuery<any, AxiosError>("projects", getProjects);
};

export const useProjectDetails = (projectId: any) => {
  const { authAxios } = useFetchContext();

  const getProjectDetails = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.projects.projectDetails(projectId)
    );
    return data;
  };
  return useQuery<any, AxiosError>(
    ["project_details", projectId],
    getProjectDetails
  );
};

export const useWorkOrderDetails = (workOrderId: any) => {
  const { authAxios } = useFetchContext();

  const getWorkOrderDetails = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.workOrders.expectedUnitTypes(workOrderId)
    );
    return data;
  };
  return useQuery<any, AxiosError>(
    ["workOrderDetails", workOrderId],
    getWorkOrderDetails
  );
};

export const useWorkOrder = (workOrderId: any) => {
  const { authAxios } = useFetchContext();

  const getWorkOrder = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.workOrders.details(workOrderId));
    return data;
  };
  return useQuery<any, AxiosError>(["workOrder", workOrderId], getWorkOrder);
};

export const useExpectedUnitDetails = (expectedUnitId: any) => {
  const { authAxios } = useFetchContext();
  const getExpectedUnitDetails = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.expectedUnitTypes.details(expectedUnitId)
    );
    return data;
  };
  return useQuery<any, AxiosError>(
    ["expectedUnitDetails", expectedUnitId],
    getExpectedUnitDetails,
    {
      enabled:
        expectedUnitId !== undefined &&
        expectedUnitId !== null &&
        expectedUnitId !== "",
    }
  );
};

export const useMagicLink = (id: any) => {
  const { authAxios } = useFetchContext();

  const getMagicLink = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.units.magicLink(id));
    return data;
  };
  return useQuery<any, AxiosError>(["magicLink", id], getMagicLink, {
    enabled: id !== undefined && id !== null,
  });
};

export const useLabel = (id: any, token: any) => {
  const { authAxios } = useFetchContext();

  const getLabel = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.units.label(id, token));
    return data;
  };

  return useQuery<any, AxiosError>(["newLabel", id, token], getLabel, {
    enabled: false,
  });
};
