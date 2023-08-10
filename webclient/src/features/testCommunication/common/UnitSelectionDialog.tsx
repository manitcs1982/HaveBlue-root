import React from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme, MenuItem } from "@material-ui/core";

export const UnitSelectionDialog = ({
  units,
  setSelectedUnit,
  setOpen,
  isOpen,
}: any) => {
  const theme = useTheme();
  const [tempUnit, setTempUnit] = React.useState<any>(null);

  const handleClose = () => {
    setOpen(false);
    setTempUnit(null);
  };

  const submitUnit = () => {
    setSelectedUnit(tempUnit);
    setOpen(false);
    setTempUnit(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Please select a unit from the following list:
      </DialogTitle>
      <DialogContent>
        <div style={theme.container}>
          <TextField
            id="unit"
            type="text"
            data-testid="unit"
            name="unit"
            select={true}
            label="Units"
            fullWidth
          >
            {units?.map((unit: any) => (
              <MenuItem
                key={unit.id}
                value={unit.url}
                onClick={() => setTempUnit(unit)}
              >
                {unit.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={submitUnit} color="primary">
          Ok
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
