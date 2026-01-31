import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'ui-input',
  imports: [InputTextModule, ReactiveFormsModule],
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.scss',
})
export class UiInputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'number' = 'text';
  @Input() inputId = `input-${Math.random().toString(36).slice(2)}`;
  @Input() errorMessage = '';
}
