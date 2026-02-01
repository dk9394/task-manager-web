import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';

import { RegisterForm } from '../../../../models/auth/register-form.model';
import { UiCardComponent } from '../../../../shared/ui/ui-card/ui-card.component';
import { UiInputComponent } from '../../../../shared/ui/ui-input/ui-input.component';
import { UiInputPasswordComponent } from '../../../../shared/ui/ui-input-password/ui-input-password.component';
import { UiButtonComponent } from '../../../../shared/ui/ui-button/ui-button.component';
import { AuthActions } from '../../store/auth.actions';
import { SerializeRegisterFormData } from '../../../../shared/utils/serialize-register-form-data';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    UiCardComponent,
    UiInputComponent,
    UiInputPasswordComponent,
    UiButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  fb = inject(NonNullableFormBuilder);
  store = inject(Store);

  form!: FormGroup<RegisterForm>;

  get nameControl(): FormControl {
    return this.form.controls.name;
  }

  get emailControl(): FormControl {
    return this.form.controls.email;
  }

  get passwordControl(): FormControl {
    return this.form.controls.password;
  }

  get confirmPasswordControl(): FormControl {
    return this.form.controls.confirmPassword;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(
      AuthActions.register({
        request: SerializeRegisterFormData(this.form.getRawValue()),
      }),
    );
  }

  private initializeForm(): void {
    this.form = this.fb.group(
      {
        name: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(50),
            ],
          },
        ],
        email: ['', { validators: [Validators.required, Validators.email] }],
        password: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(100),
              this.passwordValidator,
            ],
          },
        ],
        confirmPassword: ['', { validators: [Validators.required] }],
      },
      { validators: [this.passwordMatchVaidator] },
    );
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control?.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumber;

    return valid
      ? null
      : {
          passwordStrength:
            'Password must contain at least one uppercase letter, one lowercase letter and on number',
        };
  }

  private passwordMatchVaidator(
    group: AbstractControl,
  ): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (
      password?.value &&
      confirmPassword?.value &&
      password.value !== confirmPassword.value
    ) {
      const error = { passwordMismatch: 'Password is not matched' };
      confirmPassword.setErrors(error);
      return error;
    }
    return null;
  }

  get nameErrors(): string {
    let errorMsg = '';
    if (this.nameControl.touched && this.nameControl.errors) {
      if (this.nameControl.hasError('required')) {
        errorMsg = 'Name is required';
      }
      if (this.nameControl.hasError('minlength')) {
        errorMsg = 'Name should contain atleast 2 characters';
      }
      if (this.nameControl.hasError('maxlength')) {
        errorMsg = 'Name can have maximum 50 characters';
      }
    }
    return errorMsg;
  }

  get emailErrors(): string {
    let errorMsg = '';
    if (this.emailControl.touched && this.emailControl.errors) {
      if (this.emailControl.hasError('required')) {
        errorMsg = 'Email is required';
      }
      if (this.emailControl.hasError('email')) {
        errorMsg = 'Please provide a valid email';
      }
    }
    return errorMsg;
  }

  get passwordErrors(): string {
    let errorMsg = '';
    if (this.passwordControl.touched && this.passwordControl.errors) {
      if (this.passwordControl.hasError('required')) {
        errorMsg = 'Password is required';
      }
      if (this.passwordControl.hasError('minlength')) {
        errorMsg = 'Password should contain atleast 8 characters';
      }
      if (this.passwordControl.hasError('maxlength')) {
        errorMsg = 'Password can have maximum 100 characters';
      }
      if (this.passwordControl.hasError('passwordStrength')) {
        errorMsg = this.passwordControl.errors['passwordStrength'];
      }
    }
    return errorMsg;
  }

  get confirmPasswordErrors(): string {
    let errorMsg = '';
    if (
      this.confirmPasswordControl.touched &&
      this.confirmPasswordControl.errors
    ) {
      if (this.confirmPasswordControl.hasError('required')) {
        errorMsg = 'Confirm password is required';
      }
      if (this.confirmPasswordControl.hasError('passwordMismatch')) {
        errorMsg = this.confirmPasswordControl.errors['passwordMismatch'];
      }
    }

    return errorMsg;
  }
}
