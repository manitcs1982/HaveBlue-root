export interface ProcedureExecutionOrder {
  execution_group_name: string;
  execution_group_number: number;
  execution_condition: string;
  procedure_definition: number;
  allow_skip: boolean;
  procedure_definition_name: string;
}
