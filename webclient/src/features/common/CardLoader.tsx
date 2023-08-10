import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";
import { CardHeader, Grid, Avatar, CardContent } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export const CardLoader = () => {
  return (
    <>
      <CardHeader
        style={{ paddingBottom: 0 }}
        subheader={
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={11}>
              <Typography variant="subtitle1">
                <Skeleton />
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Skeleton variant="circle">
                <Avatar />
              </Skeleton>
            </Grid>
          </Grid>
        }
      ></CardHeader>
      <CardContent>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};
