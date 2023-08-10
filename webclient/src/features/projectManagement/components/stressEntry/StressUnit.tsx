import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import { STRESSOR_NOT_APPLY_METADATA } from "./constants";
import React from "react";
import moment from "moment";

export const StressUnit = ({
  unitData,
  procedureResult,
  sibling,
  metadata,
  onChangeMetadata,
}: any) => {
  const renderMetadata = () => {
    if (sibling) {
      if (sibling === STRESSOR_NOT_APPLY_METADATA)
        return <Typography variant="body1">N/A</Typography>;
      const measurementResultTypeField =
        sibling.measurement_results[0].measurement_result_type_field;
      if (measurementResultTypeField) {
        switch (measurementResultTypeField) {
          case "result_double":
            return (
              <TextField
                type="number"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeMetadata(e.currentTarget.value);
                }}
              ></TextField>
            );

          case "result_string":
            return (
              <TextField
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeMetadata(e.currentTarget.value);
                }}
              ></TextField>
            );
          case "result_datetime":
            return (
              <DateTimePicker
                label={"Select a date"}
                value={metadata}
                inputVariant="outlined"
                format="YYYY-MM-DD HH:mm:ss"
                onChange={(date: any) => {
                  onChangeMetadata(moment(date).format("YYYY-MM-DD HH:mm:ss"));
                }}
              />
            );
        }
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Serial Number</TableCell>
            <TableCell align="right">Model</TableCell>

            <TableCell align="right">Procedure Type</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Metadata</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              {unitData.serial_number}
            </TableCell>
            <TableCell align="right">{unitData.model}</TableCell>
            <TableCell align="right">
              {procedureResult.procedure_definition_name}
            </TableCell>
            <TableCell align="right">{sibling?.name || "N/A"}</TableCell>
            <TableCell align="right">{renderMetadata()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
