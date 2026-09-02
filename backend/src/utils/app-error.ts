export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly errors: unknown[] = [],
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
