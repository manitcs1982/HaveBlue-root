import {
  Typography,
  Grid,
  useTheme,
  Container,
  Chip,
  LinearProgress,
} from "@material-ui/core";
import { useProjectNotes } from "../../../projectQueries";
import { LSDBCoreTable } from "../../../../common/LSDBCoreTable";
import { ThreadedViewer } from "../../../../common/threadedViewer/threadedViewer";
import {
  booleanFilter,
  CheckboxColumnFilter,
  generalFilter,
  labelFilter,
  LabelPickerFilter,
  noteTypeFilter,
  NoteTypeFilter,
  taggedUsersFilter,
  UsersPickerFilter,
} from "../../../../../util/filter";
import Label from "../../../types/Label";
import { formatDate } from "../../../../common/formatDate";
import React from "react";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { ThreadedCreator } from "../../../../common/threadedViewer/threadedCreator";
import DefaultTicketColumns from "../../../../common/DefaultTicketColumns";
import { LSDBHighlightTable } from "../../../../common/services/LSDBHighlightTable";
import { BackButton } from "../../../../common/returnButton";

export const ProjectNotesDetails = ({ id }: { id: string }) => {
  const theme = useTheme();

  const [noteID, setNoteID] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);

  const {
    data: projectNotesData = [],
    error: projectNotesError,
    isLoading: isLoadingProjectNotes,
    isError: isErrorProjectNotes,
    isSuccess: isSuccessProjectNotes,
  } = useProjectNotes(id, null);

  const [idColumn, ...remainingColumns] = DefaultTicketColumns(
    setNoteID,
    setOpen
  );

  const columns = React.useMemo(
    () => [
      idColumn,
      {
        Header: "Status",
        accessor: "disposition_name",
        filter: generalFilter,
      },
      {
        Header: "Disposition Complete",
        accessor: "disposition_complete",
      },
      ...remainingColumns,
    ],
    []
  );

  if (isLoadingProjectNotes) {
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

  if (isErrorProjectNotes) {
    return <ErrorMessage error={projectNotesError} />;
  }

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid xs={11}>
            <Typography variant="h3">Project Notes Details</Typography>
          </Grid>
          <Grid item xs={1}>
            <BackButton />
          </Grid>

          <Grid container xs={12}>
            <Grid item xs={5} />
            <Grid item xs={2}>
              <ThreadedCreator id={id} noteType={0} model={"project"} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {isSuccessProjectNotes && (
        <LSDBHighlightTable
          data={projectNotesData}
          columns={columns}
          highlightColor={"#C8C8C8"}
          highlightCondition={(row: any) => {
            if (
              row !== undefined &&
              row.values !== undefined &&
              row.values.disposition_complete !== undefined
            ) {
              return !row.values.disposition_complete;
            }

            return false;
          }}
          hiddenColumns={["disposition_complete"]}
        />
      )}
      <ThreadedViewer id={noteID} open={open} setOpen={setOpen} />
    </div>
  );
};
