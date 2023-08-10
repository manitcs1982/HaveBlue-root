import { AxiosInstance } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { urls } from "./urls";
import { useFetchContext } from "./FetchContext";

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
  model: string | null;
}

export const mutateBarToPie = ({ data }: any) => {
  var wl = 0;
  var dt = 0;
  var el1 = 0;
  var el2 = 0;
  var iv1 = 0;
  var iv2 = 0;
  var iv3 = 0;
  var vi = 0;
  var col = 0;

  data.map((point: any) => {
    wl += point["Wet Leakage Current Test"];
    dt += point["Diode Test"];
    el1 += point["EL Image at 0.1x Isc"];
    el2 += point["EL Image at 1.0x Isc"];
    iv1 += point["I-V Curve at LIC (Front)"];
    iv2 += point["I-V Curve at STC (Front)"];
    iv3 += point["I-V Curve at STC (Rear)"];
    vi += point["Visual Inspection"];
    col += point["Colorimeter"];
  });

  var chart = [
    {
      id: "Diode Test",
      label: "Diode Test",
      value: dt ? dt : 0,
    },
    {
      id: "Wet Leakage Current Test",
      label: "Wet Leakage Current Test",
      value: wl ? wl : 0,
    },
    {
      id: "Visual Inspection",
      label: "Visual Inspection",
      value: vi ? vi : 0,
    },
    {
      id: "EL Image at 0.1x Isc",
      label: "EL Image at 0.1x Isc",
      value: el1 ? el1 : 0,
    },
    {
      id: "EL Image at 1.0x Isc",
      label: "EL Image at 1.0x Isc",
      value: el2 ? el2 : 0,
    },
    {
      id: "I-V Curve at LIC (Front)",
      label: "I-V Curve at LIC (Front)",
      value: iv1 ? iv1 : 0,
    },
    {
      id: "I-V Curve at STC (Front)",
      label: "I-V Curve at STC (Front)",
      value: iv2 ? iv2 : 0,
    },
    {
      id: "I-V Curve at STC (Rear)",
      label: "I-V Curve at STC (Rear)",
      value: iv3 ? iv3 : 0,
    },
    {
      id: "Colorimeter",
      label: "Colorimeter",
      value: col ? col : 0,
    },
  ];

  return chart;
};

export const mutateGantt = ( ganttData : any) => {
  console.log(ganttData)
    if (ganttData) {
      let temp = ganttData[0].data
      for (let index = 1; index < temp.length; index++) {
        temp[index] = [
          temp[index][0],
          temp[index][1],
          temp[index][2],
          new Date(temp[index][3]),
          new Date(temp[index][4]),
          temp[index][5],
          temp[index][6],
          temp[index][7],
        ];

      }
      return temp
  } else {
      return []
  }

};

export const markNoteRead = async ({ authAxios, id }: any): Promise<any> => {
  const { data } = await authAxios.post(urls.notes.markRead(id), {});
  return data;
};

export const useNoteRead = () => {
  return useMutation(markNoteRead);
};

// export const useLinkFileToNote = (options: any = {}) => {
//   const { authAxios } = useFetchContext();
//   const queryClient = useQueryClient();
//
//   return useMutation<any, any, any>({
//     mutationFn: async ({
//       unitId,
//       fileId,
//     }: any): Promise<any> => {
//       const { data } = await authAxios.post(urls.notes.linkFiles(unitId), {
//         id: fileId,
//       });
//       return data;
//     },
//     onSettled: (data, error, variables, context) => {
//       queryClient.invalidateQueries(
//         ["flagNote", variables.unitId]
//       );
//     },
//     ...options,
//   });
// };

export const linkFileToNote = async ({
  authAxios,
  noteId,
  fileId,
}: any): Promise<any> => {
  const { data } = await authAxios.post(urls.notes.linkFiles(noteId), {
    id: fileId,
  });
  return data;
};

export const useLinkFileToNote = () => {
  return useMutation(linkFileToNote);
};

export const submitComment = async ({
  authAxios,
  text,
  note_type,
  parent_note,
  subject,
}: any): Promise<any> => {
  const { data } = await authAxios.post(urls.notes.submitComment, {
    user: 1,
    text,
    subject,
    note_type,
    parent_note,
  });
  return data;
};

export const useSubmitComment = () => {
  return useMutation(submitComment);
};

export const updateNote = async ({
  authAxios,
  id,
  owner,
  disposition,
  tagged_users,
  labels,
  note_type,
  comment,
}: any) => {
  const { data } = await authAxios.post(urls.notes.bulkUpdate(id), {
    owner,
    disposition,
    tagged_users,
    labels,
    note_type,
    comment,
  });
  return data;
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation(updateNote, {
    onSettled: (data: any, error: any, variables: any) => {
      queryClient.invalidateQueries(["comments", variables.id]);
      queryClient.invalidateQueries(["flagNote", variables.id]);
      queryClient.invalidateQueries("tasks");
      queryClient.invalidateQueries("notes");
      queryClient.invalidateQueries("supportTickets");
      queryClient.invalidateQueries("closedTasks");
      queryClient.invalidateQueries("closedFlags");
      queryClient.invalidateQueries("procedure_notes", {
        refetchInactive: true,
      });
      queryClient.invalidateQueries("travelerResults", {
        refetchInactive: true,
      });
    },
  });
};

export const submitNote = async ({
  authAxios,
  id,
  model,
  owner,
  subject,
  text,
  note_type,
  disposition,
  labels,
  groups,
  tagged_users,
}: Note): Promise<any> => {
  const { data } = await authAxios.post(urls.notes.addNote, {
    id,
    model,
    user: 1,
    owner,
    subject,
    text,
    note_type,
    disposition,
    labels,
    groups,
    tagged_users,
  });
  return data;
};

export const useSubmitNote = () => {
  return useMutation(submitNote);
};
