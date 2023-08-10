import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/Button";
import PoolIcon from "@material-ui/icons/Pool";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import SearchIcon from "@material-ui/icons/Search";
import CameraIcon from "@material-ui/icons/Camera";
import CachedIcon from "@material-ui/icons/Cached";
import FlashOnOutlinedIcon from "@material-ui/icons/FlashOnOutlined";
import Typography from "@material-ui/core/Typography";
import { Badge, createStyles, makeStyles, Tooltip } from "@material-ui/core";

import { motion } from "framer-motion";
import { FlagAnimationVariants } from "../common/util";

const useStyles = makeStyles(() =>
  createStyles({
    colorSecondary: {
      backgroundColor: "black",
    },
  })
);

export const TravelerModalButton = ({
  disposition,
  name,
  handleClose,
  open_notes,
  has_notes,
  type,
}: any) => {
  const classes = useStyles();

  const getTravelerIcon = () => {
    switch (type) {
      case "wet_leakage":
        return <PoolIcon />;
      case "colorimeter":
        return <ColorLensIcon />;
      case "diode":
      case "visual_inspection":
        return <SearchIcon />;
      case "el":
        return <CameraIcon />;
      case "stress":
        return <CachedIcon />;
      case "iv":
        return <FlashOnOutlinedIcon />;
      default:
        return null;
    }
  };

  const renderModalButton = () => {
    const travelerIcon = getTravelerIcon();
    if (disposition === "Requires Review") {
      if (has_notes && open_notes) {
        return (
          <Button
            variant="contained"
            component={motion.div}
            variants={FlagAnimationVariants}
            initial="initialFlagButton"
            animate="animateFlagButton"
            startIcon={travelerIcon}
            onClick={handleClose}
            fullWidth
          >
            Verify Data
          </Button>
        );
      } else if (has_notes && !open_notes) {
        return (
          <Tooltip title="Closed Flag" placement="right-start">
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
                color="primary"
                startIcon={travelerIcon}
                onClick={handleClose}
                fullWidth
              >
                Verify Data
              </Button>
            </Badge>
          </Tooltip>
        );
      } else {
        return (
          <Button
            style={{ textAlign: "center" }}
            variant="contained"
            color="primary"
            startIcon={travelerIcon}
            onClick={handleClose}
            fullWidth
          >
            Verify Data
          </Button>
        );
      }
    } else {
      return (
        <ButtonBase
          onClick={handleClose}
          style={{
            textAlign: "center",
            textTransform: "none",
            fontSize: 8,
            margin: 2,
          }}
          variant="text"
          fullWidth
          color="primary"
          size="small"
          startIcon={travelerIcon}
        >
          <Typography variant="body2" align="center">
            {name}
          </Typography>
        </ButtonBase>
      );
    }
  };

  return <>{renderModalButton()}</>;
};
