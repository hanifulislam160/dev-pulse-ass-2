import type { Request, Response } from "express";
import { authService } from "./auth.service";


const signUpUser = async (req: Request, res: Response) => {

    const user = req.body;
    
    try {
        const result = await authService.signUpUserIntoDB(user);
        // show proper success response
        res.status(201).json({
          success: true,
          message: "User created successfully",
          data: result,
        });
    } catch (error:any) {
        // show proper error response
        res.status(500).json({
          success: false,
          message: "Failed to create user",
          error: error.message || error,
        });
        
    }

}

export const authController = { signUpUser };