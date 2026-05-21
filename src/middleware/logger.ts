import type { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const time = new Date().toLocaleString();
  console.log(`Request Log: Time   : ${time}\nMethod : ${req.method}\nRoute  : ${req.url}
  `);
  next();
};
