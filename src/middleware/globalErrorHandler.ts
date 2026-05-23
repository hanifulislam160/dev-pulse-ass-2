import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";


const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong";

  // Custom App Error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // PostgreSQL Error
  else if (err.code) {
    message = err.detail || err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default globalErrorHandler;
