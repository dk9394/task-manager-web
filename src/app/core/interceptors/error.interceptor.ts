import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const loggerService = inject(LoggerService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Skip 401 - handled by auth interceptor
        return throwError(() => error);
      }

      // Log the error
      loggerService.error(
        `HTTP Error: ${error.status} ${error.statusText}`,
        error,
        'ErrorInterceptor',
        {
          url: req.url,
          method: req.method,
          status: error.status,
        },
      );

      // Show user-friendly message
      const message = getErrorMessage(error);
      toastService.error(message);

      return throwError(() => error);
    }),
  );
};

function getErrorMessage(error: HttpErrorResponse): string {
  // Check for API error message first
  if (error.error?.message) {
    return error.error.message;
  }

  // Check for array of error messages
  if (Array.isArray(error.error?.errors)) {
    return error.error.errors[0]?.message || 'Validation failed';
  }

  // Default messages by status code
  switch (error.status) {
    case 0:
      return 'Unable to connect to server. Please check your internet connection.';
    case 400:
      return 'Invalid request. Please check your input.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This operation conflicts with existing data.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}
