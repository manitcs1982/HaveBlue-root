import { WorkOrderUnitsTable } from "./WorkOrderUnitsTable";
import { WorkOrderReportAssignment } from "./WorkOrderReportAssignment";
import { LSDBHorizontalTabs } from "../../../../common/LSDBHorizontalTabs";

export const WorkOrderAssignment = ({ workOrderId }: any) => {
  return (
    <LSDBHorizontalTabs
      properties={[
        { label: "Test Sequence Assignment" },
        { label: "Report Assignment", disabled: true },
      ]}
      components={[
        <WorkOrderUnitsTable workOrderId={workOrderId} />,
        <WorkOrderReportAssignment workOrderId={workOrderId} />,
      ]}
    />
  );
};
