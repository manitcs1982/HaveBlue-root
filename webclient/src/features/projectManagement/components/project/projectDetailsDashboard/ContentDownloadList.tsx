import React from "react";
import { useWorkOrdersById } from "../../../projectManagementQueries";
import {
  Button,
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { UseQueryResult } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { useDownloadProjects } from "../../../projectQueries";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(6),
  },
}));

const reportTypes = [
  "Intake",
  "LID",
  "Interim 1",
  "Final",
  "Interim FE",
  "Final FE",
  "PAN",
  "IAM",
  "Interim BDS",
  "Final BDS",
];

type ActionsType =
  | {
      type: "TOGGLE_OPEN";
      workOrderStateId: number;
    }
  | {
      type: "ADD_TSD" | "REMOVE_TSD";
      workOrderStateId: number;
      tsd: number;
    };

const workOrderStateReducer = (
  currentWorkOrderStates: {
    id: number;
    isOpen: boolean;
    selectedTSDs: number[];
  }[],
  action: ActionsType
): {
  id: number;
  isOpen: boolean;
  selectedTSDs: number[];
}[] => {
  switch (action.type) {
    case "TOGGLE_OPEN":
      return currentWorkOrderStates.map((workOrderState) =>
        workOrderState.id === action.workOrderStateId
          ? { ...workOrderState, isOpen: !workOrderState.isOpen }
          : workOrderState
      );
    case "ADD_TSD":
      return currentWorkOrderStates.map((workOrderState) =>
        workOrderState.id === action.workOrderStateId
          ? {
              ...workOrderState,
              selectedTSDs: [...workOrderState.selectedTSDs, action.tsd],
            }
          : workOrderState
      );
    case "REMOVE_TSD":
      return currentWorkOrderStates.map((workOrderState) =>
        workOrderState.id === action.workOrderStateId
          ? {
              ...workOrderState,
              selectedTSDs: workOrderState.selectedTSDs.filter(
                (selectedTSD) => selectedTSD !== action.tsd
              ),
            }
          : workOrderState
      );
    default:
      throw new Error("This is not right...");
  }
};

const ContentDownloadList = ({
  selectedWorkOrders,
  downloadType,
}: {
  selectedWorkOrders: number[];
  downloadType: string;
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [selectedWorkOrderIds, setSelectedWorkOrderIds] = React.useState("");
  const [selectedTsdIds, setSelectedTsdIds] = React.useState("");

  const {
    error: errorDownloadedData,
    isError: isErrorDownloadedData,
    isLoading: isLoadingDownloadedData,
  } = useDownloadProjects(selectedWorkOrderIds, false, "", "", selectedTsdIds);

  const [workOrderStates, dispatchOpenStates] = React.useReducer(
    workOrderStateReducer,
    selectedWorkOrders.map((selectedWorkOrder: number) => ({
      id: selectedWorkOrder,
      isOpen: false,
      selectedTSDs: [],
    }))
  );

  const initialWorkOrders = useWorkOrdersById(selectedWorkOrders, {
    select: React.useCallback(
      (data) => ({
        id: data.id,
        name: data.name,
        testSequenceDefinitions: data.test_sequence_definitions.map(
          (tsd: any) => ({
            id: tsd.test_sequence.id,
            name: tsd.test_sequence.name,
          })
        ),
      }),
      []
    ),
  });
  const successfulWorkOrders = initialWorkOrders.filter(
    (initialWorkOrder: any) => initialWorkOrder.isSuccess
  );

  const isOpen = (workOrderId: number): boolean => {
    const workOrderState = workOrderStates.find(
      (workOrderState) => workOrderState.id === workOrderId
    );

    if (workOrderState) {
      return workOrderState.isOpen;
    }

    return false;
  };

  const isTSDSelected = (workOrderId: number, tsdId: number): boolean => {
    const workOrderState = workOrderStates.find(
      (workOrderState) => workOrderState.id === workOrderId
    );

    if (workOrderState) {
      return workOrderState.selectedTSDs.includes(tsdId);
    }

    return false;
  };

  const toggleOpen = (id: number) => {
    const workOrderState = workOrderStates.find(
      (workOrderState) => workOrderState.id === id
    );

    if (workOrderState) {
      dispatchOpenStates({
        type: "TOGGLE_OPEN",
        workOrderStateId: id,
      });
    }
  };

  const handleSelectedReport = (reportName: string) => {
    console.log(`Clicked ${reportName}`);
  };

  const handleSelectTSD = (workOrderId: number, tsdId: number) => {
    if (isTSDSelected(workOrderId, tsdId)) {
      dispatchOpenStates({
        type: "REMOVE_TSD",
        workOrderStateId: workOrderId,
        tsd: tsdId,
      });
    } else {
      dispatchOpenStates({
        type: "ADD_TSD",
        workOrderStateId: workOrderId,
        tsd: tsdId,
      });
    }
  };

  const downloadData = async () => {
    const projectId = history.location.pathname.split("/")[3];
    let workOrderIds: number[] = [];
    let tsdIds: number[] = [];

    for (const workOrderState of workOrderStates) {
      if (workOrderState.selectedTSDs.length !== 0) {
        workOrderIds.push(workOrderState.id);
        tsdIds.push(...workOrderState.selectedTSDs);
      }
    }

    if (workOrderIds.length === 1) {
      setSelectedWorkOrderIds("" + workOrderIds[0]);
    } else if (workOrderIds.length > 1) {
      setSelectedWorkOrderIds(workOrderIds.join(","));
    }

    if (tsdIds.length === 1) {
      setSelectedTsdIds("" + tsdIds[0]);
    } else if (tsdIds.length > 1) {
      setSelectedTsdIds(tsdIds.join(","));
    }

    history.push(`/project_management/project_intelligence/${projectId}`);
  };

  return (
    <React.Fragment>
      {selectedWorkOrders.length === 0 && (
        <Typography variant="subtitle2">
          No Work Orders selected on step 1. Please select some.
        </Typography>
      )}
      <List>
        {successfulWorkOrders.map(
          (
            successfulWorkOrder: UseQueryResult<
              {
                id: number;
                name: string;
                testSequenceDefinitions: { id: number; name: string }[];
              },
              any
            >,
            index: number
          ) => (
            <React.Fragment>
              <ListItem
                button
                onClick={() => toggleOpen(successfulWorkOrder.data!.id)}
              >
                <ListItemText
                  primary={`${index + 1} - ${successfulWorkOrder.data!.name}`}
                />
                {isOpen(successfulWorkOrder.data!.id) ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItem>
              <Collapse
                in={isOpen(successfulWorkOrder.data!.id)}
                timeout="auto"
                unmountOnExit
              >
                <List>
                  {downloadType === "report" &&
                    reportTypes.map((reportType: string) => {
                      return (
                        <ListItem
                          className={classes.nested}
                          onClick={() => handleSelectedReport(reportType)}
                        >
                          <ListItemIcon>
                            <Checkbox edge="start" disableRipple />
                          </ListItemIcon>
                          <ListItemText primary={reportType} />
                        </ListItem>
                      );
                    })}
                  {downloadType === "custom" &&
                    successfulWorkOrder.data!.testSequenceDefinitions.map(
                      (testSequenceDefinition) => {
                        return (
                          <ListItem
                            key={testSequenceDefinition.id}
                            className={classes.nested}
                            button
                            onClick={() =>
                              handleSelectTSD(
                                successfulWorkOrder.data!.id,
                                testSequenceDefinition.id
                              )
                            }
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                disableRipple
                                checked={isTSDSelected(
                                  successfulWorkOrder.data!.id,
                                  testSequenceDefinition.id
                                )}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={testSequenceDefinition.name}
                            />
                          </ListItem>
                        );
                      }
                    )}
                </List>
              </Collapse>
            </React.Fragment>
          )
        )}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => downloadData()}
      >
        Download Data
      </Button>
    </React.Fragment>
  );
};

export default ContentDownloadList;
