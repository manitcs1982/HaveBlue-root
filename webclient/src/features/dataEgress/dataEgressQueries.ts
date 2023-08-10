import { useQuery } from "react-query";
import { useFetchContext } from "../common/FetchContext";
import moment from "moment";
import { urls } from "../common/urls";

export const useImage = (currentImage: any) => {
  const { authAxiosFromUrl } = useFetchContext();

  const getAzureImage = async (): Promise<any> => {
    const { data } = await authAxiosFromUrl.get(currentImage.file, {
      responseType: "arraybuffer",
    });
    const blob = new Blob([data], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  };

  return useQuery(["image", currentImage], getAzureImage, {
    enabled:
      currentImage !== undefined &&
      currentImage !== null &&
      currentImage !== "N/A",
  });
};

export const useTestResults = () => {
  const { authAxios } = useFetchContext();

  const getTestResults = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.testResults.all);
    return data.results[0];
  };
  return useQuery("test_results", getTestResults);
};

export const useWetLeakageViewerData = () => {
  const { authAxios } = useFetchContext();

  const getWetLeakageViewerData = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.wetLeakageViewer.all);
    return data.results[0];
  };
  return useQuery("wet_leakage_viewer", getWetLeakageViewerData);
};

export const useVerifyData = () => {
  const { authAxios } = useFetchContext();

  const getVerifyData = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.procedureResults.verify);
    return data;
  };
  return useQuery("verify_data", getVerifyData);
};

export const useView = (id: string, open: boolean) => {
  const { authAxios } = useFetchContext();

  const getView = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.procedureResults.view(id));
    return data;
  };
  return useQuery(["get_view", id, open], getView, {
    enabled: open !== undefined && open !== null && open !== false,
  });
};

export const useProcedureNotes = (id: string) => {
  const { authAxios } = useFetchContext();

  const getProcedureNotes = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.procedureResults.notes(id));
    return data;
  };
  return useQuery(["procedure_notes", id], getProcedureNotes);
};

export const useUnit = (url: string) => {
  const { authAxios } = useFetchContext();

  const getUnit = async (): Promise<any> => {
    const { data } = await authAxios.get(url);
    return data;
  };
  return useQuery(["get_unit", url], getUnit, {
    enabled: url !== undefined && url !== null && url !== "",
  });
};

export const useUnitType = (url: string) => {
  const { authAxios } = useFetchContext();

  const getUnitType = async (): Promise<any> => {
    const { data } = await authAxios.get(url);
    return data;
  };
  return useQuery(["get_unit_type", url], getUnitType, {
    enabled: url !== undefined && url !== null && url !== "",
  });
};

export const useDownloadProcedure = (procedureID: any) => {
  const { authAxios } = useFetchContext();

  const getDownloadProcedure = async (): Promise<any> => {
    const response = await authAxios.get(
      urls.procedureResults.download(procedureID),
      {
        responseType: "blob",
      }
    );

    const downloadUrl = URL.createObjectURL(response.data);
    let a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `ColorimeterReport-${moment().format(
      "MMM-DD-YYYY-HHMMSS"
    )}.xlsx`;
    document.body.appendChild(a);
    a.click();
  };

  return useQuery(["downloadProcedure", procedureID], getDownloadProcedure, {
    enabled: false,
  });
};
