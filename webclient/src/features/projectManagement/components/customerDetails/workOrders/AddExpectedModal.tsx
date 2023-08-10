import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

import {
  useTheme,
  Grid,
  LinearProgress,
  TextField,
  MenuItem,
} from "@material-ui/core/";

import { useUnitTypes } from "../../../projectManagementQueries";
import { useExpectedUnitType } from "../../../projectManagementMutations";
import { useFetchContext } from "../../../../common/FetchContext";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";

export const AddExpectedModal = ({ project }: any) => {
  const theme = useTheme();
  const { authAxios } = useFetchContext();
  const { mutateAsync: mutate } = useExpectedUnitType();
  const [open, setOpen] = React.useState(false);
  const [selectedUnitType, setSelectedUnitType] = React.useState("");
  const [count, setCount] = React.useState("");
  const queryClient = useQueryClient();

  const { data: unitTypesData = [], isLoading: isLoadingUnitTypes } =
    useUnitTypes();

  const handleClick = () => {
    setCount("");
    setSelectedUnitType("");
    setOpen(!open);
  };

  const handleSubmit = async () => {
    try {
      await mutate({
        project: project,
        expected_count: count,
        received_count: "0",
        unit_type: selectedUnitType,
      });
      queryClient.invalidateQueries("project");
      toast.success("Units Successfully Added");
    } catch (error) {
      queryClient.invalidateQueries("project");
      toast.success("Error while adding units.");
      processErrorOnMutation(error);
    }

    handleClick();
  };

  const changeUnitType = (event: any) => {
    setSelectedUnitType(event.target.value);
  };

  const changeCount = (event: any) => {
    setCount(event.target.value);
  };

  return (
    <div>
      <Button
        style={theme.btnNew}
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Add
      </Button>
      <Dialog
        open={open}
        onClose={handleClick}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="scroll-dialog-title">
          Add Expected Unit Types
        </DialogTitle>
        <DialogContent dividers={true}>
          {isLoadingUnitTypes ? (
            <div style={theme.containerMargin}>
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
            </div>
          ) : (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={4}
            >
              <Grid item xs={5}>
                <TextField
                  id="expectedCount"
                  name="expectedCount"
                  data-testid="expectedCount"
                  label="Expected Unit Count"
                  type="number"
                  value={count}
                  onChange={changeCount}
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  id="unitType"
                  type="text"
                  data-testid="unitType"
                  name="unitType"
                  select
                  label="Unit Type"
                  value={selectedUnitType}
                  onChange={changeUnitType}
                  fullWidth
                >
                  {unitTypesData?.map((unitType: any) => (
                    <MenuItem key={unitType.id} value={unitType.url}>
                      {unitType.model}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick} color="primary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
