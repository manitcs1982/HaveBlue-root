import { Button, LinearProgress } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { ErrorMessage } from "./ErrorMessage";
import { useProjectById } from "./CommonQueries";

const ProjectNumberColumnDisplay = ({
  parentObjectId,
}: {
  parentObjectId: number;
}) => {
  const history = useHistory();

  const {
    data: projectData,
    error: projectError,
    isLoading: isLoadingProject,
    isError: isErrorProject,
  } = useProjectById(parentObjectId);

  if (isLoadingProject) {
    return <LinearProgress />;
  }

  if (isErrorProject) {
    return (
      <React.Fragment>
        {isErrorProject && <ErrorMessage error={projectError} />}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {projectData && (
        <React.Fragment>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={() =>
              history.push(
                `/project_management/project_intelligence/${projectData.id}`
              )
            }
          >
            {projectData.number}
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ProjectNumberColumnDisplay;

/**/
