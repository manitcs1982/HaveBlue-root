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

import { useHistory, } from "react-router-dom";

import { useLabels } from "../CommonQueries";
import { NewLabel } from "../NewLabelModal";

export const ThreadedLabels = ({ usedLabels, setUsedLabels, isNew }: any) => {
  const { data: labels, isLoading: isLoadingLabels } = useLabels();
  const history = useHistory();

  const [unusedLabels, setUnusedLabels] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleAdd = (event: any) => {
    if (event.target.value == 0){
      return null
    }

    if (isNew) {
      setUsedLabels([...usedLabels, event.target.value]);
    } else {
      setUsedLabels([...usedLabels, event.target.value]);
    }
  };

  const handleDelete = (label: any) => {
    if (isNew) {
      setUsedLabels((usedLabels: any) =>
        usedLabels.filter((user: any) => user.id !== label.id)
      );
    } else {
      setUsedLabels((usedLabels: any) =>
        usedLabels.filter((user: any) => user.id !== label.id)
      );
    }
  };

  const textPicker = (color: any) => {
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return brightness > 125 ? "black" : "white";
  };

  React.useEffect(() => {
    if (usedLabels !== undefined) {
      if (labels && usedLabels.length !== 0) {
        let array = labels.results;
        usedLabels.map((labelU: any) => {
          array = (array.filter((label: any) => label.id !== labelU.id));
        });
        setUnusedLabels(array);
      } else if (labels && usedLabels.length === 0) {
        setUnusedLabels(labels.results);
      }
    }
  }, [labels, usedLabels]);

  if (isLoadingLabels) {
    return (
      <>
        <Card style={{ marginTop: 12 }}>
          <CardContent>
            <Typography variant="h6">Labels:</Typography>
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
          <Typography variant="h6">Labels:</Typography>
          <Select
            id="addUsers"
            name="historicUser"
            onChange={handleAdd}
            label="Add a user"
            fullWidth
          >
            {unusedLabels?.map((label: any) => (
              <MenuItem key={label.id} value={label}>
                <Chip
                  label={label.name}
                  style={{
                    backgroundColor: label.hex_color,
                    color: textPicker(label.hex_color),
                  }}
                />
              </MenuItem>
            ))}
              <MenuItem key={0} value={0} onClick={() => {setOpen(!open)}}>
                New Label
              </MenuItem>
          </Select>
          {usedLabels !== undefined &&
            usedLabels.map((label: any) => {
              return (
                <Chip
                  label={label.name}
                  onDelete={() => handleDelete(label)}
                  style={{
                    backgroundColor: label.hex_color,
                    color: textPicker(label.hex_color),
                  }}
                />
              );
            })}
        </CardContent>
      </Card>
      <NewLabel isOpen={open} setOpen={setOpen} />
    </>
  );
};
