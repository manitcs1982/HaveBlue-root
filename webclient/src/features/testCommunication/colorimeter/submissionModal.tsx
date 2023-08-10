import React from "react";
import {
  useTheme,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
} from "@material-ui/core/";
import MuiTable from "@material-ui/core/Table";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useExpanded,
} from "react-table";
import { generalFilter, useDefaultColumn } from "../../../util/filter";

import { PositionChartOne } from "./PositionChartOne";
import { PositionChartTwo } from "./PositionChartTwo";
import { PositionChartThree } from "./PositionChartThree";

export const SubmissionColorModal = ({data, open, setOpen, chart, setSubmit} : any) => {
  const theme = useTheme();
  const defaultColumn = useDefaultColumn();

  const calcAvg = (arr : any, value : any) => {
    let avg = 0;
    for (let index = 0; index < arr.length; index++) {
      avg += arr[index][value];
      console.log(arr[index][value])
    }
    return avg / arr.length
  }

  const calcSTD = (arr : any, value : any) => {
    let avg = 0;
    for (let index = 0; index < arr.length; index++) {
      avg += arr[index][value];
      console.log(arr[index][value])
    }
    avg = avg / arr.length

    const diffMeans = [];

    for (let index = 0; index < arr.length; index++) {
      diffMeans.push(Math.pow((arr[index][value] - avg),2));
    }

    let newAvg = 0;

    for (let index = 0; index < diffMeans.length; index++) {
      newAvg += diffMeans[index];
    }

    newAvg = newAvg / diffMeans.length;

    return Math.sqrt(newAvg).toFixed(2);

  }

    return (
      <Dialog
        open={open}
        onClose={setOpen}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth={"xl"}
      >

      <DialogTitle id="scroll-dialog-title">
        Confirm Submission
      </DialogTitle>

      <DialogContent dividers={true}>
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item xs={7}>
            { chart === 1 && (
              <PositionChartOne position={-1} colors={data} />
            )}
            { chart === 2 && (
              <PositionChartTwo position={-1} colors={data} />
            )}
            { chart === 3 && (
              <PositionChartThree position={-1} colors={data} />
            )}
          </Grid>
          <Grid item xs={5}>
            <Paper style={{ marginTop: 32 }} elevation={1}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Position </TableCell>
                      <TableCell> L* </TableCell>
                      <TableCell> A* </TableCell>
                      <TableCell> B* </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row : any) => (
                      <TableRow key={row.position}>
                        <TableCell>{row.position + 1}</TableCell>
                        <TableCell>{row.l_value}</TableCell>
                        <TableCell>{row.a_value}</TableCell>
                        <TableCell>{row.b_value}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell> Average </TableCell>
                      <TableCell> {calcAvg(data, "l_value")} </TableCell>
                      <TableCell> {calcAvg(data, "a_value")} </TableCell>
                      <TableCell> {calcAvg(data, "b_value")} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell> Standard Deviation </TableCell>
                      <TableCell> {calcSTD(data, "l_value")} </TableCell>
                      <TableCell> {calcSTD(data, "a_value")} </TableCell>
                      <TableCell> {calcSTD(data, "b_value")} </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={setOpen} color="secondary">
          Close
        </Button>
        <Button onClick={setSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>

    </Dialog>
    )
}
