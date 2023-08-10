import { AxiosInstance } from "axios";
import { useMutation, useQuery } from "react-query";
import { useFetchContext } from "../FetchContext";

interface PostFileProps {
  authAxios: AxiosInstance;
  file: File;
}

export const postFile = async ({
  authAxios,
  file,
}: PostFileProps): Promise<any> => {
  try {
    const formData = new FormData();

    formData.append("file", file, file.name);
    formData.append("hash_algorithm", "md5");
    formData.append("blob_container", "test");
    const { data } = await authAxios.post(`azure_files/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (err) {
    const error =
      err.response.data instanceof Array
        ? err.response.data.join()
        : err.response.data;
    throw new Error(`Error while uploading file(s):${error}`);
  }
};

export const usePostFile = () => {
  return useMutation(postFile);
};

export const useDownloadImageFromUrl = (url: string, name: string) => {
  const { authAxiosFromUrl } = useFetchContext();

  const downloadImageFromUrl = async (): Promise<any> => {
    const { data } = await authAxiosFromUrl.get(url, {
      responseType: "blob",
    });
    const downloadUrl = URL.createObjectURL(data);
    let a = document.createElement("a");
    a.href = downloadUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
  };
  return useQuery(["downloadImageFromUrl", url, name], downloadImageFromUrl, {
    enabled: false,
  });
};

export const useDownloadImageFromID = (id: string, name: string) => {
  const { authAxios } = useFetchContext();

  const downloadImageFromID = async (): Promise<any> => {
    const { data } = await authAxios.get(`azure_files/${id}/download/`, {
      responseType: "blob",
    });
    const downloadUrl = URL.createObjectURL(data);
    let a = document.createElement("a");
    a.href = downloadUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
  };
  return useQuery(["downloadImageFromID", id], downloadImageFromID, {
    enabled: name !== null && name !== "" && name !== undefined,
  });
};
