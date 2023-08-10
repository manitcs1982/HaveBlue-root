import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const IdButton = ({ path, id }: { path: string; id: string }) => {
  const history = useHistory();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        history.push(`${path}`);
      }}
    >
      {id}
    </Button>
  );
};

export default IdButton;
