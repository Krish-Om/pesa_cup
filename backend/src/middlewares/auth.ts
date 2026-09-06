import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token || token !== process.env.ADMIN_API_KEY) {
    return next(
      new AppError("Unauthorized: Invalid token or missing api key", 401),
    );
  }
  next();
}
