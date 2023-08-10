import React from "react";
import { Container, Paper, Typography, useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import { useUnitTypeDetails } from "../../projectManagementQueries";
import Backdrop from "@material-ui/core/Backdrop";

import CircularProgress from "@material-ui/core/CircularProgress";
import { DropzoneArea } from "material-ui-dropzone";
import { useFetchContext } from "../../../common/FetchContext";
import { toast } from "react-toastify";
import { useLinkFileToUnitType } from "../../projectManagementMutations";
import { usePostFile } from "../../../common/services/fileServices";
import { useQueryClient } from "react-query";
import { useAuthContext } from "../../../common/AuthContext";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { processErrorOnMutation } from "../../../../util/errorMessaging";

export const AddDatasheetsPage = () => {
  const theme = useTheme();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { authAxios } = useFetchContext();
  const { dispatch } = useAuthContext();
  const { unitTypeId } = useParams() as {
    unitTypeId: string;
  };
  const {
    data: unitTypeDetailsData,
    error: errorUnitTypeDetails,
    isLoading: isLoadingUnitTypeDetails,
    isError: isErrorUnitTypeDetails,
  } = useUnitTypeDetails(unitTypeId);

  const { mutateAsync: mutatePostFile } = usePostFile();
  const { mutateAsync: mutateLinkFileToUnitType } = useLinkFileToUnitType();

  const [files, setFiles] = React.useState([]);

  if (isLoadingUnitTypeDetails) {
    return (
      <Backdrop open={isLoadingUnitTypeDetails}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (isErrorUnitTypeDetails) {
    return <ErrorMessage error={errorUnitTypeDetails} />;
  }

  const handleFileChange = (uploadedFiles: any) => {
    setFiles(uploadedFiles);
  };

  const submitDatasheets = async () => {
    try {
      for (let file of files) {
        const postedFile = await mutatePostFile({ authAxios, file });
        await mutateLinkFileToUnitType({
          fileId: postedFile.id,
          unitTypeId,
        });
      }

      queryClient.invalidateQueries(["unitTypeDetails", String(unitTypeId)]);

      history.push(`/engineering/unit_type/${unitTypeId}`);
      toast.success("Datasheets succesfully added to unit type");
    } catch (error) {
      toast.error("Error while adding datasheets to unit type. ");
      processErrorOnMutation(error, dispatch, history);
    }
  };

  const openUnitTypeDetails = (event: React.SyntheticEvent) =>
    history.push(`/engineering/unit_type/${unitTypeId}`);

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <Typography variant="h4">Add Datasheets</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <div style={theme.containerPadding}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      Manufacturer:{unitTypeDetailsData.manufacturer_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body2">
                      Model:{unitTypeDetailsData.model}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body2">
                      BOM:{unitTypeDetailsData.bom}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      Unit Type Family:{unitTypeDetailsData.unit_type_family}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Upload datasheet(s) (optional)</Typography>
          </Grid>
          <Grid item xs={12}>
            <DropzoneArea
              acceptedFiles={["image/*", ".pdf",".pan"]}
              onChange={(files) => handleFileChange(files)}
              filesLimit={
                process.env.REACT_APP_FILE_LIMIT
                  ? parseInt(process.env.REACT_APP_FILE_LIMIT)
                  : 20
              }
              maxFileSize={12000000}
              data-testid="fileUploadCrate"
            />
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              spacing={3}
              direction="row"
              justify="space-around"
              alignItems="center"
              style={{ marginTop: 32 }}
            >
              <Grid item xs={2}>
                <Button
                  data-testid="submitDatasheetId"
                  variant="contained"
                  color="primary"
                  onClick={submitDatasheets}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setFiles([])}
                >
                  Clear
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  data-testid="returnToDetails"
                  variant="contained"
                  color="primary"
                  onClick={openUnitTypeDetails}
                >
                  Return to Details
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
