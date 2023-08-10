import React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from "@material-ui/core/CircularProgress"
import { Backdrop, useTheme } from "@material-ui/core";

import { useStressData } from "../../projectQueries";
import { StressReadyTable } from "./StressReadyTable";
import { ErrorMessage } from "../../../common/ErrorMessage";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 700
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  tab: {
    padding: "40px"
  },
  titleGrid: {
    paddingBottom: "30px"
  }
}));

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index: any) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const extractIds = (data: any) => {
  return Object.keys(data)
}

const filterData = (data: any, comparisonValue: any) => {
  for (let [key, value] of Object.entries(data)) {
    if (key === comparisonValue) {
      return value
    }
  }
}

export const StressReadyStatus = () => {
  const theme = useTheme();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const {
    data: stressData = [],
    isLoading,
    isError,
    error
  } = useStressData();

  if (isLoading) {
    return (
      <div style={theme.containerMargin}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Backdrop open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
  };

  const tabsKeys = extractIds(stressData);
  const filteredData = filterData(stressData, tabsKeys[value]);

  return (
    <>
      <div className={classes.titleGrid}>
        <Grid item xs={4}>
          <Typography variant="h3">Chamber Ready</Typography>
        </Grid>
      </div>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}>
          {tabsKeys.map((val: any, index: any) => (
            <Tab className={classes.tab} key={val} label={val} {...a11yProps(index)} />
          ))}
        </Tabs>
        {tabsKeys.map((val: any, index: any) => (
          <TabPanel key={val} value={value} index={index}>
            {<StressReadyTable stressData={filteredData} />}
          </TabPanel>
        ))}
      </div>
    </>
  );
}
