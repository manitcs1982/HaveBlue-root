export type ServerProcedureDefinition = {
  id: number;
  url: string;
  name: string;
  description: string;
  work_in_progress_must_comply: boolean;
  group: number;
  supersede: boolean;
  disposition: number;
  version: string;
  unit_type_family: number;
  asset_types: number[];
  linear_execution_group: number;
  visualizer: number;
  visualizer_name: string;
  project_weight: number;
  aggregate_duration: number;
  step_definitions: any[]; //TODO: Must be changed to StepDefinition once that type exists
};
