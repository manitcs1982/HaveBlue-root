import React from "react";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";

export const ListItemLink = (props: ListItemProps<"a", { button?: true }>) => {
  return <ListItem button component="a" {...props} />;
};
