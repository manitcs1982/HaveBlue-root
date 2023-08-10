import React from "react";
import {
  Container,
  ListItemSecondaryAction,
  Paper,
  Typography,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MuiLink from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { useHistory, useParams } from "react-router-dom";
import { useUnitTypeDetails } from "../../projectManagementQueries";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { ErrorMessage } from "../../../common/ErrorMessage";

const useStylesF = makeStyles((theme) => ({
  rbBorder: {
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
    borderBottomStyle: "solid",
    borderWidth: "1px",
  },
  baseBorder: {
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
    borderBottomStyle: "solid",
    borderWidth: "1px",
  },
  rBorder: {
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
    borderWidth: "1px",
  },
  smBorder: {
    borderBottomStyle: "dotted",
    borderWidth: "1px",
  },
}));

export const DetailsUnitTypePage = () => {
  const classesF = useStylesF();
  let classes = classesF;
  const theme = useTheme();
  const history = useHistory();
  const { unitTypeId } = useParams() as {
    unitTypeId: string;
  };
  const {
    data: unitTypeDetailsData,
    error: errorUnitTypeDetails,
    isLoading: isLoadingUnitTypeDetails,
    isError: isErrorUnitTypeDetails,
  } = useUnitTypeDetails(unitTypeId);

  console.log(unitTypeDetailsData);

  if (window.innerWidth < 960) {
  } else if (window.innerWidth >= 960 && window.innerWidth >= 960) {
  } else {
  }

  if (isLoadingUnitTypeDetails) {
    return (
      <Backdrop open={isLoadingUnitTypeDetails}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (isErrorUnitTypeDetails) {
    return <ErrorMessage error={errorUnitTypeDetails} />;
  }

  const openEditUnitTypePage = (event: React.SyntheticEvent) =>
    history.push(`/engineering/unit_type/${unitTypeId}/edit`);

  const openAddDatasheetsPage = (event: React.SyntheticEvent) =>
    history.push(`/engineering/unit_type/${unitTypeId}/add_datasheets`);

  const openDeleteDatasheetsPage = (event: React.SyntheticEvent) =>
    history.push(`/engineering/unit_type/${unitTypeId}/delete_datasheets`);

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={11}>
            <Typography variant="h4">Unit Type</Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" onClick={openEditUnitTypePage}>
              Edit
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <div style={theme.containerPadding}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={4}>
                        <Typography variant="body2">Manufacturer:</Typography>
                      </Grid>
                      <Grid item sm={8}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.manufacturer_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Model:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.model}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960 ? classes.rBorder : undefined
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">
                          Unit Type Family:
                        </Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.unit_type_family_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Cell Properties</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <div style={theme.containerPadding}>
                <Grid container direction="row" alignItems="center" spacing={4}>
                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">
                          Number of Cells:
                        </Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.number_of_cells}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Nameplate Pmax:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.nameplate_pmax}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.baseBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Module Width:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.module_width}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Module Height:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.module_height}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">System Voltage:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.system_voltage}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.baseBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Auditor:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.auditor}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Audit Date:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.audit_date}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">
                          Audit Report Id:
                        </Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.audit_report_id}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.baseBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">ISC:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.isc}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">VOC:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.voc}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">IMP:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.imp}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.baseBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">VMP:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.vmp}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Alpha ISC:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.alpha_isc}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Beta VOC:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.beta_voc}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.baseBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Gamma PMP:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.gamma_pmp}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">
                          Cells in series:
                        </Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.cells_in_series}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">
                          Cells in parallel:
                        </Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {
                            unitTypeDetailsData.module_property
                              .cells_in_parallel
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.baseBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Cell area:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.cell_area}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960
                        ? classes.rbBorder
                        : classes.smBorder
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">
                          Module technology:
                        </Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {
                            unitTypeDetailsData.module_property
                              .module_technology_name
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={12}
                    className={
                      window.innerWidth >= 960 ? classes.rbBorder : undefined
                    }
                  >
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="body2">Bifacial:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="body2" align="right">
                          {unitTypeDetailsData.module_property.bifacial !==
                          null ? (
                            unitTypeDetailsData.module_property.bifacial ? (
                              <Typography variant="body2">True</Typography>
                            ) : (
                              <Typography variant="body2">False</Typography>
                            )
                          ) : (
                            <Typography variant="body2">N/A</Typography>
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h4">Datasheets</Typography>
          </Grid>
          {unitTypeDetailsData.datasheets.length > 0 && (
            <Grid item xs={1}>
              <Button
                variant="contained"
                style={theme.btnError}
                onClick={openDeleteDatasheetsPage}
              >
                Remove
              </Button>
            </Grid>
          )}
          <Grid item xs={1}>
            <Button variant="contained" onClick={openAddDatasheetsPage}>
              Add
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <div style={theme.containerPadding}>
                {unitTypeDetailsData.datasheets.length > 0 ? (
                  <List component="nav" aria-label="secondary mailbox folders">
                    {unitTypeDetailsData.datasheets.map((datasheet: any) => (
                      <ListItem>
                        <ListItemText primary={datasheet.name}></ListItemText>
                        <ListItemSecondaryAction>
                          <MuiLink href={datasheet.file} component={IconButton}>
                            <CloudDownloadIcon />
                          </MuiLink>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="h4">No datasheets available</Typography>
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
