import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import { LinearProgress } from "@material-ui/core/";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { useDefaultColumn } from "../../../../util/filter";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { TravelerModal } from "../../../common/travelerModal";
import { useMyUnits } from "../../projectQueries";
import { formatDate } from "../../../common/formatDate";

export const MyUnits = ({ workOrderID }: any) => {
  const defaultColumn = useDefaultColumn();

  const [tableData, setTableData] = React.useState<any>([]);

  const { data, error, isLoading, isError, isSuccess } =
    useMyUnits(workOrderID);

  React.useEffect(() => {
    if (isSuccess) {
      setTableData(data.units);
    }
  }, [data, isSuccess]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Serial Number",
        accessor: "serial_number",
        Cell: ({ cell }: any) => {
          return <TravelerModal serialNumber={cell.value} />;
        },
      },
      {
        Header: "Assigned Sequence",
        accessor: "assigned_test_sequence_name",
      },
      {
        Header: "Project Weight",
        accessor: "project_weight",
      },
      {
        Header: "Percent Complete",
        accessor: "percent_complete",
        Cell: ({ cell }: any) => {
          if (cell.value !== null && cell.value !== undefined) {
            return (
              <Typography variant="body2">
                {" "}
                {cell.value.toFixed(2)}%{" "}
              </Typography>
            );
          } else {
            return <Typography variant="body2"> 0% </Typography>;
          }
        },
      },
      {
        Header: "Revenue",
        Cell: ({ row }: any) => {
          const revenue =
            (row.values.project_weight * row.values.percent_complete) /
            row.values.project_weight;
          return <Typography variant="body2"> {revenue || ""} </Typography>;
        },
      },
      {
        Header: "Current Execution Group",
        accessor: "execution_group_name",
      },
      {
        Header: "Last Fixture",
        accessor: "fixture_location_name",
      },
      {
        Header: "Last Action Date",
        accessor: "last_action_date",
        Cell: ({ cell }: any) => {
          if (cell.value !== null && cell.value !== undefined) {
            return (
              <Typography variant="body2">
                {" "}
                {formatDate(cell.value)}{" "}
              </Typography>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Days since last action",
        accessor: "last_action_days",
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data: tableData,
      columns,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id", "project_weight"],
      },
    },

    useFilters,
    useGlobalFilter,
    useSortBy
  );

  if (isLoading) {
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      </Grid>
    );
  }

  if (isError) {
    return <>{isError && <ErrorMessage error={error} />}</>;
  }

  return (
    <>
      <TableContainer data-testid="tableContainer">
        <MuiTable {...getTableProps()} size="small">
          <TableHead style={{ backgroundColor: "#e6e6e6" }}>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
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
    </>
  );
};
