import React from "react";
import { IconButton, TextField, Typography } from "@material-ui/core";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import { generalFilter } from "../../../../util/filter";
import { useStressEntryContext } from "./StressEntryContext";
import { STRESSOR_NOT_APPLY_METADATA } from "./constants";
import { DateTimePicker } from "@material-ui/pickers";

export const useUnitCheckerColumns = () => {
  const { state, dispatch } = useStressEntryContext();

  const ID = {
    Header: "Id",
    accessor: "id",
    filter: generalFilter,
  };

  const SERIAL_NUMBER = {
    Header: "Serial Number",
    accessor: "serial_number",
    filter: generalFilter,
  };

  const MODEL = {
    Header: "Model",
    accessor: "model",
    filter: generalFilter,
  };
  const PROCEDURE_TYPE = {
    Header: "Procedure Type",
    accessor: "procedureType",
    filter: generalFilter,
  };
  const NAME = {
    Header: "Name",
    accessor: "name",
    id: "name",
    Cell: (tableProps: any) => {
      const procedureResult = state.checkedUnits.get(
        tableProps.row.values.serial_number
      );

      return (
        <Typography variant="body1">
          {procedureResult?.sibling?.name || "N/A"}
        </Typography>
      );
    },
  };

  const METADATA = {
    Header: "Metadata",
    accessor: "metadata",
    id: "metadata",
    Cell: (tableProps: any) => {
      const [dateMetadata, setDateMetadata] = React.useState<any>(null);
      const procedureResult = state.checkedUnits.get(
        tableProps.row.values.serial_number
      );
      if (procedureResult.sibling === STRESSOR_NOT_APPLY_METADATA)
        return <Typography variant="body1">N/A</Typography>;

      const measurementResultTypeField =
        procedureResult.sibling.measurement_results[0]
          .measurement_result_type_field;
      if (measurementResultTypeField) {
        switch (measurementResultTypeField) {
          case "result_double":
            return (
              <TextField
                type="number"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    type: "SET_UPDATED_METADATA",
                    payload: {
                      metadata: e.currentTarget.value,
                      serialNumber: tableProps.row.values.serial_number,
                    },
                  });
                }}
              ></TextField>
            );
          case "result_string":
            return (
              <TextField
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    type: "SET_UPDATED_METADATA",
                    payload: {
                      metadata: e.currentTarget.value,
                      serialNumber: tableProps.row.values.serial_number,
                    },
                  });
                }}
              ></TextField>
            );
          case "result_datetime":
            return (
              <DateTimePicker
                label={"Select a date"}
                value={dateMetadata}
                inputVariant="outlined"
                format="YYYY-MM-DD HH:mm:ss"
                onChange={(date: any) => {
                  setDateMetadata(moment(date).format("YYYY-MM-DD HH:mm:ss"));
                  dispatch({
                    type: "SET_UPDATED_METADATA",
                    payload: {
                      metadata: moment(date).format("YYYY-MM-DD HH:mm:ss"),
                      serialNumber: tableProps.row.values.serial_number,
                    },
                  });
                }}
              />
            );
        }
      }
    },
  };

  const DELETE = {
    Header: "",
    id: "delete",
    accessor: "delete",

    Cell: (tableProps: any) => (
      <IconButton
        onClick={() => {
          const dataCopy: any[] = [...state.checkedUnitsTable];
          dataCopy.splice(tableProps.row.index, 1);
          dispatch({
            type: "SET_UPDATED_CHECKED_UNITS_TABLE",
            payload: {
              updatedCheckedUnitsTable: dataCopy,
              serialNumber: tableProps.row.values.serial_number,
            },
          });
        }}
      >
        <DeleteIcon />
      </IconButton>
    ),
  };

  return { ID, SERIAL_NUMBER, MODEL, PROCEDURE_TYPE, NAME, METADATA, DELETE };
};
