import { AppConstants } from '../../models/app-constants';
import { LogEntry, LogLevel, LogTransport } from '../../models/logger.model';

export class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const labelColor = this.logLabelColor(entry.level);
    const context = entry.context ? `[${entry.context}]` : '';

    console.log(
      `%c${entry.timestamp} ${labelColor.label} ${context}`,
      labelColor.color,
      entry.message,
      entry.metadata ?? '',
    );

    if (entry.error?.stack) {
      console.error(entry.error.stack);
    }
  }

  private logLabelColor(level: LogLevel): { color: string; label: string } {
    const labelColor = { color: '', label: '' };
    switch (level) {
      case LogLevel.DEBUG: {
        labelColor.color = '#9E9E9E';
        labelColor.label = AppConstants.LOG_LEVEL.DEBUG;
        break;
      }
      case LogLevel.INFO: {
        labelColor.color = '#2196F3';
        labelColor.label = AppConstants.LOG_LEVEL.INFO;
        break;
      }
      case LogLevel.WARN: {
        labelColor.color = '#FF9800';
        labelColor.label = AppConstants.LOG_LEVEL.WARN;
        break;
      }
      case LogLevel.ERROR: {
        labelColor.color = '#F44336';
        labelColor.label = AppConstants.LOG_LEVEL.ERROR;
        break;
      }
      case LogLevel.OFF: {
        labelColor.color = '';
        labelColor.label = '';
        break;
      }
      default: {
        labelColor.color = '';
        labelColor.label = '';
      }
    }
    return labelColor;
  }
}
