import { ListSelect } from ".";

export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs {
  emp_id: string;
  name: string;
  email: string;
  password: string;
  confirmPass?: string;
  code?: number | string;
  division: string;
}

export interface ForgotPassGetInputs {
  email: string;
}

export interface ForgotPassInputs {
  code: number | string;
  email: string;
  password: string;
  confirmPass?: string;
}

export interface ChangePasswordInputs {
  old_password: string;
  password?: string;
  new_password: string;
}

export interface ReopenIssueInputs {
  comment: string;
}

export interface UpdateIssueInputs {
  status_id: string | number;
  comment: string;
  category_id: string | number;
}

export interface AddIssueInputs {
  title: string;
  description: string;
  priority_id: number | string;
  project_no: number;
  asset_name: string;
  assigned?: ListSelect[];
  assigned_1?: number | string;
  assigned_2?: number | string;
  assigned_3?: number | string;
}
