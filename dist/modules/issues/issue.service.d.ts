import type { CreateIssuePayload, GetIssuesQuery, IssueWithReporter, SingleIssue } from "./issue.interface";
interface UpdateIssuePayload {
    title?: string;
    description?: string;
    type?: "bug" | "feature_request";
}
export declare const issueService: {
    createIssueIntoDB: (payload: CreateIssuePayload, reporterId: number) => Promise<any>;
    getAllIssues: (query: GetIssuesQuery) => Promise<IssueWithReporter[]>;
    getSingleIssueFromDB: (id: number) => Promise<SingleIssue | null>;
    updateIssue: (issueId: number, user: any, payload: UpdateIssuePayload) => Promise<any>;
    deleteIssueFromDB: (issueId: number) => Promise<boolean>;
};
export {};
//# sourceMappingURL=issue.service.d.ts.map