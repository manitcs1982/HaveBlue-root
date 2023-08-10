import { Button, Chip } from "@material-ui/core";
import {
  AttachedProjectFilter,
  attachedProjectFilter,
  generalFilter,
  labelFilter,
  LabelPickerFilter,
  noteTypeFilter,
  NoteTypeFilter,
} from "../../util/filter";
import Label from "../projectManagement/types/Label";
import { formatDate } from "./formatDate";
import React from "react";
import ProjectNumberColumnDisplay from "./ProjectNumberColumnDisplay";

const DefaultTicketColumns = (
  setNoteID: React.Dispatch<React.SetStateAction<number>>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return [
    {
      id: "Id",
      accessor: "id",
      Cell: ({ row }: any) => (
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={() => {
            setNoteID(row.values.Id);
            setOpen(true);
          }}
        >
          {row.values.Id}
        </Button>
      ),
      filter: generalFilter,
    },
    {
      id: "Subject",
      accessor: "subject",
      filter: generalFilter,
    },
    {
      id: "Note Type",
      accessor: "note_type_name",
      Filter: NoteTypeFilter,
      filter: noteTypeFilter,
    },
    {
      id: "Labels",
      accessor: "labels",
      Cell: ({ row }: any) => {
        if (row.values.Labels !== undefined && row.values.Labels.length === 0) {
          return <p style={{ color: "#adadad" }}> N/A </p>;
        }
        console.log("Row Values ", row.values);
        return row.values.Labels.map((label: Label) => {
          let textColor = "";
          let r = parseInt(label.hex_color.substr(1, 2), 16);
          let g = parseInt(label.hex_color.substr(3, 2), 16);
          let b = parseInt(label.hex_color.substr(5, 2), 16);
          const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
          textColor = brightness > 125 ? "black" : "white";
          return (
            <Chip
              size="medium"
              label={label.name}
              style={{
                backgroundColor: label.hex_color,
                color: textColor,
                marginBottom: 8,
              }}
            />
          );
        });
      },
      Filter: LabelPickerFilter,
      filter: labelFilter,
      disableSortBy: true,
    },
    {
      id: "Author",
      accessor: "username",
      filter: generalFilter,
    },
    {
      id: "Owner",
      accessor: "owner_name",
      Cell: ({ row }: any) =>
        row.values.Owner !== undefined ? (
          row.values.Owner
        ) : (
          <p style={{ color: "#adadad" }}> N/A </p>
        ),
      filter: generalFilter,
    },
    {
      id: "Creation Date",
      Header: "Creation Date",
      Cell: ({ row }: any) => formatDate(row.values["Days Open"]),
    },
    {
      id: "Attached Projects",
      accessor: "parent_objects",
      Cell: ({ row }: any) => {
        const parentObjects = row.values["Attached Projects"];
        if (parentObjects) {
          if (parentObjects.length === 0) {
            return <p style={{ color: "#adadad" }}> N/A </p>;
          }

          for (const parentObject of parentObjects) {
            if (parentObject["model_name"] === "project") {
              return (
                <ProjectNumberColumnDisplay parentObjectId={parentObject.id} />
              );
            }
          }
        }
        return <p style={{ color: "#adadad" }}> N/A </p>;
      },
      Filter: AttachedProjectFilter,
      filter: attachedProjectFilter,
    },
    {
      id: "Customer",
      Header: "Customer",
      accessor: "customer",
      Cell: ({ row }: any) => {
        return <p style={{ color: "#adadad" }}> N/A </p>;
      },
      Filter: () => null,
      disableSortBy: true,
    },
    {
      id: "Days Open",
      Header: "Days Open",
      accessor: "datetime",
      Cell: ({ row }: any) => {
        const created: any = new Date(row.values["Days Open"]);
        const daysSince = Date.now() - created;
        return `${Math.round(daysSince / (1000 * 60 * 60 * 24))} days`;
      },
      Filter: () => null,
    },
    {
      id: "Days Since Last Update",
      Header: "Days Since Last Update",
      accessor: "last_update_datetime",
      Cell: ({ row }: any) => {
        if (row.values["Days Since Last Update"] === null) {
          return "0 days";
        }

        const lastUpdated: any = new Date(row.values["Days Since Last Update"]);
        const daysSince = Date.now() - lastUpdated;
        return `${Math.round(daysSince / (1000 * 60 * 60 * 24))} days`;
      },
      Filter: () => null,
    },
  ];
};

export default DefaultTicketColumns;
