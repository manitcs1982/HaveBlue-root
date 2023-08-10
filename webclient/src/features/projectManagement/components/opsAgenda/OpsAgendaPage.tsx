import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { ThreadedViewer } from "../../../common/threadedViewer/threadedViewer";
import { useClosedTasks, useTasks } from "../../projectQueries";

import { useParams } from "react-router-dom";

import { LSDBCoreTable } from "../../../common/LSDBCoreTable";
import { ThreadedCreator } from "../../../common/threadedViewer/threadedCreator";
import DefaultTicketColumns from "../../../common/DefaultTicketColumns";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

export const OpsAgendaPage = () => {
  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === 1) {
      refetchClosedTasks();
    }
    setValue(newValue);
  };

  const {
    data: notesData = [],
    error: notesError,
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
    isSuccess: isSuccessNotes,
  } = useTasks();

  const {
    isIdle: isIdleClosedTasks,
    isLoading: isLoadingClosedTasks,
    isError: isErrorClosedTasks,
    data: closedTasksData,
    error: closedTasksError,
    refetch: refetchClosedTasks,
  } = useClosedTasks();

  const [noteID, setNoteID] = React.useState(
    Number((useParams() as { note_id: string }).note_id)
  );
  const [open, setOpen] = React.useState(!!noteID);

  const columns = React.useMemo(
    () => DefaultTicketColumns(setNoteID, setOpen),
    []
  );

  if (isLoadingNotes) {
    return (
      <Backdrop open={isLoadingNotes}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorNotes) {
    return <ErrorMessage error={notesError} />;
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={10}>
          <Typography variant="h3">Tasks Inbox</Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ThreadedCreator id={0} model={null} noteType={0} />
        </Grid>
        <Grid item xs={4}></Grid>

        <Grid item xs={12}>
          <Paper style={{ flexGrow: 1, marginTop: 10 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="primary"
              centered
              variant="fullWidth"
            >
              <Tab label="Open" />
              <Tab label="Closed" />
            </Tabs>
            <TabPanel value={value} index={0}>
              {isSuccessNotes && (
                <LSDBCoreTable
                  data={notesData}
                  columns={columns}
                  noGeneralFilterColumns={[
                    "Note Type",
                    "Labels",
                    "Attached Projects",
                    "Customer",
                  ]}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {isIdleClosedTasks ? (
                <p>Not Ready...</p>
              ) : isLoadingClosedTasks ? (
                <Backdrop open={isLoadingClosedTasks}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : isErrorClosedTasks ? (
                <ErrorMessage error={closedTasksError} />
              ) : (
                <LSDBCoreTable
                  data={closedTasksData}
                  columns={columns}
                  noGeneralFilterColumns={[
                    "Note Type",
                    "Labels",
                    "Attached Projects",
                    "Customer",
                  ]}
                />
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      <ThreadedViewer id={noteID} open={open} setOpen={setOpen} />
    </>
  );
};
