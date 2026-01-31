export interface ErrorResponse {
  code: string;
  message: string;
  details?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse<T> {
  success: boolean;
  error: ErrorResponse;
}
