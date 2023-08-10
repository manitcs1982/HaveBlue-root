import React from "react";
import {
  Grid,
  useTheme,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({

  noBorder: {
    height: "35px"
  },

  topLeftBorder: {
    borderTopStyle: "solid",
    borderLeftStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  topRightBorder: {
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  bottomLeftBorder: {
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  bottomRightBorder: {
    borderBottomStyle: "solid",
    borderRightStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  leftBorder:{
    borderLeftStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  rightBorder: {
    borderRightStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  topBorder: {
    borderTopStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  bottomBorder: {
    borderBottomStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  jboxBorder: {
    borderStyle: "solid",
    borderWidth: "1px",
    height: "35px"
  },

  jboxDoubleBorder: {
    borderStyle: "solid",
    borderWidth: "1px",
    height: "70px"
  }
}));

export const PositionChartTwo = ({ position, colors } : any) => {

  const [colorStrings, setColorStrings] = React.useState<any[]>([]);
  const classes = useStyles();

  React.useEffect(() => {
    var updatedValues = [];
    for (let index = 0; index < 10; index++) {
      if (colors[index]?.l === undefined) {
        updatedValues[index] = "rgb(255, 255, 255)";
      } else if (colors[index]?.l !== 0 &&
                 colors[index]?.a !== 0 &&
                 colors[index]?.b !== 0) {
            updatedValues[index] = lab2rgb(colors[index])
      } else {
        updatedValues[index] = "rgb(255, 255, 255)";
      }
    }
    setColorStrings(updatedValues);
  }, [colors, position])

  React.useEffect(() => {
    var updatedValues = [];
    for (let index = 0; index < 10; index++) {
      if (colors[index]?.l_value === null || colors[index]?.l_value === undefined) {
        updatedValues[index] = "rgb(255, 255, 255)";
      } else if (colors[index]?.l_value !== 0 &&
                 colors[index]?.a_value !== 0 &&
                 colors[index]?.b_value !== 0) {
            updatedValues[index] = lab2rgb(colors[index])
      } else {
        updatedValues[index] = "rgb(255, 255, 255)";
      }
    }
    setColorStrings(updatedValues);
  }, [colors, position])

  const lab2rgb = (color : any) =>
  {
    var var_Y = ( color.l_value + 16. ) / 116.;
    var var_X = color.a_value / 500. + var_Y;
    var var_Z = var_Y - color.b_value / 200.;

    if ( Math.pow(var_Y,3) > 0.008856 )
      var_Y = Math.pow(var_Y,3);
    else
      var_Y = ( var_Y - 16. / 116. ) / 7.787;
    if ( Math.pow(var_X,3) > 0.008856 )
      var_X = Math.pow(var_X,3);
    else
      var_X = ( var_X - 16. / 116. ) / 7.787;
    if ( Math.pow(var_Z,3) > 0.008856 )
      var_Z = Math.pow(var_Z,3);
    else
      var_Z = ( var_Z - 16. / 116. ) / 7.787;

    var newX = 95.047 * var_X ;    //ref_X =  95.047     Observer= 2°, Illuminant= D65
    var newY = 100.000 * var_Y  ;   //ref_Y = 100.000
    var newZ = 108.883 * var_Z ;    //ref_Z = 108.883


    var_X = newX / 100. ;       //X from 0 to  95.047      (Observer = 2°, Illuminant = D65)
    var_Y = newY / 100. ;       //Y from 0 to 100.000
    var_Z = newZ / 100. ;      //Z from 0 to 108.883

    var var_R = var_X *  3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
    var var_G = var_X * -0.9689 + var_Y *  1.8758 + var_Z *  0.0415;
    var var_B = var_X *  0.0557 + var_Y * -0.2040 + var_Z *  1.0570;

    if ( var_R > 0.0031308 )
      var_R = 1.055 * Math.pow(var_R , ( 1 / 2.4 ))  - 0.055;
    else
      var_R = 12.92 * var_R;
    if ( var_G > 0.0031308 )
      var_G = 1.055 * Math.pow(var_G , ( 1 / 2.4 ) )  - 0.055;
    else
      var_G = 12.92 * var_G;
    if ( var_B > 0.0031308 )
      var_B = 1.055 * Math.pow( var_B , ( 1 / 2.4 ) ) - 0.055;
    else
      var_B = 12.92 * var_B;

    return `rgb(${var_R * 255.}, ${var_G * 255.}, ${var_B * 255.})`
  }

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
    <Grid
      container
      item
      xs={7}
      direction="row"
      justify="space-between"
      alignItems="flex-start"
      style={{ backgroundColor: "rgb(255, 255, 255)"}}
    >
      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[6]}}
      >
        <Grid item className={classes.topLeftBorder} >
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.leftBorder}>
          { position === 6 ? (
            <Typography variant="body1" align="center"
              style={{ backgroundColor: "yellow"}}>
              7
            </Typography>
          ) : (
            <Typography variant="body1" align="center">
              7
            </Typography>
          )}
        </Grid>
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
      >
        <Grid item className={classes.topBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" align="center">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" align="center">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[8]}}
      >
        <Grid item className={classes.topRightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
        { position === 8 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            9
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            9
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[9]}}
      >
        <Grid item className={classes.leftBorder}>
        { position === 9 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            10
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            10
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[7]}}
      >
        <Grid item className={classes.noBorder}>
        { position === 7 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            8
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            8
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
      >
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
      >
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
      >
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
      >
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[5]}}
      >
        <Grid item className={classes.jboxBorder}>
          <Typography variant="body1" align="center">
            {"J-Box"}
          </Typography>
        </Grid>
        <Grid item className={classes.leftBorder}>
        { position === 5 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            6
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            6
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[4]}}
      >
        <Grid item className={classes.jboxBorder}>
          <Typography variant="body1" align="center">
            {"J-Box"}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
        { position === 4 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            5
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            5
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[3]}}
      >
        <Grid item className={classes.jboxBorder}>
          <Typography variant="body1" align="center">
            {"J-Box"}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
        { position === 3 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            4
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            4
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
      >
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
      >
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
      >
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[0]}}
      >
        <Grid item className={classes.leftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.leftBorder}>
        { position === 0 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            1
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            1
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.bottomLeftBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[1]}}
      >
        <Grid item className={classes.noBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.noBorder}>
        { position === 1 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            2
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            2
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.bottomBorder}>
          <Typography variant="body1" >
            {" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={4}
        direction="column"
        style={{ backgroundColor: colorStrings[2]}}
      >
        <Grid item className={classes.rightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
        <Grid item className={classes.rightBorder}>
        { position === 2 ? (
          <Typography variant="body1" align="center"
            style={{ backgroundColor: "yellow"}}>
            3
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            3
          </Typography>
        )}
        </Grid>
        <Grid item className={classes.bottomRightBorder}>
          <Typography variant="body1">
            {" "}
          </Typography>
        </Grid>
      </Grid>

    </Grid>
    </Grid>
  )
}
