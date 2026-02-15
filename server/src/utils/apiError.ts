export class ApiError extends Error {
  public statusCode: number;
  public message: string;
  public errors: Error[];
  public data: null;
  public success: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: Error[] = [],
    stack: string = "",
  ) {
    super(message)
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if(stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}