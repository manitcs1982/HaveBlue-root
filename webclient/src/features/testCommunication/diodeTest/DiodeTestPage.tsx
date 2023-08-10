import React from "react";
import { Grid, useTheme } from "@material-ui/core";
import { TestCommunicationForm } from "../common/TestComunicationForm";
import { DiodeTester } from "./DiodeTester";
import { HistoricUserCapture } from "../common/HistoricUserCapture";

export const DiodeTestPage = ({
  historicData,
  unitData,
  unitTypeData,
  closeHistoricModal,
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
            visualizer="diode_test"
            historicData={historicData}
            unitData={unitData}
            unitTypeData={unitTypeData}
            setStartDateTime={setStartDateTime}
          />
        </Grid>
        <Grid item xs={12}>
          {testerData && selectedProcedureResult && (
            <DiodeTester
              testerData={testerData}
              procedureResultData={selectedProcedureResult}
              assetData={selectedAsset}
              setClearedValues={setClearedValues}
              historicUser={historicUser}
              historicDate={historicDate}
              historicData={historicData}
              historicDisposition={historicDisposition}
              closeHistoricModal={closeHistoricModal}
              startDateTime={startDateTime}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};
