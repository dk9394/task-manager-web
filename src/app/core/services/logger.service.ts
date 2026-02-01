import { Injectable } from '@angular/core';
import { LogEntry, LogLevel, LogTransport } from '../../models/logger.model';
import { ConsoleTransport } from './console.transport';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private transports: LogTransport[] = [new ConsoleTransport()];
  private minLevel: LogLevel = environment.production
    ? LogLevel.WARN
    : LogLevel.DEBUG;

  // TODO: Add Splunk transport later
  // addTransport(transport: LogTransport): void {
  //   this.transports.push(transport);
  // }

  debug(
    message: string,
    context?: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.log(LogLevel.DEBUG, message, context, metadata);
  }

  info(
    message: string,
    context?: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  warn(
    message: string,
    context?: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  error(
    message: string,
    error?: Error,
    context?: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.log(LogLevel.ERROR, message, context, metadata, error);
  }

  private log(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, unknown>,
    error?: Error,
  ): void {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : undefined,
    };

    this.transports.forEach((transport) => transport.log(entry));
  }
}
