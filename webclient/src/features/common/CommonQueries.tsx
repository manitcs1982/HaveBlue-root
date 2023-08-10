import { QueryOptions, useQuery, useQueryClient } from "react-query";
import { useFetchContext } from "./FetchContext";
import { urls } from "./urls";

export const useTestingStats = (
    facility: string,
    options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: "test_stats",
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(
        urls.procedureResults.procedureStats(facility)
      );
      return data;
    },
    ...options,
  });
};

export const useNapaStats = (
    options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: "napa_stats",
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(
        urls.procedureResults.procedureStats("NAPA")
      );
      return data;
    },
    ...options,
  });
};

export const useDCLStats = (
    options: QueryOptions = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: "dcl_stats",
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(
        urls.procedureResults.procedureStats("DCL")
      );
      return data;
    },
    ...options,
  });
};

export const useLabels = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: "labels",
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.labels.all);
      return data;
    },
    ...options,
  });
};

export const useNote = (id: any, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: ["flagNote", id],
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.notes.noteDetails(id));
      return data;
    },
    enabled: id !== undefined && id !== null,
    notifyOnChangeProps: ["data", "error"],
    ...options,
  });
};

export const useComments = (id: any, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: ["comments", id],
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.notes.comments(id));
      return data;
    },
    enabled: id !== undefined && id !== null,
    ...options,
  });
};

export const useUsers = (options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: "activeUsers",
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.users.active);
      return data.results;
    },

    ...options,
  });
};

export const useAttachments = (
  attachmentArray: any[],
  options: QueryOptions = {}
) => {
  const { authAxiosFromUrl } = useFetchContext();

  return useQuery<any, any>({
    queryKey: ["attachments", attachmentArray],
    queryFn: async (): Promise<any> => {
      let tempFiles: any[] = [];
      for (const attachment of attachmentArray) {
        if (
          attachment.name.toLowerCase().includes(".png") ||
          attachment.name.toLowerCase().includes(".jpg")
        ) {
          const { data } = await authAxiosFromUrl.get(attachment.file, {
            responseType: "arraybuffer",
          });
          const blob = new Blob([data], { type: "image/jpeg" });
          tempFiles.push({
            ...attachment,
            image: URL.createObjectURL(blob),
          });
        } else {
          tempFiles.push({ ...attachment, image: undefined });
        }
      }
      tempFiles.sort(function (a, b) {
        const temp1 = new Date(a.uploaded_datetime);
        const temp2 = new Date(b.uploaded_datetime);
        return temp1 > temp2 ? -1 : 1;
      });

      return tempFiles;
    },
    enabled:
      attachmentArray !== undefined &&
      attachmentArray !== null &&
      attachmentArray !== [],
    ...options,
  });
};

export const useUnitById = (id: any, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: ["unit_by_id", id],
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.units.unitDetails(id));
      return data;
    },

    ...options,
  });
};

export const useProjectById = (id: any, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: ["project_by_id", id],
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(urls.projects.projectDetails(id));
      return data;
    },
    ...options,
  });
};

export const useProcedureById = (id: any, options: QueryOptions = {}) => {
  const { authAxios } = useFetchContext();

  return useQuery<any, any>({
    queryKey: ["procedure_by_id", id],
    queryFn: async (): Promise<any> => {
      const { data } = await authAxios.get(
        urls.procedureResults.procedureDetails(id)
      );
      return data;
    },

    ...options,
  });
};

export const useEmailNote = (id: number) => {
  const { authAxios } = useFetchContext();

  const emailNote = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.notes.emailNote(id));
    return data;
  };
  return useQuery(["email_note", id], emailNote, {
    enabled: false,
  });
};

export const useFileByID = (id: string) => {
  const { authAxios } = useFetchContext();

  const fileByID = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.files.azureFileDetails(id));
    return data;
  };
  return useQuery(["file", id], fileByID);
};
