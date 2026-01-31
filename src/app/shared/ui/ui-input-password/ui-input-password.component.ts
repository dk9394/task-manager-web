import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'ui-input-password',
  imports: [ReactiveFormsModule, PasswordModule],
  templateUrl: './ui-input-password.component.html',
  styleUrl: './ui-input-password.component.scss',
})
export class UiInputPasswordComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() inputId = `password-${Math.random().toString(36).slice(2)}`;
  @Input() feedback = false;
  @Input() toggleMask = true;
  @Input() errorMessage = '';
}
