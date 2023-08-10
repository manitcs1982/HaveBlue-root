import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";

import { TravelerContainer } from "../../../../common/traveler/TravelerContainer";
import { TravelerNotesContainer } from "../../../../common/traveler/TravelerNotesContainer";
import { TravelerGroup } from "../../../../common/traveler/TravelerGroup";
import { TravelerGroupHeader } from "../../../../common/traveler/TravelerGroupHeader";
import { TravelerMasterContainer } from "../../../../common/traveler/TravelerMasterContainer";
import { TravelerMasterRow } from "../../../../common/traveler/TravelerMasterRow";
import { TravelerNotes } from "../../../../common/traveler/TravelerNotes";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { useTestPermissions } from "../../../projectQueries";
import { useTestSequenceDefinitionDetails } from "../../../testSequenceDefinitionQueries";
import React from "react";

export const WorkOrderTestSequenceTraveler = ({ id }: any) => {
  const { data, isLoading, isError, error } =
    useTestSequenceDefinitionDetails(id);

  const {
    data: permissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
    error: errorPermissions,
  } = useTestPermissions();

  if (isLoading || isLoadingPermissions) {
    return (
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
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (isErrorPermissions) {
    return <ErrorMessage error={errorPermissions} />;
  }

  return (
    <TravelerContainer>
      <TravelerMasterContainer>
        <TravelerMasterRow header="Name" data={data?.name} />
        <TravelerMasterRow
          header="Test Sequence Definition Name"
          data={data?.test_sequence_definition_name}
        />
        <TravelerMasterRow header="Description" data={data?.description} />
      </TravelerMasterContainer>
      <TravelerNotesContainer />
      <TravelerGroupHeader header="Procedure" />
      <TravelerGroupHeader header="Operator" />
      <TravelerGroupHeader header="Test Date" />
      <TravelerGroupHeader header="Disposition" />
      <TravelerGroupHeader header="Reviewer" />
      <TravelerGroupHeader header="Review Date" />

      {data?.grouped_results.map((groupedResult: any) => (
        <TravelerGroup data={groupedResult} permissions={permissions} />
      ))}
    </TravelerContainer>
  );
};
