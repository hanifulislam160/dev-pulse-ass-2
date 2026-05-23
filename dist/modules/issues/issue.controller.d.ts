import type { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
export declare const issueController: {
    createIssue: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    getAllIssues: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSingleIssue: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateIssue: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteIssue: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=issue.controller.d.ts.map