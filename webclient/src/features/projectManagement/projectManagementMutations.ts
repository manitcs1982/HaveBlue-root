import { useMutation, useQueryClient, MutationOptions } from "react-query";
import { useFetchContext } from "../common/FetchContext";
import {
  PostCustomerProps,
  PutCustomerProps,
  LinkFileToUnitProps,
  Note,
  PostExpectedUnitType,
  PostProjectProps,
  PostUnitTypeProps,
  PostWorkOrderProps,
  PutProjectProps,
  PutUnitTypeProps,
  PutWorkOrderProps,
} from "./types/Customer";
import * as queryKeys from "./projectManagementQueryKeyFactory";
import { PostPlugin } from "./types/Plugin";
import { urls } from "../common/urls";
import { ProcedureExecutionOrder } from "./types/ProcedureExecutionOrder";
import {
  LinkFileToActionProps,
  MarkCompleteActionProps,
  RevokeActionProps,
} from "./types/Action";
import moment from "moment";

export const useCreateCustomer = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, PostCustomerProps>({
    mutationFn: async ({
      name,
      short_name,
    }: PostCustomerProps): Promise<any> => {
      const { data } = await authAxios.post(urls.customers.submit, {
        name,
        short_name,
      });
      return data;
    },
    ...options,
  });
};

export const useUpdateCustomer = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, PutCustomerProps>({
    mutationFn: async ({
      name,
      short_name,
      customerId,
    }: PutCustomerProps): Promise<any> => {
      const { data } = await authAxios.put(urls.customers.details(customerId), {
        name,
        short_name,
      });
      return data;
    },
    onSettled: (data, error, variables, context) =>
      queryClient.invalidateQueries(
        queryKeys.customerKeys.detail(String(variables.customerId))
      ),
    ...options,
  });
};

export const useCreateWorkOrder = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, PostWorkOrderProps>({
    mutationFn: async ({
      project,
      name,
      description,
      start_datetime,
      disposition,
      unit_disposition,
      tib,
    }: PostWorkOrderProps): Promise<any> => {
      const { data } = await authAxios.post(urls.workOrders.submit, {
        project,
        name,
        description,
        start_datetime,
        disposition,
        unit_disposition,
        tib,
      });
      return data;
    },
    ...options,
  });
};

export const useUpdateWorkOrder = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, PutWorkOrderProps>({
    mutationFn: async ({
      project,
      name,
      description,
      start_datetime,
      disposition,
      unit_disposition,
      tib,
      workOrderId,
    }: PutWorkOrderProps): Promise<any> => {
      const { data } = await authAxios.put(
        urls.workOrders.details(workOrderId),
        {
          project,
          name,
          description,
          start_datetime,
          disposition,
          unit_disposition,
          tib,
        }
      );
      return data;
    },

    onSettled: (data, error, variables, context) =>
      queryClient.invalidateQueries(
        queryKeys.workOrderKeys.detail(String(variables.workOrderId))
      ),
    ...options,
  });
};

export const useCreateProject = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, PostProjectProps>({
    mutationFn: async ({
      group,
      customer,
      number,
      sfdc_number,
      project_manager,
      disposition,
      proposal_price,
    }: PostProjectProps): Promise<any> => {
      const { data } = await authAxios.post(urls.projects.submit, {
        group,
        customer,
        number,
        sfdc_number,
        project_manager,
        disposition,
        proposal_price,
      });
      return data;
    },
    ...options,
  });
};

export const useUpdateProject = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();
  return useMutation<any, any, PutProjectProps>({
    mutationFn: async ({
      group,
      customer,
      projectId,
      number,
      sfdc_number,
      project_manager,
      disposition,
      proposal_price,
    }: PutProjectProps): Promise<any> => {
      const { data } = await authAxios.put(
        urls.projects.projectDetails(projectId),
        {
          number,
          sfdc_number,
          project_manager,
          disposition,
          group,
          customer,
          proposal_price,
        }
      );
      return data;
    },
    onSettled: (data, error, variables, context) =>
      queryClient.invalidateQueries(
        queryKeys.projectKeys.detail(String(variables.projectId))
      ),
    ...options,
  });
};

export const useAttachUnitToWorkOrder = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({ workOrderId, unitIds }: any): Promise<any> => {
      const { data } = await authAxios.post(
        urls.workOrders.linkUnits(workOrderId),
        unitIds
      );
      return data;
    },
    onSettled: (data, error, variables, context) =>
      queryClient.invalidateQueries(
        queryKeys.workOrderKeys.assignUnits(String(variables.workOrderId))
      ),
    ...options,
  });
};

export const useDetachUnitToWorkOrder = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({ workOrderId, unitIds }: any): Promise<any> => {
      const { data } = await authAxios.post(
        urls.workOrders.unlinkUnits(workOrderId),
        unitIds
      );
      return data;
    },
    onSettled: (data, error, variables, context) =>
      queryClient.invalidateQueries(
        queryKeys.workOrderKeys.assignUnits(String(variables.workOrderId))
      ),
    ...options,
  });
};

export const useResoakUnit = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({ unit, workOrderId }: any): Promise<any> => {
      const { data } = await authAxios.post(urls.manageResults.rerunSoak, {
        unit: unit,
      });
      return data;
    },
    onSettled: (data, error, variables, context) =>
      queryClient.invalidateQueries(
        queryKeys.workOrderKeys.assignUnits(variables.workOrderId)
      ),
    ...options,
  });
};

export const useAddTestSequencesToWorkOrder = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({ workOrderId, selectedTests }: any): Promise<any> => {
      const { data } = await authAxios.post(
        `work_orders/${workOrderId}/add_tests/`,
        selectedTests
      );
      return data;
    },
    onSettled: (data, error, variables, context) => {
      console.log(
        "The key",
        queryKeys.workOrderKeys.detail(variables.workOrderId)
      );
      queryClient.invalidateQueries(
        queryKeys.workOrderKeys.detail(String(variables.workOrderId))
      );
    },
    ...options,
  });
};

export const useDeleteTestSequencesToWorkOrder = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({ workOrderId, testSequences }: any): Promise<any> => {
      const { data } = await authAxios.post(
        urls.workOrders.deleteTests(workOrderId),
        testSequences
      );
      return data;
    },
    onSettled: (data, error, variables, context) =>
      queryClient.invalidateQueries(
        queryKeys.workOrderKeys.detail(String(variables.workOrderId))
      ),
    ...options,
  });
};

export const useCreateUnitType = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, PostUnitTypeProps>({
    mutationFn: async ({
      manufacturer,
      bom,
      description,
      notes,
      model,
      number_of_cells,
      nameplate_pmax,
      module_width,
      module_height,
      system_voltage,
      auditor,
      audit_date,
      audit_report_id,
      isc,
      voc,
      imp,
      vmp,
      alpha_isc,
      beta_voc,
      gamma_pmp,
      cells_in_series,
      cells_in_parallel,
      cell_area,
      unit_type_family,
      module_technology,
      bifacial,
    }: PostUnitTypeProps): Promise<any> => {
      const { data } = await authAxios.post(urls.unitTypes.submit, {
        manufacturer,
        bom,
        description,
        notes,
        model,
        unit_type_family,
        module_property: {
          number_of_cells,
          nameplate_pmax,
          module_width,
          module_height,
          system_voltage,
          auditor,
          audit_date,
          audit_report_id,
          isc,
          voc,
          imp,
          vmp,
          alpha_isc,
          beta_voc,
          gamma_pmp,
          cells_in_series,
          cells_in_parallel,
          cell_area,
          module_technology,
          bifacial,
        },
      });
      return data;
    },
    ...options,
  });
};

export const useUpdateUnitType = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, PutUnitTypeProps>({
    mutationFn: async ({
      unitTypeId,
      manufacturer,
      bom,
      description,
      notes,
      model,
      number_of_cells,
      nameplate_pmax,
      module_width,
      module_height,
      system_voltage,
      auditor,
      audit_date,
      audit_report_id,
      isc,
      voc,
      imp,
      vmp,
      alpha_isc,
      beta_voc,
      gamma_pmp,
      cells_in_series,
      cells_in_parallel,
      cell_area,
      unit_type_family,
      module_technology,
      bifacial,
    }: PutUnitTypeProps): Promise<any> => {
      const { data } = await authAxios.put(urls.unitTypes.details(unitTypeId), {
        manufacturer,
        bom,
        description,
        notes,
        model,
        unit_type_family,
        module_property: {
          number_of_cells,
          nameplate_pmax,
          module_width,
          module_height,
          system_voltage,
          auditor,
          audit_date,
          audit_report_id,
          isc,
          voc,
          imp,
          vmp,
          alpha_isc,
          beta_voc,
          gamma_pmp,
          cells_in_series,
          cells_in_parallel,
          cell_area,
          module_technology,
          bifacial,
        },
      });
      return data;
    },
    ...options,
  });
};

export const useLinkFileToUnitType = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, LinkFileToUnitProps>({
    mutationFn: async ({
      unitTypeId,
      fileId,
    }: LinkFileToUnitProps): Promise<any> => {
      const { data } = await authAxios.post(
        urls.unitTypes.linkFiles(unitTypeId),
        {
          id: fileId,
        }
      );
      return data;
    },
    ...options,
  });
};

export const useAssignTestSequenceToUnit = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({ workOrderId, assignmentData }: any): Promise<any> => {
      const { data } = await authAxios.post(
        urls.workOrders.assignUnits(workOrderId),
        assignmentData
      );
      return data;
    },
    onSettled: (data, error, variables, context) => {
      console.log(
        "The key",
        queryKeys.workOrderKeys.assignUnits(variables.workOrderId)
      );
      queryClient.invalidateQueries(
        queryKeys.workOrderKeys.assignUnits(variables.workOrderId)
      );
    },
    ...options,
  });
};

export const useExpectedUnitType = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, PostExpectedUnitType>({
    mutationFn: async ({
      project,
      expected_count,
      received_count,
      unit_type,
    }: PostExpectedUnitType): Promise<any> => {
      const { data } = await authAxios.post(urls.expectedUnitTypes.submit, {
        expected_count,
        received_count,
        project,
        unit_type,
      });
      return data;
    },
    ...options,
  });
};

export const useAddNoteToProject = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, Note>({
    mutationFn: async ({
      id,
      owner,
      subject,
      text,
      note_type,
      disposition,
      labels,
      groups,
      tagged_users,
    }: Note): Promise<any> => {
      const { data } = await authAxios.post(urls.projects.addNote(id), {
        owner,
        subject,
        text,
        type: note_type,
        disposition,
        labels,
        groups,
        tagged_users,
      });
      return data;
    },
    ...options,
  });
};

export const useAddNoteToUnit = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, Note>({
    mutationFn: async ({
      id,
      owner,
      subject,
      text,
      note_type,
      disposition,
      labels,
      groups,
      tagged_users,
    }: Note): Promise<any> => {
      const { data } = await authAxios.post(urls.units.addNote(id), {
        owner,
        subject,
        text,
        type: note_type,
        disposition,
        labels,
        groups,
        tagged_users,
      });
      return data;
    },
    ...options,
  });
};

export const useLinkFileToProject = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, any>({
    mutationFn: async ({ projectId, fileId }: any): Promise<any> => {
      const { data } = await authAxios.post(
        urls.projects.linkFiles(projectId),
        {
          id: fileId,
        }
      );
      return data;
    },
    ...options,
  });
};

export const useCreatePlugin = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, PostPlugin>({
    mutationFn: async (newPlugin: PostPlugin): Promise<any> => {
      const { data } = await authAxios.post(urls.plugins.all, newPlugin);

      return data;
    },
    ...options,
  });
};

export const useUpdatePlugin = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, { pluginId: number; updatedPlugin: PostPlugin }>(
    {
      mutationFn: async ({ pluginId, updatedPlugin }): Promise<any> => {
        const { data } = await authAxios.put(
          urls.plugins.details(pluginId),
          updatedPlugin
        );

        return data;
      },
      ...options,
    }
  );
};

export const useTestPlugin = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, { pluginId: number; serialize: boolean }>({
    mutationFn: async ({ pluginId, serialize }): Promise<any> => {
      if (serialize) {
        const { data } = await authAxios.post(
          urls.plugins.testPlugin(pluginId, serialize)
        );

        return data;
      } else {
        const { data } = await authAxios.post(
          urls.plugins.testPlugin(pluginId, serialize),
          null,
          {
            responseType: "blob",
          }
        );

        const downloadUrl = window.URL.createObjectURL(data);
        let a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${moment().format("MMM-DD-YYYY-HHMMSS")}.zip`;
        document.body.appendChild(a);
        a.click();
      }
    },
    ...options,
  });
};

export const useRunPlugin = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<
    any,
    any,
    { pluginId: number; inputVariables: any; serialize: boolean }
  >({
    mutationFn: async ({
      pluginId,
      inputVariables,
      serialize,
    }): Promise<any> => {
      if (serialize) {
        const { data } = await authAxios.post(
          urls.plugins.runPlugin(pluginId, serialize),
          inputVariables
        );

        return data;
      } else {
        const { data } = await authAxios.post(
          urls.plugins.runPlugin(pluginId, serialize),
          inputVariables,
          {
            responseType: "blob",
          }
        );

        const downloadUrl = window.URL.createObjectURL(data);
        let a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${moment().format("MMM-DD-YYYY-HHMMSS")}.zip`;
        document.body.appendChild(a);
        a.click();
      }
    },
    ...options,
  });
};

export const useCreateTestSequence = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, any>({
    mutationFn: async (newTestSequence: any): Promise<any> => {
      const { data } = await authAxios.post(
        "test_sequence_definitions/",
        newTestSequence
      );

      return data;
    },
    ...options,
  });
};

export const useUpdateTestSequence = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, { tsdId: number; updatedTSD: any }>({
    mutationFn: async ({ tsdId, updatedTSD }): Promise<any> => {
      const { data } = await authAxios.patch(
        `test_sequence_definitions/${tsdId}/`,
        updatedTSD
      );

      return data;
    },
    ...options,
  });
};

export const useAddProcedureDefinitionsToTestSequence = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<
    any,
    any,
    { testSequenceId: number; procedureDefinitions: ProcedureExecutionOrder[] }
  >({
    mutationFn: async ({ testSequenceId, procedureDefinitions }) => {
      const { data } = await authAxios.post(
        `test_sequence_definitions/${testSequenceId}/add_procedures/`,
        procedureDefinitions
      );

      return data;
    },
    ...options,
  });
};

export const useRemoveProcedureDefinitionsFromTestSequence = (
  options: any = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<
    any,
    any,
    { testSequenceId: number; procedureDefinitions: ProcedureExecutionOrder[] }
  >({
    mutationFn: async ({ testSequenceId, procedureDefinitions }) => {
      const { data } = await authAxios.post(
        `test_sequence_definitions/${testSequenceId}/delete_procedures/`,
        procedureDefinitions
      );

      return data;
    },
    ...options,
  });
};

export const useUpdateActionDate = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, any>({
    mutationFn: async ({
      id,
      key,
      value,
    }: {
      id: string;
      projectId: string;
      key: string;
      value: string;
    }): Promise<any> => {
      const { data } = await authAxios.patch(urls.actionResults.details(id), {
        [key]: value,
      });

      return data;
    },

    ...options,
  });
};

export const useUpdateActionDates = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, any>({
    mutationFn: async ({
      id,
      dates,
    }: {
      id: string;
      dates: any;
    }): Promise<any> => {
      const { data } = await authAxios.patch(
        urls.actionResults.details(id),
        dates
      );

      return data;
    },

    ...options,
  });
};

export const useCreateWorkOrderAction = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    mutationFn: async ({
      workOrderId,
      name,
      description,
      disposition,
      action_definition,
      done_datetime,
      start_datetime,
      promise_datetime,
      eta_datetime,
      execution_group,
      groups,
    }: {
      workOrderId: string;
      name: string;
      description: string;
      disposition: string;
      action_definition: string;
      done_datetime: string;
      start_datetime: string;
      promise_datetime: string;
      eta_datetime: string;
      execution_group: string;
      groups: string[];
    }): Promise<any> => {
      const { data } = await authAxios.post(
        urls.workOrders.addAction(workOrderId),
        {
          name,
          description,
          disposition,
          action_definition,
          done_datetime,
          start_datetime,
          promise_datetime,
          eta_datetime,
          execution_group,
          groups,
        }
      );

      return data;
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(queryKeys.projectKeys.all);
    },
    ...options,
  });
};

export const useCreateProjectAction = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({
      projectId,
      name,
      description,
      disposition,
      action_definition,
      execution_group,
      done_datetime,
      start_datetime,
      promise_datetime,
      eta_datetime,
    }: {
      projectId: string;
      name: string;
      description: string;
      disposition: string;
      action_definition: string;
      execution_group: string;
      done_datetime: string;
      start_datetime: string;
      promise_datetime: string;
      eta_datetime: string;
    }): Promise<any> => {
      const { data } = await authAxios.post(
        urls.projects.addAction(projectId),
        {
          name,
          description,
          disposition,
          action_definition,
          execution_group,
          done_datetime,
          start_datetime,
          promise_datetime,
          eta_datetime,
        }
      );

      return data;
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(queryKeys.projectKeys.all);
    },
    ...options,
  });
};

export const useMarkCompleteAction = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, MarkCompleteActionProps>({
    mutationFn: async ({
      id,
      override,
      description,
    }: MarkCompleteActionProps): Promise<any> => {
      const { data } = await authAxios.post(
        urls.actionResults.mark_complete(id),
        {
          override: override,
          description: description,
        }
      );
      return data;
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(
        queryKeys.actionDefinitionKeys.detail(data.id)
      );
    },
    ...options,
  });
};

export const useRevokeAction = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, RevokeActionProps>({
    mutationFn: async ({
      id,
      description,
    }: RevokeActionProps): Promise<any> => {
      const { data } = await authAxios.post(urls.actionResults.revoke(id), {
        description: description,
      });
      return data;
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(
        queryKeys.actionDefinitionKeys.detail(data.id)
      );
    },
    ...options,
  });
};

export const useLinkFileToAction = (options: any = {}) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();

  return useMutation<any, any, LinkFileToActionProps>({
    mutationFn: async ({ id, fileId }: LinkFileToActionProps): Promise<any> => {
      const { data } = await authAxios.post(urls.actionResults.linkFiles(id), {
        id: fileId,
      });
      return data;
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(
        queryKeys.actionDefinitionKeys.detail(data.id)
      );
    },
    ...options,
  });
};

export const useAppendTestSequenceToUnit = (options: any = {}) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, any>({
    mutationFn: async ({
      unitId,
      testSequenceDefinitionId,
    }: {
      unitId: string;
      testSequenceDefinitionId: string;
    }): Promise<any> => {
      const { data } = await authAxios.post(
        urls.units.appendTestSequence(unitId),
        {
          test_sequence_definition: testSequenceDefinitionId,
        }
      );

      return data;
    },

    ...options,
  });
};
