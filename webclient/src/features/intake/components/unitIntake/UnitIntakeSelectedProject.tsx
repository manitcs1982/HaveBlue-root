import React from "react";
import { useExpectedUnitDetails, useWorkOrderDetails, useProjectDetails, useWorkOrder } from "../../intakeQueries";
import { UnitIntakeExpectedUnitTypesTable } from "./UnitIntakeExpectedUnitTypesTable";
import { UnitIntakeArrivedUnitsTable } from "./UnitIntakeArrivedUnitsTable";
import { UnitIntakeNewPage } from "./UnitIntakeNewPage";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import { useTheme } from "@material-ui/core";

import { ErrorMessage } from "../../../common/ErrorMessage";

import {
  useProjectNotes,
} from "../../../projectManagement/projectQueries";
import { NotePopup } from "../../../common/notePopupBlocker";

import { getNoteType } from "../../../../util/searchData";

export const UnitIntakeSelectedProject = () => {
  const { projectid } = useParams() as { projectid : string };
  const { workOrderid } = useParams() as { workOrderid : string };
  const [activeUnitIntakeExpectedUnitTypeId, setUnitIntakeId] = React.useState("");
  const [unitIntakeType, setUnitIntakeType] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const {
    data: projectDetailsData,
    error: errorProjectDetails,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
    isSuccess: isSuccessProjectDetails,
  } = useWorkOrderDetails(workOrderid);

  const {
    data: expectedUnitDetailsData,
    error: errorExpectedUnitDetails,
    isLoading: isLoadingExpectedUnitDetails,
    isError: isErrorExpectedUnitDetails,
    isSuccess: isSuccessExpectedUnitDetails,
  } = useExpectedUnitDetails(activeUnitIntakeExpectedUnitTypeId);

  const {
    data: projectData,
    isLoading: isLoadingProject,
    isError: isErrorProject,
  } = useProjectDetails(projectid);

  const {
    data: workOrderData,
    isLoading: isLoadingWorkOrder,
    isError: isErrorWorkOrder,
  } = useWorkOrder(workOrderid);

  React.useEffect(() => {
      if (projectData) { console.log(projectData)
          if (projectData.notes.length !== 0
              && projectData.notes[getNoteType("SRI Note", projectData.notes)]?.count !== 0){
              setOpen(true);
          }
    }
  }, [projectData])


  if (isLoadingProjectDetails || isLoadingExpectedUnitDetails || isLoadingProject || isLoadingWorkOrder) {
    return (
      <Backdrop open={isLoadingProjectDetails || isLoadingExpectedUnitDetails || isLoadingProject || isLoadingWorkOrder}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isErrorProjectDetails || isErrorExpectedUnitDetails || isErrorProject || isErrorWorkOrder) {
    return (
      <>
        {isErrorProjectDetails && <ErrorMessage error={errorProjectDetails} />}
        {isErrorExpectedUnitDetails && <ErrorMessage error={errorExpectedUnitDetails} />}
        {isErrorProject && <ErrorMessage error={isErrorProject} />}
        {isErrorWorkOrder && <ErrorMessage error={isErrorWorkOrder} />}
      </>
    );
  }

  return(
    <Container>
      <>
        {isSuccessProjectDetails && (
          <UnitIntakeExpectedUnitTypesTable
            data={projectDetailsData}
            activeUnitIntakeExpectedUnitTypeId={activeUnitIntakeExpectedUnitTypeId}
            setUnitIntakeId={setUnitIntakeId}
            setUnitIntakeType={setUnitIntakeType}
          />
        )}
        {activeUnitIntakeExpectedUnitTypeId &&
          isSuccessExpectedUnitDetails && (
            <>
              <UnitIntakeArrivedUnitsTable data={expectedUnitDetailsData.units} />
              <UnitIntakeNewPage
                activeArrivedUnits={expectedUnitDetailsData.units}
                project={projectData}
                workOrder={workOrderData}
                unitIntakeType={unitIntakeType}
                activeUnitIntakeExpectedUnitTypeId={activeUnitIntakeExpectedUnitTypeId}
              />
            </>
          )}
        <NotePopup
          type={2}
          id={projectid}
          getNotes={useProjectNotes}
          open={open}
          setOpen={setOpen}
          header={`Please read & review the following notes. They are pertinent to the project for intake. Clicking \"ACKNOWLEDGE\" will record your confirmation that you have read all of the notes`} />
      </>
    </Container>
  );
}
