import React from "react";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Container from "@material-ui/core/Container";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { formatDate } from "../../common/formatDate";

import { useDefaultColumn } from "../../../util/filter";
import Button from "@material-ui/core/Button";

import { VisualInspectionReviewModal } from "../VisualInspectionReviewModal";
import { ELImageReviewModal } from "../ELImageReviewModal";
import { LeakedDataModal } from "../LeakedDataModal";
import { DiodeTestModal } from "../DiodeTestModal";
import { IVReviewModal } from "../IVReview/IVReviewModal";
import { ColorimeterReviewModal } from "../ColorimeterModal";


export const EgressSubTable = ( {rowData} : any) => {
  const defaultColumn = useDefaultColumn();

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Characterization Point",
        accessor: "characterization_point",
      },
      {
        Header: "Step",
        accessor: "procedure_definition_name",
      },
      {
        Header: "Completion Date",
        accessor: "completion_date",
        Cell: ({cell} : any) => {
          if (cell.value === null) {
            return "Incomplete"
          } else {
            return (formatDate(cell.value))
          }
        }
      },
      {
        Header: "Action Required",
        accessor: "disposition_name",
        Cell: ({cell, row} : any) => {
          if(cell.value === "Requires Review"){
            if (row.original.visualizer_name === "iv_curve") {
              return(<IVReviewModal id={row.original.id} disposition={cell.value}/>);
            } else if (row.original.visualizer_name === "el_image") {
              return(<ELImageReviewModal id={row.original.id} disposition={cell.value} />);
            } else if (row.original.visualizer_name === "wet_leakage") {
              return <LeakedDataModal id={row.original.id} disposition={cell.value}/> ;
            } else if (row.original.visualizer_name === "visual_inspection") {
              return( <VisualInspectionReviewModal id={row.original.id} disposition={cell.value} /> );
            } else if (row.original.visualizer_name === "diode") {
              return <DiodeTestModal id={row.original.id} disposition={cell.value}/>;
            } else if (row.original.visualizer_name === "colorimeter") {
              return <ColorimeterReviewModal id={row.original.id} disposition={cell.value}/>;
            } else {
              return(
                <Button
                  style={{ textAlign: "center" }}
                  variant="contained"
                  color="primary"
                >
                  Dummy Button (Contact Development Team)
                </Button>);
            }
          } else if (cell.value === null) {
            return(
              <Typography variant="body2">
                Incomplete
              </Typography>
            )
          } else {
            return (cell.value);
          }
        }
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow, } = useTable(
    {
      data: rowData.procedure_results,
      columns,
      defaultColumn,
      initialState: {
        hiddenColumns: ["id"],
      },
    },

    useFilters,
    useGlobalFilter,
    useSortBy,
  );



  return (
      <Container>
      <TableContainer data-testid="tableContainer">
        <MuiTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell>
                    <Grid
                      container
                      direction="row"
                      /*justify="space-between"*/
                      alignItems="center"
                      spacing={0}
                    >
                      <Grid
                        item
                        xs={12}
                        {...column.getHeaderProps()}
                      >
                        <Typography variant="h6">
                          {column.render("Header")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
      </Container>
  );
};
