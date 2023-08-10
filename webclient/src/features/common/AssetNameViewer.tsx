import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";

export const AssetNameViewer = ({ procedureResults }: any) => {
  const renderListContent = () => {
    if (
      procedureResults === undefined ||
      procedureResults.assets === undefined ||
      procedureResults.assets.length === 0
    ) {
      return (
        <ListItem>
          <ListItemText primary="No Assets" />
        </ListItem>
      );
    } else {
      return procedureResults.assets.map((asset: any) => (
        <ListItem>
          <ListItemText primary={asset[0]} />
        </ListItem>
      ));
    }
  };

  return (
    <Paper variant="outlined">
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Grid item xs={12} style={{ margin: "8px" }}>
          <Typography variant="h5">Asset Names</Typography>
        </Grid>
        <Grid item xs={12}>
          <List>{renderListContent()}</List>
        </Grid>
      </Grid>
    </Paper>
  );
};
