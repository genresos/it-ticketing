import axios from "axios";
import { MutateParams, MutateParamsId } from "../types";
import {
  AddIssueInputs,
  ChangePasswordInputs,
  ForgotPassGetInputs,
  ForgotPassInputs,
  LoginInputs,
  RegisterInputs,
  ReopenIssueInputs,
  UpdateIssueInputs,
} from "../types/formInput";
import { endpoint } from "./endpoint";
import { downloadFile } from "./myFunction";

export const fetchApi = axios.create({
  baseURL: `${endpoint}/api`,
});

export const loginUser = async (data: LoginInputs) => {
  const response = await fetchApi.post("/auth/login", data);

  return response.data;
};

export const getCodeRegister = async (data: {
  email: string;
  emp_id: string;
}) => {
  const response = await fetchApi.post("/users/sendverification", data);

  return response.data;
};

export const registerUser = async (data: RegisterInputs) => {
  const response = await fetchApi.post("/auth/signup", data);

  return response.data;
};

export const getCodeForgotPass = async (data: ForgotPassGetInputs) => {
  const response = await fetchApi.put("/users/forgotpassword", data);

  return response.data;
};

export const forgotPass = async (data: ForgotPassInputs) => {
  const response = await fetchApi.put("/users/resetvalidation", data);

  return response.data;
};

export const changePassword = async ({
  data,
  token,
}: MutateParams<{ data: ChangePasswordInputs }>) => {
  const response = await fetchApi.post("/auth/reset", data, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getDataDashboard = async (token: string) => {
  const response = await Promise.all([
    getIssueSummary(token),
    getIssuePieChart(token),
    getIssueLineChart(token),
    getIssueCurrent(token),
    getIssueTable(token),
    getIssueCloseDay("", token),
    getIssueIctCategory(token),
  ]);

  const keys = [
    "issueSummary",
    "issuePieChart",
    "issueLineChart",
    "issueCurrent",
    "issueTable",
    "issueCloseDay",
    "issueCategory",
  ];

  const dataRes = response.reduce((acc, curr, idx) => {
    return { ...acc, [keys[idx]]: curr };
  }, {});

  return dataRes;
};

export const getIssueSummary = async (token: string) => {
  const response = await fetchApi.get("/tickets/issue_summary", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getIssuePieChart = async (
  token: string,
  year?: string,
  month?: string
) => {
  const currentYear = new Date().getFullYear();
  const response = await fetchApi.post(
    "/tickets/issue_pie_chart",
    { year: year || currentYear, month: month || "" },
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

export const getIssueLineChart = async (token: string, year?: string) => {
  const currentYear = new Date().getFullYear();
  const response = await fetchApi.get(
    `/tickets/issue_line_chart_year/${year || currentYear}`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

export const getIssueCurrent = async (token: string) => {
  const response = await fetchApi.get("/tickets/current_issue", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getIssueTable = async (
  token: string,
  year?: string,
  month?: string
) => {
  const currentYear = new Date().getFullYear();
  const response = await fetchApi.post(
    "/tickets/table_list",
    { year: year || currentYear, month: month || "" },
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

export const getIssueCloseDay = async (
  category_id: string | number,
  token: string
) => {
  const response = await fetchApi.post(
    `/tickets/issue_close_in_a_day?category_id=${category_id}`,
    {},
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

export const getIssueICT = async (
  page: number,
  perpage: number,
  search: string,
  category_id: string | number,
  status_id: string | number,
  token: string,
  project_no?: string
) => {
  const response = await fetchApi.get(
    `/tickets/my_tickets?page=${page}&perpage=${perpage}&search=${search}&category_id=${category_id}&status_id=${status_id}&project_no=${
      project_no || ""
    }`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    }
  );

  console.log(`fetch: /tickets/my_tickets?page=${page}&perpage=${perpage}`);

  return response.data;
};

export const getIssueICTDetails = async (id_ticket: number, token: string) => {
  const response = await fetchApi.get(
    `/tickets/detail?id_ticket=${id_ticket}`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const reopenIssueICT = async ({
  id,
  data,
  token,
}: MutateParamsId<{ data: ReopenIssueInputs }>) => {
  const response = await fetchApi.put(`/tickets/reopen/${id}`, data, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data;
};

export const getIssuePriority = async (token: string) => {
  const response = await fetchApi.get("/tickets/priority", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getIssueIctMember = async (token: string) => {
  const response = await fetchApi.get("/tickets/ict_members", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data.data;
};

export const addIssueICT = async ({
  data,
  token,
}: MutateParams<{ data: AddIssueInputs }>) => {
  const response = await fetchApi.post("/tickets/create", data, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyIssueICT = async (token: string) => {
  const response = await fetchApi.get("/tickets", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getIssueIctStatus = async (token: string) => {
  const response = await fetchApi.get("/tickets/status", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getIssueIctCategory = async (token: string) => {
  const response = await fetchApi.get("/tickets/category", {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data.data;
};

export const updateIssueICT = async ({
  id,
  data,
  token,
}: MutateParamsId<{ data: UpdateIssueInputs }>) => {
  const response = await fetchApi.put(`/tickets/update/${id}`, data, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return response.data;
};

export const exportIssueICT = async ({
  token,
  from,
  to,
}: MutateParams<{ from: string; to: string }>) => {
  const response = await fetchApi.get(`/tickets/export?from=${from}&to=${to}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    responseType: "blob",
  });

  downloadFile(response.data, "issue-report.xlsx");

  return response.data;
};

export const getProjectWithSearch = async (search: string, token: string) => {
  const response = await fetchApi.get(
    `/projects/list_search?project_code=${search}`,
    { headers: { Authorization: `bearer ${token}` } }
  );
  return response.data.data;
};
