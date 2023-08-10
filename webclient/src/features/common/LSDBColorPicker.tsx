import React from "react";
import { Box, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ColorResult, SketchPicker } from "react-color";
import { calculateTextColor } from "../../util/helpers";

const useStyles = makeStyles(() => ({
  swatch: {
    padding: "5px",
    background: "#fff",
    borderRadius: "1px",
    boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
    display: "inline-block",
    cursor: "pointer",
  },
  popover: {
    position: "absolute",
    zIndex: 3,
  },
  cover: {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  },
}));

const LSDBColorPicker = ({
  chipSize = "medium",
  initialHexColor = "#000000",
  chipLabel,
  onChange,
}: {
  chipSize?: "small" | "medium";
  initialHexColor?: string;
  chipLabel: string;
  onChange: (hexColor: string) => void;
}) => {
  const styles = useStyles();

  const [colorPickerIsOpen, setColorPickerIsOpen] = React.useState(false);
  const [hexColor, setHexColor] = React.useState(initialHexColor);
  const [textColor, setTextColor] = React.useState("white");

  const toggleColorPicker = () => {
    setColorPickerIsOpen((prevState) => !prevState);
  };

  const handleChangeColor = (color: ColorResult) => {
    setHexColor(color.hex);
    onChange(color.hex);
  };

  React.useEffect(() => {
    if (hexColor) {
      setTextColor(calculateTextColor(hexColor));
    }
  }, [hexColor]);

  return (
    <>
      <Chip
        size={chipSize}
        label={chipLabel}
        style={{
          backgroundColor: hexColor,
          color: textColor,
          marginBottom: 32,
        }}
        onClick={toggleColorPicker}
      />
      {colorPickerIsOpen && (
        <Box className={styles.popover}>
          <Box className={styles.cover} onClick={toggleColorPicker} />
          <SketchPicker
            color={hexColor}
            onChange={handleChangeColor}
            disableAlpha={true}
          />
        </Box>
      )}
    </>
  );
};

export default LSDBColorPicker;
