import type { Request, Response } from "express";
import { authService } from "./auth.service";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;

    if (!user.name || !user.email || !user.password || !user.role) {
      throw new Error("Name, email and password are required");
    }

    if (user.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw new Error("Invalid email format provided");
    }

    if (user.role !== "contributor" && user.role !== "maintainer") {
      throw new Error("Role must be contributor or maintainer");
    }

    const result = await authService.signUpUserIntoDB(user);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message || error,
    });
  }
};

export const authController = { signUpUser };
