import React from "react"
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useExpanded,
  usePagination
} from "react-table";

import MaUTable from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import { makeStyles } from "@material-ui/core/styles";

import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import { TravelerModal } from "../../../common/travelerModal";

const useStyles = makeStyles(() => ({
  table: {
    maxHeight: "700px"
  }
}))

export const StressReadyTable = (stressData: any) => {
  const classes = useStyles();
  const defaultColumn = useDefaultColumn();

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Serial Number",
        accessor: "serial_number",
        filter: generalFilter,
        Cell: ({ cell } : any) => {
          return (<TravelerModal serialNumber={cell.value} />)
        }
      },
      {
        Header: "Test Sequence",
        accessor: "test_sequence",
        filter: generalFilter
      },
      {
        Header: "Project Number",
        accessor: "project_number",
        filter: generalFilter
      },
      {
        Header: "Work Order",
        accessor: "work_order",
        filter: generalFilter
      },
      {
        Header: "Characterization",
        accessor: "characterization",
        filter: generalFilter
      },
    ],
    []
  );

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable({
    columns,
    data: stressData.stressData,
    defaultColumn,
    initialState: {
      hiddenColumns: ["id"],
    },
  },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );

  return (
    <Container>
      <TableContainer data-testid="tableContainer" className={classes.table}>
        <MaUTable stickyHeader {...getTableProps()}>
          <TableHead className={classes.table}>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell {...column.getHeaderProps()}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={0}
                    ></Grid>
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
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row) => {
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
        </MaUTable>
      </TableContainer>
      <div>
        <Button
          variant="outlined"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </Button>{" "}
        <Button
          variant="outlined"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </Button>{" "}
        <Button
          variant="outlined"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </Button>{" "}
        <Typography variant="body1" component="span" gutterBottom>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Typography>
        <Typography variant="body1" component="span" gutterBottom>
          | Go to page:{" "}
        </Typography>
        <TextField
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          style={{ width: "100px" }}
        />{" "}
        <Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <MenuItem key={pageSize} value={pageSize}>
              Show {pageSize}
            </MenuItem>
          ))}
        </Select>
      </div>
    </Container>
  )
}
