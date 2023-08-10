import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDownloadImageFromUrl } from "./services/fileServices";
import { ListItemIcon, ListItemText, useTheme } from "@material-ui/core";
import { ErrorMessage } from "./ErrorMessage";
import { AttachFile } from "@material-ui/icons";
import { ImageDownloaderVariants } from "../common/enums";
import { ListItemLink } from "../common/ListItemLink";

export const ImageDownloader = ({
  url,
  name,
  label,
  disabled,
  variant = ImageDownloaderVariants.Button,
}: {
  url: string;
  name: string;
  label: string;
  disabled?: boolean;
  variant?: ImageDownloaderVariants;
}) => {
  const theme = useTheme();
  const { isError, isLoading, isFetching, error, refetch } =
    useDownloadImageFromUrl(url, name);

  if (isLoading || isFetching) {
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

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  const downloadImage = async () => {
    if (url && name) {
      await refetch();
    }
  };

  switch (variant) {
    case ImageDownloaderVariants.Button:
      return (
        <Button
          variant="contained"
          disabled={(!url && !name) || disabled}
          color="primary"
          onClick={() => downloadImage()}
        >
          {label}
        </Button>
      );
    case ImageDownloaderVariants.ListItem:
      return (
        <ListItemLink
          disabled={(!url && !name) || disabled}
          onClick={() => downloadImage()}
        >
          <ListItemIcon>
            <AttachFile />
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItemLink>
      );
    default:
      return (
        <Button
          variant="contained"
          disabled={(!url && !name) || disabled}
          color="primary"
          onClick={() => downloadImage()}
        >
          {label}
        </Button>
      );
  }
};
