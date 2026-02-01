import { ErrorHandler, Injectable } from '@angular/core';

interface ErrorDetails {
  message: string;
  stack?: string;
  name?: string;
  timestamp: string;
  context?: string;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // 1. Extract error Details
    const errorDetails = this.extractError(error);

    // 2. Log to console (placeholder for future Splunk integration)
    this.logError(errorDetails);

    // 3. Handle specific error types
    this.handleSpecificErrors(errorDetails);
  }

  private extractError(error: unknown): ErrorDetails {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      message: String(error),
      timestamp: new Date().toISOString(),
    };
  }

  private logError(errorDetails: ErrorDetails): void {
    console.group('Global Error');
    console.error('Message: ', errorDetails.message);
    console.error('Timestamp : ', errorDetails.timestamp);

    if (errorDetails.stack) {
      console.error('Stack:', errorDetails.stack);
    }
    console.groupEnd();

    // TODO: Future Splunk integration
    // this.logTransport.send(details);
  }

  private handleSpecificErrors(errorDetails: ErrorDetails): void {
    // Chunk loading errors (lazy loaded modules)
    if (errorDetails.message?.includes('ChunkLoadError')) {
      console.warn('Chunk load failed - app may need refresh');
    }
  }
}
