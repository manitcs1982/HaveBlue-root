import React from "react";
import { useCustomers } from "../../projectManagementQueries";
import { CustomerTable } from "./CustomerTable";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ErrorMessage } from "../../../common/ErrorMessage";

export const CustomersPage = () => {
  const { data, error, isLoading, isFetching, isError, isSuccess } =
    useCustomers();
  const history = useHistory();
  const [customerTableData, setCustomerTableData] = React.useState([]);

  React.useEffect(() => {
    if (isSuccess) {
      setCustomerTableData(data);
    }
  }, [isSuccess, data]);

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  const openNewCustomerForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    history.push("customer/add");
  };

  return (
    <Container>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3">Customers</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={openNewCustomerForm}
          >
            New
          </Button>
        </Grid>
      </Grid>
      <CustomerTable data={customerTableData} />
      {isFetching ? (
        <Typography variant="body2">Refreshing...</Typography>
      ) : null}
    </Container>
  );
};
