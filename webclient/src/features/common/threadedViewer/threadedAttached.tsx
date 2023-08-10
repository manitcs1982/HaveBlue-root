import React from "react";
import {
  Divider,
  Button,
  Tooltip,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
} from "@material-ui/core";

import { DiodeTestModal } from "../../dataEgress/DiodeTestModal";
import { ELImageReviewModal } from "../../dataEgress/ELImageReviewModal";
import { ColorimeterReviewModal } from "../../dataEgress/ColorimeterModal";
import { VisualInspectionReviewModal } from "../../dataEgress/VisualInspectionReviewModal";
import { LeakedDataModal } from "../../dataEgress/LeakedDataModal";
import { IVReviewModal } from "../../dataEgress/IVReview/IVReviewModal";
import { VisualizerModal } from "../../testCommunication/common/VisualizerModal";
import { StressDataModal } from "../../dataEgress/StressDataModal";

import { TravelerModal } from "../travelerModal";
import {
  useUnitById,
  useProjectById,
  useProcedureById,
} from "../CommonQueries";
import { useDispositionsByName } from "../services/dispositionServices";
import { ErrorMessage } from "../ErrorMessage";
import { Link } from "react-router-dom";

import { useHistory } from "react-router-dom";

const RenderUnit = ({ item }: any) => {
  const {
    data: unit,
    isError: isErrorUnit,
    isLoading: isLoadingUnit,
    error: errorUnit,
  } = useUnitById(item.id);

  if (isLoadingUnit) {
    return (
      <Button variant="contained" fullWidth>
        <LinearProgress />
      </Button>
    );
  }

  return <TravelerModal serialNumber={unit.serial_number} />;
};

const RenderProject = ({ item }: any) => {
  const history = useHistory();
  const {
    data: project,
    isError: isErrorProject,
    isLoading: isLoadingProject,
    error: errorProject,
  } = useProjectById(item.id);

  if (isLoadingProject) {
    return (
      <Button variant="contained" fullWidth>
        <LinearProgress />
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      fullWidth
      component={Link}
      to={`/project_management/project_intelligence/${project.id}`}
    >
      {project.number}
    </Button>
  );
};

const RenderResult = ({ item }: any) => {
  const {
    data: procedure,
    isError: isErrorProcedure,
    isLoading: isLoadingProcedure,
    error: errorProcedure,
  } = useProcedureById(item.id);

  const {
    data: dispositionPassed,
    isLoading: isLoadingDispositionPassed,
    isError: isErrorDispositionPassed,
    error: errorDispositionPassed,
    isSuccess: isSuccessDispositionPassed,
  } = useDispositionsByName("Pass");

  if (isLoadingProcedure || isLoadingDispositionPassed) {
    return (
      <Button variant="contained" fullWidth>
        <LinearProgress />
      </Button>
    );
  }

  if (isErrorProcedure || isErrorDispositionPassed) {
    return (
      <>
        {isErrorProcedure && <ErrorMessage error={errorProcedure} />}
        {isErrorDispositionPassed && (
          <ErrorMessage error={errorDispositionPassed} />
        )}
      </>
    );
  }

  switch (procedure.visualizer) {
    case "el_image":
      return (
        <ELImageReviewModal
          id={procedure.id}
          disposition={null}
          name={procedure.procedure_definition_name}
          dispositionPassedId={dispositionPassed?.id}
          open_notes={procedure.open_notes}
          has_notes={procedure.has_notes}
        />
      );
    case "iv_curve":
      return (
        <IVReviewModal
          id={procedure.id}
          disposition={null}
          name={procedure.procedure_definition_name}
          dispositionPassedId={dispositionPassed?.id}
          open_notes={procedure.open_notes}
          has_notes={procedure.has_notes}
        />
      );
    case "wet_leakage":
      return (
        <LeakedDataModal
          id={procedure.id}
          disposition={null}
          name={procedure.procedure_definition_name}
          dispositionPassedId={dispositionPassed?.id}
          open_notes={procedure.open_notes}
          has_notes={procedure.has_notes}
        />
      );
    case "visual_inspection":
      return (
        <VisualInspectionReviewModal
          id={procedure.id}
          disposition={null}
          name={procedure.procedure_definition_name}
          dispositionPassedId={dispositionPassed?.id}
          open_notes={procedure.open_notes}
          has_notes={procedure.has_notes}
        />
      );
    case "diode":
      return (
        <DiodeTestModal
          id={procedure.id}
          disposition={null}
          name={procedure.procedure_definition_name}
          dispositionPassedId={dispositionPassed?.id}
          open_notes={procedure.open_notes}
          has_notes={procedure.has_notes}
        />
      );
    case "colorimeter":
      return (
        <ColorimeterReviewModal
          id={procedure.id}
          disposition={null}
          name={procedure.procedure_definition_name}
          dispositionPassedId={dispositionPassed?.id}
          open_notes={procedure.open_notes}
          has_notes={procedure.has_notes}
        />
      );
    case "stress":
      return (
        <StressDataModal
          id={procedure.id}
          disposition={null}
          name={procedure.procedure_definition_name}
          open_notes={procedure.open_notes}
          has_notes={procedure.has_notes}
        />
      );
    default:
      return (
        <Typography variant="body2" align="center">
          {procedure.procedure_definition_name}
        </Typography>
      );
  }
};

export const ThreadedAttached = ({ attached, isNew }: any) => {
  const renderButton = (item: any) => {
    switch (item.model_name) {
      case "unit":
        return <RenderUnit item={item} />;

      case "project":
        return <RenderProject item={item} />;

      case "procedureresult":
        return <RenderResult item={item} />;

      default:
        break;
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">Attached To:</Typography>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
            spacing={1}
          >
            {attached?.map((item: any) => {
              return (
                <Grid item xs={12}>
                  {renderButton(item)}
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
