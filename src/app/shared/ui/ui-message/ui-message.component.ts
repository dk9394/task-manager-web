import { Component, Input } from '@angular/core';

import { MessageModule } from 'primeng/message';

@Component({
  selector: 'ui-message',
  imports: [MessageModule],
  templateUrl: './ui-message.component.html',
  styleUrl: './ui-message.component.scss',
})
export class UiMessageComponent {
  @Input() severity: 'success' | 'info' | 'warn' | 'error' = 'info';
  @Input() text = '';
}
