import React from "react";
import {
  Grid,
  Button,
  Typography,
  Chip,
  makeStyles,
  Box,
} from "@material-ui/core";
import { SketchPicker } from "react-color";

import { ThreadedViewer } from "../../../common/threadedViewer/threadedViewer";

const useStyles = makeStyles((theme) => ({
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    /*zIndex: '2',*/
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
}));

export const TestPage = () => {
  const [open, setOpen] = React.useState(false);
  const [hexColor, setColor] = React.useState("#ffffff");
  const [textColor, setText] = React.useState("white");

  const styles = useStyles();

  const handleClose = () => {
    setOpen(!open);
  }

  const handleColor = (color : any) => {
    console.log(color);
    setColor(color.hex);
  }

  React.useEffect(() => {
    if (hexColor){
      let r = parseInt(hexColor.substr(1, 2), 16);
      let g = parseInt(hexColor.substr(3, 2), 16);
      let b = parseInt(hexColor.substr(5, 2), 16);
      const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
      setText((brightness > 125) ? "black" : "white");
  };
 }, [hexColor]);

  return (
    <>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <ThreadedViewer />
        </Grid>
        <Grid item xs={12}>
          <Chip
            size="medium"
            label="Change My Color"
            style={{backgroundColor: hexColor, color: textColor}}
            onClick={handleClose}
          />
          { open ? (
          <Box className={ styles.popover }>
            <Box className={ styles.cover } onClick={ handleClose }/>
              <SketchPicker color={ hexColor } onChange={ handleColor } disableAlpha={true} />
          </Box>
          ) : null}
        </Grid>
      </Grid>
    </>
  )
};
