import { createReducer, on } from '@ngrx/store';

import { initialAuthState } from '../../../models/auth/auth-state.model';
import { AuthActions } from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState,
  })),
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Refresh Token
  on(AuthActions.refreshToken, (state) => ({
    ...state,
  })),
  on(AuthActions.refreshTokenSuccess, (state, { response }) => ({
    ...state,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
  })),
  on(AuthActions.refreshTokenFailure, () => ({
    ...initialAuthState,
  })),

  // Load from storage
  on(
    AuthActions.loadUserFromStorageSuccess,
    (state, { user, accessToken, refreshToken }) => ({
      ...state,
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    }),
  ),
  on(AuthActions.loadUserFromStorageFailure, (state) => ({
    ...state,
  })),

  // Clear error
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
