import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import MuiLink from "@material-ui/core/Link";
import {
  useTable,
  useSortBy,
  useExpanded,
  useFilters,
  useGlobalFilter,
} from "react-table";
import Typography from "@material-ui/core/Typography";
import { Button, useTheme } from "@material-ui/core/";
import { Alert, AlertTitle } from "@material-ui/lab";
import { formatDate } from "../../../../common/formatDate";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useDefaultColumn } from "../../../../../util/filter";
import { WorkOrderUnitsCardDetailsTable } from "./WorkOrderUnitsCardDetailsTable";
import { Link, useHistory } from "react-router-dom";
import { BackButton } from "../../../../common/returnButton";

export const WorkOrdersCardDetailsTable = ({ data = [] }: any) => {
  const defaultColumn = useDefaultColumn();
  const history = useHistory();
  const theme = useTheme();
  const [currentWorkOrder, setCurrentWorkOrder] = React.useState(null);

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }: any) => {
          return (
            <div
              onClick={() => {
                if (currentWorkOrder) {
                  setCurrentWorkOrder(null);
                } else {
                  setCurrentWorkOrder(row.values.id);
                }
              }}
            >
              <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? (
                  <KeyboardArrowDownIcon
                    onClick={() => setCurrentWorkOrder(null)}
                  />
                ) : (
                  <KeyboardArrowUpIcon
                    onClick={() => setCurrentWorkOrder(row.values.id)}
                  />
                )}
              </span>
            </div>
          );
        },
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: any) => {
          return (
            <MuiLink
              component={Link}
              to={`${history.location.pathname}/edit/${row.values.id}`}
            >
              {row.values.name}
            </MuiLink>
          );
        },
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

  const openNewWorkOrderForm = () => {
    history.push(`${history.location.pathname}/add`);
  };

  return (
    <div style={theme.container}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={10}>
          <Typography variant="h3">Work Orders</Typography>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={openNewWorkOrderForm} style={theme.btnNew}>
            New
          </Button>
        </Grid>
        <Grid item xs={1}>
          <BackButton />
        </Grid>
      </Grid>
      {!data.length && (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No Work Orders Available</strong>
        </Alert>
      )}
      {data.length > 0 && (
        <TableContainer
          data-testid="tableContainer"
          style={theme.tableContainer}
        >
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
                          <Typography variant="h6">
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
                          <WorkOrderUnitsCardDetailsTable
                            workOrderId={row.values.id}
                            workOrderName={row.values.name}
                          />
                        </TableCell>
                      </TableRow>
                    ) : null}
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
