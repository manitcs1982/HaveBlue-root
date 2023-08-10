import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { TagCreation } from "../projectManagement/components/tagCreation/TagCreation";

export const NewLabel = ({isOpen, setOpen} : any) => {


  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"xl"}
      >
        <DialogContent>
           <TagCreation />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(!isOpen)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
