import {
  Button,
  Container,
  FormControlLabel,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { useProjectWorkOrders } from "../../../projectManagementQueries";
import { useParams } from "react-router-dom";
import ContentDownloadList from "./ContentDownloadList";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { BackButton } from "../../../../common/returnButton";

export const ClientDeliverablesDetails = () => {
  const theme = useTheme();
  const { projectId } = useParams() as {
    projectId: string;
  };

  const steps = [
    "Select Work Orders",
    "Select Type of Download",
    "Select Content to Download",
  ];

  /*const workOrders = [
    {
      id: 1,
      url: "http://localhost:8000/api/1.0/work_orders/1/",
      name: "Test Work Order",
      description: "Work order created for API test",
      project: "http://localhost:8000/api/1.0/projects/1/",
      start_datetime: null,
      disposition: "http://localhost:8000/api/1.0/dispositions/16/",
      disposition_name: "Available",
      test_sequence_definitions: [
        {
          id: 5,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/5/",
          name: "Backsheet Durability Sequence",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 27,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/27/",
          name: "Control",
          short_name: null,
          description: "Control modules for LID and FE",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 47,
          unit_type_family: 1,
        },
        {
          id: 4,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/4/",
          name: "Damp Heat 2000",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 22,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/22/",
          name: "Field Exposure",
          short_name: null,
          description: "Field Exposure 360 days",
          notes: "",
          disposition: 14,
          disposition_name: "Revoked",
          version: "2018 PQP",
          group: 1,
          unit_type_family: 1,
        },
      ],
    },
    {
      id: 2,
      url: "http://localhost:8000/api/1.0/work_orders/1/",
      name: "Test Work Order",
      description: "Work order created for API test",
      project: "http://localhost:8000/api/1.0/projects/1/",
      start_datetime: null,
      disposition: "http://localhost:8000/api/1.0/dispositions/16/",
      disposition_name: "Available",
      test_sequence_definitions: [
        {
          id: 5,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/5/",
          name: "Backsheet Durability Sequence",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 27,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/27/",
          name: "Control",
          short_name: null,
          description: "Control modules for LID and FE",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 47,
          unit_type_family: 1,
        },
        {
          id: 4,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/4/",
          name: "Damp Heat 2000",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 22,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/22/",
          name: "Field Exposure",
          short_name: null,
          description: "Field Exposure 360 days",
          notes: "",
          disposition: 14,
          disposition_name: "Revoked",
          version: "2018 PQP",
          group: 1,
          unit_type_family: 1,
        },
      ],
    },
    {
      id: 3,
      url: "http://localhost:8000/api/1.0/work_orders/1/",
      name: "Test Work Order",
      description: "Work order created for API test",
      project: "http://localhost:8000/api/1.0/projects/1/",
      start_datetime: null,
      disposition: "http://localhost:8000/api/1.0/dispositions/16/",
      disposition_name: "Available",
      test_sequence_definitions: [
        {
          id: 5,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/5/",
          name: "Backsheet Durability Sequence",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 27,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/27/",
          name: "Control",
          short_name: null,
          description: "Control modules for LID and FE",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 47,
          unit_type_family: 1,
        },
        {
          id: 4,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/4/",
          name: "Damp Heat 2000",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 22,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/22/",
          name: "Field Exposure",
          short_name: null,
          description: "Field Exposure 360 days",
          notes: "",
          disposition: 14,
          disposition_name: "Revoked",
          version: "2018 PQP",
          group: 1,
          unit_type_family: 1,
        },
      ],
    },
    {
      id: 4,
      url: "http://localhost:8000/api/1.0/work_orders/1/",
      name: "Test Work Order",
      description: "Work order created for API test",
      project: "http://localhost:8000/api/1.0/projects/1/",
      start_datetime: null,
      disposition: "http://localhost:8000/api/1.0/dispositions/16/",
      disposition_name: "Available",
      test_sequence_definitions: [
        {
          id: 5,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/5/",
          name: "Backsheet Durability Sequence",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 27,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/27/",
          name: "Control",
          short_name: null,
          description: "Control modules for LID and FE",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 47,
          unit_type_family: 1,
        },
        {
          id: 4,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/4/",
          name: "Damp Heat 2000",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 22,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/22/",
          name: "Field Exposure",
          short_name: null,
          description: "Field Exposure 360 days",
          notes: "",
          disposition: 14,
          disposition_name: "Revoked",
          version: "2018 PQP",
          group: 1,
          unit_type_family: 1,
        },
      ],
    },
    {
      id: 5,
      url: "http://localhost:8000/api/1.0/work_orders/1/",
      name: "Test Work Order",
      description: "Work order created for API test",
      project: "http://localhost:8000/api/1.0/projects/1/",
      start_datetime: null,
      disposition: "http://localhost:8000/api/1.0/dispositions/16/",
      disposition_name: "Available",
      test_sequence_definitions: [
        {
          id: 5,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/5/",
          name: "Backsheet Durability Sequence",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 27,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/27/",
          name: "Control",
          short_name: null,
          description: "Control modules for LID and FE",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 47,
          unit_type_family: 1,
        },
        {
          id: 4,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/4/",
          name: "Damp Heat 2000",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 22,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/22/",
          name: "Field Exposure",
          short_name: null,
          description: "Field Exposure 360 days",
          notes: "",
          disposition: 14,
          disposition_name: "Revoked",
          version: "2018 PQP",
          group: 1,
          unit_type_family: 1,
        },
      ],
    },
    {
      id: 6,
      url: "http://localhost:8000/api/1.0/work_orders/1/",
      name: "Test Work Order",
      description: "Work order created for API test",
      project: "http://localhost:8000/api/1.0/projects/1/",
      start_datetime: null,
      disposition: "http://localhost:8000/api/1.0/dispositions/16/",
      disposition_name: "Available",
      test_sequence_definitions: [
        {
          id: 5,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/5/",
          name: "Backsheet Durability Sequence",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 27,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/27/",
          name: "Control",
          short_name: null,
          description: "Control modules for LID and FE",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 47,
          unit_type_family: 1,
        },
        {
          id: 4,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/4/",
          name: "Damp Heat 2000",
          short_name: null,
          description: "",
          notes: "",
          disposition: 16,
          disposition_name: "Available",
          version: "2019 PQP",
          group: 1,
          unit_type_family: 1,
        },
        {
          id: 22,
          url: "http://localhost:8000/api/1.0/test_sequence_definitions/22/",
          name: "Field Exposure",
          short_name: null,
          description: "Field Exposure 360 days",
          notes: "",
          disposition: 14,
          disposition_name: "Revoked",
          version: "2018 PQP",
          group: 1,
          unit_type_family: 1,
        },
      ],
    },
  ];*/

  const {
    data: workOrders,
    error: workOrdersError,
    isLoading: isLoadingWorkOrders,
    isError: isErrorWorkOrders,
  } = useProjectWorkOrders(projectId);

  const [activeStep, setActiveStep] = React.useState(0);
  const [downloadTypeValue, setDownloadTypeValue] = React.useState("report");
  const [selectedWorkOrders, setSelectedWorkOrders] = React.useState<number[]>(
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadTypeValue((event.target as HTMLInputElement).value);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleBack = () => {
    setActiveStep((currentActiveStep) => currentActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStep((currentActiveStep) => currentActiveStep + 1);
  };

  const handleWorkOrderSelectItem = (workOrder: any) => {
    if (selectedWorkOrders.includes(workOrder.id)) {
      setSelectedWorkOrders((currentSelectedWorkOrders) =>
        currentSelectedWorkOrders.filter((value) => value !== workOrder.id)
      );
    } else {
      setSelectedWorkOrders((currentSelectedWorkOrders) => [
        ...currentSelectedWorkOrders,
        workOrder.id,
      ]);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <Typography variant="h5">
              Please select from the available Work Orders
            </Typography>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={1} />
              <Grid item xs={11}>
                <List>
                  {workOrders &&
                    workOrders.map((workOrder: any) => {
                      return (
                        <ListItem
                          button
                          selected={selectedWorkOrders.includes(workOrder.id)}
                          onClick={() => handleWorkOrderSelectItem(workOrder)}
                        >
                          <ListItemText primary={workOrder.name} />
                        </ListItem>
                      );
                    })}
                </List>
              </Grid>
            </Grid>
          </React.Fragment>
        );
      case 1:
        return (
          <React.Fragment>
            <Typography variant="h5">
              Please select the Type of Download
            </Typography>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={1} />
              <Grid item xs={11}>
                <RadioGroup
                  aria-label="downloadType"
                  name="downloadType"
                  value={downloadTypeValue}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="report"
                    control={<Radio />}
                    label="Report Based - (This doesn't work yet)"
                  />
                  <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label="Custom"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <Typography variant="h5">
              Please select the Content to Download
            </Typography>
            <ContentDownloadList
              selectedWorkOrders={selectedWorkOrders}
              downloadType={downloadTypeValue}
            />
          </React.Fragment>
        );
    }
  };

  const renderStepButtons = (currentStep: number) => {
    return (
      <div style={{ margin: "8px", marginBottom: "16px" }}>
        <Button disabled={currentStep === 0} onClick={handleBack}>
          Back
        </Button>
        {currentStep !== steps.length - 1 && (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    );
  };

  if (isLoadingWorkOrders) {
    return <LinearProgress />;
  }

  if (isErrorWorkOrders) {
    return <ErrorMessage error={workOrdersError} />;
  }

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={11}>
            <Typography variant="h3">Client Deliverables</Typography>
          </Grid>
          <Grid item xs={1}>
            <BackButton />
          </Grid>
          <Grid xs={12}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography
                    style={{ marginTop: "16px", marginBottom: "16px" }}
                  >
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={handleReset}>Reset</Button>
                </div>
              ) : (
                <div>
                  {renderStepButtons(activeStep)}
                  {getStepContent(activeStep)}
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
