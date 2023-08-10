import { toast } from "react-toastify";

export const processErrorOnMutation = (
  error: any,
  dispatch: any = null,
  history: any = null
) => {
  if (error && dispatch === null && history === null && error.response) {
    console.log("JSON Error", JSON.stringify(error.response.data));
    toast.error(
      `Error while processing transaction.Error:${JSON.stringify(
        error.response.data
      )}`
    );
  } else {
    if (error?.response?.status === 401) {
      toast.error(`Credentials expired.Please login again`);
      dispatch({ type: "LOGOUT" });
      history.push("/");
    } else if (error?.response?.status === 403) {
      toast.error(
        `Current credentials are not allowed to perform this operation.`
      );
    } else if (error?.response?.data) {
      console.log("JSON Error", JSON.stringify(error.response.data));
      toast.error(
        `Error while processing transaction.Error:${JSON.stringify(
          error.response.data
        )}`
      );
    } else {
      console.log("Error", error);
      toast.error(`${error}`);
    }
  }
};
