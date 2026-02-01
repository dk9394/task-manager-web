import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AuthService } from '../services/auth.service';
import { AppConstants } from '../../models/app-constants';
import { LoggerService } from '../services/logger.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loggerService = inject(LoggerService);

  // Skip auth for public URLs
  const isPublicUrl = AppConstants.PUBLIC_URLS.some((url) =>
    req.url.includes(url),
  );
  if (isPublicUrl) {
    return next(req);
  }

  const accessToken = authService.getAccessToken();

  let authReq = req;
  if (accessToken) {
    authReq = addToken(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicUrl) {
        // Warning
        loggerService.warn('AccessToken is expired', 'AuthInterceptor');
        return handleUnauthorized(
          authReq,
          next,
          authService,
          router,
          loggerService,
        );
      }
      return throwError(() => error);
    }),
  );
};

function handleUnauthorized(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
  loggerService: LoggerService,
) {
  const refreshToken = authService.getRefreshToken();

  if (!refreshToken) {
    authService.clearTokens();
    router.navigate(['/auth/login']);
    return throwError(() => new Error('No refresh token available'));
  }

  trackRefresh(next, req);

  return authService.refreshToken().pipe(
    switchMap((response) => {
      authService.setAccessToken(response.tokens.accessToken);
      authService.setRefreshToken(response.tokens.refreshToken);

      const newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${response.tokens.accessToken}`,
        },
      });
      return next(newReq);
    }),
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.clearTokens();
        router.navigate(['/auth/login']);
      } else {
        // Error
        loggerService.error('Login failed', error, 'AuthEffects', {
          email: 'xyz@example.com',
        });
      }
      return throwError(() => error);
    }),
  );
}

// Track if refresh is in progress, queue request while refreshing
function trackRefresh(next: HttpHandlerFn, req: HttpRequest<unknown>) {
  let isRefreshing = false;
  let refreshTokenSubject = new BehaviorSubject<string | null>(null);

  if (isRefreshing) {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addToken(req, token))),
    );
  }
  return next(req);
}

function addToken(req: HttpRequest<unknown>, token: string | null) {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
