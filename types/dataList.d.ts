export interface ListGeneral {
  id: number;
  name: string;
}

export interface IssueSummary {
  all_issue: number;
  new_issue: number;
  closed_issue: number;
}

export interface PieChartData {
  DailyChecking: {
    total_issue: number;
  };
  Requisition: {
    total_issue: number;
  };
  GeneralRequest: {
    total_issue: number;
  };
  HardwareInstallation: {
    total_issue: number;
  };
  MonthlyPreventiveMaintenance: {
    total_issue: number;
  };
  Networking: {
    total_issue: number;
  };
  Question: {
    total_issue: number;
  };
  SoftwareInstallation: {
    total_issue: number;
  };
  Suggestion: {
    total_issue: number;
  };
  AllCategory: {
    total_issue: number;
  };
}

export interface IssuePieCart {
  pie_chart: PieChartData[];
}

export type LineChartData<T = unknown> = T & {
  January: {
    total_issue: number;
  };
  February: {
    total_issue: number;
  };
  March: {
    total_issue: number;
  };
  April: {
    total_issue: number;
  };
  May: {
    total_issue: number;
  };
  June: {
    total_issue: number;
  };
  July: {
    total_issue: number;
  };
  August: {
    total_issue: number;
  };
  September: {
    total_issue: number;
  };
  October: {
    total_issue: number;
  };
  November: {
    total_issue: number;
  };
  December: {
    total_issue: number;
  };
};

export interface IssueLineChart {
  line_chart: LineChartData<{
    total_issue: {
      issue: number;
    };
  }>[];
}

// export interface CurrentIssue {
//   requestor: string;
//   title: string;
//   description: string;
//   asset_name: string | null;
//   project_code: string | null;
//   assigned_to: string;
//   status: string;
//   date: string;
// }

export interface CurrentIssues {
  issue: DataIssues[];
}

export interface IssueTableList {
  user: string;
  total_issue: number;
  issue_by_category: [
    {
      DailyChecking: number;
    },
    {
      Requisition: number;
    },
    {
      GeneralRequest: number;
    },
    {
      HardwareInstallation: number;
    },
    {
      MonthlyPreventiveMaintenance: number;
    },
    {
      Networking: number;
    },
    {
      Question: number;
    },
    {
      SoftwareInstallation: number;
    },
    {
      Suggestion: number;
    }
  ];
}

export interface DataIssueCloseDay {
  average_close_in_a_day: number;
  total_closed_in_a_day: number;
}

export interface DataProjectList {
  project_no: number;
  project_code: string;
  division_name: string;
}

export interface TicketComment {
  id: number;
  comment: string;
  creator: string;
  status: string;
  created_time: string | 0;
}

export type StatusIssue =
  | "New"
  | "Assigned"
  | "Resovled"
  | "Deployed"
  | "Verified"
  | "Reopened"
  | "Closed";

interface DataIssues {
  id: number;
  requestor: string;
  title: string;
  description: string;
  category_id: string;
  priority: string;
  status_id: StatusIssue;
  asset_name: string | null;
  project_no: number | null;
  project_code: string | null;
  assigned_to: string;
  accepted_time: string;
  end_time: string;
  created_time: string;
}

export interface DataIssueICT extends DataIssues {
  ticket_comments: TicketComment[];
}

export interface DataIssueUser extends DataIssues {
  finish_in_hour: string;
}

export interface DataIssueUserDetails extends DataIssues {
  finish_in_hour: string;
  ticket_comments: TicketComment[];
}

export interface ProjectList {
  project_no: number;
  code: string;
  name: string;
  customer: string | null;
  type: string | null;
  project_manager: string | null;
  person_id: number;
}
