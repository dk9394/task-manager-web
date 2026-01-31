import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../../models/auth/auth-state.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user,
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state) => state.accessToken,
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state) => state.refreshToken,
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  selectAuthState,
  (state) => state.error,
);

export const selectAuthStatus = createSelector(
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  (isAuthenticated, isLoading, error) => ({
    isAuthenticated,
    isLoading,
    error,
  }),
);
