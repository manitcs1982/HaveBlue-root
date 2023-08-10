import React from "react";
import { DiodeTestPage } from "../diodeTest/DiodeTestPage";
import { VisualInspectionPage } from "../visualInspection/VisualInspectionPage";
import { WetLeakagePage } from "../wetLeakage/WetLeakagePage";
import { ColorTestPage } from "../colorimeter/ColorTestPage";
import { ELTestPage } from "../elHistoric/ELTestPage";
import { FlashTestPage } from "../flashHistoric/FlashTestPage";
import { IAMTestPage } from "../IAMHistoric/IAMTestPage";
import { StressEntryHistoricalModal } from "../../projectManagement/components/stressEntry/StressEntryHistoricalModal";

export const VisualizerModal = ({
  historicData,
  unitData,
  unitTypeData,
  closeHistoricModal,
}: any) => {
  switch (historicData?.visualizer) {
    case "wet_leakage":
      return (
        <WetLeakagePage
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          closeHistoricModal={closeHistoricModal}
        />
      );
    case "diode":
      return (
        <DiodeTestPage
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          closeHistoricModal={closeHistoricModal}
        />
      );
    case "visual_inspection":
      return (
        <VisualInspectionPage
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          closeHistoricModal={closeHistoricModal}
        />
      );
    case "colorimeter":
      return (
        <ColorTestPage
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          closeHistoricModal={closeHistoricModal}
        />
      );
    case "el_image":
      return (
        <ELTestPage
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          closeHistoricModal={closeHistoricModal}
        />
      );
    case "iv_curve":
      return (
        <FlashTestPage
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          closeHistoricModal={closeHistoricModal}
        />
      );
    case "stress":
      return (
        <StressEntryHistoricalModal
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          closeHistoricModal={closeHistoricModal}
        />
      );
    case "iam":
      return (
        <IAMTestPage
          historicData={historicData}
          unitData={unitData}
          unitTypeData={unitTypeData}
          closeHistoricModal={closeHistoricModal}
        />
      );
  }
  return null;
};
