import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import AppError from "../../utils/AppError";
import sendResponse from "../../utils/sendResponse";

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body;

    if (!user.name || !user.email || !user.password || !user.role) {
      throw new AppError(
        400,
        "Name, email, password and role are required fields",
      );
    }

    if (user.password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw new AppError(400, "Invalid email format provided");
    }

    if (user.role !== "contributor" && user.role !== "maintainer") {
      throw new AppError(400, "Role must be contributor or maintainer");
    }

    const result = await authService.signUpUserIntoDB(user);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, "Email and password are required");
    }

    const result = await authService.loginUserFromDB(email, password);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: result,
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const authController = { signUpUser, loginUser };
