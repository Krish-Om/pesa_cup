import { describe, expect, test } from "bun:test";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { requireAdmin } from "../src/middlewares/auth";
import {
  asyncHandler,
  errorHandler,
  notFoundHandler,
} from "../src/middlewares/error-handler";
import { AppError } from "../src/utils/app-error";

const request = (headers: Record<string, string> = {}) =>
  ({ headers, method: "GET", path: "/test" }) as Request;

const response = () => {
  const result = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      result.statusCode = code;
      return result;
    },
    json(body: unknown) {
      result.body = body;
      return result;
    },
  };
  return result as Response & typeof result;
};

describe("requireAdmin", () => {
  const originalKey = process.env.ADMIN_API_KEY;

  test("rejects invalid headers and accepts the configured token", () => {
    process.env.ADMIN_API_KEY = "test-secret";
    const errors: unknown[] = [];
    const next = ((error?: unknown) => {
      if (error) errors.push(error);
    }) as NextFunction;

    requireAdmin(request(), response(), next);
    requireAdmin(
      request({ authorization: "Basic test-secret" }),
      response(),
      next,
    );

    expect(errors).toHaveLength(2);
    expect(errors[0]).toBeInstanceOf(AppError);
    expect((errors[0] as AppError).status).toBe(401);
    expect((errors[0] as AppError).message).not.toContain("test-secret");

    errors.length = 0;
    requireAdmin(
      request({ authorization: "Bearer wrong-secret" }),
      response(),
      next,
    );
    requireAdmin(
      request({ authorization: "Bearer test-secret" }),
      response(),
      next,
    );

    expect(errors).toHaveLength(1);
    expect((errors[0] as AppError).status).toBe(401);

    if (originalKey === undefined) delete process.env.ADMIN_API_KEY;
    else process.env.ADMIN_API_KEY = originalKey;
  });
});

describe("error middleware", () => {
  test("formats malformed JSON, validation, application, and unknown errors", () => {
    const malformed = response();
    errorHandler(
      Object.assign(new SyntaxError("Unexpected token"), {
        status: 400,
        body: {},
      }),
      request(),
      malformed,
      (() => {}) as NextFunction,
    );
    expect(malformed.statusCode).toBe(400);
    expect(malformed.body).toEqual({
      success: false,
      message: "Invalid JSON payload",
      errors: ["Request body contains malformed JSON"],
    });

    const validationResult = z
      .object({ email: z.string().email() })
      .safeParse({ email: "bad" });
    const validation = response();
    errorHandler(
      validationResult.success
        ? new Error("unreachable")
        : validationResult.error,
      request(),
      validation,
      (() => {}) as NextFunction,
    );
    expect(validation.statusCode).toBe(400);
    expect(validation.body).toMatchObject({
      success: false,
      message: "Validation failed",
    });
    expect(
      (validation.body as { errors: Array<{ field: string }> }).errors?.[0]
        ?.field,
    ).toBe("email");

    const application = response();
    errorHandler(
      new AppError("Conflict", 409, ["duplicate"]),
      request(),
      application,
      (() => {}) as NextFunction,
    );
    expect(application.statusCode).toBe(409);
    expect(application.body).toEqual({
      success: false,
      message: "Conflict",
      errors: ["duplicate"],
    });

    const unknown = response();
    errorHandler("unexpected", request(), unknown, (() => {}) as NextFunction);
    expect(unknown.statusCode).toBe(500);
    expect(unknown.body).toEqual({
      success: false,
      message: "Internal Server Error",
      errors: [],
    });
  });

  test("returns a consistent not-found response", () => {
    const result = response();
    notFoundHandler(request(), result, (() => {}) as NextFunction);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual({
      success: false,
      message: "Route GET /test not found",
      errors: [],
    });
  });

  test("forwards rejected async handlers", async () => {
    const error = new Error("failed request");
    let forwarded: unknown;
    const handler = asyncHandler(async () => {
      throw error;
    });

    handler(request(), response(), ((value?: unknown) => {
      forwarded = value;
    }) as NextFunction);
    await Promise.resolve();

    expect(forwarded).toBe(error);
  });
});
