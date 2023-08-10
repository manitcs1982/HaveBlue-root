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

import { Button } from "@material-ui/core";
import PrintIcon from '@material-ui/icons/Print';

import { TravelerModal } from "../../../common/travelerModal";
import { LabelButton } from "./Unitprintbutton";

export const UnitIntakeArrivedUnitsTable = ({ data = [] }: any) => {
  const theme = useTheme();
  const columns = React.useMemo(
    () => [
      {
        Header: "Unit Arrived Id",
        accessor: "id",
      },
      {
        Header: "Serial Number",
        accessor: "serial_number",
        Cell: ({ cell } : any) => {
          return (
            <TravelerModal serialNumber={cell.value} />
          )
        }
      },
      {
        Header: "Manufacturer",
        accessor: "manufacturer",
      },
      {
        Header: "Model",
        accessor: "model",
      },
      {
        Header: "Test Sequence",
        accessor: "assigned_test_sequence_name",
        Cell: ({ row } : any) => {
          if (row.values.assigned_test_sequence_name === null) {
            return (
              <Typography variant="body2" align="center" style={{color:"grey"}}>
                N/A
              </Typography>
            )
          } else {
          return (
            <Typography variant="body2" align="center">
              {row.values.assigned_test_sequence_name}
            </Typography>
          )}
        }
      },
      {
        Header: "Location",
        accessor: "location_name",
      },
      {
        Header: "Print",
        Cell: ({ row } : any) => {
          return (
            <LabelButton unitID={row.values.id} />
          )
        }
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data,
      columns,
      initialState: {
        hiddenColumns: ["id"],
      },
    },
    useSortBy
  );
  return (
    <div style={theme.container}>
      <Typography variant="h3">Arrived Units</Typography>

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
