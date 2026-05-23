import type { NextFunction, Request, Response } from "express";
export interface JwtPayload {
    id: number;
    name: string;
    email: string;
    role: "contributor" | "maintainer";
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorizeRole: (...roles: ("contributor" | "maintainer")[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map