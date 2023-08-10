import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useCharacterizationQueueByAssetName } from "../../projectManagement/components/opsQueues/opsQueuesQueries";
import { ErrorMessage } from "../../common/ErrorMessage";

const CharacterizationQueueDialog = ({
  historicData,
  procedureResultData,
  assetData,
}: {
  historicData: any | undefined;
  procedureResultData: any;
  assetData: any | undefined;
}) => {
  let characterizationName = historicData
    ? historicData.procedure_definition_name
    : procedureResultData.procedure_definition_name;
  const [isOpen, setOpen] = React.useState<boolean>(false);

  const {
    data: characterizations,
    error: characterizationsError,
    isLoading: isLoadingCharacterizations,
    isError: isErrorCharacterizations,
  } = useCharacterizationQueueByAssetName(assetData?.name);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoadingCharacterizations) {
    return <LinearProgress />;
  }

  if (isErrorCharacterizations) {
    return <ErrorMessage error={characterizationsError} />;
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Characterization Queue
      </Button>
      <Dialog onClose={handleClose} open={isOpen}>
        <DialogTitle>Unit Queued for this Characterization</DialogTitle>
        <DialogContent>
          <p>{characterizationName}</p>
          {characterizations ? (
            <List>
              {characterizations.map((unitQueued: any) => (
                <>
                  <ListItem>
                    <ListItemText
                      primary={`Unit number: ${unitQueued.serial_number}`}
                      secondary={
                        <>
                          <p>{`Work Order: ${unitQueued.work_order}`}</p>
                          <p>{`Project: ${unitQueued.project_number}`}</p>
                        </>
                      }
                    />
                  </ListItem>

                  <Divider />
                </>
              ))}
            </List>
          ) : (
            <Typography variant="h6">
              There's no units queued for this characterization
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CharacterizationQueueDialog;
