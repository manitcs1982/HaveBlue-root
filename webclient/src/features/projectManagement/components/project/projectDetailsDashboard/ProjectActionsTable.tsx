import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { EditableCell } from "../../../../common/EditableCell";

import CloudOffIcon from "@material-ui/icons/CloudOff";
import CloudDoneIcon from "@material-ui/icons/CloudDone";

import { useDefaultColumn } from "../../../../../util/filter";
import { Cell, useExpanded, useSortBy, useTable } from "react-table";
import moment from "moment";
import { useUpdateActionDate } from "../../../projectManagementMutations";
import { toast } from "react-toastify";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../../../common/AuthContext";

export const ProjectActionsTable = ({ reports = [] }: any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();
  const {
    mutateAsync: mutatePostActionDate,
    isLoading: isLoadingPostActionDate,
  } = useUpdateActionDate();
  const { dispatch } = useAuthContext();
  const history = useHistory();

  const updateDate = React.useCallback(
    async (id: string, key: string, value: string, setValue: Function) => {
      try {
        await mutatePostActionDate({ id, key, value });

        toast.success("Date was succesfully created");
        setValue(value);
      } catch (error) {
        toast.error("Error while updating date");
        processErrorOnMutation(error, dispatch, history);
      }
    },
    [dispatch, history, mutatePostActionDate]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        id: "order",
        Header: "Order",
        accessor: "execution_group",
      },
      {
        Header: "Disposition",
        accessor: "disposition__name",
      },
      {
        Header: "Start Date",
        accessor: "start_datetime",
      },

      {
        Header: "Promise Date",
        accessor: "promise_datetime",

        Cell: ({ cell, row }: { cell: Cell; row: any }) => {
          return (
            <EditableCell
              id={row.original.id}
              initialValue={
                cell.value !== null
                  ? moment(cell.value).format("YYYY-MM-DD")
                  : null
              }
              type="promise_datetime"
              onUpdate={updateDate}
            />
          );
        },
      },
      {
        Header: "Eta Date",
        accessor: "eta_datetime",

        Cell: ({ cell, row }: { cell: Cell; row: any }) => {
          return (
            <EditableCell
              id={row.original.id}
              initialValue={
                cell.value !== null
                  ? moment(cell.value).format("YYYY-MM-DD")
                  : null
              }
              type="eta_datetime"
              onUpdate={updateDate}
            />
          );
        },
      },
      {
        Header: "Delivery Date",
        accessor: "done_datetime",

        Cell: ({ cell, row }: { cell: Cell; row: any }) => {
          return (
            <EditableCell
              id={row.original.id}
              initialValue={
                cell.value !== null
                  ? moment(cell.value).format("YYYY-MM-DD")
                  : null
              }
              type="done_datetime"
              onUpdate={updateDate}
            />
          );
        },
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Data Ready?",
        Cell: ({ row }: any) =>
          row.original.completion_criteria[0].criteria_completed === true ? (
            <CloudDoneIcon />
          ) : (
            <CloudOffIcon />
          ),
      },
    ],
    [updateDate]
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data: reports,
      columns,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id"],
        sortBy: [
          {
            id: "order",
            desc: false,
          },
        ],
      },
    },

    useSortBy,
    useExpanded
  );

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid xs={12}>
        <TableContainer
          data-testid="tableContainer"
          style={theme.tableContainer}
        >
          <MuiTable {...getTableProps()}>
            <TableHead color="primary">
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell>
                      <Grid
                        container
                        direction="row"
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
                        <Grid item xs={12}>
                          {column.canFilter ? column.render("Filter") : null}
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
    </Grid>
  );
};
