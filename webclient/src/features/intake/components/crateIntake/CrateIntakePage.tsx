import {
  Typography,
  Container,
  Button,
  Grid,
  Backdrop,
  CircularProgress,
  useTheme,
  Link as MuiLink,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { useCrates } from "../../intakeQueries";
import { generalFilter } from "../../../../util/filter";

import { Link } from "react-router-dom";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { LSDBCoreTable } from "../../../common/LSDBCoreTable";

export const CrateIntakePage = () => {
  const theme = useTheme();

  const history = useHistory();

  const columns = [
    {
      id: "Crate Id",
      accessor: "id",
    },
    {
      id: "Crate Name",
      accessor: "name",
      Cell: ({ row }: any) => {
        return (
          <MuiLink
            component={Link}
            to={`/operations/intake/crate/edit/${row.values["Crate Id"]}`}
          >
            {row.values["Crate Name"]}
          </MuiLink>
        );
      },
      filter: generalFilter,
    },
    {
      id: "Disposition",
      accessor: "disposition_name",
      filter: generalFilter,
    },
    {
      id: "Shipped By",
      accessor: "shipped_by_name",
      filter: generalFilter,
    },
  ];

  const { error, data, isLoading, isError } = useCrates();

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

  const openNewCrateForm = () => {
    history.push(`/operations/intake/crate/new`);
  };

  return (
    <div style={theme.container}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={10}>
          <Typography variant="h5">Crates</Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            style={{ textAlign: "right" }}
            variant="contained"
            color="primary"
            onClick={openNewCrateForm}
          >
            New
          </Button>
        </Grid>
      </Grid>

      <LSDBCoreTable data={data} columns={columns} />
    </div>
  );
};
