import { useMutation, UseMutationOptions } from "react-query";
import { useFetchContext } from "../common/FetchContext";
import User, { PostReducedUser, ServerReducedUser } from "./types/User";
import { urls } from "../common/urls";

export type UpdateReducedUser = {
  userId: number;
  updatedReducedUser: PostReducedUser;
};
export type SetUserGroups = { userId: number; groupsIds: number[] };
export type SetUserAllowedTemplates = {
  userId: number;
  templatesIds: number[];
};
export type SetPassword = {
  userId: string;
  passwords: {
    old_password: string;
    new_password: string;
  };
};

export const useCreateUser = (
  options: UseMutationOptions<any, any, any> = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, User>({
    mutationFn: async (newUser) => {
      const { data } = await authAxios.post(urls.users.all, newUser);

      return data;
    },
    ...options,
  });
};

export const useUpdateUser = (
  options: UseMutationOptions<any, any, { id: string; updatedUser: User }> = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, { id: string; updatedUser: User }>({
    mutationFn: async ({ id, updatedUser }) => {
      const { data } = await authAxios.patch(
        urls.users.details(id),
        updatedUser
      );

      return data;
    },
    ...options,
  });
};

export const useUpdateReducedUser = (
  options: UseMutationOptions<ServerReducedUser, any, UpdateReducedUser> = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<ServerReducedUser, any, UpdateReducedUser>({
    mutationKey: ["updateReducedUser"],
    mutationFn: async ({ userId, updatedReducedUser }) => {
      const { data } = await authAxios.post(
        urls.users.edit(`${userId}`),
        updatedReducedUser
      );

      return data;
    },
    ...options,
  });
};

export const useSetPassword = (
  options: UseMutationOptions<any, any, SetPassword> = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, SetPassword>({
    mutationKey: ["setPassword"],
    mutationFn: async ({ userId, passwords }) => {
      const { data } = await authAxios.post(
        urls.users.setPassword(userId),
        passwords
      );

      return data;
    },
    ...options,
  });
};

export const useSetUserGroups = (
  options: UseMutationOptions<any, any, SetUserGroups> = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, SetUserGroups>({
    mutationKey: "setUserGroups",
    mutationFn: async ({ userId, groupsIds }) => {
      const { data } = await authAxios.post(
        urls.users.setGroups(String(userId)),
        { groups: groupsIds }
      );

      return data;
    },
    ...options,
  });
};

export const useSetUserAllowedTemplates = (
  options: UseMutationOptions<any, any, SetUserAllowedTemplates> = {}
) => {
  const { authAxios } = useFetchContext();

  return useMutation<any, any, SetUserAllowedTemplates>({
    mutationKey: `setUserAllowedTemplates`,
    mutationFn: async ({ userId, templatesIds }) => {
      const { data } = await authAxios.post(
        urls.users.setAllowedTemplates(userId),
        {
          templates: templatesIds,
        }
      );

      return data;
    },
    ...options,
  });
};
