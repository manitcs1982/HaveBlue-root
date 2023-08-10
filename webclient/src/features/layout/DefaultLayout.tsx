import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "react-query";

import clsx from "clsx";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Input from "@material-ui/core/Input";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import WorkIcon from "@material-ui/icons/Work";
import PoolIcon from "@material-ui/icons/Pool";
import SearchIcon from "@material-ui/icons/Search";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import EventNoteIcon from "@material-ui/icons/EventNote";
import PersonIcon from "@material-ui/icons/Person";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import StorageIcon from "@material-ui/icons/Storage";
import BuildIcon from "@material-ui/icons/Build";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import HomeIcon from "@material-ui/icons/Home";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EventAvailable from "@material-ui/icons/EventAvailable";
import EventBusy from "@material-ui/icons/EventBusy";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import EmailIcon from "@material-ui/icons/Email";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import SubjectIcon from "@material-ui/icons/Subject";
import CodeIcon from "@material-ui/icons/Code";

import { TravelerComponent } from "../projectManagement/components/virtualTraveler/TravelerComponent";
import { useUnitsBySerialNumber } from "../testCommunication/common/testQueries";
import { LSDBreadcrumb } from "./LSDBreadcrumb";
import { Copyright } from "../common/Copyright";
import { useAuthContext } from "../common/AuthContext";
import { Autorenew } from "@material-ui/icons";
import { useGlobalLogout } from "../common/util";

const drawerWidth = 310;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    accordionRoot: {
      display: "inline-flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    barButton: {
      borderWidth: "2px",
      backgroundColor: "white",
      borderColor: "#369b47",
      color: "#369b47",
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    subTab: {
      marginLeft: "20px",
    },
    title: {
      flexGrow: 1,
    },
    viewTravelerInput: {
      marginRight: "5px",
      height: "35px",
      backgroundColor: "white",
      transition: "backgroundColor 5s linear",
      "&.Mui-focused": {
        backgroundColor: "#cce6ff",
      },
    },
    viewTravelerDiv: {
      marginRight: "15px",
    },
    submitButton: {
      color: "white",
    },
    miniList: {
      margin: "10px",
    },
  })
);

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, state } = useAuthContext();
  const { logout } = useGlobalLogout();
  const logoff = () => {
    logout();
  };

  const classes = useStyles();
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const textInputRef = React.useRef<any>("");

  const {
    data: units,
    isSuccess: isSuccessUnits,
    isLoading: isLoadingUnits,
  } = useUnitsBySerialNumber(textInputRef.current.value);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleUnitsInfo = () => {
    if (isLoadingUnits) {
      return <h2>Loading...</h2>;
    } else if (units && units.length === 0) {
      return <h1>No units found.</h1>;
    } else if (isSuccessUnits) {
      return <TravelerComponent serialNumber={textInputRef.current.value} />;
    }
  };

  const handleModalClose = (e: any) => {
    e.preventDefault();
    return textInputRef.current.value ? setOpenDialog(!openDialog) : null;
  };

  const clearSerial = () => {
    (document.getElementById("traveler-bar") as HTMLFormElement).reset();
  };

  const handleSideMenu = () => {
    return openDrawer ? (
      <List>
        <Accordion>
          <AccordionSummary
            className={classes.accordionRoot}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ListItem button component={Link} to="/home">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </AccordionSummary>
        </Accordion>
        <Accordion>
          <AccordionSummary
            className={classes.accordionRoot}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ListItem button component={Link} to="/operations">
              <ListItemIcon>
                <SettingsApplicationsIcon />
              </ListItemIcon>
              <ListItemText primary="Operations" />
            </ListItem>
          </AccordionSummary>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations/wet_leakage"
            >
              <ListItemIcon>
                <PoolIcon />
              </ListItemIcon>
              <ListItemText primary="Wet Leakage" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations/diode_test"
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Diode Test" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations/visual_inspection"
            >
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="Visual Inspection" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations/colorimeter"
            >
              <ListItemIcon>
                <ColorLensIcon />
              </ListItemIcon>
              <ListItemText primary="Colorimeter" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations/intake/crate"
            >
              <ListItemIcon>
                <AllInboxIcon />
              </ListItemIcon>
              <ListItemText primary="Crate Intake" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations/intake/unit"
            >
              <ListItemIcon>
                <ViewModuleIcon />
              </ListItemIcon>
              <ListItemText primary="Unit Intake" />
            </ListItem>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            className={classes.accordionRoot}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ListItem button component={Link} to="/operations_management">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Ops Management" />
            </ListItem>
          </AccordionSummary>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations_management/ops_agenda"
            >
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Ops Agenda" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations_management/data_verification"
            >
              <ListItemIcon>
                <FindInPageIcon />
              </ListItemIcon>
              <ListItemText primary="Data Verification" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations_management/stress_entry"
            >
              <ListItemIcon>
                <EventAvailable />
              </ListItemIcon>
              <ListItemText primary="Stress Entry" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations_management/stress_out"
            >
              <ListItemIcon>
                <EventBusy />
              </ListItemIcon>
              <ListItemText primary="Stress Exit" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations_management/ops_queues"
            >
              <ListItemIcon>
                <Autorenew />
              </ListItemIcon>
              <ListItemText primary="Ops Queues" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/operations_management/work_log"
            >
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Work Log" />
            </ListItem>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            className={classes.accordionRoot}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ListItem button component={Link} to="/project_management">
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Project Management" />
            </ListItem>
          </AccordionSummary>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/project_management/active_projects"
            >
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText primary="Active Projects" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/project_management/my_projects"
            >
              <ListItemIcon>
                <AssignmentIndIcon />
              </ListItemIcon>
              <ListItemText primary="My Projects" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/project_management/customer"
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/project_management/virtual_traveler"
            >
              <ListItemIcon>
                <FlightTakeoffIcon />
              </ListItemIcon>
              <ListItemText primary="Virtual Traveler" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/project_management/projects"
            >
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Project Data" />
            </ListItem>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            className={classes.accordionRoot}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ListItem button component={Link} to="/engineering">
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="Engineering" />
            </ListItem>
          </AccordionSummary>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/engineering/unit_type"
            >
              <ListItemIcon>
                <DragIndicatorIcon />
              </ListItemIcon>
              <ListItemText primary="Unit Types" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/engineering/engineering_agenda"
            >
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Engineering Agenda" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/engineering/plugins"
            >
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary="Plugins" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/engineering/test-sequence-definitions"
            >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Test Sequence Definitions" />
            </ListItem>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            className={classes.accordionRoot}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ListItem button component={Link} to="/profile_management">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile Management" />
            </ListItem>
          </AccordionSummary>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/profile_management/user_management"
            >
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="(Admin) User Management" />
            </ListItem>
          </AccordionDetails>
          <AccordionDetails>
            <ListItem
              button
              className={classes.subTab}
              component={Link}
              to="/profile_management/my_agenda"
            >
              <ListItemIcon>
                <SubjectIcon />
              </ListItemIcon>
              <ListItemText primary="My Agenda" />
            </ListItem>
          </AccordionDetails>
        </Accordion>
      </List>
    ) : (
      <>
        <List className={classes.miniList}>
          <Tooltip title="Home">
            <ListItem button component={Link} to="/home">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Tooltip>
          <Divider />
          <Tooltip title="Operations">
            <ListItem button component={Link} to="/operations">
              <ListItemIcon>
                <SettingsApplicationsIcon />
              </ListItemIcon>
              <ListItemText primary="Operations" />
            </ListItem>
          </Tooltip>
          <Divider />
          <Tooltip title="Ops Management">
            <ListItem button component={Link} to="/operations_management">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Ops Management" />
            </ListItem>
          </Tooltip>
          <Divider />
          <Tooltip title="Project Management">
            <ListItem button component={Link} to="/project_management">
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Project Management" />
            </ListItem>
          </Tooltip>
          <Divider />
          <Tooltip title="Engineering">
            <ListItem button component={Link} to="/engineering">
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="Engineering" />
            </ListItem>
          </Tooltip>
          <Divider />
          <Tooltip title="Profile Management">
            <ListItem button component={Link} to="/profile_management">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItem>
          </Tooltip>
          <Divider />
        </List>
      </>
    );
  };

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: openDrawer,
              })}
            >
              <Tooltip title="Full list of options">
                <MenuIcon />
              </Tooltip>
            </IconButton>
            <Typography variant="h6" noWrap>
              {/*title*/}
            </Typography>
            <div className={classes.title}></div>
            <div className={classes.viewTravelerDiv}>
              <form onSubmit={handleModalClose} id="traveler-bar">
                <Input
                  placeholder="View Traveler"
                  className={classes.viewTravelerInput}
                  inputRef={textInputRef}
                ></Input>
                <Button
                  className={classes.barButton}
                  variant="contained"
                  type={"submit"}
                  style={{ marginRight: 5 }}
                >
                  SUBMIT
                </Button>
                <Button
                  className={classes.barButton}
                  variant="contained"
                  onClick={clearSerial}
                >
                  RESET
                </Button>
              </form>
              <Dialog
                open={openDialog}
                onClose={handleModalClose}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth={true}
                maxWidth={"md"}
              >
                <DialogTitle id="scroll-dialog-title">
                  Traveler: {textInputRef.current.value}
                </DialogTitle>
                <DialogContent>{handleUnitsInfo()}</DialogContent>
                <DialogActions>
                  <Button onClick={handleModalClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            {isAuthenticated() && (
              <>
                <Typography variant="subtitle1">{state.user}</Typography>
                <Button
                  color="inherit"
                  onClick={logoff}
                  style={{ textAlign: "right" }}
                >
                  Logoff
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: openDrawer,
              [classes.drawerClose]: !openDrawer,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          {handleSideMenu()}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <LSDBreadcrumb />
          <Typography paragraph>{children}</Typography>
        </main>
      </div>
      <Copyright />
    </>
  );
};
