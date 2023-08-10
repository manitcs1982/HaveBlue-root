import React from "react";
import {
  Divider,
  Button,
  Tooltip,
  Paper,
  Grid,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  TextField,
  MenuItem,
} from "@material-ui/core";

import CameraAltIconOutlined from "@material-ui/icons/CameraAltOutlined";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

import { ThreadedFileModal } from "./threadedFileModal";

export const ThreadedFiles = () => {

  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<any[]>([]);

  return (
    <>
    <Card>
      <CardContent>
        <Typography variant="h4">
          Files:
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {setOpen(!open);}}
          startIcon={files[0] ? (
            <CameraAltIcon/>
          ) : (
            <CameraAltIconOutlined/>
          )}/>
      </CardContent>
    </Card>
    <ThreadedFileModal image={files} setImage={setFiles} open={open} setOpen={setOpen} />
    </>
  )
}
