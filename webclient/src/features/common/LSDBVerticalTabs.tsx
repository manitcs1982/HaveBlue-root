import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Theme } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import { combineStyles } from "../common/util";

import Typography from "@material-ui/core/Typography";

import Box from "@material-ui/core/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const useStylesBase = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    alignItems: "flex-start",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    textAlign: "left",
  },
  tab: {
    marginRight: "1200px",
    fontSize: "11px",
    textAlign: "left",
  },
  wrapper: {
    display: "block",
  },
  titleGrid: {
    paddingBottom: "30px",
  },
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
};

const extractIds = (data: any) => {
  return Object.keys(data);
};

const filterData = (data: any, comparisonValue: any): any => {
  for (let [key, value] of Object.entries(data)) {
    if (key === comparisonValue) {
      return value;
    }
  }
};
export const LSDBVerticalTabs = ({
  data = [],
  title,
  useStyles = () => {},
  component: Component,
}: {
  data: any;
  useStyles?: any;
  title: string;
  component: React.ComponentType<any>;
}) => {
  const classes = combineStyles(useStylesBase(), useStyles())();

  const [value, setValue] = React.useState(0);

  const handleChange = (newValue: any) => () => {
    setValue(newValue);
  };

  const tabsKeys = React.useMemo(() => extractIds(data), [data]);
  const filteredData = React.useMemo(() => filterData(data, tabsKeys[value]), [
    data,
    tabsKeys,
    value,
  ]);

  return (
    <>
      <div className={classes.titleGrid}>
        <Typography variant="h3">{title}</Typography>
      </div>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {tabsKeys.map((val: any, index: any) => (
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={1}>
                <Badge badgeContent={data[val].length} max={999} color="primary"></Badge>
              </Grid>
              <Grid item xs={8}>
                <Tab
                  className={classes.tab}
                  classes={{ wrapper: classes.wrapper }}
                  key={val}
                  label={val}
                  onClick={handleChange(index)}
                />
              </Grid>
            </Grid>
          ))}
        </Tabs>
        {tabsKeys.map((val: any, index: any) => (
          <TabPanel key={val} value={value} index={index}>
            <Component data={filteredData} />
          </TabPanel>
        ))}
      </div>
    </>
  );
};
