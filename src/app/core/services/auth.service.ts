import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../models/auth/auth.model';
import { environment } from '../../../environments/environment';
import { User } from '../../models/auth/user.model';
import { AppConstants } from '../../models/app-constants';
import { ApiResponse } from '../../models/api/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, request)
      .pipe(
        map((response) => response.data),
        tap((response) => this.handleAuthResponse(response)),
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, request)
      .pipe(
        map((response) => response.data),
        tap((response) => this.handleAuthResponse(response)),
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearTokens();
      }),
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken() ?? '';
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/refresh`, {
        refreshToken,
      })
      .pipe(map((response) => response.data));
  }

  // Token management
  setAccessToken(token: string): void {
    localStorage.setItem(AppConstants.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(AppConstants.ACCESS_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(AppConstants.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AppConstants.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(AppConstants.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AppConstants.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // User management
  storeUser(user: User): void {
    localStorage.setItem(AppConstants.USER_KEY, JSON.stringify(user));
  }

  getStoredUser(): User | null {
    const user = localStorage.getItem(AppConstants.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Helper methods
  private handleAuthResponse(response: AuthResponse): void {
    this.setAccessToken(response.tokens.accessToken);
    this.setRefreshToken(response.tokens.refreshToken);
    this.storeUser(response.user);
  }
}
