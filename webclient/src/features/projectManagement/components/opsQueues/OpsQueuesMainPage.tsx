import React from "react";

import {
  makeStyles,
  Theme,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
} from "@material-ui/core";
import { useQueryClient } from "react-query";
import { InTest } from "./inTest/InTest";
import { CharacterizationQueue } from "./characterizationStress/CharacterizationQueue";
import { StressQueue } from "./characterizationStress/StressQueue";

import { useTodoDownload } from "./opsQueuesQueries";
import EndOfLifeQueue from "./EndOfLifeQueue";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export const OpsQueuesMainPage = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const [value, setValue] = React.useState(0);
  const [isEnabled, setIsEnabled] = React.useState(false);

  const {
    error: errorDownloadedData,
    isError: isErrorDownloadedData,
    isLoading: isLoadingDownloadedData,
  } = useTodoDownload();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleDownload = () => {
    queryClient.refetchQueries(["downloadTodo"]);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <Paper className={classes.root} style={{ marginTop: 20 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="In Test" />
              <Tab label="Characterization Queue" />
              <Tab label="Stress Queue" />
              <Tab label="EoL Queue" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <InTest />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CharacterizationQueue />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <StressQueue />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <EndOfLifeQueue />
            </TabPanel>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleDownload}>
            Todo Download
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
