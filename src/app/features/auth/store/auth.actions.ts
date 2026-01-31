import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../../models/auth/auth.model';
import { User } from '../../../models/auth/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ request: LoginRequest }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: string }>(),

    Register: props<{ request: RegisterRequest }>(),
    'Register Success': props<{ response: AuthResponse }>(),
    'Register Failure': props<{ error: string }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: string }>(),

    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{ response: AuthResponse }>(),
    'Refresh Token Failure': props<{ error: string }>(),

    'Load User From Storage': emptyProps(),
    'Load User From Storage Success': props<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>(),
    'Load User From Storage Failure': emptyProps(),

    'Clear Error': emptyProps(),
  },
});
