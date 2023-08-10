import React from "react";
import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { ErrorMessage } from "../../../common/ErrorMessage";
import {
  useClosedFlags,
  useClosedSupportTickets,
  useFlags,
  useSupportTickets,
} from "../../projectQueries";
import { ThreadedViewer } from "../../../common/threadedViewer/threadedViewer";
import { ThreadedCreator } from "../../../common/threadedViewer/threadedCreator";
import { useParams } from "react-router-dom";
import LSDBPaginatedTable from "../../../common/LSDBPaginatedTable";
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

export const EngineeringAgendaPage = () => {
  const [valueEngineeringTabs, setValueEngineeringTabs] =
    React.useState<number>(0);
  const [valueTicketsTabs, setValueTicketsTabs] = React.useState<number>(0);
  const [valueSectionTabs, setValueSectionTabs] = React.useState<Number>(0);
  const [noteID, setNoteID] = React.useState(
    Number((useParams() as { note_id: string }).note_id)
  );
  const [open, setOpen] = React.useState(noteID ? true : false);

  const {
    data: flagsData = [],
    error: flagsError,
    isLoading: isLoadingFlags,
    isError: isErrorFlags,
    isSuccess: isSuccessFlags,
  } = useFlags();

  const {
    data: ticketsData = [],
    error: ticketsError,
    isLoading: isLoadingTickets,
    isError: isErrorTickets,
    isSuccess: isSuccessTickets,
  } = useSupportTickets();

  const {
    isIdle: isIdleClosedFlags,
    isLoading: isLoadingClosedFlags,
    isError: isErrorClosedFlags,
    data: closedFlagsData,
    error: closedFlagsError,
    refetch: refetchClosedFlags,
  } = useClosedFlags();

  const {
    isIdle: isIdleClosedTickets,
    isLoading: isLoadingClosedTickets,
    isError: isErrorClosedTickets,
    data: closedTicketsData,
    error: closedTicketsError,
    refetch: refetchClosedTickets,
  } = useClosedSupportTickets();

  const handleChangeEngineering = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    if (newValue === 1) {
      refetchClosedFlags();
    }
    setValueEngineeringTabs(newValue);
  };

  const handleChangeTickets = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    if (newValue === 1) {
      refetchClosedTickets();
    }
    setValueTicketsTabs(newValue);
  };

  const columns = React.useMemo(
    () => DefaultTicketColumns(setNoteID, setOpen),
    []
  );

  if (isLoadingFlags || isLoadingTickets) {
    //
    return <LinearProgress />;
  }

  if (isErrorFlags || isErrorTickets) {
    return (
      <>
        {isErrorFlags && <ErrorMessage error={flagsError} />}
        {isErrorTickets && <ErrorMessage error={ticketsError} />}
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
        <Grid item>
          <Grid item xs={12}>
            <Paper style={{ flexGrow: 1, marginTop: 20 }}>
              <Tabs
                value={valueSectionTabs}
                onChange={(event: React.ChangeEvent<{}>, newValue: number) =>
                  setValueSectionTabs(newValue)
                }
                indicatorColor="secondary"
                textColor="primary"
                centered
                variant="fullWidth"
              >
                <Tab label="Engineering Agenda" />
                <Tab label="Development Support Tickets" />
              </Tabs>
              <TabPanel value={valueSectionTabs} index={0}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item xs={2} />
                  <Grid item xs={8}>
                    <ThreadedCreator id={0} noteType={0} model={null} />
                  </Grid>
                  <Grid item xs={2} />

                  <Grid item xs={12}>
                    <Paper style={{ flexGrow: 1, marginTop: 20 }}>
                      <Tabs
                        value={valueEngineeringTabs}
                        onChange={handleChangeEngineering}
                        indicatorColor="secondary"
                        textColor="primary"
                        centered
                        variant="fullWidth"
                      >
                        <Tab label="Open" />
                        <Tab label="Closed" />
                      </Tabs>
                      <TabPanel value={valueEngineeringTabs} index={0}>
                        {isSuccessFlags && (
                          <LSDBPaginatedTable
                            data={flagsData}
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
                      <TabPanel value={valueEngineeringTabs} index={1}>
                        {isIdleClosedFlags ? (
                          <p>Not Ready...</p>
                        ) : isLoadingClosedFlags ? (
                          <Grid container>
                            <Grid item xs={12}>
                              <LinearProgress />
                            </Grid>
                          </Grid>
                        ) : isErrorClosedFlags ? (
                          <ErrorMessage error={closedFlagsError} />
                        ) : (
                          <LSDBPaginatedTable
                            data={closedFlagsData}
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
              </TabPanel>
              <TabPanel value={valueSectionTabs} index={1}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item xs={2} />
                  <Grid item xs={8}>
                    <ThreadedCreator
                      id={0}
                      noteType={7}
                      model={null}
                      invalidate={["supportTickets"]}
                    />
                  </Grid>
                  <Grid item xs={2} />

                  <Grid item xs={12}>
                    <Paper style={{ flexGrow: 1, marginTop: 20 }}>
                      <Tabs
                        value={valueTicketsTabs}
                        onChange={handleChangeTickets}
                        indicatorColor="secondary"
                        textColor="primary"
                        centered
                        variant="fullWidth"
                      >
                        <Tab label="Open" />
                        <Tab label="Closed" />
                      </Tabs>
                      <TabPanel value={valueTicketsTabs} index={0}>
                        {isSuccessTickets && (
                          <LSDBPaginatedTable
                            data={ticketsData}
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
                      <TabPanel value={valueTicketsTabs} index={1}>
                        {isIdleClosedTickets ? (
                          <p>Not Ready...</p>
                        ) : isLoadingClosedTickets ? (
                          <Grid container>
                            <Grid item xs={12}>
                              <LinearProgress />
                            </Grid>
                          </Grid>
                        ) : isErrorClosedTickets ? (
                          <ErrorMessage error={closedTicketsError} />
                        ) : (
                          <LSDBPaginatedTable
                            data={closedTicketsData}
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
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <ThreadedViewer id={noteID} open={open} setOpen={setOpen} />
    </>
  );
};
