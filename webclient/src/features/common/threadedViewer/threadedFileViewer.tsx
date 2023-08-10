import React from "react";
import { Grid, Typography, TextField, Tooltip, IconButton, Badge } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { toast } from "react-toastify";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useQueryClient } from "react-query";
import { useFetchContext } from "../FetchContext";
import { useAttachments } from "../CommonQueries";
import { useDownloadImageFromUrl } from "../services/fileServices";
import { ThreadedFileDownload } from "./threadedFileDownload";

const degreeRotationMarks = [
  {
    value: -180,
    label: "-180°",
  },
  {
    value: -90,
    label: "-90°",
  },
  {
    value: 0,
    label: "0°",
  },
  {
    value: 90,
    label: "90°",
  },
  {
    value: 180,
    label: "180°",
  },
];

export const ThreadedFileViewModal = ({files, locale = ""} : any ) => {

  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const { data, isError, isLoading, isFetching, error, refetch } = useDownloadImageFromUrl(url, name);

  const {
    data: attachments,
    isLoading: isLoadingAttachments,
    isError: isErrorAttachments,
    isSuccess: isSuccessAttachments,
    error: errorAttachments,
  } = useAttachments(files);

  const handleClose = () => {
    setOpen(!open);
  };

  const renderImage = (file : any) => {
    if (file) {
      return (
        <>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Zoom>
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
            </Zoom>
          </Grid>
        </>
      );
    } else if (
      file === undefined ||
      file === null ||
      file === "N/A"
    ) {
      return (
        <>
          <Grid item xs={4} style={{ textAlign: "center" }}>
            <Typography variant="h3">N/A</Typography>
          </Grid>
        </>
      );
    }
  };

  return (
    <>
    { locale === "top" ? (
      <Tooltip title="View Files">
        <IconButton
          color="primary"
          onClick={handleClose}
        >
          <AttachFileIcon />
        </IconButton>
      </Tooltip>
    ) : (
        <Button
          color="primary"
          variant="contained"
          onClick={handleClose}
          startIcon={<AttachFileIcon />}
          fullWidth
        >
          <Badge color="secondary" badgeContent={files.length}>          
          </Badge>
        </Button>
    )
    }
    <Dialog
      open={open}
      onClose={() => {setOpen(!open);}}
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
            <Typography variant="h4">Attached Files</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={4}
            >
              {attachments?.map((attachment: any) => {
                if (attachment.image !== undefined) {
                  return(renderImage(attachment))
                } else {
                  return(<ThreadedFileDownload file={attachment} />)
                }
              })}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {setOpen(!open);}} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
