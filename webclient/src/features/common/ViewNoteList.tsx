import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  Typography,
  Grid,
  Divider,
} from '@material-ui/core';
import NoteIcon from '@material-ui/icons/Note';


export const ViewNoteList = ({notes} : any) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
      setOpen(!open);
  }

  console.log(notes);

  return(
    <div>
    <Button
      style={{ textAlign: "center" }}
      variant="contained"
      color="primary"
      onClick={handleClose}
      fullWidth={true}
      startIcon={<NoteIcon />}
    >
    </Button>
   <Dialog
     open={open}
     onClose={handleClose}
     aria-labelledby="scroll-dialog-title"
     aria-describedby="scroll-dialog-description"
     fullWidth={true}
     maxWidth={"md"}
   >
     <DialogTitle id="scroll-dialog-title">Attached Notes</DialogTitle>
     <DialogContent>
      <Divider variant="fullWidth" />
         {notes?.map((note : any) => (
           <>
             <Grid
               container
               direction="column"
               alignItems="flex-start"
               spacing={2}
             >
               <Grid item xs={12} style={{marginBottom: 4, marginTop: 8}}>
                 <Typography variant="h4">
                   {note.subject}
                 </Typography>
               </Grid>
               <Grid item xs={12} style={{marginBottom: 12}}>
                 <Typography variant="body2">
                   {note.text}
                 </Typography>
               </Grid>
             </Grid>
             <Divider variant="fullWidth" />
           </>
         ))}
     </DialogContent>
     <DialogActions>
       <Button onClick={handleClose} color="primary">
         Close
       </Button>
     </DialogActions>
   </Dialog>
 </div>
  );
}
