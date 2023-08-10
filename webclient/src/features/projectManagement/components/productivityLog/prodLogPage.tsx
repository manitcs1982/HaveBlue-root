import React from "react";
import { Button, Grid, useTheme } from "@material-ui/core";
import { Container, Typography } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useDatesRange, useDownloadLog } from "../../projectQueries";
import { ProductivityTable } from "./prodLogTable";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { formatDateWorkLog } from "../../../../util/searchData";
import { KeyboardDatePicker } from "@material-ui/pickers";

export const ProductivityLog = () => {
  const theme = useTheme();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const [startDate, setStartDate] = React.useState(yesterday);
  const [endDate, setEndDate] = React.useState(today);
  const [isEnabled, setIsEnabled] = React.useState(false);

  const handleStartDateChange = (date: any) => {
    setStartDate(date);
    setIsEnabled(false);
  };

  const handleEndDateChange = (date: any) => {
    setEndDate(date);
    setIsEnabled(false);
  };

  const dates = {
    startDate: formatDateWorkLog(startDate),
    endDate: formatDateWorkLog(endDate),
  };

  const {
    data: logData,
    error: errorLog,
    isLoading: isLoadingLog,
    isError: isErrorLog,
  } = useDatesRange(dates);

  const {
    error: errorDownloadedData,
    isError: isErrorDownloadedData,
    isLoading: isLoadingDownloadedData,
  } = useDownloadLog(startDate, endDate, isEnabled);

  React.useEffect(() => {
    if (isEnabled) {
      setIsEnabled(false);
    }
  }, [isEnabled]);

  if (isLoadingLog) {
    return (
      <Backdrop open={isLoadingLog}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorLog) {
    return <ErrorMessage error={errorLog} />;
  }

  const handleDates = () => {
    setIsEnabled(true);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={6}>
          <Typography variant="h3">Work Log</Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={10} justify="space-around">
            <Grid xs={4}>
              <KeyboardDatePicker
                disableToolbar
                disableFuture
                autoOk={true}
                variant="inline"
                format="MM/DD/yyyy"
                margin="normal"
                id="start-date-picker"
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid xs={4}>
              <KeyboardDatePicker
                disableToolbar
                disableFuture
                autoOk={true}
                variant="inline"
                format="MM/DD/yyyy"
                margin="normal"
                id="end-date-picker"
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>

            <Grid xs={4}>
              <Button variant="contained" color="primary" onClick={handleDates}>
                Export
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {dates && logData && <ProductivityTable logData={logData} />}
        </Grid>
      </Grid>
    </>
  );
};
