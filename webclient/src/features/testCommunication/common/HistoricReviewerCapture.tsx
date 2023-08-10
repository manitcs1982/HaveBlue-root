import { Grid, TextField, MenuItem } from "@material-ui/core";

import { DateTimePicker } from "@material-ui/pickers";

export const HistoricReviewerCapture = ({
  users,
  reviewer,
  setReviewer,
  reviewDate,
  setReviewDate,
  reviewDateLabel,
}: any) => {
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="flex-start"
      spacing={2}
    >
      <Grid item xs={4}>
        <TextField
          id="reviewer"
          type="text"
          data-testid="reviewer"
          name="reviewer"
          select={true}
          label="Pick a reviewer"
          fullWidth
        >
          {users?.map((user: any) => (
            <MenuItem
              key={user.id}
              value={user.url || ""}
              onClick={() => setReviewer(user)}
            >
              {user.username}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={8}>
        <DateTimePicker
          label={reviewDateLabel}
          inputVariant="outlined"
          format="YYYY-MM-DD HH:mm:ss"
          value={reviewDate}
          onChange={setReviewDate}
        />
      </Grid>
    </Grid>
  );
};
