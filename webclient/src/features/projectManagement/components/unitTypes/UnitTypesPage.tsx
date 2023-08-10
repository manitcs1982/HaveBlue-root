import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { IconButton, useTheme } from "@material-ui/core/";
import { Alert, AlertTitle } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { renderHeader } from "../../../common/util";

import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useUnitTypes } from "../../projectManagementQueries";
import { useHistory } from "react-router-dom";
import { ErrorMessage } from "../../../common/ErrorMessage";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const UnitTypesPage = () => {
  const theme = useTheme();
  const history = useHistory();
  const defaultColumn = useDefaultColumn();
  const [unitTypesTableData, setUnitTypesTableData] = React.useState([]);
  const {
    data: unitTypesData,
    error: errorUnitTypes,
    isLoading: isLoadingUnitTypes,
    isError: isErrorUnitTypes,
    isSuccess: isSuccessUnitTypes,
  } = useUnitTypes();

  React.useEffect(() => {
    if (isSuccessUnitTypes && unitTypesData) {
      setUnitTypesTableData(unitTypesData);
    }
  }, [isSuccessUnitTypes, unitTypesData]);

  const [selectedUnitType, setSelectedUnitType] = React.useState(null);
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        id: "Manufacturer",
        accessor: "manufacturer_name",
        filter: generalFilter,
      },

      {
        id: "Model",
        accessor: "model",
        filter: generalFilter,
      },
      {
        id: "Bom",
        accessor: "bom",
        filter: generalFilter,
      },
      {
        id: "Description",
        accessor: "description",
        filter: generalFilter,
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data: unitTypesTableData,
      columns,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id"],
      },
    },

    useFilters,
    useGlobalFilter,
    useSortBy
  );

  if (isLoadingUnitTypes) {
    return (
      <Backdrop open={isLoadingUnitTypes}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (isErrorUnitTypes) {
    return <>{isErrorUnitTypes && <ErrorMessage error={errorUnitTypes} />}</>;
  }

  if (!unitTypesData.length) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        <strong>No unit types Available</strong>
      </Alert>
    );
  }

  const openNewUnitTypesForm = () => {
    history.push(`/engineering/unit_type/new`);
  };

  const openDetailsUnitTypesForm = () => {
    history.push(`/engineering/unit_type/${selectedUnitType}`);
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
          <Typography variant="h5">Unit Types</Typography>
        </Grid>
        <Grid item xs={1}>
          {selectedUnitType && (
            <Button
              style={{ textAlign: "right" }}
              variant="contained"
              color="primary"
              onClick={openDetailsUnitTypesForm}
            >
              Details
            </Button>
          )}
        </Grid>
        <Grid item xs={1}>
          <Button
            style={{ textAlign: "right" }}
            variant="contained"
            color="primary"
            onClick={openNewUnitTypesForm}
          >
            New
          </Button>
        </Grid>
      </Grid>

      <TableContainer
        data-testid="tableContainer"
        style={theme.tableContainer}
        component={Paper}
      >
        <MuiTable stickyHeader {...getTableProps()} size="small">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell style={theme.noLeftRightPadding}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={0}
                    >
                      <Grid item xs={12} {...column.getHeaderProps()}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          spacing={0}
                        >
                          <Typography variant="subtitle1">
                            {renderHeader(column)}
                          </Typography>
                          {column.canFilter ? column.render("Filter") : null}
                          <Grid item xs={2}>
                            <IconButton
                              type="submit"
                              aria-label="search"
                              size="small"
                              {...column.getSortByToggleProps()}
                            >
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <ArrowDropDownIcon />
                                ) : (
                                  <ArrowDropUpIcon />
                                )
                              ) : (
                                <CallSplitIcon />
                              )}
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  selected={row.values.id === selectedUnitType}
                  onClick={() => {
                    if (selectedUnitType === row.values.id) {
                      setSelectedUnitType(null);
                    } else {
                      setSelectedUnitType(row.values.id);
                    }
                  }}
                >
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </div>
  );
};
