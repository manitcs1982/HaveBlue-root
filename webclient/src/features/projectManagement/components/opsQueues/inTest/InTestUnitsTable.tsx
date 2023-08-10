import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import { LinearProgress } from "@material-ui/core/";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useExpanded,
} from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { generalFilter, useDefaultColumn } from "../../../../../util/filter";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { TravelerModal } from "../../../../common/travelerModal";
import { useUnitsByAssetId } from "../opsQueuesQueries";

export const InTestUnitsTable = ({ assetId }: any) => {
  const defaultColumn = useDefaultColumn();

  const { data = [], error, isLoading, isError } = useUnitsByAssetId(assetId);

  const columns = React.useMemo(
    () => [
      {
        Header: "Serial Number",
        accessor: "serial_number",
        filter: generalFilter,
        Cell: ({ cell }: any) => {
          return <TravelerModal serialNumber={cell.value} />;
        },
      },
      {
          Header: "Customer",
          accessor: "customer",
          filter: generalFilter,
      },
      {
        Header: "Project",
        accessor: "project_number",
        filter: generalFilter,
      },
      {
        Header: "Work Order",
        accessor: "work_order",
        filter: generalFilter,
      },
      {
        Header: "Execution Group",
        accessor: "execution_group_name",
      },
      {
        Header: "Test Sequence",
        accessor: "test_sequence",
      },
      {
        Header: "End (ETA)",
        accessor: "eta_datetime",
        filter: generalFilter,
      },
      ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
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
    return <ErrorMessage error={error} />;
  }

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
                </>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </>
  );
};
