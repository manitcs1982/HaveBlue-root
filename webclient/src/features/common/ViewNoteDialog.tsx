import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import RichTextEditor from 'react-rte';

export const ViewNote = ({note, open, handleClose} : any) => {

  return(
    <div>
   <Dialog
     open={open}
     onClose={handleClose}
     aria-labelledby="scroll-dialog-title"
     aria-describedby="scroll-dialog-description"
     fullWidth={true}
     maxWidth={"md"}
   >
     <DialogTitle id="scroll-dialog-title">{note.subject}</DialogTitle>
     <DialogContent dividers={true}>
       <RichTextEditor
         value={note.text}
         readOnly={true}
       />
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
