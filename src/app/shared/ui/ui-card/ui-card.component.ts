import { Component, Input } from '@angular/core';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'ui-card',
  imports: [CardModule],
  templateUrl: './ui-card.component.html',
  styleUrl: './ui-card.component.scss',
})
export class UiCardComponent {
  @Input() header = '';
  @Input() subheader = '';
  @Input() style: Record<string, string> = {};
}
