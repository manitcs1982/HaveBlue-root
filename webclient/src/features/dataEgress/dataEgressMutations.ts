import { AxiosInstance } from "axios";
import { useMutation } from "react-query";
import { urls } from "../common/urls";

interface PostRetestProcedureProps {
  authAxios: AxiosInstance;
  procedure_result: string;
}

interface PostReviewProcedureProps extends PostRetestProcedureProps {
  disposition: string | undefined;
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

export const retestProcedure = async ({
  authAxios,
  procedure_result,
}: PostRetestProcedureProps): Promise<any> => {
  const { data } = await authAxios.post(urls.manageResults.retestProcedure, {
    procedure_result,
  });
  return data;
};

export const useRetestProcedure = () => {
  return useMutation(retestProcedure);
};

export const reviewProcedure = async ({
  authAxios,
  procedure_result,
  disposition,
}: PostReviewProcedureProps): Promise<any> => {
  const { data } = await authAxios.post(urls.manageResults.review, {
    procedure_result,
    disposition,
  });
  return data;
};

export const useReviewProcedure = () => {
  return useMutation(reviewProcedure);
};

export const mutateCharts = ({ curves }: any) => {
  var charts: any[] = [];
  if (curves !== undefined) {
    curves.map((curve: any) => {
      charts = [
        ...charts,
        { id: curve.id, color: curve.color, data: curve.chart },
      ];
    });
  }
  return charts;
};

export const addNoteToResult = async ({
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
  const { data } = await authAxios.post(urls.procedureResults.addNote(id), {
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

export const useAddNoteToResult = () => {
  return useMutation(addNoteToResult);
};
