import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useParams } from "react-router-dom";
import { useDownloadImageFromID } from "./fileServices";
import { ListItemIcon, ListItemText, useTheme } from "@material-ui/core";
import { ErrorMessage } from "../ErrorMessage";
import { useFileByID } from "../CommonQueries";

export const DownloadPage = () => {
  const theme = useTheme();

  const { fileID } = useParams() as { fileID: string; };

  const {
    data: fileDetailsData,
    error: errorFileDetailsData,
    isLoading: isLoadingFileDetailsData,
    isError: isErrorFileDetailsData,
    isSuccess: isSuccessFileDetailsData,
  } = useFileByID(fileID);

  const { isError, isLoading, isFetching, error } =
    useDownloadImageFromID(fileID, fileDetailsData?.name);

  if (isLoading || isFetching || isLoadingFileDetailsData) {
    return (
      <div style={theme.containerMargin}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <>
      <Typography variant="h2">
        Your download {fileDetailsData.name} is ready!
      </Typography>
    </>
  )
};
