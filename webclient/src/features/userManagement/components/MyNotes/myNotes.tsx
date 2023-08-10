import React from "react";
import {
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  LinearProgress,
} from "@material-ui/core";

import { ErrorMessage } from "../../../common/ErrorMessage";

import { useMyNotes } from "../../userQueries";
import { useParams } from "react-router-dom";
import { LSDBCoreTable } from "../../../common/LSDBCoreTable";
import { ThreadedViewer } from "../../../common/threadedViewer/threadedViewer";
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

export const MyNotesPage = () => {
  const [value, setValue] = React.useState<number>(0);

  const [noteID, setNoteID] = React.useState(
    Number((useParams() as { note_id: string }).note_id)
  );
  const [open, setOpen] = React.useState(noteID ? true : false);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const {
    data: openNotes,
    error: errorOpenNotes,
    isLoading: isLoadingOpenNotes,
    isError: isErrorOpenNotes,
    isSuccess: isSuccessOpenNotes,
  } = useMyNotes("False");

  const {
    data: closedNotes,
    error: errorClosedNotes,
    isLoading: isLoadingClosedNotes,
    isError: isErrorClosedNotes,
    isSuccess: isSuccessClosedNotes,
  } = useMyNotes("True");

  const columns = React.useMemo(
    () => DefaultTicketColumns(setNoteID, setOpen),
    []
  );

  if (isLoadingOpenNotes || isLoadingClosedNotes) {
    return <LinearProgress />;
  }

  if (isErrorOpenNotes || isErrorClosedNotes) {
    return (
      <>
        {isErrorOpenNotes && <ErrorMessage error={errorOpenNotes} />};
        {isErrorClosedNotes && <ErrorMessage error={errorClosedNotes} />};
      </>
    );
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
        <Grid item xs={12}>
          <Typography variant="h3"> My Agenda </Typography>
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={5} />
          <Grid item xs={2}>
            <ThreadedCreator id={0} model={null} noteType={0} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper>
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
              {isSuccessOpenNotes && (
                <LSDBCoreTable
                  data={openNotes}
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
              {isSuccessClosedNotes && (
                <LSDBCoreTable
                  data={closedNotes}
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
