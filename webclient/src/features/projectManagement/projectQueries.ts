import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { useFetchContext } from "../common/FetchContext";
import moment from "moment";
import { formatDateWorkLog } from "../../util/searchData";
import Label from "./types/Label";
import { AxiosInstance } from "axios";
import { urls } from "../common/urls";

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

export const useDownloadableProjects = () => {
  const { authAxios } = useFetchContext();

  const getDownloadableProjects = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.projects.allDownloads);
    return data;
  };
  return useQuery("downloadableProjects", getDownloadableProjects);
};

export const useStressData = () => {
  const { authAxios } = useFetchContext();

  const getStressData = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.units.stressQueue);
    return data;
  };
  return useQuery("test_query", getStressData);
};

export const useDownloadProjects = (
  selectedProjectIds: string | number | null,
  adjust_images: boolean | null,
  unitIds?: string | number,
  procedureIds?: string | number,
  tsdIds?: string | number
) => {
  const { authAxios } = useFetchContext();

  const getDownloadProjects = async (): Promise<any> => {
    const response = await authAxios.get(
      urls.projects.selectedDownloads(
        selectedProjectIds,
        adjust_images,
        unitIds,
        procedureIds,
        tsdIds
      ),
      {
        responseType: "blob",
      }
    );

    const downloadUrl = URL.createObjectURL(response.data);
    let a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${moment().format("MMM-DD-YYYY-HHMMSS")}.zip`;
    document.body.appendChild(a);
    a.click();
  };

  return useQuery(
    ["downloadProjects", selectedProjectIds, adjust_images],
    getDownloadProjects,
    {
      enabled: selectedProjectIds !== "",
    }
  );
};

export const useDownloadProjectFile = (
  projectId: string | number,
  options: UseQueryOptions<any, any> = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryFn: async (): Promise<any> => {
      const response = await authAxios.get(urls.projects.download(projectId), {
        responseType: "blob",
      });

      const downloadUrl = URL.createObjectURL(response.data);
      let a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${moment().format("MMM-DD-YYYY-HHMMSS")}.zip`;
      document.body.appendChild(a);

      a.click();
    },
    enabled: projectId !== 0,
    ...options,
  });
};

export const useResults = (id: string) => {
  const { authAxios } = useFetchContext();

  const getResults = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.units.groupedHistory(id));
    return data;
  };
  return useQuery(["travelerResults", id], getResults, {
    enabled: id !== undefined && id !== "" && id !== null,
  });
};

export const useUnitNotes = (id: string, type: number | null) => {
  const { authAxios } = useFetchContext();

  const getUnitNotes = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.units.notes(id, type));
    return data;
  };
  return useQuery(["unit_notes", id], getUnitNotes, {
    enabled: id !== undefined && id !== null,
  });
};

export const useTestPermissions = () => {
  const { authAxios } = useFetchContext();

  const getTestPermission = async (): Promise<any> => {
    try {
      const { data } = await authAxios.get(urls.manageResults.permissions);
      return data;
    } catch (error) {
      return error;
    }
  };
  return useQuery("test_permission", getTestPermission);
};

export const useTestPermissionsVerification = (id: any, open: any) => {
  const { authAxios } = useFetchContext();

  const getTestPermission = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.manageResults.permissions);
    return data;
  };
  return useQuery(["test_permission_verification", id], getTestPermission, {
    enabled: open !== undefined && open !== null && open !== false,
  });
};

export const useActiveProjects = (archived: boolean) => {
  const { authAxios } = useFetchContext();

  const getActiveProjects = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.projects.activeProjects(archived)
    );
    return data;
  };
  return useQuery(["active_projects", archived], getActiveProjects);
};

export const useMyProjects = (archived: boolean) => {
  const { authAxios } = useFetchContext();

  const getMyProjects = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.projects.myProjects(archived));
    return data;
  };
  return useQuery(["my_projects", archived], getMyProjects);
};

export const useProjectNotes = (id: string, type: number | null) => {
  const { authAxios } = useFetchContext();

  const getProjectNotes = async (): Promise<any> => {
    if (type === null) {
      const { data } = await authAxios.get(urls.projects.notes(id));
      return data;
    }

    const { data } = await authAxios.get(urls.projects.notesAndType(id, type));
    return data;
  };
  return useQuery(["projectNotes", id], getProjectNotes, {
    enabled: id !== undefined && id !== null,
  });
};

export const submitProjectNote = async ({
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
  const { data } = await authAxios.post(urls.projects.addNote(id), {
    user: 1,
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

export const useSubmitProjectNote = () => useMutation(submitProjectNote);

export const useMyWorkorders = (id: string) => {
  const { authAxios } = useFetchContext();

  const getMyWorkorders = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.projects.workOrders(id));
    return data;
  };
  return useQuery(["my_workorders", id], getMyWorkorders, {
    enabled: id !== undefined && id !== "" && id !== null,
  });
};

export const useMyUnits = (id: string) => {
  const { authAxios } = useFetchContext();

  const getMyUnits = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.workOrders.assignUnits(id));
    return data;
  };
  return useQuery(["my_units", id], getMyUnits, {
    enabled: id !== undefined && id !== "" && id !== null,
  });
};

export const useWorkLog = (days: string) => {
  const { authAxios } = useFetchContext();

  const getWorkLog = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.procedureResults.workLog(days));
    return data;
  };
  return useQuery(["workLogs", days], getWorkLog, {
    enabled: days !== undefined && days !== null && days !== "",
  });
};

export const useDatesRange = (dates: any) => {
  const { authAxios } = useFetchContext();

  const getDatesRange = async (): Promise<any> => {
    const { data } = await authAxios.get(
      urls.procedureResults.datesRange(dates)
    );
    return data;
  };
  return useQuery(["dateRanges", dates], getDatesRange, {
    enabled: dates !== undefined && dates !== null,
  });
};

export const useDownloadLog = (
  startDate: any,
  endDate: any,
  isEnabled: any
) => {
  const { authAxios } = useFetchContext();
  const startDateFormatted = formatDateWorkLog(startDate);
  const endDateFormatted = formatDateWorkLog(endDate);

  const getDownloadLog = async (): Promise<any> => {
    const response = await authAxios.get(
      urls.procedureResults.downloadLog(startDateFormatted, endDateFormatted),
      {
        responseType: "blob",
      }
    );

    const downloadUrl = URL.createObjectURL(response.data);
    let a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${moment().format("MMM-DD-YYYY-HHMMSS")}.xls`;
    document.body.appendChild(a);
    a.click();
  };

  return useQuery(
    ["downloadLog", startDate, endDate, isEnabled],
    getDownloadLog,
    {
      enabled:
        isEnabled !== undefined && isEnabled !== null && isEnabled !== false,
    }
  );
};

export const useFlags = () => {
  const { authAxios } = useFetchContext();

  const getFlags = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.notes.flags);
    return data;
  };

  return useQuery("notes", getFlags, {});
};

export const useTasks = () => {
  const { authAxios } = useFetchContext();

  const getTasks = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.notes.tasks);
    return data;
  };

  return useQuery("tasks", getTasks, {});
};

export const useSupportTickets = () => {
  const { authAxios } = useFetchContext();

  const getSupportTickets = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.notes.supportTickets);
    return data;
  };

  return useQuery("supportTickets", getSupportTickets);
};

export const useClosedFlags = () => {
  const { authAxios } = useFetchContext();

  const getClosedFlags = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.notes.closedFlags);
    return data;
  };

  return useQuery("closedFlags", getClosedFlags, {
    enabled: false,
  });
};

export const useClosedTasks = () => {
  const { authAxios } = useFetchContext();

  const getClosedTasks = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.notes.closedTasks);
    return data;
  };

  return useQuery("closedTasks", getClosedTasks, {
    enabled: false,
  });
};

export const useClosedSupportTickets = () => {
  const { authAxios } = useFetchContext();

  const getSupportTickets = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.notes.closedSupportTickets);
    return data;
  };

  return useQuery("closedSupportTickets", getSupportTickets);
};

export const useLabels = () => {
  const { authAxios } = useFetchContext();

  const getLabels = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.labels.all);
    return data;
  };

  return useQuery("labels", getLabels);
};

export const createLabel = async ({
  labelData,
  authAxios,
}: {
  labelData: Label;
  authAxios: AxiosInstance;
}): Promise<any> => {
  const { data } = await authAxios.post(urls.labels.submit, { ...labelData });
  return data;
};

export const useNoteCounts = () => {
  const { authAxios } = useFetchContext();

  const getNoteCounts = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.notes.noteCounts);
    return data;
  };

  return useQuery("noteCounts", getNoteCounts);
};

export const useCreateLabel = () => useMutation(createLabel);

export const useNoteTypes = (filter = "") => {
  const { authAxios } = useFetchContext();

  const getNoteTypes = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.noteTypes.byGroup(filter));
    return data;
  };

  return useQuery(["noteTypes", filter], getNoteTypes);
};
