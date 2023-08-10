import React from "react";
import {
  Divider,
  Button,
  Tooltip,
  Paper,
  Grid,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  TextField,
  MenuItem,
} from "@material-ui/core";

import { useNotesDispositions } from "../services/dispositionServices";

export const ThreadedDisposition = ({disposition, setDisposition, isNew} : any) => {

  const {
    error: errorDispositions,
    data: dispositions,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
  } = useNotesDispositions();

  const handleChange = (disposition : any) => {
    if (isNew) {
      setDisposition(disposition);
    } else {
      setDisposition(disposition);
    }
  }

  if (isLoadingDispositions) {
    return (
      <>
      <Card style={{ marginTop: 12}}>
        <CardContent>
          <Typography variant="h4">
            Status:
          </Typography>
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
          Status:
        </Typography>
        <TextField
          id="historicUser"
          type="text"
          data-testid="historicUser"
          name="historicUser"
          select={true}
          label="Pick a Disposition"
          fullWidth
          value={disposition.id}
        >
          {dispositions?.map((disposition: any) => (
            <MenuItem
              key={disposition.id}
              value={disposition.id}
              onClick={() => handleChange(disposition)}
            >
              {disposition.name}
            </MenuItem>
          ))}
        </TextField>
      </CardContent>
    </Card>
    </>
  )
}
