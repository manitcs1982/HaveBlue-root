import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";

const NewModelPage: React.FC<{ pageTitle: string }> = ({
  children,
  pageTitle,
}) => {
  return (
    <>
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography variant="h3">{pageTitle}</Typography>
          </Grid>

          {/*The actual form */}
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default NewModelPage;
