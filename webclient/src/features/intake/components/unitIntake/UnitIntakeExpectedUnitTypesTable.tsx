import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { useTable, useSortBy } from "react-table";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/";

export const UnitIntakeExpectedUnitTypesTable = ({ data = [], activeUnitIntakeExpectedUnitTypeId, setUnitIntakeId, setUnitIntakeType }: any) => {
  const theme = useTheme();
  const columns = React.useMemo(
    () => [
      {
        Header: "Expected Unit Type Id",
        accessor: "id",
      },
      {
        Header: "Url",
        accessor: "url",
      },
      {
        Header: "Unit Type",
        accessor: "unit_type",
      },
      {
        Header: "Model",
        accessor: "model",
      },
      {
        Header: "Manufacturer",
        accessor: "manufacturer",
      },
      {
        Header: "Expected",
        accessor: "expected_count",
      },
      {
        Header: "Received",
        accessor: "received_count",
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data,
      columns,
      initialState: {
        hiddenColumns: ["id", "url", "unit_type"],
      },
    },
    useSortBy
  );
  return (
    <div style={theme.container}>
      <Typography variant="h3">Expected Unit Types</Typography>

      <TableContainer data-testid="tableContainer" component={Paper}>
        <MuiTable {...getTableProps()}>
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
                <TableRow
                  {...row.getRowProps()}
                  selected={
                    row.values.id === activeUnitIntakeExpectedUnitTypeId
                  }
                  onClick={() =>
                    {setUnitIntakeType(row.values.unit_type);
                    setUnitIntakeId(row.values.id);}
                  }
                  hover={true}
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
