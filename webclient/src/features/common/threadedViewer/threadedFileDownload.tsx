import React from "react";
import { Grid, Typography, TextField, Tooltip, IconButton } from "@material-ui/core";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useDownloadImageFromUrl } from "../services/fileServices";

export const ThreadedFileDownload = ({file} : any) => {
  const { data, isError, isLoading, isFetching, error, refetch } = useDownloadImageFromUrl(file.file, file.name);

  const downloadImage = async (file : any) => {
    if (file.file && file.name) {
      await refetch();
    }
  };

  return(
    <>
      <Grid item xs={6} style={{ textAlign: "center" }}>
        <Typography variant="body1">
          Click to Download
        </Typography>
        <IconButton onClick={() => {downloadImage(file);}}>
          <FileCopyIcon />
        </IconButton>
        <Typography variant="body2">
          {file.name}
        </Typography>
      </Grid>
    </>
  )
}
