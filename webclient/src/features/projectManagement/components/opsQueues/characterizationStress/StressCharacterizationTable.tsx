import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Grid from "@material-ui/core/Grid";
import { IconButton, useTheme } from "@material-ui/core";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import Typography from "@material-ui/core/Typography";
import { TravelerModal } from "../../../../common/travelerModal";
import { Alert, AlertTitle } from "@material-ui/lab";
import { generalFilter, useDefaultColumn } from "../../../../../util/filter";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { renderHeader } from "../../../../common/util";

export const StressCaracterizationTable = ({ data = [] }) => {
  const theme = useTheme();

  const defaultColumn = useDefaultColumn();
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        id: "Serial Number",
        accessor: "serial_number",
        filter: generalFilter,
        Cell: ({ cell }: any) => {
          return <TravelerModal serialNumber={cell.value} />;
        },
      },
      {
        id: "Test Sequence",
        accessor: "test_sequence",
        filter: generalFilter,
      },
      // {
      //   id: "Procedure Definition",
      //   accessor: "procedure_definition",
      //   filter: generalFilter,
      // },
      {
        id: "Customer",
        accessor: "customer",
        filter: generalFilter,
      },
      {
        id: "Project Number",
        accessor: "project_number",
        filter: generalFilter,
      },
      {
        id: "Work Order",
        accessor: "work_order",
        filter: generalFilter,
      },
      {
        id: "Execution Group Name",
        accessor: "characterization",
        filter: generalFilter,
      },
      {
        id: "Days since last action",
        accessor: "last_action_days",
        filter: generalFilter,
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data,
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

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      {!data.length && (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No procedures Available</strong>
        </Alert>
      )}
      {data.length > 0 && (
        <>
          <Grid item xs={12}>
            <TableContainer
              data-testid="tableContainer"
              style={theme.tableContainer}
            >
              <MuiTable {...getTableProps()}>
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
                                <Typography variant="subtitle2">
                                  {renderHeader(column)}
                                </Typography>
                                {column.canFilter
                                  ? column.render("Filter")
                                  : null}
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
                      <TableRow {...row.getRowProps()}>
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
          </Grid>
        </>
      )}
    </Grid>
  );
};
