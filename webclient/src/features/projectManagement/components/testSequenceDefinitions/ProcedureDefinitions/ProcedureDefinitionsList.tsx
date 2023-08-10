import React from "react";
import { Grid, List, Typography } from "@material-ui/core";
import { ProcedureExecutionOrder } from "../../../types/ProcedureExecutionOrder";
import ProcedureDefinitionItem from "./ProcedureDefinitionItem";

const ProcedureDefinitionsList = ({
  procedureDefinitions,
  onClickEditItem,
  onClickDeleteItem,
}: {
  procedureDefinitions: ProcedureExecutionOrder[];
  onClickEditItem: (procedureDefinition: ProcedureExecutionOrder) => void;
  onClickDeleteItem: (procedureDefinition: ProcedureExecutionOrder) => void;
}) => {
  return (
    <Grid container direction="row" justifyContent="center">
      <Grid item container justifyContent="center" xs={12}>
        <Grid item>
          <Typography variant="h6">
            List of Picked Procedure Definitions
          </Typography>
        </Grid>
      </Grid>

      <Grid item container justifyContent="center" xs={12}>
        <Grid item>
          {procedureDefinitions && procedureDefinitions.length !== 0 ? (
            <List>
              {procedureDefinitions
                .sort(
                  (
                    firstItem: ProcedureExecutionOrder,
                    secondItem: ProcedureExecutionOrder
                  ) => {
                    if (firstItem && secondItem) {
                      return (
                        firstItem.execution_group_number -
                        secondItem.execution_group_number
                      );
                    }

                    return 0;
                  }
                )
                .map((procedureDefinition) => (
                  <ProcedureDefinitionItem
                    procedureDefinitionItem={procedureDefinition}
                    onClickEditItem={(procedureDefinitionItem) => {
                      onClickEditItem(procedureDefinitionItem);
                    }}
                    onClickDeleteItem={(procedureDefinitionItem) => {
                      onClickDeleteItem(procedureDefinitionItem);
                    }}
                  />
                ))}
            </List>
          ) : (
            <p>No Picked Procedure Definitions yet!</p>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProcedureDefinitionsList;
