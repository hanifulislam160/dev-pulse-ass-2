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

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.loginUserFromDB(email, password);

    console.log(result);

    res.status(200).json({
      success: true,
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
