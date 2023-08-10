import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import findIndex from "lodash/findIndex";

const useClearButtonsStyles = makeStyles((theme) => ({
  buttonSubmit: {
    color: "#369b47",
    borderColor: "#369b47",
    "&:hover": {
      background: "#369b47",
      color: "#FFFFFF",
    },
    "&:disabled": {
      color: "#369b47",
      borderColor: "#369b47",
    },
  },
  splitButtonPopper: {
    zIndex: 50,
  },
}));

export const LSDBSplitButton = ({
  options,
  onItemSelection,
  idField,
  textField,
  selectedItemText,
}: any) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<any>(null);
  const classes = useClearButtonsStyles();

  const handleMenuItemClick = (option: any) => (event: any) => {
    setOpen(false);
    onItemSelection(option);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const setSelectedOptionButton = () => {
    if (!selectedItemText) {
      return "None";
    }

    return selectedItemText;
  };

  return (
    <Grid container direction="column" alignItems="flex-start">
      <Grid item xs={12}>
        <ButtonGroup
          variant="outlined"
          ref={anchorRef}
          aria-label="split button"
        >
          <Button className={classes.buttonSubmit}>
            {setSelectedOptionButton()}
          </Button>
          <Tooltip
            title="Use the drop down menu to make your selection."
            placement="right"
          >
            <Button
              className={classes.buttonSubmit}
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
        <Popper
          className={classes.splitButtonPopper}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    <MenuItem key={-1} selected={selectedItemText === ""}>
                      None
                    </MenuItem>
                    {options.map((option: any, index: any) => {
                      return (
                        <MenuItem
                          key={option[idField]}
                          selected={option[textField] === selectedItemText}
                          onClick={handleMenuItemClick(option)}
                        >
                          {option[textField]}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
};
