import React from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Button,
  Grid,
  TextField,
  Backdrop,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";
import { ErrorMessage } from "../../common/ErrorMessage";
import moment from "moment";

import { DateTimePicker } from "@material-ui/pickers";

import { useUsers } from "./testQueries";
import { useMeasurementsDispositions } from "../../common/services/dispositionServices";

export const HistoricUserCapture = ({
  historicUser,
  setHistoricUser,
  historicDate,
  setHistoricDate,
  historicDisposition,
  setHistoricDisposition,
}: any) => {
  const history = useHistory();
  const {
    data: users,
    isError: isErrorUsers,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useUsers();
  const {
    data: dispositions,
    isError: isErrorDispositions,
    isLoading: isLoadingDispositions,
    error: errorDispositions,
  } = useMeasurementsDispositions();

  if (isLoadingUsers || isLoadingDispositions) {
    return (
      <Backdrop open={isLoadingUsers || isLoadingDispositions}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorUsers) {
    return <ErrorMessage error={errorUsers} />;
  }

  if (isErrorDispositions) {
    return <ErrorMessage error={errorDispositions} />;
  }

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="flex-start"
      spacing={2}
    >
      <Grid item xs={4}>
        <TextField
          id="historicUser"
          type="text"
          data-testid="historicUser"
          name="historicUser"
          select={true}
          label="Pick a user"
          fullWidth
        >
          {users?.map((user: any) => (
            <MenuItem
              key={user.id}
              value={user.url}
              onClick={() => setHistoricUser(user)}
            >
              {user.username}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="historicDisposition"
          type="text"
          data-testid="historicDisposition"
          name="historicDisposition"
          select={true}
          label="Pick a disposition"
          fullWidth
        >
          {dispositions?.map((disposition: any) => (
            <MenuItem
              key={disposition.id}
              value={disposition.url}
              onClick={() => setHistoricDisposition(disposition)}
            >
              {disposition.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={4}>
        <DateTimePicker
          label={"Select a date"}
          value={historicDate}
          inputVariant="outlined"
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(date: any) => {
            setHistoricDate(new Date(date).toJSON());
          }}
        />
      </Grid>
    </Grid>
  );
};
