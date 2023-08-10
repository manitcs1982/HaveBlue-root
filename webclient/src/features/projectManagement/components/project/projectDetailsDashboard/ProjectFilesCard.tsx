import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useAttachments } from "../../../../common/CommonQueries";
import { useDownloadImageFromUrl } from "../../../../common/services/fileServices";
import { formatDate } from "../../../../common/formatDate";
import { CallMade } from "@material-ui/icons";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import {
  setActionsImages,
  setCratesImages,
  setUnitsImages,
} from "../../../../../util/helpers";

export const ProjectFilesCard = ({ files, actions, units, crates }: any) => {
  enum Sourcelocation {
    PROJECT,
    UNIT,
    CRATE,
  }
  const theme = useTheme();
  const history = useHistory();
  const [source, setFileSource] = React.useState(Sourcelocation.PROJECT);
  const [actionImages, setActionImages] = React.useState<any[]>([]);
  const [unitImages, setUnitImages] = React.useState<any[]>([]);
  const [crateImages, setCrateImages] = React.useState<any[]>([]);

  const {
    data: attachments = [],
    isLoading: isLoadingAttachments,
    isError: isErrorAttachments,
    isSuccess: isSuccessAttachments,
    error: errorAttachments,
  } = useAttachments(files);

  const {
    data: actionAttachments = [],
    isLoading: isLoadingActionAttachments,
    isError: isErrorActionAttachments,
    error: actionAttachmentsError,
  } = useAttachments(actionImages);

  const {
    data: attachmentsUnits = [],
    isLoading: isLoadingAttachmentsUnits,
    isError: isErrorAttachmentsUnits,
    isSuccess: isSuccessAttachmentsUnits,
    error: errorAttachmentsUnits,
  } = useAttachments(unitImages);

  const {
    data: attachmentsCrates = [],
    isLoading: isLoadingAttachmentsCrates,
    isError: isErrorAttachmentsCrates,
    isSuccess: isSuccessAttachmentsCrates,
    error: errorAttachmentsCrates,
  } = useAttachments(crateImages);

  React.useEffect(() => {
    setUnitsImages(units, setUnitImages);
    setCratesImages(crates, setCrateImages);
    setActionsImages(actions, setActionImages);
  }, [units, crates]);

  const renderFiles = () => {
    switch (source) {
      case Sourcelocation.PROJECT:
        return (
          <>
            {[...attachments, ...actionAttachments].map((attachment: any) => {
              return (
                <TableRow>
                  <TableCell>
                    <FileDownload
                      file={{ url: attachment.url, name: attachment.name }}
                    />
                  </TableCell>
                  <TableCell>{attachment.name}</TableCell>
                  <TableCell>
                    {formatDate(attachment.uploaded_datetime)}
                  </TableCell>
                </TableRow>
              );
            })}
          </>
        );

      case Sourcelocation.UNIT:
        return (
          <>
            {attachmentsUnits.map((attachment: any) => {
              return (
                <TableRow>
                  <TableCell>
                    <FileDownload
                      file={{ url: attachment.url, name: attachment.name }}
                    />
                  </TableCell>
                  <TableCell>{attachment.name}</TableCell>
                  <TableCell>
                    {formatDate(attachment.uploaded_datetime)}
                  </TableCell>
                </TableRow>
              );
            })}
          </>
        );

      case Sourcelocation.CRATE:
        return (
          <>
            {attachmentsCrates.map((attachment: any) => {
              return (
                <TableRow>
                  <TableCell>
                    <FileDownload
                      file={{ url: attachment.url, name: attachment.name }}
                    />
                  </TableCell>
                  <TableCell>{attachment.name}</TableCell>
                  <TableCell>
                    {formatDate(attachment.uploaded_datetime)}
                  </TableCell>
                </TableRow>
              );
            })}
          </>
        );

      default:
        return <></>;
    }
  };

  const setSource = (event: any) => {
    setFileSource(event.target.value);
  };

  const renderCardContent = () => {
    /*   if (isLoadingProjectDetails) {
      return <CardLoader />;
    }
    if (isErrorProjectDetails) {
      return <ErrorMessage error={errorProjectDetails} />;
    } */

    if (
      isLoadingAttachments ||
      isLoadingAttachmentsUnits ||
      isLoadingAttachmentsCrates
    ) {
      return <LinearProgress />;
    } else {
      return (
        <>
          <CardHeader
            style={theme.cardHeader}
            subheader={
              <>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item xs={6}>
                    <Typography variant="h6" style={theme.dashboardCardTitle}>
                      Project Files
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
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
                </Grid>
              </>
            }
            action={
              <IconButton
                onClick={() =>
                  history.push(`${history.location.pathname}/files`)
                }
              >
                <CallMade style={theme.cardGoToDetailButton} />
              </IconButton>
            }
          ></CardHeader>
          <CardContent>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={12}>
                <TableContainer style={{ maxHeight: 300 }}>
                  <Table
                    size="small"
                    padding="none"
                    style={{ minWidth: 20, zIndex: -1 }}
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>File Name</TableCell>
                        <TableCell>Creation Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{renderFiles()}</TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
        </>
      );
    }
  };

  return <Card style={theme.dashboardCard}>{renderCardContent()}</Card>;
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
      <IconButton
        onClick={() => {
          downloadImage(file);
        }}
      >
        <FileCopyIcon />
      </IconButton>
    </>
  );
};
