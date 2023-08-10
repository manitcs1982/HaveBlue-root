import React from "react";
import { useTheme } from "@material-ui/core/";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useTable } from "react-table";
import Typography from "@material-ui/core/Typography";
import { useStressEntryContext } from "./StressEntryContext";
import { STRESSOR_CHECK_IN_MODE } from "./constants";
import { useUnitCheckerColumns } from "./unitCheckerColumns";

export const UnitChecker = () => {
  const theme = useTheme();
  const { state, dispatch } = useStressEntryContext();
  const {
    ID,
    DELETE,
    METADATA,
    MODEL,
    NAME,
    PROCEDURE_TYPE,
    SERIAL_NUMBER,
  } = useUnitCheckerColumns();

  const stressorColumns = React.useMemo(
    () =>
      state.mode === STRESSOR_CHECK_IN_MODE
        ? [ID, SERIAL_NUMBER, MODEL, PROCEDURE_TYPE, NAME, METADATA, DELETE]
        : [ID, SERIAL_NUMBER, MODEL, NAME, METADATA, DELETE],
    [dispatch, state.checkedUnitsTable]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable({
    data: state.checkedUnitsTable,
    initialState: {
      hiddenColumns: ["id"],
    },
    columns: stressorColumns,
  });

  if (!state.checkedUnitsTable.length) {
    return null;
  }

  return (
    <>
      <Typography variant="h5">
        {state.mode === STRESSOR_CHECK_IN_MODE
          ? `Checked in units:${state.checkedUnitsTable.length}`
          : `Checked out units:${state.checkedUnitsTable.length}`}
      </Typography>
      <Paper style={{ marginTop: 32 }}>
        <TableContainer
          data-testid="tableContainer"
          style={theme.tableContainer}
        >
          <MuiTable stickyHeader {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell {...column.getHeaderProps()}>
                      <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Grid item xs={12} {...column.getHeaderProps()}>
                          <Typography variant="h6">
                            {column.render("Header")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
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
      </Paper>
    </>
  );
};
