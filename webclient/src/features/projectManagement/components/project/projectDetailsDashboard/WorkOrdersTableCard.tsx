import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useExpanded,
} from "react-table";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useDefaultColumn } from "../../../../../util/filter";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Typography } from "@material-ui/core";

export const WorkOrdersTableCard = ({ data = [] }: any) => {
  const defaultColumn = useDefaultColumn();
  const history = useHistory();

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: any) => {
          return (
            <MuiLink
              component={Link}
              to={`${history.location.pathname}/work_orders/edit/${row.values.id}`}
            >
              {row.values.name}
            </MuiLink>
          );
        },
      },
      {
        Header: "Unit Count",
        accessor: "unit_count",
      },
      {
        Header: "Percent Complete",
        accessor: "percent_complete",
        Cell: ({ cell }: any) => {
          return (
            <Typography variant="body2"> {cell.value.toFixed(2)}% </Typography>
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
    <div>
      {!data.length && (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No Work Orders Available</strong>
        </Alert>
      )}
      {data.length > 0 && (
        <TableContainer data-testid="tableContainer" style={{ maxHeight: 150 }}>
          <MuiTable
            {...getTableProps()}
            style={{ minWidth: 20 }}
            padding="none"
            size="small"
          >
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
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
                  </>
                );
              })}
            </TableBody>
          </MuiTable>
        </TableContainer>
      )}
    </div>
  );
};
