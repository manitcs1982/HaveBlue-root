import React from "react";
import { Checkbox, LinearProgress, useTheme } from "@material-ui/core/";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useRowState,
  HeaderProps,
  Row,
} from "react-table";
import { Link } from "react-router-dom";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import { generalFilter, useDefaultColumn } from "../../../../../util/filter";
import { useReportTypes } from "../../../projectManagementQueries";
import { ErrorMessage } from "../../../../common/ErrorMessage";

export const WorkOrderReportAssignment = ({
  workOrderId,
}: {
  workOrderId: string;
}) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();
  const [reportTypesTableData, setReportTypesTableData] = React.useState<any>(
    []
  );
  const {
    data: reportTypesData,
    isError: isErrorReportTypes,
    isSuccess: isSuccessReportTypes,
    error: errorReportTypes,
    isLoading: isLoadingReportTypes,
  } = useReportTypes();

  React.useEffect(() => {
    if (isSuccessReportTypes && reportTypesData) {
      setReportTypesTableData(reportTypesData);
    }
  }, [isSuccessReportTypes, reportTypesData]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
        filter: generalFilter,
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
      {
        data: reportTypesTableData,
        columns,
        defaultColumn,
        initialState: {
          hiddenColumns: ["id"],
        },
      },

      useFilters,
      useGlobalFilter,
      useSortBy,
      useRowSelect,
      useRowState,
      (hooks) => {
        hooks.visibleColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
              <div>
                <Checkbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }: { row: Row<any> }) => (
              <div>
                <Checkbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    );

  if (isErrorReportTypes) {
    return <ErrorMessage error={errorReportTypes} />;
  }

  if (isLoadingReportTypes) {
    return (
      <div style={theme.containerMargin}>
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
      </div>
    );
  }

  return (
    <div style={theme.container}>
      <TableContainer
        data-testid="tableContainer"
        component={Paper}
        style={{ maxHeight: 440 }}
      >
        <MuiTable stickyHeader {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell>
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                      spacing={1}
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
    </div>
  );
};
