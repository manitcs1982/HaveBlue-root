export interface LinkFileToActionProps {
  id: string;
  fileId: number;
}

export interface MarkCompleteActionProps {
  id: string;
  override: boolean | null;
  description: string | null;
}

export interface RevokeActionProps {
  id: string;
  description: string;
}
