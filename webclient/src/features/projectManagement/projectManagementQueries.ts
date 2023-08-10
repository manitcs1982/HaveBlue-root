import {
  QueryObserverOptions,
  QueryOptions,
  useQueries,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import { useFetchContext } from "../common/FetchContext";
import { urls } from "../common/urls";
import * as queryKeys from "./projectManagementQueryKeyFactory";
import { Plugin } from "./types/Plugin";
import { Group } from "./types/Group";
import { ServerUnitTypeFamily } from "./types/UnitTypeFamily";
import { ServerProcedureDefinition } from "./types/ProcedureDefinition";

export const useCustomers = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.customerKeys.all,
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.customers.all);
      return data.results;
    },
    ...options,
  });
};

export const useProjectManagers = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.groupKeys.projectManagers(),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.groups.projectManagers);
      return data.results[0].users;
    },
    ...options,
  });
};

export const useProjectGroup = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.groupKeys.projects(),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.groups.projects);
      return data.results[0];
    },
    ...options,
  });
};

export const useCustomerDetails = (id: string, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.customerKeys.detail(id),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.customers.details(id));
      return data;
    },
    ...options,
  });
};

export const useProjectDetails = (
  activeProject: string | null,
  options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.projectKeys.detail(activeProject),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(
        urls.projects.projectDetails(activeProject)
      );
      return data;
    },
    enabled: activeProject !== undefined && activeProject !== null,
    ...options,
  });
};

export const useProjectSummary = (
  projectId: string,
  options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.projectKeys.detail(projectId),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(
        urls.projects.projectIntelligenceSummary(projectId)
      );
      return data;
    },
    enabled: projectId !== undefined && projectId !== null,
    ...options,
  });
};

export const useProjectWorkOrders = (
  projectId: string,
  options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.projectKeys.workOrders(projectId),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.projects.workOrders(projectId));

      return data;
    },
    ...options,
  });
};

export const useWorkOrdersById = (
  workOrderIds: number[],
  options: QueryObserverOptions<any, any, any> = {}
): UseQueryResult<any, any>[] => {
  const { authAxios } = useFetchContext();

  const queryOptions: UseQueryOptions<any, any, any>[] = workOrderIds.map(
    (workOrderId: number) => {
      return {
        queryKey: queryKeys.workOrderKeys.detail(workOrderId),
        queryFn: async (): Promise<any> => {
          const { data } = await authAxios.get(`work_orders/${workOrderId}/`);

          return data;
        },
        ...options,
      };
    }
  );

  return useQueries(queryOptions);
};

export const useWorkOrderDetails = (id: string, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.workOrderKeys.detail(id),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.workOrders.details(id));
      return data;
    },
    ...options,
  });
};

export const useAvailableUnits = (id: string, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.projectKeys.availableUnits(id),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.projects.availableUnits(id));
      return data;
    },
    ...options,
  });
};

export const useAssignUnitsByWorkOrder = (
  activeWorkOrder: string | null,
  options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.workOrderKeys.assignUnits(activeWorkOrder),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(
        urls.workOrders.assignUnits(activeWorkOrder)
      );
      return data;
    },
    enabled:
      activeWorkOrder !== undefined &&
      activeWorkOrder !== null &&
      activeWorkOrder !== "",
    ...options,
  });
};

export const useTestSequenceDefinitions = (
  createdWorkOrderId: any,
  options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.testSequenceDefinitionsKeys.all,
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.testSequenceDefinitions.all);
      return data.results;
    },
    enabled:
      createdWorkOrderId !== undefined &&
      createdWorkOrderId !== null &&
      createdWorkOrderId !== "",
    ...options,
  });
};

export const useUnitTypes = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.unitTypeKeys.all,
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.unitTypes.all);
      return data.results;
    },
    ...options,
  });
};

export const useModuleTechnologies = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.moduleTechologiesKeys.all,
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.moduleTechnologies.all);
      return data.results;
    },
    ...options,
  });
};

export const useMeasurementTypes = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.measurementTypesKeys.all,
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.measurementTypes.all);
      return data.results;
    },
    ...options,
  });
};

export const useUnitTypeFamilies = (
  options: UseQueryOptions<ServerUnitTypeFamily[], any> = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<ServerUnitTypeFamily[], any>({
    queryKey: queryKeys.unitTypeFamiliesKeys.all,
    queryFn: async () => {
      const { data } = await authAxios.get(urls.unitTypeFamilies.all);

      return data.results;
    },
    ...options,
  });
};

export const useUnitTypeDetails = (
  unitTypeId: string,
  options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.unitTypeKeys.detail(unitTypeId),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.unitTypes.details(unitTypeId));
      return data;
    },
    ...options,
  });
};

export const useReportTypes = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.reportTypesKeys.all,
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.reportTypes.all);
      return data.results;
    },
    ...options,
  });
};

export const useBurndown = (id: any) => {
  const { authAxios } = useFetchContext();

  const getBurndown = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.projects.burndownGraph(id));
    return data;
  };

  return useQuery(["burndownChart", id], getBurndown);
};

export const useGantt = (id: any) => {
  const { authAxios } = useFetchContext();

  const getGantt = async (): Promise<any> => {
    const { data } = await authAxios.get(`/projects/${id}/gantt_graph/`);
    return data;
  };

  return useQuery(["ganttChart", id], getGantt);
};

export const usePlugins = (options: QueryOptions<any, any> = {}) => {
  const { authAxios } = useFetchContext();

  const getPlugins = async (): Promise<Plugin[]> => {
    const { data } = await authAxios.get(urls.plugins.all);
    return data.results;
  };

  return useQuery<Plugin[], any>(queryKeys.pluginKeys.all, getPlugins, options);
};

export const usePlugin = (
  pluginId: number,
  options: QueryOptions<any, any> = {}
) => {
  const { authAxios } = useFetchContext();

  const getPlugin = async (): Promise<Plugin> => {
    const { data } = await authAxios.get(urls.plugins.details(pluginId));

    return data;
  };

  return useQuery<Plugin, any>(
    queryKeys.pluginKeys.detail(pluginId),
    getPlugin,
    options
  );
};

export const useGroups = (options: UseQueryOptions<Group[], any> = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<Group[], any>({
    queryKey: queryKeys.groupKeys.all,
    queryFn: async (): Promise<Group[]> => {
      const { data } = await authAxios.get(urls.groups.all);

      return data.results;
    },
    ...options,
  });
};

export const useGroupsByGroupType = (
  groupType: number,
  options: UseQueryOptions<Group[], any> = {}
) => {
  const { authAxios } = useFetchContext();

  const getGroupsByGroupType = async (): Promise<Group[]> => {
    const { data } = await authAxios.get(`groups/?group_type=${groupType}`);

    return data.results;
  };

  return useQuery<Group[], any>(
    queryKeys.groupKeys.groupType(groupType),
    getGroupsByGroupType,
    options
  );
};

export const useProcedureDefinitions = (
  useOnlyAvailable: boolean = false,
  options: UseQueryOptions<ServerProcedureDefinition[], any> = {}
) => {
  const { authAxios } = useFetchContext();

  const getProcedureDefinitions = async () => {
    let requestString = "procedure_definitions/?limit=-1";

    if (useOnlyAvailable) requestString += "&disposition=16";

    const { data } = await authAxios.get(requestString);

    return data.results;
  };

  return useQuery<ServerProcedureDefinition[], any>(
    queryKeys.procedureDefinitionKeys.all,
    getProcedureDefinitions,
    options
  );
};

export const useProjectActions = (id: string, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.projectKeys.actions(id),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.projects.actions(id));

      return data;
    },
    ...options,
  });
};

export const useActionDefinitions = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.actionDefinitionKeys.all,
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.actionDefinitions.all);

      return data.results;
    },
    ...options,
  });
};

export const useActionResult = (id: string, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.actionDefinitionKeys.detail(id),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.actionResults.details(id));

      return data;
    },
    ...options,
  });
};

export const useCheckActionCompletion = (
  id: string,
  options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: queryKeys.actionDefinitionKeys.detail(id),
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.actionResults.completed(id));

      return data;
    },
    enabled: false,
    ...options,
  });
};

export const useReports = (options: UseQueryOptions<any, any> = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.actionResults.reports);

      return data;
    },
    ...options,
  });
};
