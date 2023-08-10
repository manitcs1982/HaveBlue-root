import React from "react";
import {
  Button,
  ButtonBase,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useQueryClient } from "react-query";
import { useAttachments } from "../../../../common/CommonQueries";
import {
  useDownloadImageFromUrl,
  usePostFile,
} from "../../../../common/services/fileServices";
import { useLinkFileToProject } from "../../../projectManagementMutations";
import { formatDate } from "../../../../common/formatDate";

import { DropzoneArea } from "material-ui-dropzone";
import { toast } from "react-toastify";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import { useFilters, useGlobalFilter, useSortBy, useTable } from "react-table";

import { useDefaultColumn } from "../../../../../util/filter";
import { useFetchContext } from "../../../../common/FetchContext";
import { BackButton } from "../../../../common/returnButton";
import {
  setActionsImages,
  setCratesImages,
  setUnitsImages,
} from "../../../../../util/helpers";

export const ProjectFilesDetails = ({
  files,
  id,
  projectFetch,
  actions,
  units,
  crates,
}: any) => {
  enum Sourcelocation {
    PROJECT,
    UNIT,
    CRATE,
  }
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [source, setFileSource] = React.useState(0);
  const [attachments, setAttachments] = React.useState<any[]>([]);
  const [projectImages, setProjectImages] = React.useState<any[]>([]);
  const [actionImages, setActionImages] = React.useState<any[]>([]);
  const [unitImages, setUnitImages] = React.useState<any[]>([]);
  const [crateImages, setCrateImages] = React.useState<any[]>([]);

  const {
    data: attachmentsProject,
    isLoading: isLoadingAttachments,
    isError: isErrorAttachments,
    isSuccess: isSuccessAttachments,
    error: errorAttachments,
    refetch: fileFetch,
  } = useAttachments(files);

  const {
    data: actionAttachments,
    isLoading: isLoadingActionAttachments,
    isError: isErrorActionAttachments,
    error: actionAttachmentsError,
  } = useAttachments(actionImages);

  const {
    data: attachmentsUnits,
    isLoading: isLoadingAttachmentsUnits,
    isError: isErrorAttachmentsUnits,
    isSuccess: isSuccessAttachmentsUnits,
    error: errorAttachmentsUnits,
  } = useAttachments(unitImages);

  const {
    data: attachmentsCrates,
    isLoading: isLoadingAttachmentsCrates,
    isError: isErrorAttachmentsCrates,
    isSuccess: isSuccessAttachmentsCrates,
    error: errorAttachmentsCrates,
  } = useAttachments(crateImages);

  React.useEffect(() => {
    if (attachmentsProject) {
      setProjectImages(attachmentsProject);
    }
    setUnitsImages(units, setUnitImages);
    setCratesImages(crates, setCrateImages);
    setActionsImages(actions, setActionImages);
  }, [units, crates, actions, attachmentsProject]);

  React.useEffect(() => {
    switch (source) {
      case Sourcelocation.PROJECT:
        setAttachments([...projectImages, ...actionAttachments]);
        //console.log(attachmentsProject);
        break;
      case Sourcelocation.UNIT:
        setAttachments(attachmentsUnits);
        //console.log(attachments);
        break;
      case Sourcelocation.CRATE:
        setAttachments(attachmentsCrates);
        break;
      default:
        setAttachments([]);
        break;
    }
  }, [source]);

  const setSource = (event: any) => {
    setFileSource(event.target.value);
  };

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid xs={6}>
            <Typography variant="h3">Project Files Details</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="standard-select-currency"
              select
              label="Select Files"
              value={source}
              onChange={setSource}
              helperText="Select Project or Intake Files"
            >
              <MenuItem key={0} value={Sourcelocation.PROJECT}>
                Project
              </MenuItem>
              <MenuItem key={1} value={Sourcelocation.UNIT}>
                Units
              </MenuItem>
              <MenuItem key={2} value={Sourcelocation.CRATE}>
                Crates
              </MenuItem>
            </TextField>
          </Grid>
          <Grid xs={1}>
            {source === 0 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(!open)}
              >
                Add File
              </Button>
            ) : (
              <Button variant="contained" disabled>
                Add File
              </Button>
            )}
          </Grid>
          <Grid item xs={1}>
            <BackButton />
          </Grid>
          <Grid item xs={12}>
            {isLoadingAttachments ? (
              <LinearProgress />
            ) : (
              <FileTable attachments={attachments} />
            )}
          </Grid>
        </Grid>
      </Container>
      <AddFile
        id={id}
        open={open}
        setOpen={setOpen}
        attachments={attachments}
        refetch={fileFetch}
        projectFetch={projectFetch}
      />
    </div>
  );
};

const FileTable = ({ attachments }: any) => {
  console.log({ attachments });
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

const AddFile = ({
  id,
  open,
  setOpen,
  attachments,
  refetch,
  projectFetch,
}: any) => {
  const { authAxios } = useFetchContext();
  const queryClient = useQueryClient();
  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFile } = useLinkFileToProject();
  const [length, setLength] = React.useState(0);

  const saveFiles = async (files: any) => {
    if (files.length > 0) {
      try {
        for (let index = length; index < files.length; index++) {
          let newFile = await mutatePostFile({
            authAxios,
            file: files[index],
          });
          await mutateLinkFile({
            authAxios,
            fileId: newFile.id,
            projectId: id,
          });
          toast.success("File uploaded.");
        }
        await projectFetch();
        queryClient.invalidateQueries("attachments");

        //await refetch();
        setLength(files.length);
      } catch (error) {
        toast.error(`Error uploading file: ${error}`);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(!open);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography variant="h4">Add Files</Typography>
          </Grid>
          <Grid item xs={12}>
            <DropzoneArea
              //acceptedFiles={["*"]}
              filesLimit={
                process.env.REACT_APP_FILE_LIMIT
                  ? parseInt(process.env.REACT_APP_FILE_LIMIT)
                  : 20
              }
              maxFileSize={12000000}
              onChange={saveFiles}
              showPreviews={false}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(!open);
          }}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
