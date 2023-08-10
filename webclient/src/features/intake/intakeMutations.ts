import { AxiosInstance } from "axios";
import { useMutation } from "react-query";
import { Customer } from "../common/types/customer.type";
import { Disposition } from "../common/types/disposition.type";
import { urls } from "../common/urls";

interface PostCrateProps {
  authAxios: AxiosInstance;
  name: string;
  disposition: string;
  shipped_by: string;
  shipping_agent: string;
  received_date: string;
  project: string | null;
}

interface PutCrateProps extends PostCrateProps {
  id: string;
}

export interface Crate {
  id: number;
  url: string;
  name: string;
  disposition: string;
  shipped_by: string;
  project: string | null;
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
export interface LinkFileToUnitProps {
  authAxios: AxiosInstance;
  unitId: string;
  fileId: string;
}

export interface LinkUnitsToWorkOrder {
  authAxios: AxiosInstance;
  unitIds: any;
  workOrderId: any;
}

export interface LinkFileToCrateProps {
  authAxios: AxiosInstance;
  crateId: string;
  fileId: string;
}

export interface Note {
  authAxios: AxiosInstance;
  id: string;
  owner: number | null;
  subject: string;
  text: string;
  note_type: number;
  disposition: number | null;
  labels: object | null;
  groups: object | null;
  tagged_users: object | null;
}

export const postCrate = async ({
  authAxios,
  name,
  project,
  shipping_agent,
  disposition,
  shipped_by,
  received_date,
}: PostCrateProps): Promise<any> => {
  const { data } = await authAxios.post(urls.crates.submit, {
    name,
    project,
    shipping_agent,
    disposition,
    shipped_by,
    received_date,
  });
  return data;
};

export const linkFileToCrate = async ({
  authAxios,
  crateId,
  fileId,
}: LinkFileToCrateProps): Promise<any> => {
  const { data } = await authAxios.post(urls.crates.linkFiles(crateId), {
    id: fileId,
  });
  return data;
};

export const useCreateCrate = () => {
  return useMutation(postCrate);
};

export const putCrate = async ({
  authAxios,
  name,
  project,
  disposition,
  shipped_by,
  shipping_agent,
  received_date,
  id,
}: PutCrateProps): Promise<any> => {
  const { data } = await authAxios.patch(urls.crates.details(id), {
    name,
    project,
    disposition,
    shipped_by,
    received_date,
    shipping_agent,
  });
  return data;
};

export const useUpdateCrate = () => {
  return useMutation(putCrate);
};

export const postEmptyCrate = async ({ authAxios, id }: any): Promise<any> => {
  const { data } = await authAxios.post(urls.crates.markEmpty, {
    id,
  });
  return data;
};

export const useEmptyCrate = () => {
  return useMutation(postEmptyCrate);
};

export const postUnit = async ({
  authAxios,
  crate,
  location,
  serial_number,
  unit_type,
  project_url,
  intake_date,
}: any): Promise<any> => {
  const { data } = await authAxios.post(urls.units.all, {
    crate,
    location,
    serial_number,
    unit_type,
    intake_date,
    workorder_set: [],
    project_set: [project_url],
  });
  return data;
};

export const linkUnitToProject = async (
  authAxios: AxiosInstance,
  project_id: string,
  id: string
): Promise<any> => {
  const { data } = await authAxios.post(urls.projects.linkUnits(project_id), [
    id,
  ]);
  return data;
};

export const addNoteToCrate = async ({
  authAxios,
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
  const { data } = await authAxios.post(urls.crates.addNote(id), {
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
};

export const useAddNoteToCrate = () => {
  return useMutation(addNoteToCrate);
};

export const linkFileToUnit = async ({
  authAxios,
  unitId,
  fileId,
}: LinkFileToUnitProps): Promise<any> => {
  const { data } = await authAxios.post(urls.units.linkFiles(unitId), {
    id: fileId,
  });
  return data;
};

export const linkUnitsToWorkOrder = async ({
  authAxios,
  workOrderId,
  unitIds,
}: LinkUnitsToWorkOrder): Promise<any> => {
  const { data } = await authAxios.post(
    urls.workOrders.linkUnits(workOrderId),
    unitIds
  );
  return data;
};

export const autoAssignUnitsToWorkOrder = async ({
  authAxios,
  workOrderId,
  unitIds,
}: LinkUnitsToWorkOrder): Promise<any> => {
  const { data } = await authAxios.post(
    urls.workOrders.autoAssignUnits(workOrderId),
    unitIds
  );
  return data;
};

export const useCreateUnit = () => {
  return useMutation(postUnit);
};

export const useLinkUnitsToWorkOrder = () => {
  return useMutation(linkUnitsToWorkOrder);
};

export const useAutoAssignUnitsToWorkOrder = () => {
  return useMutation(autoAssignUnitsToWorkOrder);
};

export const useLinkFileToUnit = () => {
  return useMutation(linkFileToUnit);
};

export const useLinkFileToCrate = () => {
  return useMutation(linkFileToCrate);
};
