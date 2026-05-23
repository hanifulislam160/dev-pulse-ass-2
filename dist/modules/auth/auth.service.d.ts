import type { IUser } from "./auth.interface";
export declare const authService: {
    signUpUserIntoDB: (payload: IUser) => Promise<any>;
    loginUserFromDB: (email: string, password: string) => Promise<{
        token: string;
        user: any;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map