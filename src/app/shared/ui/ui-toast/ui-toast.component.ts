import { Component, Input } from '@angular/core';

import { ToastModule, ToastPositionType } from 'primeng/toast';

@Component({
  selector: 'ui-toast',
  imports: [ToastModule],
  templateUrl: './ui-toast.component.html',
  styleUrl: './ui-toast.component.scss',
})
export class UiToastComponent {
  @Input() position: ToastPositionType = 'top-right';
}
