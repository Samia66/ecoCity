export class ApiResponse<T> {
  success: boolean;

  message: string;

  data: T;

  timestamp: string;

  constructor(
    success: boolean,
    message: string,
    data: T,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(
    data: T,
    message = 'Operation completed successfully',
  ) {
    return new ApiResponse(
      true,
      message,
      data,
    );
  }

  static error(
    message: string,
  ) {
    return new ApiResponse(
      false,
      message,
      null,
    );
  }
}