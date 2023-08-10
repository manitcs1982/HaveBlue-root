import React from "react";
import {
  Typography,
  Card,
  CardContent,
  LinearProgress,
  TextField,
  MenuItem,
} from "@material-ui/core";

import { useUsers } from "../CommonQueries";

export const ThreadedOwner = ({ owner, setOwner, isNew }: any) => {
  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const handleChange = (newOwner: any) => {
    if (isNew) {
      setOwner(newOwner);
    } else {
      setOwner(newOwner);
    }
  };

  if (isLoadingUsers) {
    return (
      <>
        <Card style={{ marginTop: 12 }}>
          <CardContent>
            <Typography variant="h6">Owner:</Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
    <Card>
      <CardContent>
        <Typography variant="h6">
          Owner:
        </Typography>
        <TextField
          id="historicUser"
          type="text"
          data-testid="historicUser"
          name="historicUser"
          select={true}
          label="Pick a user"
          fullWidth
          value={owner.id}

        >
          {users?.map((user: any) => (
            <MenuItem
              key={user.id}
              value={user.id}
              onClick={() => handleChange(user)}
            >
              {user.username}
            </MenuItem>
          ))}
        </TextField>
      </CardContent>
    </Card>
    </>
  );
};
