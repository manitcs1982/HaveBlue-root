import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useExpanded,
} from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import { formatDate } from "../../../common/formatDate";

import { MyUnits } from "./myProjectsUnitsTable";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

export const MyProjectsWorkOrderTable = ({ data = [] }: any) => {
  const defaultColumn = useDefaultColumn();

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }: any) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowUpIcon />
            )}
          </span>
        ),
      },
      {
        Header: "Work Order Name",
        accessor: "name",
        filter: generalFilter,
      },

      {
        Header: "Unit Count",
        accessor: "unit_count",
      },
      {
        Header: "Days Since Last Action",
        accessor: "last_action_days",
      },
      {
        Header: "Last Action Date",
        accessor: "last_action_date",
        Cell: ({ cell }: any) => {
          return (
            <Typography variant="body2"> {formatDate(cell.value)} </Typography>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, visibleColumns, headerGroups, rows, prepareRow } =
    useTable(
      {
        data: data,
        columns,
        defaultColumn,
        initialState: {
          hiddenColumns: ["id"],
        },
      },

      useFilters,
      useGlobalFilter,
      useSortBy,
      useExpanded
    );

  return (
    <>
      <TableContainer data-testid="tableContainer">
        <MuiTable {...getTableProps()}>
          <TableHead color="primary">
            {headerGroups.map((headerGroup) => (
              <TableRow
                style={{ backgroundColor: "#b3ecff" }}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <TableCell>
                    <Grid
                      container
                      direction="row"
                      /*justify="space-between"*/
                      alignItems="center"
                      spacing={0}
                    >
                      <Grid
                        item
                        xs={12}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        <Typography variant="subtitle1">
                          {column.render("Header")}
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </Typography>
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
                <>
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {row.isExpanded ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length}>
                        <MyUnits workOrderID={row.values.id} />
                      </TableCell>
                    </TableRow>
                  ) : null}
                </>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </>
  );
};
