import React from "react";
import { Button, Grid, LinearProgress, Typography } from "@material-ui/core";
import { LSDBCoreTable } from "../../../common/LSDBCoreTable";
import { useTestSequenceDefinitions } from "../../testSequenceDefinitionQueries";
import { ErrorMessage } from "../../../common/ErrorMessage";
import {
  dispositionFilter,
  DispositionFilter,
  generalFilter,
} from "../../../../util/filter";
import { useHistory } from "react-router-dom";

const TSDList = () => {
  const history = useHistory();

  if (history.location.pathname[history.location.pathname.length - 1] === "/") {
    history.replace("/engineering/test_sequence_definitions");
  }

  const {
    data: tsdData,
    error: tsdError,
    isLoading: isLoadingTSD,
    isError: isErrorTSD,
  } = useTestSequenceDefinitions();

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        maxWidth: 40,
        filter: generalFilter,
        Cell: ({ row }: any) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push(`test_sequence_definitions/${row.values.id}`);
              console.log({ location: history.location });
            }}
          >
            {row.values.id}
          </Button>
        ),
      },
      { Header: "Name", accessor: "name", filter: generalFilter },
      {
        Header: "Disposition",
        accessor: "disposition_name",
        Filter: DispositionFilter,
        filter: dispositionFilter,
      },
      { Header: "Version", accessor: "version", filter: generalFilter },
    ],
    []
  );

  if (isLoadingTSD) {
    return <LinearProgress />;
  }

  if (isErrorTSD) {
    return <>{isErrorTSD && <ErrorMessage error={tsdError} />}</>;
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={4}
    >
      <Grid item xs={12}>
        <Typography variant="h3">Test Sequence Definitions</Typography>
      </Grid>

      <Grid item container xs={12} justifyContent="center">
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => history.push("test_sequence_definitions/new_tsd")}
          >
            Add TSD
          </Button>
        </Grid>
      </Grid>

      {tsdData && (
        <Grid item xs={12}>
          <LSDBCoreTable
            columns={columns}
            data={tsdData}
            noGeneralFilterColumns={["disposition_name"]}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default TSDList;
