import React from "react";
import {
  Grid,
  useTheme,
  Paper,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";

import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  Cell,
} from "react-table";

import { TravelerModal } from "../../../common/travelerModal";
import { formatDate } from "../../../common/formatDate";
import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import { renderHeader } from "../../../common/util";

export const ProductivityTable = ({ logData }: any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        id: "Project",
        accessor: "project_number",
        filter: generalFilter,
      },
      {
        id: "BOM",
        accessor: "work_order_name",
        filter: generalFilter,
      },
      {
        id: "Serial",
        accessor: "serial_number",
        filter: generalFilter,
      },
      {
        id: "Procedure",
        accessor: "procedure_definition_name",
        filter: generalFilter,
      },
      {
        id: "Test Sequence",
        accessor: "test_sequence_definition_name",
        filter: generalFilter,
      },
      {
        id: "Characterization Point",
        accessor: "characterization_point",
        filter: generalFilter,
      },
      {
        id: "Result",
        accessor: "disposition_name",
        filter: generalFilter,
      },
      {
        id: "Operator",
        accessor: "username",
        filter: generalFilter,
      },
      {
        id: "Completion Time",
        accessor: "completion_date",
        filter: generalFilter,
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data: logData,
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

  const renderCell = (cell: Cell<object, any>, index: number) => {
    if (cell.column.Header === "Completion Time") {
      return (
        <Typography variant="body2" align="left">
          {formatDate(cell.value)}
        </Typography>
      );
    } else if (cell.column.Header === "Serial") {
      return <TravelerModal serialNumber={cell.value} />;
    } else {
      return cell.render("Cell");
    }
  };

  return (
    <TableContainer
      data-testid="tableContainer"
      style={{ overflowX: "hidden" }}
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
                        <Typography variant="subtitle2">
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
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {renderCell(cell, index)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
