import React from "react";
import {
  useCustomerDetails,
  useProjectDetails,
} from "../../projectManagementQueries";
import { ProjectsTable } from "./ProjectsTable";
import { WorkOrdersDashboard } from "./workOrders";

import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  LinearProgress,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { useCustomerDetailsContext } from "../../../common/CustomerDetailsContext";
import { ErrorMessage } from "../../../common/ErrorMessage";

export const CustomerDetailsPage = () => {
  const { customerId } = useParams() as {
    customerId: string;
  };
  const theme = useTheme();
  const {
    data: customerDetailsData,
    error: errorCustomerDetails,
    isLoading: isLoadingCustomerDetails,
    isError: isErrorCustomerDetails,
  } = useCustomerDetails(customerId);

  const history = useHistory();
  const { state, dispatch } = useCustomerDetailsContext();
  React.useEffect(() => {
    if (customerDetailsData?.id && customerDetailsData?.url) {
      dispatch({
        type: "CUSTOMER_SELECTED",
        payload: {
          customerId: customerDetailsData.id,
          customerUrl: customerDetailsData.url,
        },
      });
    }
  }, [customerDetailsData, dispatch, customerId]);

  const {
    data: projectDetailsData,
    error: errorProjectDetails,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
    isSuccess: isSuccessProjectDetails,
  } = useProjectDetails(state.activeProjectId);

  if (isLoadingProjectDetails || isLoadingCustomerDetails) {
    return (
      <Backdrop open={isLoadingProjectDetails || isLoadingCustomerDetails}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (isErrorProjectDetails || isErrorCustomerDetails) {
    return (
      <>
        {isErrorProjectDetails && <ErrorMessage error={errorProjectDetails} />}
        {isErrorCustomerDetails && (
          <ErrorMessage error={errorCustomerDetails} />
        )}
      </>
    );
  }

  const openEditCustomerForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    history.push(`/project_management/customer/edit/${customerId}`);
  };

  return (
    <Container>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={11}>
          <Typography variant="h5">
            {customerDetailsData.name} details
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            style={{ textAlign: "right" }}
            variant="contained"
            color="primary"
            onClick={openEditCustomerForm}
          >
            Edit
          </Button>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={4}
            >
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" style={theme.monospacedText}>
                  Customer Name:{customerDetailsData.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" style={theme.monospacedText}>
                  Short Name:{customerDetailsData.short_name}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <ProjectsTable data={customerDetailsData.project_set} />
      {isLoadingProjectDetails && (
        <Container>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={theme.container}
          >
            <Grid item xs={12} spacing={10}>
              <LinearProgress />
            </Grid>
          </Grid>
        </Container>
      )}

      {state.activeProjectId && isSuccessProjectDetails && (
        <WorkOrdersDashboard data={projectDetailsData} />
      )}
    </Container>
  );
};
