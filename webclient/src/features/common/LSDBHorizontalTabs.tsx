import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

interface LinkTabProps {
  label?: string;
  href?: string;
  disabled?: boolean;
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

export const LSDBHorizontalTabs = ({
  properties,
  components,
}: {
  properties: object[];
  components: React.ReactNode[];
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          {properties.map((property: any, index: number) => (
            <LinkTab
              label={property.label}
              href="#"
              disabled={property.disabled}
            />
          ))}
        </Tabs>
      </AppBar>
      {components.map((currentComponent: React.ReactNode, index: number) => {
        return (
          <TabPanel value={value} index={index}>
            {currentComponent}
          </TabPanel>
        );
      })}
    </>
  );
};
