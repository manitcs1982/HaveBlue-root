import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { toast } from "react-toastify";

import {
  useTheme,
  Grid,
  LinearProgress,
  TextField,
  MenuItem,
} from "@material-ui/core/";

import { useTestSequenceDefinitions } from "../../../projectManagementQueries";
import { processErrorOnMutation } from "../../../../../util/errorMessaging";
import { useAppendTestSequenceToUnit } from "../../../projectManagementMutations";
import { ErrorMessage } from "../../../../common/ErrorMessage";

export const TestSequenceDefinitionModal = ({
  unit,
  isOpen,
  handleClose,
}: any) => {
  const theme = useTheme();

  const [selectedTestSequenceDefinition, setSelectedTestSequenceDefinition] =
    React.useState<any>(null);
  const { mutateAsync: mutateAppendTestSequenceToUnit } =
    useAppendTestSequenceToUnit();

  const {
    data: testSequenceDefinitions,
    isLoading: isLoadingTestSequenceDefinitions,
    isError: isErrorTestSequenceDefinitions,
    error: errorTestSequenceDefinitions,
  } = useTestSequenceDefinitions(true);

  const handleClick = (testSequenceDefinition: any) => () => {
    setSelectedTestSequenceDefinition(testSequenceDefinition);
  };

  if (isLoadingTestSequenceDefinitions) {
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

  if (isErrorTestSequenceDefinitions) {
    return <ErrorMessage error={errorTestSequenceDefinitions} />;
  }

  const handleSubmit = async () => {
    try {
      await mutateAppendTestSequenceToUnit({
        unitId: unit.id,
        testSequenceDefinitionId: selectedTestSequenceDefinition?.id,
      });

      toast.success("Test sequence was succesfully appended");
    } catch (error) {
      toast.success("Error while appending test sequence.");
      processErrorOnMutation(error);
    }
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="scroll-dialog-title">
          {`Assing test sequence to unit ${unit?.serial_number}`}
        </DialogTitle>
        <DialogContent dividers={true}>
          {isLoadingTestSequenceDefinitions ? (
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
              <Grid item xs={7}>
                <TextField
                  id="testSequenceDefinitions"
                  type="text"
                  data-testid="testSequenceDefinitions"
                  name="testSequenceDefinitions"
                  select
                  label="Test Sequence Definitions"
                  fullWidth
                >
                  {testSequenceDefinitions?.map(
                    (testSequenceDefinition: any) => (
                      <MenuItem
                        key={testSequenceDefinition.id}
                        value={testSequenceDefinition.url}
                        onClick={handleClick(testSequenceDefinition)}
                      >
                        {testSequenceDefinition.name}(
                        {testSequenceDefinition.version})
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Append
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
