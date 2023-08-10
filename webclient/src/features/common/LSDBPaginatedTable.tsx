import {
  Column,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useDefaultColumn } from "../../util/filter";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@material-ui/core";
import MuiTable from "@material-ui/core/Table";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { includes } from "lodash";
import { renderHeader } from "./util";

const LSDBPaginatedTable = ({
  columns,
  data = [],
  hiddenColumns = [],
  noGeneralFilterColumns = [],
}: {
  columns: Column<object>[];
  data: any;
  hiddenColumns?: string[];
  noGeneralFilterColumns?: string[];
}) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    pageOptions,
    pageCount,
    page,
    state: { pageIndex },
    previousPage,
    gotoPage,
    nextPage,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        hiddenColumns: hiddenColumns,
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <TableContainer component={Paper}>
        <MuiTable stickyHeader {...getTableProps}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps({
                      style: {
                        minWidth: column.minWidth,
                        width: column.width,
                        maxWidth: column.maxWidth,
                      },
                    })}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={0}
                    >
                      <Grid item xs={12} {...column.getHeaderProps()}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          spacing={0}
                        >
                          <Typography variant="subtitle2">
                            {renderHeader(column)}
                          </Typography>
                          {column.canFilter ? column.render("Filter") : null}
                          <Grid item xs={2}>
                            <IconButton
                              type="submit"
                              aria-label="search"
                              size="small"
                              {...column.getSortByToggleProps()}
                            >
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <ArrowDropDownIcon />
                                ) : (
                                  <ArrowDropUpIcon />
                                )
                              ) : (
                                !includes(
                                  noGeneralFilterColumns,
                                  column.id
                                ) && <CallSplitIcon />
                              )}
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <>
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                </>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <div style={{ display: "inline-block", padding: "0.5rem" }}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <NavigateBefore />
          <NavigateBefore />
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <NavigateBefore />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <NavigateNext />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <NavigateNext />
          <NavigateNext />
        </Button>{" "}
        {pageOptions.length > 0 && (
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
        )}
      </div>
    </>
  );
};

export default LSDBPaginatedTable;
