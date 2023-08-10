import React from "react";
import { Button, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { LSDBCoreTable } from "./LSDBCoreTable";

const GenericModelList = ({
  newModelObjectPath,
  modelName,
  columns,
  modelData,
}: {
  newModelObjectPath: string;
  modelName: string;
  columns: any;
  modelData: any;
}) => {
  const history = useHistory();

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
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
                onClick={() => history.push(newModelObjectPath)}
              >
                New {modelName}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <LSDBCoreTable columns={columns} data={modelData} />
        </Grid>
      </Grid>
    </>
  );
};

export default GenericModelList;
