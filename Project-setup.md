# Task Manager Web - Project Setup Documentation

## Project Overview

- **Framework:** Angular 19.2.0
- **State Management:** NgRx 19
- **UI Library:** PrimeNG 19
- **Styling:** SCSS
- **Architecture:** Standalone Components

---

## Step 1: Install Dependencies

### NgRx Packages

State management library for Angular applications.

```bash
npm install @ngrx/store@19 @ngrx/effects@19 @ngrx/store-devtools@19 @ngrx/entity@19
```

| Package | Version | Purpose |
|---------|---------|---------|
| `@ngrx/store` | ^19.2.1 | Central state container |
| `@ngrx/effects` | ^19.2.1 | Handle side effects (API calls) |
| `@ngrx/store-devtools` | ^19.2.1 | Browser debugging tools |
| `@ngrx/entity` | ^19.2.1 | Entity collection management |

### PrimeNG Packages

UI component library for Angular.

```bash
npm install primeng@19 primeicons @primeng/themes@19
```

| Package | Version | Purpose |
|---------|---------|---------|
| `primeng` | ^19.1.4 | UI components |
| `primeicons` | ^7.0.0 | Icon library |
| `@primeng/themes` | ^19.1.4 | Theming system (new in v19) |

### All-in-One Command

```bash
npm install @ngrx/store@19 @ngrx/effects@19 @ngrx/store-devtools@19 @ngrx/entity@19 primeng@19 primeicons @primeng/themes@19
```

---

## Step 2: Environment Configuration

Manage different configurations for development and production environments.

### Files Created

```
src/
├── app/
│   └── models/
│       └── environment.models.ts    # Type interface
└── environments/
    ├── environment.ts               # Development config
    └── environment.prod.ts          # Production config
```

### Environment Interface

**File:** `src/app/models/environment.models.ts`

```typescript
export interface Environment {
  production: boolean;
  apiUrl: string;
}
```

### Development Environment

**File:** `src/environments/environment.ts`

```typescript
import { Environment } from '../app/models/environment.models';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

### Production Environment

**File:** `src/environments/environment.prod.ts`

```typescript
import { Environment } from '../app/models/environment.models';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
};
```

### Angular.json Configuration

Added file replacement in `angular.json` under `projects > task-manager-web > architect > build > configurations > production`:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

### Key Points

- **Auto-replacement**: Angular CLI swaps environment files during production builds
- **Type Safety**: Both files implement the same `Environment` interface
- **Never hardcode**: Always import API URL from environment, not hardcoded strings
- **No secrets**: Environment files are bundled in browser code - never store secrets here

---

## Step 3: Core Module Setup

Configure app providers and global styles for NgRx, HTTP Client, and PrimeNG.

### App Configuration

**File:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
    provideStore(),
    provideEffects(),
    provideStoreDevtools(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      ripple: true,
    }),
  ],
};
```

### Global Styles

**File:** `src/styles.scss`

```scss
/* PrimeNG Styles */
@import "primeicons/primeicons.css";

/* Your custom styles below */
```

### Providers Summary

| Provider | Purpose |
|----------|---------|
| `provideHttpClient(withInterceptors([]))` | HTTP client with interceptor support |
| `provideStore()` | NgRx root store |
| `provideEffects()` | NgRx effects for side effects |
| `provideStoreDevtools()` | Redux DevTools integration |
| `providePrimeNG()` | PrimeNG theming (Aura preset) |

### PrimeNG v19 Theming

- No CSS imports needed (except primeicons)
- Theme applied via `providePrimeNG()` with preset
- Available presets: `Aura`, `Lara`, `Nora`

### Folder Structure (Created as needed)

```
src/app/
├── core/           # Singleton services, guards, interceptors
├── shared/         # Reusable components, pipes, directives
├── features/       # Feature modules (lazy-loaded)
└── models/         # Shared interfaces/types
```

---

## Step 4: Auth State Management (NgRx)

Complete NgRx setup for authentication state management.

### Files Created

```
src/app/
├── models/                              # Centralized models
│   ├── environment.model.ts
│   ├── user/
│   │   └── user.model.ts                # User interface
│   └── auth/
│       ├── auth.model.ts                # Auth request/response interfaces
│       └── auth-state.model.ts          # Auth state interface
└── features/auth/
    └── store/
        ├── auth.actions.ts              # NgRx actions
        ├── auth.reducers.ts             # State reducer
        ├── auth.selectors.ts            # State selectors
        └── auth.effects.ts              # Side effects (placeholder)
```

### Models

**User Model** (`models/user/user.model.ts`):
```typescript
export type UserTheme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  theme?: UserTheme;
}
```

**Auth Models** (`models/auth/auth.model.ts`):
```typescript
export interface AuthTokens { accessToken: string; refreshToken: string; }
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { name: string; email: string; password: string; }
export interface AuthResponse { user: User; tokens: AuthTokens; }
export interface RefreshTokenResponse extends AuthTokens {}
```

**Auth State** (`models/auth/auth-state.model.ts`):
```typescript
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### NgRx Actions (createActionGroup)

| Action | Payload | Purpose |
|--------|---------|---------|
| `Login` | `LoginRequest` | Trigger login |
| `Login Success` | `AuthResponse` | Login succeeded |
| `Login Failure` | `error` | Login failed |
| `Register` | `RegisterRequest` | Trigger registration |
| `Logout` | none | Trigger logout |
| `Refresh Token` | none | Refresh access token |
| `Clear Error` | none | Clear error state |

### NgRx Selectors

| Selector | Returns |
|----------|---------|
| `selectUser` | `User \| null` |
| `selectAccessToken` | `string \| null` |
| `selectIsAuthenticated` | `boolean` |
| `selectIsLoading` | `boolean` |
| `selectError` | `string \| null` |
| `selectAuthStatus` | Combined status object |

### App Config Registration

```typescript
provideStore({ auth: authReducer }),
provideEffects([AuthEffects]),
provideStoreDevtools({
  maxAge: 25,
  logOnly: !isDevMode(),
  connectInZone: true,
}),
```

### Key Concepts

- **createActionGroup**: Modern NgRx pattern for related actions
- **exhaustMap**: Prevents duplicate API calls (used in effects)
- **Feature Selector**: `createFeatureSelector('auth')` for state access
- **isDevMode()**: Restricts DevTools in production
- **connectInZone**: Ensures Angular change detection works with DevTools

---

## Step 5: Auth Service

HTTP service for authentication API calls and token management.

### Files Created

```
src/app/
├── core/services/
│   └── auth.service.ts          # Auth API service
└── models/
    ├── api/
    │   └── api-response.model.ts # API response wrapper
    └── app-constants.ts          # Storage key constants
```

### Auth Service Methods

| Method | API Endpoint | Purpose |
|--------|--------------|---------|
| `login()` | POST `/auth/login` | Authenticate user |
| `register()` | POST `/auth/register` | Create account |
| `logout()` | POST `/auth/logout` | End session |
| `refreshToken()` | POST `/auth/refresh` | Get new tokens |

### Token Management Methods

| Method | Purpose |
|--------|---------|
| `setAccessToken()` | Store access token |
| `getAccessToken()` | Retrieve access token |
| `setRefreshToken()` | Store refresh token |
| `getRefreshToken()` | Retrieve refresh token |
| `clearTokens()` | Remove all tokens |
| `storeUser()` | Store user data |
| `getStoredUser()` | Retrieve user data |

### API Response Handling

API returns wrapped responses:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

Service extracts data using:
```typescript
.pipe(map((response) => response.data))
```

### App Constants

```typescript
export class AppConstants {
  static ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
  static REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
  static USER_KEY = 'USER';
}
```

### Effects Updated

Auth effects now use AuthService for API calls with `exhaustMap` pattern.

---

## Step 6: HTTP Interceptor

*(To be documented after completion)*

---

## Step 7: Auth Guard

*(To be documented after completion)*

---

## Step 8: Login Component

*(To be documented after completion)*

---

## Step 9: Register Component

*(To be documented after completion)*

---

## Step 10: Auth Layout

*(To be documented after completion)*

---

## Version Compatibility Reference

| Angular | NgRx | PrimeNG |
|---------|------|---------|
| 19.x | 19.x | 19.x |
| 18.x | 18.x | 17.x/18.x |
| 17.x | 17.x | 17.x |
