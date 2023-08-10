import { UserProfileTemplate } from "../../projectManagement/types/Template";

interface User {
  id?: number;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  username: string;
  first_name?: string;
  last_name?: string;
  userprofile?: {
    notes?: string;
    registration_comment?: string;
    administration_comment?: string;
    user_registration_status: string | undefined;
    email_subscriptions: number[];
  };
  password?: string;
}

export interface PostReducedUser {
  first_name: string;
  last_name: string;
}

export interface ReducedUser {
  first_name: string;
  last_name: string;
  allowed_templates: UserProfileTemplate[];
}

export interface ServerReducedUser extends ReducedUser {
  id: number;
}

export default User;
