import User from "./User";

export interface ServerGroup {
  id: number;
  url: string;
  name: string;
  notes: string;
  organization: string;
  group_type: string;
  users: any[];
  test_sequence_definitions: any[];
}

export interface Group {
  id?: number;
  url?: string;
  name?: string;
  notes?: string;
  organization?: string;
  group_type?: string;
  users?: User[];
}
