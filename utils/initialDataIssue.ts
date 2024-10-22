import { DataIssueICT, DataIssues, DataIssueUser } from "../types/dataList";

const initialDataIssueICT: DataIssueICT = {
  id: 0,
  requestor: "",
  title: "",
  description: "",
  category_id: "",
  priority: "",
  status_id: "New",
  project_no: 0,
  project_code: "",
  asset_name: "",
  assigned_to: "",
  accepted_time: "",
  end_time: "",
  created_time: "",
  ticket_comments: [],
};

const initialDataIssueUser: DataIssueUser = {
  id: 0,
  requestor: "",
  title: "",
  description: "",
  category_id: "",
  priority: "",
  status_id: "New",
  project_no: 0,
  project_code: "",
  asset_name: "",
  assigned_to: "",
  accepted_time: "",
  end_time: "",
  created_time: "",
  finish_in_hour: "",
};

const initialDataIssue: DataIssues = {
  id: 0,
  requestor: "",
  title: "",
  description: "",
  category_id: "",
  priority: "",
  status_id: "New",
  project_no: 0,
  project_code: "",
  asset_name: "",
  assigned_to: "",
  accepted_time: "",
  end_time: "",
  created_time: "",
};

export { initialDataIssueICT, initialDataIssueUser, initialDataIssue };
