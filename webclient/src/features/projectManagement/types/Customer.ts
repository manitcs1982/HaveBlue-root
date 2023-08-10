export interface PostCustomerProps {
  name: string;
  short_name: string;
}

export interface PutCustomerProps {
  name: string;
  short_name: string;
  customerId: string;
}
export interface LinkFileToUnitProps {
  unitTypeId: string;
  fileId: string;
}
export interface PostWorkOrderProps {
  project: string | null;
  name: string;
  start_datetime: Date;
  description: string;
  disposition: string;
  unit_disposition: string;
  tib: boolean;
}

export interface PutWorkOrderProps extends PostWorkOrderProps {
  workOrderId: string;
}

export interface PostProjectProps {
  number: string;
  sfdc_number: string;
  project_manager: string;
  disposition: string;
  group: string;
  customer: string | null;
  proposal_price: string;
}

export interface PostUnitTypeProps {
  manufacturer: string;
  bom: string;
  description: string;
  notes: string;
  model: string;
  number_of_cells: string;
  nameplate_pmax: string;
  module_width: string;
  module_height: string;
  system_voltage: string;
  auditor: string;
  audit_date: string;
  audit_report_id: string;
  isc: string;
  voc: string;
  imp: string;
  vmp: string;
  alpha_isc: string;
  beta_voc: string;
  gamma_pmp: string;
  cells_in_series: string;
  cells_in_parallel: string;
  cell_area: string;
  unit_type_family: string;
  module_technology: string;
  bifacial: boolean | null;
}

export interface PutUnitTypeProps extends PostUnitTypeProps {
  unitTypeId: string;
}

export interface PutProjectProps {
  number: string;
  sfdc_number: string;
  project_manager: string;
  disposition: string;
  projectId: string;
  group: string;
  customer: string;
  proposal_price: string;
}

export interface PostExpectedUnitType {
  expected_count: string;
  received_count: string;
  project: string;
  unit_type: string;
}

export interface Note {
  id: string;
  owner: number | null;
  subject: string;
  text: string;
  note_type: number;
  disposition: number | null;
  labels: object | null;
  groups: object | null;
  tagged_users: object | null;
}
