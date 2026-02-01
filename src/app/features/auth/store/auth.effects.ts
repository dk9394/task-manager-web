import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';

import { AuthActions } from './auth.actions';
import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger.service';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private loggerService = inject(LoggerService);
  private router = inject(Router);
  private toast = inject(ToastService);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ request }) => {
        return this.authService.login(request).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => of(AuthActions.loginFailure({ error }))),
        );
      }),
    );
  });

  loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          // Store tokens
          this.authService.setAccessToken(response.tokens.accessToken);
          this.authService.setRefreshToken(response.tokens.refreshToken);
          this.authService.storeUser(response.user);

          // Log success
          this.loggerService.info('User logged in', 'AuthEffects', {
            userId: response.user.id,
          });
          this.toast.success('You are logged in successfully.', 'Login');

          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        }),
      );
    },
    { dispatch: false },
  );

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ request }) => {
        return this.authService.register(request).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((error) => of(AuthActions.registerFailure({ error }))),
        );
      }),
    );
  });

  registerSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ response }) => {
          // Store tokens
          this.authService.setAccessToken(response.tokens.accessToken);
          this.authService.setRefreshToken(response.tokens.refreshToken);
          this.authService.storeUser(response.user);

          // Log success
          this.loggerService.info('User registered', 'AuthEffects', {
            userId: response.user.id,
          });
          this.toast.success('You are registered successfully', 'Register');

          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        }),
      );
    },
    { dispatch: false },
  );

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() => {
        return this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((error) => of(AuthActions.logoutFailure({ error }))),
        );
      }),
    );
  });

  logoutSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          // Clear tokens
          this.authService.clearTokens();

          // Log
          this.loggerService.info('User logged out', 'AuthEffects');
          this.toast.success('You are loggedout successfully', 'Logout');

          // Navigate to login
          this.router.navigate(['/auth/login']);
        }),
      );
    },
    { dispatch: false },
  );

  refreshToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() => {
        return this.authService.refreshToken().pipe(
          map((response) => AuthActions.refreshTokenSuccess({ response })),
          catchError((error) => of(AuthActions.refreshTokenFailure({ error }))),
        );
      }),
    );
  });

  refreshTokenSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.refreshTokenSuccess),
        tap(({ response }) => {
          this.authService.setAccessToken(response.tokens.accessToken);
          this.authService.setRefreshToken(response.tokens.refreshToken);
        }),
      );
    },
    { dispatch: false },
  );

  loadUserFromStorage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      map(() => {
        const user = this.authService.getStoredUser();
        const accessToken = this.authService.getAccessToken();
        const refreshToken = this.authService.getRefreshToken();
        if (user && accessToken && refreshToken) {
          return AuthActions.loadUserFromStorageSuccess({
            user,
            accessToken,
            refreshToken,
          });
        }
        return AuthActions.loadUserFromStorageFailure();
      }),
    );
  });
}
