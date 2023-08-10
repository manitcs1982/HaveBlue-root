import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import React from "react";

type StateSetter<T> = (value: T | ((prevState: T) => T)) => void;

const RelationshipPicker = <Type extends { id?: number; name?: string }>({
  pickerTitle,
  assignedItemsTitle,
  availableItemsTitle,
  assignedItems,
  setAssignedItems,
  availableItems,
  setAvailableItems,
  renderAssignedItem,
  renderAvailableItem,
  saveAssignedItems,
}: {
  pickerTitle: string;
  assignedItemsTitle: string;
  availableItemsTitle: string;
  assignedItems: Type[];
  setAssignedItems: StateSetter<Type[]>;
  availableItems: Type[];
  setAvailableItems: StateSetter<Type[]>;
  renderAssignedItem: (item: Type) => JSX.Element;
  renderAvailableItem: (item: Type) => JSX.Element;
  saveAssignedItems: (itemsToSave: Type[]) => Promise<any> | Promise<void>;
}) => {
  const [selectedAssignedItems, setSelectedAssignedItems] = React.useState<
    Type[]
  >([]);
  const [selectedAvailableItems, setSelectedAvailableItems] = React.useState<
    Type[]
  >([]);

  const manageSelectedList = (
    itemList: Type[],
    setList: StateSetter<Type[]>,
    item: Type
  ) => {
    if (itemList.includes(item)) {
      setList((prevState) => prevState.filter((prevItem) => prevItem !== item));
    } else {
      setList((prevState) => [...prevState, item]);
    }
  };

  const selectAssignedItem = (item: Type) => {
    manageSelectedList(selectedAssignedItems, setSelectedAssignedItems, item);
  };

  const selectAvailableItem = (item: Type) => {
    manageSelectedList(selectedAvailableItems, setSelectedAvailableItems, item);
  };

  const removeSelectedFromAssigned = () => {
    setAvailableItems((prevAvailableItems) => [
      ...prevAvailableItems,
      ...selectedAssignedItems,
    ]);

    setAssignedItems((prevAssignedItems) =>
      prevAssignedItems.filter((item) => !selectedAssignedItems.includes(item))
    );

    setSelectedAssignedItems([]);
  };

  const addSelectedToAssigned = () => {
    setAssignedItems((prevAssignedItems) => [
      ...prevAssignedItems,
      ...selectedAvailableItems,
    ]);

    setAvailableItems((prevAvailableItems) =>
      prevAvailableItems.filter(
        (item) => !selectedAvailableItems.includes(item)
      )
    );

    setSelectedAvailableItems([]);
  };

  const saveUpdatedAssignedItems = () => {
    setAssignedItems((assignedItems) => {
      saveAssignedItems(assignedItems);

      return assignedItems;
    });
  };

  return (
    <Paper>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h5">{pickerTitle}</Typography>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        spacing={1}
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
      >
        <Grid item xs>
          <Typography variant="h6">{assignedItemsTitle}</Typography>
          <List>
            {assignedItems
              .sort((a, b) => a.id! - b.id!)
              .map((item) => (
                <ListItem
                  button
                  selected={
                    item.id !== undefined &&
                    selectedAssignedItems.includes(item)
                  }
                  onClick={() => {
                    if (item.id !== undefined) selectAssignedItem(item);
                  }}
                >
                  {renderAssignedItem(item)}
                </ListItem>
              ))}
          </List>
        </Grid>

        <Grid item xs={2} style={{ display: "block", margin: "auto" }}>
          <Button
            variant="outlined"
            color="primary"
            disabled={selectedAssignedItems.length === 0}
            style={{ display: "block", margin: "5px auto" }}
            onClick={() => {
              removeSelectedFromAssigned();
              saveUpdatedAssignedItems();
            }}
          >
            <ArrowForward />
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={selectedAvailableItems.length === 0}
            style={{ display: "block", margin: "5px auto" }}
            onClick={() => {
              addSelectedToAssigned();
              saveUpdatedAssignedItems();
            }}
          >
            <ArrowBack />
          </Button>
        </Grid>

        <Grid item xs>
          <Typography variant="h6">{availableItemsTitle}</Typography>
          <List>
            {availableItems
              .sort((a, b) => a.id! - b.id!)
              .map((item) => (
                <ListItem
                  button
                  selected={
                    item.id !== undefined &&
                    selectedAvailableItems.includes(item)
                  }
                  onClick={() => selectAvailableItem(item)}
                >
                  {renderAvailableItem(item)}
                </ListItem>
              ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RelationshipPicker;
