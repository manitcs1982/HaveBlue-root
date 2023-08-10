import { LinearProgress } from "@material-ui/core/";
import Grid from "@material-ui/core/Grid";

import { useDefaultColumn } from "../../../../util/filter";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { useMyWorkorders } from "../../projectQueries";

import { MyProjectsWorkOrderTable } from "./myProjectsWorkOrderTable";

export const MyProjectsWorkOrderPage = ({ projectID }: any) => {
  const defaultColumn = useDefaultColumn();

  const {
    data = [],
    error,
    isLoading,
    isError,
    isSuccess,
  } = useMyWorkorders(projectID);

  if (isLoading) {
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      </Grid>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <MyProjectsWorkOrderTable data={data} />
    </>
  );
};
