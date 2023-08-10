import React from "react";
import {
  Typography,
  Card,
  CardContent,
  LinearProgress,
  MenuItem,
  Chip,
  Select,
} from "@material-ui/core";

import { useUsers } from "../CommonQueries"; 

export const ThreadedTaggedUsers = ({taggedUsers, setTaggedUsers, isNew} : any) => {
  const [unusedUsers, setUnusedUsers] = React.useState<any[]>([]);

  const handleAdd = (event: any) => {
    if (setTaggedUsers !== undefined) {
      setTaggedUsers([...taggedUsers, event.target.value]);
    }
  };

  const handleDelete = (event: any) => {
    if (setTaggedUsers !== undefined) {
      setTaggedUsers((taggedUsers: any) =>
        taggedUsers.filter((user: any) => user.id !== event.id)
      );
    }
  };

  const { data: users, isLoading: isLoadingUsers } = useUsers();

  React.useEffect(() => {
    if (users && taggedUsers.length !== 0) {
      let array = users;
      taggedUsers.map((tUser : any) => {
        array = (array.filter((user : any) => user.id !== tUser.id))
      })
      setUnusedUsers(array);
    } else if (users && taggedUsers.length === 0) {
      setUnusedUsers(users);
    }
  }, [users, taggedUsers]);

  if (isLoadingUsers) {
    return (
      <>
        <Card style={{ marginTop: 12 }}>
          <CardContent>
            <Typography variant="h6">Tagged Users:</Typography>
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
          Tagged Users:
        </Typography>
        <Select
          id="addUsers"
          name="historicUser"
          onChange={handleAdd}
          label="Add a user"
          fullWidth
        >
          {unusedUsers?.map((user: any) => (
            <MenuItem
              key={user.id}
              value={user}
            >
              {user.username}
            </MenuItem>
          ))}
        </Select>
        {taggedUsers?.map((user : any) => {
          return (
              <Chip
                label={user.username}
                onDelete={() => {handleDelete(user);}}
              />

          )
        })}
      </CardContent>
    </Card>
    </>
  );
};
