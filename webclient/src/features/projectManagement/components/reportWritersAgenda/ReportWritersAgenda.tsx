import React from "react";
import { useReports } from "../../projectManagementQueries";
import { LSDBCoreTable } from "../../../common/LSDBCoreTable";
import { Button, LinearProgress, Typography } from "@material-ui/core";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { generalFilter } from "../../../../util/filter";
import { useDownloadProjectFile } from "../../projectQueries";
import { useHistory } from "react-router";

const dateFormatter = (dateToFormat: Date) => {
  return `${dateToFormat.toDateString()} ${dateToFormat
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${dateToFormat
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${dateToFormat
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}`;
};

const ReportWritersAgenda = () => {
  const [projectId, setProjectId] = React.useState(0);

  const {
    data: reports,
    error: reportsError,
    isLoading: isLoadingReports,
    isError: isErrorReports,
    refetch: refetchReports,
  } = useReports();

  const {
    error: errorDownloadFile,
    isLoading: isLoadingDownloadFile,
    isError: isErrorDownloadFile,
    refetch: refetchDownloadFile,
  } = useDownloadProjectFile(projectId, { cacheTime: 1 });

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        filter: generalFilter,
      },
      {
        Header: "Name",
        accessor: "name",
        filter: generalFilter,
      },
      {
        Header: "Disposition",
        accessor: "disposition",
        filter: generalFilter,
      },
      {
        Header: "Action Definition",
        accessor: "action_definition",
        filter: generalFilter,
      },
      {
        Header: "Start Datetime",
        accessor: "start_datetime",
        Cell: ({ cell }: any) => {
          return cell.value !== null ? (
            <p>{dateFormatter(new Date(cell.value))}</p>
          ) : (
            <p>N/A</p>
          );
        },
        filter: generalFilter,
      },
      {
        Header: "Promise Datetime",
        accessor: "promise_datetime",
        Cell: ({ cell }: any) => {
          const promiseDatetime = new Date(cell.value);

          return cell.value !== null ? (
            <p>{dateFormatter(promiseDatetime)}</p>
          ) : (
            <p>N/A</p>
          );
        },
        filter: generalFilter,
      },
      {
        Header: "ETA Datetime",
        accessor: "eta_datetime",
        Cell: ({ cell }: any) => {
          return cell.value !== null ? (
            <p>{dateFormatter(new Date(cell.value))}</p>
          ) : (
            <p>N/A</p>
          );
        },
        filter: generalFilter,
      },
      {
        Header: "Parent Type",
        accessor: "parent.type",
        filter: generalFilter,
      },
      {
        Header: "Parent",
        accessor: "parent.str",
        Cell: ({ cell }: any) => {
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                setProjectId(cell.row.original.parent.id);
                if (projectId !== 0) await refetchDownloadFile();
                await refetchReports();
              }}
            >
              {cell.value}
            </Button>
          );
        },
        filter: generalFilter,
      },
      {
        Header: "Ready to process?",
        accessor: "is_data_ready",
        Cell: () => null,
        Filter: () => null,
      },
    ],
    []
  );

  if (isLoadingReports) {
    return <LinearProgress />;
  }

  if (isErrorReports) {
    return <ErrorMessage error={reportsError} />;
  }

  return (
    <>
      <Typography variant="h2">Report Writer's Agenda</Typography>
      {console.log(projectId)}
      {reports && (
        <LSDBCoreTable
          columns={columns}
          data={reports}
          hiddenColumns={["id"]}
          getCellProps={(cellInfo: any) => {
            if (cellInfo.column.Header === "ETA Datetime") {
              const originalInfo = cellInfo.row.original;
              const etaDatetime = new Date(originalInfo.eta_datetime);
              const today = new Date();
              const dayDiff = Math.floor(
                (Date.UTC(
                  etaDatetime.getFullYear(),
                  etaDatetime.getMonth(),
                  etaDatetime.getDate()
                ) -
                  Date.UTC(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate()
                  )) /
                  (1000 * 60 * 60 * 24)
              );

              return {
                style: {
                  backgroundColor:
                    dayDiff <= 0 ? "red" : dayDiff === 1 ? "yellow" : "green",
                  fontWeight: "bold",
                  color: dayDiff === 1 ? "black " : "white",
                },
              };
            }
            if (cellInfo.column.Header === "Ready to process?") {
              if (!cellInfo.value) return {};
              return { style: { backgroundColor: "green" } };
            }

            return {};
          }}
        />
      )}
    </>
  );
};

export default ReportWritersAgenda;
