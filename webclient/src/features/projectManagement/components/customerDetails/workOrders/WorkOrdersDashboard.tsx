import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { WorkOrdersTable } from "./WorkOrdersTable";
import { ExpectedUnitTypesTable } from "./ExpectedUnitTypesTable";
import { ProjectUnitsTable } from "./ProjectUnitsTable";

import { useCustomerDetailsContext } from "../../../../common/CustomerDetailsContext";
import { useTheme } from "@material-ui/core";

interface LinkTabProps {
  label?: string;
  href?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          <Typography>{children}</Typography>
        </>
      )}
    </div>
  );
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export const WorkOrdersDashboard = ({ data = [], isCard = false }: any) => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div style={theme.container}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Work Orders" href="#" />
          <LinkTab label="Expected Unit Types" href="#" />
          <LinkTab label="Project Units" href="#" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <WorkOrdersTable data={data.workorder_set} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ExpectedUnitTypesTable
          data={data.expectedunittype_set}
          number={data.url}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ProjectUnitsTable data={data.units} />
      </TabPanel>
    </div>
  );
};
