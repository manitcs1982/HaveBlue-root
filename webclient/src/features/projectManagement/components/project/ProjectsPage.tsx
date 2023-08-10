import React from "react";
import {
  useDownloadProjects,
  useDownloadableProjects,
} from "../../projectQueries";
import {
  Typography,
  Button,
  Grid,
  useTheme,
  IconButton,
} from "@material-ui/core";
import {
  useTable,
  useSortBy,
  HeaderProps,
  useFilters,
  useRowSelect,
  useGlobalFilter,
  Row,
  usePagination,
} from "react-table";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Alert, AlertTitle } from "@material-ui/lab";
import { generalFilter, useDefaultColumn } from "../../../../util/filter";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { renderHeader } from "../../../common/util";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export const ProjectsPage = () => {
  const theme = useTheme();
  const [projectGridData, setProjectGridData] = React.useState([]);
  const {
    data: projectData,
    isLoading: isLoadingDownloadableProjects,
    isFetching,
    isError: isErrorDownloadableProjects,
    error: errorDownloadableProjects,
    isSuccess: isSuccessDownloadableProjects,
  } = useDownloadableProjects();

  const [selectedProjectIds, setSelectedProjectIds] = React.useState("");
  const [imageAdjust, setImageAdjust] = React.useState(false);
  const {
    error: errorDownloadedData,
    isError: isErrorDownloadedData,
    isLoading: isLoadingDownloadedData,
    refetch: refetchDownload,
  } = useDownloadProjects(selectedProjectIds, imageAdjust);

  React.useEffect(() => {
    if (isSuccessDownloadableProjects && projectData) {
      setProjectGridData(projectData);
    }
  }, [isSuccessDownloadableProjects, projectData]);

  const handleChange = (event: any) => {
    setImageAdjust(event.target.checked);
  };

  //Work in progress.
  const downloadZip = async () => {
    const unitIds = selectedFlatRows
      .map((d) => d.original)
      .map((row: any) => row.id);

    if (unitIds.length === 1) {
      setSelectedProjectIds(unitIds[0]);
    } else if (unitIds.length > 1) {
      setSelectedProjectIds(unitIds.join(","));
    }

    if (unitIds.length !== 0) {
      await refetchDownload();
    }
  };

  const defaultColumn = useDefaultColumn();

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        id: "Url",
        accessor: "url",
      },
      {
        id: "Customer",
        accessor: "customer_name",
        filter: generalFilter,
      },
      {
        id: "Project Number",
        accessor: "project_number",
        filter: generalFilter,
      },

      {
        id: "BOM",
        accessor: "name",
        filter: generalFilter,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      data: projectGridData,

      columns,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id", "url"],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
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

  if (isLoadingDownloadableProjects || isLoadingDownloadedData) {
    return (
      <Backdrop open={isLoadingDownloadableProjects || isLoadingDownloadedData}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!projectData.length) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        <strong>No Projects Available</strong>
      </Alert>
    );
  }

  if (isErrorDownloadableProjects || isErrorDownloadedData) {
    return (
      <>
        {isErrorDownloadableProjects && (
          <ErrorMessage error={errorDownloadableProjects} />
        )}
        {isErrorDownloadedData && <ErrorMessage error={errorDownloadedData} />}
      </>
    );
  }

  if (isLoadingDownloadedData) {
    return (
      <Backdrop open={isLoadingDownloadedData}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const downloadProjects = (event: React.MouseEvent<HTMLButtonElement>) => {
    const unitIds = selectedFlatRows
      .map((d) => d.original)
      .map((row: any) => row.id);

    if (unitIds.length === 1) {
      setSelectedProjectIds(unitIds[0]);
    } else if (unitIds.length > 1) {
      setSelectedProjectIds(unitIds.join(","));
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3">Projects</Typography>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={imageAdjust}
                onChange={handleChange}
                name="image_check"
                color="primary"
              />
            }
            label="Pre-Process Images"
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={downloadProjects}
          >
            Download
          </Button>
        </Grid>
      </Grid>

      <TableContainer
        data-testid="tableContainer"
        style={theme.tableContainer}
        component={Paper}
      >
        <MuiTable stickyHeader {...getTableProps()} size="small">
          <TableHead>
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
                      <Grid item xs={12} {...column.getHeaderProps()}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          spacing={0}
                        >
                          <Typography variant="subtitle1">
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
                                column.id !== "selection" && <CallSplitIcon />
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

      <div className="pagination">
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
      {isFetching ? (
        <Typography variant="body2">Refreshing...</Typography>
      ) : null}
    </>
  );
};
