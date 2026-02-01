import { inject, Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';
import { AppConstants } from '../../models/app-constants';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  success(message: string, title = 'Success'): void {
    this.messageService.add({
      severity: AppConstants.ERROR_SEVERITY.SUCCESS,
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  error(message: string, title = 'Error'): void {
    this.messageService.add({
      severity: AppConstants.ERROR_SEVERITY.ERROR,
      summary: title,
      detail: message,
      life: 5000,
    });
  }

  warn(message: string, title = 'Warning'): void {
    this.messageService.add({
      severity: AppConstants.ERROR_SEVERITY.WARN,
      summary: title,
      detail: message,
      life: 4000,
    });
  }

  info(message: string, title = 'Info'): void {
    this.messageService.add({
      severity: AppConstants.ERROR_SEVERITY.INFO,
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
