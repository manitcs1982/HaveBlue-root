import React from "react";
import { LSDBCoreTable } from "../../../common/LSDBCoreTable";
import { usePlugins } from "../../projectManagementQueries";
import { Link, useHistory } from "react-router-dom";
import MuiLink from "@material-ui/core/Link";
import { Button, Grid, LinearProgress } from "@material-ui/core";
import { ErrorMessage } from "../../../common/ErrorMessage";

const PluginsPage = () => {
  const history = useHistory();

  const {
    data: plugins,
    isLoading: isLoadingPlugins,
    isError: isErrorPlugins,
    error: pluginsError,
  } = usePlugins();

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }: any) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push(`plugins/${row.values.id}`)}
          >
            {row.values.id}
          </Button>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Reviewed Status",
        Cell: () => "Reviewed",
      },
      {
        Header: "Number of Callers",
        Cell: () => 0,
      },
    ],
    []
  );

  if (isLoadingPlugins) {
    return <LinearProgress />;
  }

  if (isErrorPlugins) {
    return (
      <React.Fragment>
        {isErrorPlugins && <ErrorMessage error={pluginsError} />}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={5} />
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push("plugins/new_plugin")}
                fullWidth
              >
                New Plugin
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <LSDBCoreTable columns={columns} data={plugins} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default PluginsPage;
