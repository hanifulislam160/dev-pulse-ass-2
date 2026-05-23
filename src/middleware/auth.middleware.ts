import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

// Custom JWT Payload Type
export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: "contributor" | "maintainer";
}

// Extend Express Request
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Verify JWT Middleware
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Role Authorization Middleware
export const authorizeRole = (...roles: ("contributor" | "maintainer")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    // Check role
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    next();
  };
};
