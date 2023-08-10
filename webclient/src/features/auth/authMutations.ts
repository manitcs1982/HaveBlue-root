import { useMutation } from "react-query";
import { getPublicFetch } from "../../util/fetch";
import { urls } from "../common/urls";
import { getBaseUrl } from "../common/util";

interface PostMagicLinkProps {
  token: string;
}

interface PostForgotPasswordProps {
  username: string;
}

interface PostResetPasswordProps {
  id: string | null;
  new_password: string;
  token: string | null;
}

export const postMagicLink = async ({
  token,
}: PostMagicLinkProps): Promise<any> => {
  const baseUrl = getBaseUrl();
  const publicFetch = getPublicFetch(baseUrl);
  const { data } = await publicFetch.post(urls.auth.signin, {
    token,
  });
  return data;
};

export const useSubmitMagicLink = () => {
  return useMutation(postMagicLink);
};

export const postForgotPassword = async ({
  username,
}: PostForgotPasswordProps): Promise<any> => {
  try {
    const baseUrl = getBaseUrl();
    const publicFetch = getPublicFetch(baseUrl);
    const { data } = await publicFetch.post(urls.auth.forgotPassword, {
      username,
    });
    return data;
  } catch (err) {
    throw new Error(`Error while requesting a password reset:${err}`);
  }
};

export const useSubmitForgotPassword = () => {
  return useMutation(postForgotPassword);
};

export const postResetPassword = async ({
  id,
  new_password,
  token,
}: PostResetPasswordProps): Promise<any> => {
  const baseUrl = getBaseUrl();
  const publicFetch = getPublicFetch(baseUrl);
  const { data } = await publicFetch.post(
    urls.users.lostPassword(id),
    {
      new_password,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const useResetPassword = () => {
  return useMutation(postResetPassword);
};
