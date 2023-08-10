import React from "react";
import {
  Typography,
  Grid,
  Divider,
  Button,
  Tooltip,
  LinearProgress,
  makeStyles,
  createStyles,
  Badge,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import { SimpleNoteList } from "../common/SimpleNoteList";
import { useProcedureNotes } from "./dataEgressQueries";
import { ErrorMessage } from "../common/ErrorMessage";
import { motion } from "framer-motion";
import { FlagAnimationVariants } from "../common/util";
import every from "lodash/every";

const useStyles = makeStyles(() =>
  createStyles({
    colorSecondary: {
      backgroundColor: "black",
    },
  })
);

export const VisualizerNotesModal = ({ procedureId, name }: any) => {
  const [isVisualizerNotesModalOpen, setIsVisualizerModalOpen] =
    React.useState(false);
  const classes = useStyles();
  const {
    error: errorProcedureNotes,
    data: procedureNotes,
    isSuccess: isSuccessProcedureNotes,
    isLoading: isLoadingProcedureNotes,
    isError: isErrorProcedureNotes,
  } = useProcedureNotes(procedureId);

  if (isLoadingProcedureNotes) {
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

  if (isErrorProcedureNotes) {
    return <ErrorMessage error={errorProcedureNotes} />;
  }

  const closeModal = () => {
    setIsVisualizerModalOpen(false);
  };

  const areAllFlagsClosed = () => {
    return every(procedureNotes, {
      note_type_name: "Flag",
      disposition_name: "Completed",
    });
  };

  return (
    <div>
      {procedureNotes.length > 0 && !areAllFlagsClosed() && (
        <Tooltip title="View Flags">
          <Button
            style={{ textAlign: "center" }}
            variant="contained"
            component={motion.div}
            variants={FlagAnimationVariants}
            initial="initialFlagButton"
            animate="animateFlagButton"
            color="primary"
            onClick={() => {
              setIsVisualizerModalOpen(true);
            }}
            endIcon={<EditIcon />}
            fullWidth
          >
            {procedureNotes.length}
          </Button>
        </Tooltip>
      )}
      {procedureNotes.length > 0 && areAllFlagsClosed() && (
        <Tooltip title="All flags are closed" placement="right-start">
          <Badge
            classes={{
              colorSecondary: classes.colorSecondary,
            }}
            color="secondary"
            badgeContent=""
            style={{ display: "inherit" }}
          >
            <Button
              style={{ textAlign: "center" }}
              variant="contained"
              color="secondary"
              onClick={() => {
                setIsVisualizerModalOpen(true);
              }}
              endIcon={<EditIcon />}
              fullWidth
            >
              {procedureNotes.length}
            </Button>
          </Badge>
        </Tooltip>
      )}

      <Dialog
        open={isVisualizerNotesModalOpen}
        onClose={closeModal}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"md"}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
      >
        <DialogTitle>{`Flags for ${name}`}</DialogTitle>
        <DialogContent>
          <SimpleNoteList notes={procedureNotes} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
