import React from "react";
import { Grid, Typography, TextField, Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import { DropzoneArea } from "material-ui-dropzone";
import { toast } from "react-toastify";

import { useQueryClient } from "react-query";
import { useFetchContext } from "./FetchContext";
import { useLinkFileToNote } from "./CommonMutations";
import { usePostFile } from "./services/fileServices";

export const UploadAttachmentsModal = ({ id, mutate, open, setOpen }: any) => {
  const { authAxios } = useFetchContext();
  const { mutateAsync: mutatePostFile } = usePostFile();

  const saveFiles = async (files: any) => {
    if (files.length > 0) {
      try {
        let newFile = await mutatePostFile({
          authAxios,
          file: files[files.length - 1],
        });
        await mutate({
          authAxios,
          fileId: newFile.id,
          id: id,
        });
        toast.success("File uploaded.");
      } catch (error) {
        toast.error(`Error uploading file: ${error}`);
      }
    }
  };

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography variant="h4">Add Files</Typography>
            </Grid>
            <Grid item xs={12}>
              <DropzoneArea
                //acceptedFiles={["*"]}
                filesLimit={
                  process.env.REACT_APP_FILE_LIMIT
                    ? parseInt(process.env.REACT_APP_FILE_LIMIT)
                    : 20
                }
                maxFileSize={12000000}
                onChange={saveFiles}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(!open);
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
