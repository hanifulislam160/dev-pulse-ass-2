import type { Request, Response } from "express";
export declare const authController: {
    signUpUser: (req: Request, res: Response) => Promise<void>;
    loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=auth.controller.d.ts.map