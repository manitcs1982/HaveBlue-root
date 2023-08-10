import React from "react";
import { Button, useTheme } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export const BackButton = () => {
  const theme = useTheme();
  const history = useHistory();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {history.goBack()}}
      >
      Return
    </Button>
  )

}
