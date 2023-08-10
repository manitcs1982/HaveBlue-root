import React from "react";
import {
  Divider,
  Button,
  Tooltip,
  LinearProgress,
  useTheme,
  Paper,
  Grid,
  Typography,
  IconButton,
  ButtonBase
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  Cell,
} from "react-table";
import { formatDate } from "./formatDate";
import Zoom from "react-medium-image-zoom";

import {
  useDefaultColumn,
  generalFilter,
  labelFilter,
  LabelPickerFilter,
  taggedUsersFilter,
  UsersPickerFilter,
} from "../../util/filter";
import { useFetchContext } from "./FetchContext";
import {
  useDownloadImageFromUrl,
  usePostFile,
} from "./services/fileServices";
import { useAttachments } from "./CommonQueries";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import FileCopyIcon from "@material-ui/icons/FileCopy";

  export const ImageListModal = ({
    open,
    setOpen,
    images,
  }: any) => {
    const handleClose = () => {
      setOpen(!open);
    };

    const {
      data: formattedImages,
      isLoading: isLoadingFormattedImages,
      isError: isErrorFormattedImages,
      isSuccess: isSuccessFormattedImages,
      error: errorFormattedImages,
      refetch: fileFetch,
    } = useAttachments(images);

    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth={true}
          maxWidth={"md"}
        >
          <DialogTitle id="scroll-dialog-title">Attached Images</DialogTitle>
          <DialogContent>
            <Divider variant="fullWidth" />
            {isLoadingFormattedImages ? (
              <LinearProgress />
            ) : (
              <FileTable attachments={formattedImages} />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

  }

  const FileTable = ({ attachments }: any) => {
    console.log(attachments)
    const theme = useTheme();
    const defaultColumn = useDefaultColumn();
    const columns = React.useMemo(
      () => [
        {
          Header: "ID",
          accessor: "id",
        },
        {
          Header: "URL",
          accessor: "url",
        },
        {
          Header: "Preview",
          accessor: "image",
          Cell: ({ cell, row }: any) => {
            return (
              <FileDownload
                file={{
                  url: row.values.url,
                  name: row.values.name,
                  image: cell.value,
                }}
              />
            );
          },
          disableSortBy: true,
          Filter: () => null,
        },
        {
          Header: "File Name",
          accessor: "name",
        },
        {
          Header: "Creation Date",
          accessor: "uploaded_datetime",
          Cell: ({ cell }: any) => {
            return <>{formatDate(cell.value)}</>;
          },
        },
      ],
      []
    );

    const { getTableProps, visibleColumns, headerGroups, rows, prepareRow } =
      useTable(
        {
          data: attachments,
          columns,
          defaultColumn,
          initialState: {
            hiddenColumns: ["id", "url"],
          },
        },
        useFilters,
        useGlobalFilter,
        useSortBy
      );

    return (
      <Paper style={{ marginTop: 32 }}>
        <TableContainer style={theme.tableContainer}>
          <MuiTable stickyHeader {...getTableProps}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <Grid
                          item
                          xs={12}
                          {...column.getHeaderProps([
                            column.getSortByToggleProps(),
                          ])}
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
      </Paper>
    );
  };

  const FileDownload = ({ file }: any) => {
    const { data, isError, isLoading, isFetching, error, refetch } =
      useDownloadImageFromUrl(file.url, file.name);

    const downloadImage = async (file: any) => {
      if (file.url && file.name) {
        await refetch();
      }
    };

    return (
      <>
        {file.image === undefined ? (
          <IconButton
            onClick={() => {
              downloadImage(file);
            }}
          >
            <FileCopyIcon />
          </IconButton>
        ) : (
          <ButtonBase
            onClick={() => {
              downloadImage(file);
            }}
          >
            <img
              src={file.image}
              alt="N/A"
              className="img"
              style={{
                maxWidth: "15em",
                maxHeight: "15em",
                filter: `brightness(${100}%) contrast(${100}%)`,
                //transform: `rotate(${rotate}deg)`,
              }}
            />
          </ButtonBase>
        )}
      </>
    );
  };
