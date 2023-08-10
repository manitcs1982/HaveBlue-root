import React from "react";
import { Grid, LinearProgress, useTheme } from "@material-ui/core";

import { TestCommunicationForm } from "../common/TestComunicationForm";
import { VisualInspectionTester } from "./VisualInspectionTester";
import { useDispositionsByName } from "../../common/services/dispositionServices";

import { ErrorMessage } from "../../common/ErrorMessage";
import { HistoricUserCapture } from "../common/HistoricUserCapture";

export const VisualInspectionPage = ({
  historicData,
  unitData,
  unitTypeData,
  closeHistoricModal,
  setIsSubmitting,
}: any) => {
  const theme = useTheme();
  const [testerData, setTesterData] = React.useState(null);
  const [selectedProcedureResult, setSelectedProcedureResult] =
    React.useState(null);
  const [selectedAsset, setSelectedAsset] = React.useState(null);
  const [clearedValues, setClearedValues] = React.useState(false);
  const [historicUser, setHistoricUser] = React.useState(null);
  const [historicDate, setHistoricDate] = React.useState(null);
  const [historicDisposition, setHistoricDisposition] = React.useState(null);
  const [startDateTime, setStartDateTime] = React.useState("");
  const {
    error: errorDispositionPassed,
    data: dispositionPassed,
    isLoading: isLoadingDispositionPassed,
    isError: isErrorDispositionPassed,
  } = useDispositionsByName("Pass");

  const {
    error: errorDispositionRequiresReview,
    data: dispositionRequiresReview,
    isLoading: isLoadingDispositionRequiresReview,
    isError: isErrorDispositionRequiresReview,
  } = useDispositionsByName("Requires Review");

  if (isLoadingDispositionPassed || isLoadingDispositionRequiresReview) {
    return (
      <div style={theme.containerMargin}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (isErrorDispositionPassed || isErrorDispositionRequiresReview) {
    return (
      <>
        {isErrorDispositionPassed && (
          <ErrorMessage error={errorDispositionPassed} />
        )}
        {isErrorDispositionRequiresReview && (
          <ErrorMessage error={errorDispositionRequiresReview} />
        )}
      </>
    );
  }

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="flex-start"
      spacing={2}
    >
      {historicData && (
        <Grid item xs={12}>
          <HistoricUserCapture
            historicUser={historicUser}
            setHistoricUser={setHistoricUser}
            historicDate={historicDate}
            setHistoricDate={setHistoricDate}
            historicDisposition={historicDisposition}
            setHistoricDisposition={setHistoricDisposition}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <TestCommunicationForm
          testerData={testerData}
          setTesterData={setTesterData}
          selectedProcedureResult={selectedProcedureResult}
          setSelectedProcedureResult={setSelectedProcedureResult}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          clearedValues={clearedValues}
          setClearedValues={setClearedValues}
          visualizer="visual_inspection"
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          setStartDateTime={setStartDateTime}
        />
      </Grid>
      <Grid item xs={12}>
        {dispositionRequiresReview &&
          dispositionPassed &&
          testerData &&
          selectedProcedureResult && (
            <VisualInspectionTester
              testerData={testerData}
              procedureResultData={selectedProcedureResult}
              assetData={selectedAsset}
              setClearedValues={setClearedValues}
              dispositionRequiresReview={dispositionRequiresReview}
              dispositionPassed={dispositionPassed}
              historicUser={historicUser}
              historicDate={historicDate}
              historicData={historicData}
              historicDisposition={historicDisposition}
              closeHistoricModal={closeHistoricModal}
              setIsSubmitting={setIsSubmitting}
              startDateTime={startDateTime}
            />
          )}
      </Grid>
    </Grid>
  );
};
