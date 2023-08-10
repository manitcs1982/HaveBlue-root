import {
  Card,
  CardContent,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useNoteTypes } from "../../projectManagement/projectQueries";
import { ErrorMessage } from "../ErrorMessage";

const ThreadedNoteType = ({ noteType, setNoteType }: any) => {
  const {
    data: noteTypesData = [],
    error: noteTypesError,
    isLoading: isLoadingNoteTypes,
    isError: isErrorNoteTypes,
  } = useNoteTypes("Threaded Notes");

  const handleChange = (newNoteType: any) => {
    setNoteType(newNoteType.id);
  };

  if (isLoadingNoteTypes) {
    return (
      <>
        <Card style={{ marginTop: 12 }}>
          <CardContent>
            <Typography variant="h6">Type of Note to Create:</Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      </>
    );
  }

  if (isErrorNoteTypes) {
    return <ErrorMessage error={noteTypesError} />;
  }

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography variant="h6">Type of Ticket to Create:</Typography>
          <TextField
            id="noteType"
            type="text"
            data-testid="noteType"
            name="noteType"
            select={true}
            fullWidth
            value={noteType}
          >
            {noteTypesData !== undefined &&
              noteTypesData.results.map((type: any) => (
                <MenuItem
                  key={type.id}
                  value={type.id}
                  onClick={() => handleChange(type)}
                >
                  {type.visible_name}
                </MenuItem>
              ))}
          </TextField>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ThreadedNoteType;
