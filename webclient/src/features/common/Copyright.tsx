import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";

export const Copyright = () => {
  return (
    <Box mt={8}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <MuiLink color="inherit" href="http://www.pvel.com">
          PVEL LLC INC.
        </MuiLink>
        {new Date().getFullYear()}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {`Version ${process.env.REACT_APP_LSDB_BUILD}`}
      </Typography>
    </Box>
  );
};
