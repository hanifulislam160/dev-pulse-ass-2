export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";
export type SortType = "newest" | "oldest";

export interface GetIssuesQuery {
  sort?: SortType;
  type?: IssueType;
  status?: IssueStatus;
}

export interface IssueWithReporter {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter: {
    id: number;
    name: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateIssuePayload {
  title: string;
  description: string;
  type: IssueType;
}