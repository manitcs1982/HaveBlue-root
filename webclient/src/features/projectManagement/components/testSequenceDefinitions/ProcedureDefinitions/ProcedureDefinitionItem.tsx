import React from "react";
import { ProcedureExecutionOrder } from "../../../types/ProcedureExecutionOrder";
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { MoreVertOutlined } from "@material-ui/icons";

const ProcedureDefinitionItem = ({
  procedureDefinitionItem,
  onClickEditItem,
  onClickDeleteItem,
}: {
  procedureDefinitionItem: ProcedureExecutionOrder;
  onClickEditItem: (procedureDefinitionItem: ProcedureExecutionOrder) => void;
  onClickDeleteItem: (procedureDefinitionItem: ProcedureExecutionOrder) => void;
}) => {
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(
    null
  );

  const handleOpenItemOptionsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseItemOptions = () => {
    setAnchorElement(null);
  };

  return (
    <ListItem
      key={`${procedureDefinitionItem.execution_group_number}-${procedureDefinitionItem.execution_group_name}-${procedureDefinitionItem.procedure_definition_name}`}
    >
      <ListItemText
        primary={`(${procedureDefinitionItem.execution_group_number}) ${procedureDefinitionItem.execution_group_name}`}
        secondary={
          <>
            <p>
              Procedure Definition:{" "}
              {procedureDefinitionItem.procedure_definition_name}
            </p>
            <p>
              Allow Skip?{" "}
              {procedureDefinitionItem.allow_skip ? "True" : "False"}
            </p>
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={(event) => {
            handleOpenItemOptionsClick(event);
          }}
        >
          <MoreVertOutlined />
        </IconButton>
        <Menu
          id={`menu-${procedureDefinitionItem.procedure_definition}`}
          open={Boolean(anchorElement)}
          anchorEl={anchorElement}
          keepMounted
          onClose={handleCloseItemOptions}
        >
          <MenuItem
            onClick={() => {
              handleCloseItemOptions();
              onClickEditItem(procedureDefinitionItem);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseItemOptions();
              onClickDeleteItem(procedureDefinitionItem);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ProcedureDefinitionItem;
