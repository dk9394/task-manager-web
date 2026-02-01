import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';

import { LoginForm } from '../../../../models/auth/login-form.model';
import { AuthActions } from '../../store/auth.actions';
import { UiCardComponent } from '../../../../shared/ui/ui-card/ui-card.component';
import { UiMessageComponent } from '../../../../shared/ui/ui-message/ui-message.component';
import { UiInputComponent } from '../../../../shared/ui/ui-input/ui-input.component';
import { UiInputPasswordComponent } from '../../../../shared/ui/ui-input-password/ui-input-password.component';
import { UiButtonComponent } from '../../../../shared/ui/ui-button/ui-button.component';
import { selectAuthStatus } from '../../store/auth.selectors';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    AsyncPipe,
    UiCardComponent,
    UiMessageComponent,
    UiInputComponent,
    UiInputPasswordComponent,
    UiButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private store = inject(Store);

  form!: FormGroup<LoginForm>;
  authStatus$ = this.store.select(selectAuthStatus);

  get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  get passwordControl(): FormControl<string> {
    return this.form.controls.password;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.store.dispatch(
        AuthActions.login({ request: this.form.getRawValue() }),
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email] }],
      password: [
        '',
        { validators: [Validators.required, Validators.minLength(6)] },
      ],
    });
  }
}
