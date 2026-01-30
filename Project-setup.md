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

*(To be documented after completion)*

---

## Step 4: Auth State Management (NgRx)

*(To be documented after completion)*

---

## Step 5: Auth Service

*(To be documented after completion)*

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
