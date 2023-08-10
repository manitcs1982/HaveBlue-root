import React from "react";
import { useAsyncDebounce } from "react-table";
import TextField from "@material-ui/core/TextField";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  Checkbox,
  Chip,
  LinearProgress,
  Select,
} from "@material-ui/core";
import { useLabels, useUsers } from "../features/common/CommonQueries";
import { ErrorMessage } from "../features/common/ErrorMessage";
import Label from "../features/projectManagement/types/Label";
import { useNoteTypes } from "../features/projectManagement/projectQueries";
import { useTestSequenceDefinitionsDispositions } from "../features/common/services/dispositionServices";
import capitalize from "lodash/capitalize";

// Define a default UI for filtering
export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) => {
  const [, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <TextField
      id="standard-basic"
      label="Standard"
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder="Search"
    />
  );
};

export const useDefaultColumn = () => {
  return React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );
};

// Define a default UI for filtering
export const DefaultColumnFilter = ({ column }: any) => {
  const [activeFilterType, setActiveFilterType] = React.useState("contains");
  const [activeFilterValue, setActiveFilterValue] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClearFilterClick = () => {
    setAnchorEl(null);
    setActiveFilterType("contains");
    setActiveFilterValue("");
    column.setFilter(undefined);
  };

  const handleClose = (filterType: string | null) => () => {
    if (filterType !== null) {
      setActiveFilterType(filterType);
      column.setFilter(`${activeFilterValue}|${filterType}` || undefined);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Grid item xs={8}>
        <TextField
          id="standard-basic"
          variant="outlined"
          size="small"
          value={activeFilterValue}
          label={column.id}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            setActiveFilterValue(e.currentTarget.value);
            if (!e.currentTarget.value) column.setFilter(undefined);
            else {
              if (e.currentTarget.value.includes("|")) {
                e.currentTarget.value = e.currentTarget.value.replace("|", "");
              }

              column.setFilter(
                `${e.currentTarget.value}|${activeFilterType}` || undefined
              );
            }
          }}
        />
      </Grid>
      <Grid item xs={2}>
        {activeFilterValue === "" && (
          <IconButton
            size="small"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <FilterListIcon />
          </IconButton>
        )}
        {activeFilterType !== "" && activeFilterValue !== "" && (
          <IconButton
            size="small"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClearFilterClick}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Grid>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose(null)}
      >
        <MenuItem
          onClick={handleClose("contains")}
          selected={activeFilterType === "contains"}
        >
          Contains
        </MenuItem>
        <MenuItem
          onClick={handleClose("notContains")}
          selected={activeFilterType === "notContains"}
        >
          Not Contains
        </MenuItem>
        <MenuItem
          onClick={handleClose("startsWith")}
          selected={activeFilterType === "startsWith"}
        >
          Starts With
        </MenuItem>
        <MenuItem
          onClick={handleClose("endsWith")}
          selected={activeFilterType === "endsWith"}
        >
          Ends With
        </MenuItem>
      </Menu>
    </>
  );
};

export const generalFilter = (rows: any, id: any, filterValue: any) => {
  let splitValues = filterValue.split("|");

  switch (splitValues[1]) {
    case "contains":
      return rows.filter((row: any) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .includes(String(splitValues[0]).toLowerCase())
          : false;
      });
    case "startsWith":
      return rows.filter((row: any) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .startsWith(String(splitValues[0]).toLowerCase())
          : false;
      });
    case "endsWith":
      return rows.filter((row: any) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .endsWith(String(splitValues[0]).toLowerCase())
          : false;
      });
    case "notContains":
      return rows.filter((row: any) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? !String(rowValue)
              .toLowerCase()
              .includes(String(splitValues[0]).toLowerCase())
          : false;
      });
  }
};

export const CheckboxColumnFilter = ({
  column: { setFilter },
}: {
  column: { setFilter: any };
}) => {
  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Checkbox
          checked={isChecked}
          onChange={({
            target: { checked },
          }: {
            target: { checked: boolean };
          }) => {
            setIsChecked(checked);
            setFilter(checked);
          }}
        />

        <Button
          variant="outlined"
          onClick={() => {
            setIsChecked(false);
            setFilter(undefined);
          }}
        >
          Reset
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export const booleanFilter = (
  rows: any,
  id: any,
  filterValue: boolean | null
) => {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    const booleanRowValue: boolean = Boolean(rowValue);
    const xnor = !(
      (!booleanRowValue && filterValue) ||
      (booleanRowValue && !filterValue)
    );
    return rowValue !== undefined || filterValue !== undefined ? xnor : true;
  });
};

export const LabelPickerFilter = ({
  column: { setFilter },
}: {
  column: { setFilter: any };
}) => {
  const [labelValue, setLabelValue] = React.useState<any>(0);
  const [unusedLabels, setUnusedLabels] = React.useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = React.useState<Label[]>([]);

  const {
    data: labelsData = [],
    error: labelsError,
    isLoading: isLoadingLabels,
    isError: isErrorLabels,
  } = useLabels();

  const handleAdd = (event: any) => {
    setSelectedLabels((currentLabels) => [
      ...currentLabels,
      event.target.value,
    ]);
  };

  const handleDelete = (label: Label) => {
    setSelectedLabels((currentLabels) =>
      currentLabels.filter((currentLabel) => currentLabel.id !== label.id)
    );
  };

  const textPicker = (color: any) => {
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return brightness > 125 ? "black" : "white";
  };

  React.useEffect(() => {
    if (labelsData !== undefined) {
      if (selectedLabels.length !== 0) {
        const array: Label[] = labelsData.results;
        const selectedIndicesArray: number[] = selectedLabels.map(
          (selectedLabel: Label) =>
            selectedLabel.id !== undefined ? selectedLabel.id : 0
        );
        setUnusedLabels(
          array.filter(
            (backendLabel: any) =>
              !selectedIndicesArray.includes(backendLabel.id)
          )
        );
      } else {
        setUnusedLabels(labelsData.results);
      }
    }
  }, [labelsData, selectedLabels]);

  React.useEffect(() => {
    if (selectedLabels !== undefined) {
      setFilter(selectedLabels);
    }
  }, [selectedLabels]);

  if (isLoadingLabels) {
    return <LinearProgress />;
  }

  if (isErrorLabels) {
    return <ErrorMessage error={labelsError} />;
  }

  return (
    <>
      <TextField
        id="labels"
        select={true}
        name="labels"
        size="small"
        label="Filter By Label"
        value={labelValue}
        onChange={handleAdd}
        fullWidth
      >
        {unusedLabels !== undefined &&
          unusedLabels.map((label: any) => (
            <MenuItem key={label.id} value={label}>
              {label.name}
            </MenuItem>
          ))}
      </TextField>
      {selectedLabels.map((label: any) => (
        <Chip
          label={label.name}
          onDelete={() => handleDelete(label)}
          style={{
            backgroundColor: label.hex_color,
            color: textPicker(label.hex_color),
          }}
        />
      ))}
    </>
  );
};

export const labelFilter = (rows: any, id: any, filterValue: Label[]) => {
  if (filterValue.length === 0) {
    return rows;
  }

  return rows.filter((row: any) => {
    let isReqLabelFound = true;
    const rowValue: Label[] = row.values[id];

    if (rowValue.length === 0) {
      return false;
    }

    const indicesArray: number[] = rowValue.map((existingLabel: Label) =>
      existingLabel.id !== undefined ? existingLabel.id : 0
    );

    for (const reqLabel of filterValue) {
      if (!indicesArray.includes(reqLabel.id !== undefined ? reqLabel.id : 0)) {
        isReqLabelFound = false;
        break;
      }
    }

    return isReqLabelFound;
  });
};

export const UsersPickerFilter = ({
  column: { setFilter },
}: {
  column: { setFilter: any };
}) => {
  const [userValue, setUserValue] = React.useState<any>(0);
  const [unusedUsers, setUnusedUsers] = React.useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = React.useState<any[]>([]);

  const {
    data: userData = [],
    error: usersError,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useUsers();

  const handleAdd = (event: any) => {
    setSelectedUsers((currentUsers) => [...currentUsers, event.target.value]);
  };

  const handleDelete = (user: any) => {
    setSelectedUsers((currentUsers) =>
      currentUsers.filter((currentUser) => currentUser.id !== user.id)
    );
  };

  React.useEffect(() => {
    if (userData !== undefined) {
      if (selectedUsers.length !== 0) {
        const array = userData;
        const selectedIndicesArray: number[] = selectedUsers.map(
          (selectedUser: any) =>
            selectedUser.id !== undefined ? selectedUser.id : 0
        );
        setUnusedUsers(
          array.filter(
            (backendUser: any) => !selectedIndicesArray.includes(backendUser.id)
          )
        );
      } else {
        setUnusedUsers(userData);
      }
    }
  }, [selectedUsers, userData]);

  React.useEffect(() => {
    if (selectedUsers !== undefined) {
      setFilter(selectedUsers);
    }
  }, [selectedUsers]);

  if (isLoadingUsers) {
    return <LinearProgress />;
  }

  if (isErrorUsers) {
    return <ErrorMessage error={usersError} />;
  }

  return (
    <React.Fragment>
      <Select
        id="labels"
        name="labels"
        value={userValue}
        onChange={handleAdd}
        fullWidth
      >
        <MenuItem key={0} value={0}>
          Select a user to filter
        </MenuItem>
        {unusedUsers !== undefined &&
          unusedUsers.map((user: any) => (
            <MenuItem key={user.id} value={user}>
              {user.username}
            </MenuItem>
          ))}
      </Select>
      {selectedUsers.map((user: any) => (
        <Chip label={user.username} onDelete={() => handleDelete(user)} />
      ))}
    </React.Fragment>
  );
};

export const taggedUsersFilter = (rows: any, id: any, filterValue: any) => {
  if (filterValue.length === 0) {
    return rows;
  }

  return rows.filter((row: any) => {
    let isReqUserFound = true;
    const rowValue = row.values[id];

    if (rowValue.length === 0) {
      return false;
    }

    const indicesArray: number[] = rowValue.map((existingLabel: any) =>
      existingLabel.id !== undefined ? existingLabel.id : 0
    );

    for (const reqUser of filterValue) {
      if (!indicesArray.includes(reqUser.id !== undefined ? reqUser.id : 0)) {
        isReqUserFound = false;
        break;
      }
    }

    return isReqUserFound;
  });
};

export const NoteTypeFilter = ({
  column: { setFilter },
}: {
  column: { setFilter: any };
}) => {
  const [noteTypeValue, setNoteTypeValue] = React.useState<any>(0);

  const {
    data: noteTypesData = [],
    error: noteTypesError,
    isLoading: isLoadingNoteTypes,
    isError: isErrorNoteTypes,
  } = useNoteTypes();

  const handleChange = (event: any) => {
    setNoteTypeValue(event.target.value);
    setFilter(event.target.value);
  };

  if (isLoadingNoteTypes) {
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      </Grid>
    );
  }

  if (isErrorNoteTypes) {
    return <ErrorMessage error={noteTypesError} />;
  }

  return (
    <React.Fragment>
      <TextField
        select={true}
        size="small"
        id="noteTypes"
        name="noteTypes"
        label="Filter by Type"
        value={noteTypeValue}
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        fullWidth
      >
        {noteTypesData !== undefined &&
          noteTypesData.results.map((noteType: any) => (
            <MenuItem key={noteType.id} value={noteType}>
              {noteType.visible_name}
            </MenuItem>
          ))}
      </TextField>
    </React.Fragment>
  );
};

export const noteTypeFilter = (rows: any, id: any, filterValue: any) => {
  if (filterValue === 0) return rows;

  return rows.filter((row: any) => {
    const rowValue = row.values[id];

    return rowValue === filterValue.name;
  });
};

export const AttachedProjectFilter = ({
  column: { setFilter },
}: {
  column: { setFilter: any };
}) => (
  <React.Fragment>
    <TextField
      id="attachedProject"
      placeholder="Project ID"
      onChange={(e) => {
        setFilter(e.target.value);
      }}
    />
  </React.Fragment>
);

export const attachedProjectFilter = (rows: any, id: any, filterValue: any) => {
  if (filterValue === "") {
    console.log(filterValue);
    return rows;
  }

  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    console.log(rowValue);
    for (let i = 0; i < rowValue.length; i++) {
      console.log(rowValue[i]);
      if (
        rowValue[i] &&
        rowValue[i].id &&
        rowValue[i].model_name === "project"
      ) {
        return String(rowValue[i].str)
          .toLowerCase()
          .includes(String(filterValue).toLowerCase())
          ? true
          : false;
      }
    }
    return false;
  });
};

export const DispositionFilter = ({
  column: { setFilter },
}: {
  column: { setFilter: any };
}) => {
  const [dispositionValue, setDispositionValue] = React.useState(0);

  const {
    data: dispositions,
    error: dispositionsError,
    isLoading: isLoadingDispositions,
    isError: isErrorDispositions,
  } = useTestSequenceDefinitionsDispositions();

  const handleChange = (event: any) => {
    setDispositionValue(event.target.value);
    setFilter(event.target.value);
  };

  if (isLoadingDispositions) {
    return <LinearProgress />;
  }

  if (isErrorDispositions) {
    return (
      <>{isErrorDispositions && <ErrorMessage error={dispositionsError} />}</>
    );
  }

  return (
    <React.Fragment>
      <Select
        id="noteTypes"
        name="noteTypes"
        value={dispositionValue}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem key={0} value={0}>
          Select a disposition to filter
        </MenuItem>
        {dispositions &&
          dispositions.map((disposition) => (
            <MenuItem key={disposition.id} value={disposition.id}>
              {disposition.name}
            </MenuItem>
          ))}
      </Select>
    </React.Fragment>
  );
};

export const dispositionFilter = (rows: any, id: any, filterValue: any) => {
  if (filterValue === 0) {
    return rows;
  }

  return rows.filter((row: any) => row.original.disposition === filterValue);
};
