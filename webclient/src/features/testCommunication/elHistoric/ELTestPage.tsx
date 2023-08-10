import React from "react";
import { Grid, useTheme } from "@material-ui/core";

import { TestCommunicationForm } from "../common/TestComunicationForm";
import { ELTester } from "./ELTester";
import { useDispositionsByName } from "../../common/services/dispositionServices";

import { ErrorMessage } from "../../common/ErrorMessage";
import { HistoricUserCapture } from "../common/HistoricUserCapture";

export const ELTestPage = ({
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
  const {
    error: errorDispositionPassed,
    data: dispositionPassed,

    isError: isErrorDispositionPassed,
  } = useDispositionsByName("Pass");

  const {
    data: dispositionRequiresReview,
    error: errorDispositionRequiresReview,
    isError: isErrorDispositionRequiresReview,
  } = useDispositionsByName("Requires Review");

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
    <div style={theme.containerMargin}>
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
        <Grid item xs={5}>
          <TestCommunicationForm
            testerData={testerData}
            setTesterData={setTesterData}
            selectedProcedureResult={selectedProcedureResult}
            setSelectedProcedureResult={setSelectedProcedureResult}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            clearedValues={clearedValues}
            setClearedValues={setClearedValues}
            visualizer="el"
            historicData={historicData}
            unitData={unitData}
            unitTypeData={unitTypeData}
          />
        </Grid>
        <Grid item xs={7}>
          {dispositionRequiresReview &&
            dispositionPassed &&
            testerData &&
            selectedProcedureResult && (
              <ELTester
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
              />
            )}
        </Grid>
      </Grid>
    </div>
  );
};
