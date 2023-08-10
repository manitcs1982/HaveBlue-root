export interface PostPlugin {
  author: number;
  name: string;
  description: string;
  disposition: number;
  reviewed_by_user?: number | null;
  reviewed_datetime?: Date | null;
  revision: number;
  group: number;
  source_code: string;
  restricted: boolean;
}

export interface Plugin {
  id: number;
  url: string;
  author: number;
  author_name: string;
  name: string;
  description: string;
  disposition: number;
  disposition_name: string;
  reviewed_by_user: number | null;
  reviewer_name: string | undefined;
  review_datetime: Date | null;
  revision: number;
  group: number;
  group_name: string;
  source_code: string;
  restricted: boolean;
}
