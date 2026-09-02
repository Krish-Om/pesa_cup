import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
      errors: ["Request body contains malformed JSON"],
    });
    return;
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => {
      const field = issue.path.join(".");
      return { field, message: issue.message };
    });

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }
  const status = err instanceof AppError ? err.status : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";
  const errors = err instanceof AppError ? err.errors : [];

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
  next: NextFunction,
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
