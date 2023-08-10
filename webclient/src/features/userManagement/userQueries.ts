import { useQuery, UseQueryOptions } from "react-query";
import { useFetchContext } from "../common/FetchContext";
import { urls } from "../common/urls";
import UserRegistrationStatus from "./types/UserRegistrationStatus";
import { ServerGroup } from "./types/Group";
import { ServerReducedUser } from "./types/User";

export const useUsers = () => {
  const { authAxios } = useFetchContext();

  const getUsers = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.users.all);
    return data.results;
  };
  return useQuery("users", getUsers);
};

export const useUserDetails = (userId: string) => {
  const { authAxios } = useFetchContext();

  const getUserDetails = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.users.details(userId));
    return data;
  };

  return useQuery<any, any>(["user", userId], getUserDetails);
};

export const useUserReducedDetails = (
  userId: string,
  options: UseQueryOptions<ServerReducedUser, any> = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<ServerReducedUser, any>({
    queryKey: ["user/", userId, "edit/"],
    queryFn: async () => {
      const { data } = await authAxios.get(urls.users.edit(userId));

      return data;
    },
    ...options,
  });
};

export const useIsSuperuser = (
  userId: string,
  options: UseQueryOptions<any, any> = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<boolean, any>({
    queryKey: ["/isSuperuser", userId],
    queryFn: async () => {
      const { data } = await authAxios.get(urls.users.details(`${userId}`));

      return data.is_superuser;
    },
    ...options,
  });
};

export const useAvailableGroups = (
  options: UseQueryOptions<ServerGroup[], any> = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<ServerGroup[], any>({
    queryKey: "groups",
    queryFn: async () => {
      const { data } = await authAxios.get(urls.groups.users);

      return data.results;
    },
    ...options,
  });
};

export const useMyNotes = (closed: string | null) => {
  const { authAxios } = useFetchContext();

  const getMyNotes = async (): Promise<any> => {
    const { data } = await authAxios.get(urls.users.myNotes(closed));
    return data;
  };
  return useQuery(["my_notes", closed], getMyNotes);
};

export const useUserRegistrationStatuses = (
  options: UseQueryOptions<UserRegistrationStatus[], any> = {}
) => {
  const { authAxios } = useFetchContext();

  return useQuery<UserRegistrationStatus[], any>({
    queryKey: "userRegistrationStatuses",
    queryFn: async () => {
      const { data } = await authAxios.get(urls.userRegistrationStatus.all);

      return data.results;
    },
    ...options,
  });
};
