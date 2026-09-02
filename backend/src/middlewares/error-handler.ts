import type { Request, Response, NextFunction } from "express";
import {ZodError} from "zod/v3";

export interface AppError extends Error {
  status?: number;
  errors?: string[];
}

export const errorHandler = (
  err: any | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const formattedErros= err.issues.map((issue)=>{
      const field = issue.path.join(".");
      return field? `{field} : {issue.message}` : issue.message;
    })

    res.status(400).json({
      success:false,
      message : "Validation failed",
      errors:formattedErros
    })
    return;
  }
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  console.error(`[${new Date().toISOString()}] Error:`, {
    status,
    message,
    path: req.path,
    method: req.method,
  });

  res.status(status).json({
    success: false,
    message,
    errors,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    errors: [],
  });
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
