import { LSDBCoreTable } from "../../../common/LSDBCoreTable";
import React from "react";
import { useEndofLifeQueue } from "./opsQueuesQueries";
import { LinearProgress } from "@material-ui/core";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { generalFilter } from "../../../../util/filter";
import { TravelerModal } from "../../../common/travelerModal";

const EndOfLifeQueue = () => {
  const {
    data: endOfLifeQueue,
    error: eofQError,
    isLoading: isLoadingEoLQ,
    isError: isErrorEoLQ,
  } = useEndofLifeQueue();

  const columns = React.useMemo(
    () => [
      {
        id: "Serial Number",
        accessor: "serial_number",
        filter: generalFilter,
        Cell: ({ cell }: any) => {
          return <TravelerModal serialNumber={cell.value} />;
        },
      },
      {
        id: "Customer",
        accessor: "customer_name",
        filter: generalFilter,
      },
      {
        id: "Project",
        accessor: "project_number",
        filter: generalFilter,
      },
      {
        id: "Work Order",
        accessor: "work_order_name",
        filter: generalFilter,
      },
      {
        id: "Test Sequence Definition",
        accessor: "test_sequence_definition_name",
        filter: generalFilter,
      },
      {
        id: "Completion Date",
        accessor: "completion_date",
        filter: generalFilter,
      },
    ],
    []
  );

  if (isLoadingEoLQ) {
    return <LinearProgress />;
  }

  if (isErrorEoLQ) {
    return <ErrorMessage error={eofQError} />;
  }

  return (
    <>
      <LSDBCoreTable columns={columns} data={endOfLifeQueue} />
    </>
  );
};

export default EndOfLifeQueue;
