export interface Template {
  name: string;
  description: string;
  disposition: number;
  group: number;
  body_source: string;
  subject_source: string;
  format: number;
}

export interface ServerTemplate extends Template {
  id: number;
  url: string;
  author: number;
  author_name: string;
  disposition_name: string;
  group_name: string;
  format_name: string;
}

export interface UserProfileTemplate {
  id: number;
  url: string;
  name: string;
  description: string;
}
