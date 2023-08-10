import { getPublicFetch } from "../../util/fetch";
import { Auth } from "../common/AuthContext";
import { getBaseUrl } from "../common/util";
import { useFetchContext } from "../common/FetchContext";
import { useQuery } from "react-query";
import { urls } from "../common/urls";
export const login = async (
  username: string,
  password: string
): Promise<Auth> => {
  const baseUrl = getBaseUrl();
  const publicFetch = getPublicFetch(baseUrl);
  const { data } = await publicFetch.post(urls.auth.signin, {
    username,
    password,
  });
  return data;
};

export const useCurrentUser = () => {
  const { authAxios } = useFetchContext();

  const getCurrentUser = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.auth.whoami);
    return data;
  };
  return useQuery("user", getCurrentUser);
};
