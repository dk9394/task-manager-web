# Testing Fundamentals - Learning Module

A comprehensive guide to understanding and implementing tests in Angular applications.

---

## Part 1: Testing Concepts & Philosophy

### 1.1 What is Testing & Why It Matters

#### Definition

Testing is the process of verifying that your code behaves as expected. It involves writing additional code (tests) that exercises your application code and checks the results.

#### Why Test?

| Benefit | Description |
|---------|-------------|
| **Confidence** | Deploy with confidence knowing your code works |
| **Regression Prevention** | Catch bugs before they reach production |
| **Documentation** | Tests describe how code should behave |
| **Design Improvement** | Testable code tends to be better designed |
| **Refactoring Safety** | Change code without fear of breaking things |
| **Faster Development** | Find bugs early when they're cheaper to fix |

#### The Cost of Not Testing

```
Bug found during:
┌─────────────────┬──────────────────┐
│ Development     │ Cost: $1         │
│ Testing         │ Cost: $10        │
│ Production      │ Cost: $100+      │
└─────────────────┴──────────────────┘
```

#### Real-World Scenario

Without tests:
```
1. You write a login feature
2. It works! Ship it.
3. Months later, you refactor the auth service
4. Login breaks, but you don't know
5. Users report: "Can't login!"
6. Emergency fix at 2 AM
```

With tests:
```
1. You write a login feature + tests
2. Tests pass! Ship it.
3. Months later, you refactor the auth service
4. Tests fail immediately
5. You fix the issue before committing
6. Sleep peacefully
```

---

### 1.2 The Testing Pyramid

The testing pyramid is a concept that helps you decide how many tests of each type to write.

```
                    /\
                   /  \
                  / E2E \          Few, Slow, Expensive
                 /──────\
                /        \
               /Integration\       Some, Medium Speed
              /────────────\
             /              \
            /   Unit Tests   \     Many, Fast, Cheap
           /──────────────────\
```

#### Types of Tests

| Type | What It Tests | Speed | Quantity |
|------|--------------|-------|----------|
| **Unit** | Single function/class in isolation | Fast (ms) | Many (70-80%) |
| **Integration** | Multiple units working together | Medium (s) | Some (15-20%) |
| **E2E** | Entire application flow | Slow (min) | Few (5-10%) |

#### Unit Tests

Test individual pieces in isolation.

```typescript
// Testing a pure function
function add(a: number, b: number): number {
  return a + b;
}

// Unit test
it('should add two numbers', () => {
  expect(add(2, 3)).toBe(5);
});
```

**Characteristics:**
- Test one thing at a time
- Fast (milliseconds)
- No external dependencies (database, API, file system)
- Use mocks/stubs for dependencies

#### Integration Tests

Test multiple units working together.

```typescript
// Integration test - Component + Service
it('should display user data from service', () => {
  // Component calls service, service returns data
  // Component displays data in template
  // We verify the entire flow works
});
```

**Characteristics:**
- Test interactions between units
- Slower than unit tests
- May use real or mocked dependencies
- Verify "contracts" between components

#### E2E (End-to-End) Tests

Test the entire application as a user would use it.

```typescript
// E2E test with Cypress/Playwright
it('should login and see dashboard', () => {
  cy.visit('/login');
  cy.get('[data-testid="email"]').type('user@example.com');
  cy.get('[data-testid="password"]').type('password');
  cy.get('[data-testid="submit"]').click();
  cy.url().should('include', '/dashboard');
});
```

**Characteristics:**
- Test real user scenarios
- Slowest (seconds to minutes)
- Use real browser, real backend (or mocked)
- Catch integration issues unit tests miss

---

### 1.3 TDD vs Test-After

#### Test-Driven Development (TDD)

Write tests BEFORE writing code.

```
TDD Cycle (Red-Green-Refactor):

┌─────────────────────────────────────────────┐
│                                             │
│    1. RED                                   │
│    Write a failing test                     │
│              │                              │
│              ▼                              │
│    2. GREEN                                 │
│    Write minimal code to pass               │
│              │                              │
│              ▼                              │
│    3. REFACTOR                              │
│    Improve code, keep tests passing         │
│              │                              │
│              └──────────► Repeat            │
│                                             │
└─────────────────────────────────────────────┘
```

**Example - TDD for a password validator:**

```typescript
// Step 1: RED - Write failing test
it('should return false for password without uppercase', () => {
  expect(isStrongPassword('password123')).toBe(false);
});
// Test fails - isStrongPassword doesn't exist

// Step 2: GREEN - Write minimal code
function isStrongPassword(password: string): boolean {
  return /[A-Z]/.test(password);
}
// Test passes

// Step 3: REFACTOR - Improve if needed
// Add more tests, repeat cycle
```

#### Test-After Development

Write code first, then write tests.

```
1. Write feature code
2. Verify it works manually
3. Write tests to cover the code
4. Refactor if needed
```

#### Comparison

| Aspect | TDD | Test-After |
|--------|-----|------------|
| Design | Forces good design upfront | May need refactoring for testability |
| Coverage | High (test first = all code tested) | May miss edge cases |
| Speed | Slower initially, faster long-term | Faster initially |
| Confidence | High | Depends on discipline |
| Learning Curve | Steeper | Easier to start |

#### When to Use Each

**Use TDD when:**
- Building new features from scratch
- Working on critical business logic
- You want to think through design first

**Use Test-After when:**
- Exploring/prototyping (spike)
- Adding tests to legacy code
- Time-critical fixes (but add tests after!)

---

### 1.4 What to Test vs What Not to Test

#### What TO Test

| Category | Examples |
|----------|----------|
| **Business Logic** | Calculations, validations, transformations |
| **State Changes** | Reducers, service methods that modify state |
| **User Interactions** | Form submissions, button clicks |
| **Edge Cases** | Empty inputs, null values, boundaries |
| **Error Handling** | What happens when things fail |
| **Public APIs** | Methods other code depends on |

#### What NOT to Test

| Category | Why Not |
|----------|---------|
| **Framework Code** | Angular/RxJS already tested |
| **Third-Party Libraries** | PrimeNG components work |
| **Private Methods** | Test through public interface |
| **Simple Getters/Setters** | No logic to test |
| **Configuration** | Constants don't need testing |
| **Implementation Details** | Makes tests brittle |

#### Example: What to Test in AuthService

```typescript
class AuthService {
  // ✅ TEST - Business logic
  login(email: string, password: string): Observable<User>

  // ✅ TEST - State change
  setAccessToken(token: string): void

  // ✅ TEST - Logic
  isTokenExpired(): boolean

  // ❌ DON'T TEST - Simple getter
  get currentUser(): User | null { return this._user; }

  // ❌ DON'T TEST - Configuration
  private readonly API_URL = environment.apiUrl;
}
```

#### The Right Level of Abstraction

Test behavior, not implementation:

```typescript
// ❌ BAD - Testing implementation
it('should call localStorage.setItem with "token" key', () => {
  spyOn(localStorage, 'setItem');
  service.setAccessToken('abc');
  expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc');
});

// ✅ GOOD - Testing behavior
it('should persist token for later retrieval', () => {
  service.setAccessToken('abc');
  expect(service.getAccessToken()).toBe('abc');
});
```

---

### 1.5 Code Coverage - Metrics & Meaning

#### What is Code Coverage?

Code coverage measures how much of your code is executed during tests.

```
┌─────────────────────────────────────────────┐
│  Your Code        Tests Execute             │
│  ────────────     ─────────────             │
│  Line 1    ✅     Covered                   │
│  Line 2    ✅     Covered                   │
│  Line 3    ❌     Not covered               │
│  Line 4    ✅     Covered                   │
│  Line 5    ❌     Not covered               │
│                                             │
│  Coverage: 3/5 = 60%                        │
└─────────────────────────────────────────────┘
```

#### Types of Coverage

| Type | What It Measures |
|------|-----------------|
| **Line Coverage** | % of lines executed |
| **Branch Coverage** | % of if/else branches taken |
| **Function Coverage** | % of functions called |
| **Statement Coverage** | % of statements executed |

#### Branch Coverage Example

```typescript
function getDiscount(age: number): number {
  if (age < 18) {          // Branch 1: age < 18
    return 0.2;
  } else if (age > 65) {   // Branch 2: age > 65
    return 0.15;
  }
  return 0;                // Branch 3: default
}

// Test 1: getDiscount(15) → covers branch 1
// Test 2: getDiscount(70) → covers branch 2
// Test 3: getDiscount(30) → covers branch 3
// All 3 tests needed for 100% branch coverage
```

#### Coverage Goals

| Coverage Level | Meaning |
|----------------|---------|
| 0-30% | Minimal testing |
| 30-60% | Some critical paths tested |
| 60-80% | Good coverage |
| 80-90% | Very good coverage |
| 90-100% | Excellent (but diminishing returns) |

#### The 80% Rule

Aim for ~80% coverage. Why not 100%?

```
Effort vs Value:
                    │
                    │         ╱ Diminishing
         Value      │      ╱    Returns
                    │    ╱
                    │  ╱
                    │╱
                    └─────────────────────
                     0%   50%   80%  100%
                           Coverage
```

**Getting from 80% to 100% often means:**
- Testing trivial code
- Testing framework code
- Writing brittle tests
- Wasting time

#### Coverage Lies

**100% coverage ≠ 100% correct**

```typescript
function divide(a: number, b: number): number {
  return a / b;
}

// This test gives 100% coverage
it('should divide', () => {
  expect(divide(10, 2)).toBe(5);
});

// But what about divide(10, 0)?
// 100% coverage, but bug not caught!
```

**Lesson:** Coverage measures quantity, not quality. Focus on meaningful tests.

---

### 1.6 Testing Mindset - Thinking Like a Tester

#### Shift Your Perspective

Developer mindset: "How do I make this work?"
Tester mindset: "How can this break?"

#### Ask These Questions

1. **Happy Path**: Does it work with valid input?
2. **Edge Cases**: What about boundaries?
3. **Error Cases**: What if something goes wrong?
4. **Null/Empty**: What if input is missing?
5. **Invalid Input**: What if input is wrong type?

#### Example: Testing a Login Function

```typescript
function validateLoginForm(email: string, password: string): ValidationResult

// 1. Happy Path
✅ Valid email and password → success

// 2. Edge Cases
✅ Email at max length (254 chars)
✅ Password at min length (8 chars)
✅ Password at max length

// 3. Error Cases
✅ Invalid email format
✅ Password too short
✅ Empty email
✅ Empty password

// 4. Null/Undefined
✅ Email is null
✅ Password is undefined

// 5. Invalid Types (if using JavaScript)
✅ Email is a number
✅ Password is an object
```

#### The ZOMBIES Acronym

Use this to remember what to test:

| Letter | Meaning | Example |
|--------|---------|---------|
| **Z** | Zero | Empty array, zero value |
| **O** | One | Single item, first element |
| **M** | Many | Multiple items, typical case |
| **B** | Boundaries | Min/max values, edges |
| **I** | Interfaces | API contracts, input/output |
| **E** | Exceptions | Error handling |
| **S** | Simple | Start with simplest case |

#### Think in Terms of Specifications

Tests are specifications of behavior:

```typescript
describe('LoginService', () => {
  describe('login()', () => {
    it('should return user when credentials are valid');
    it('should throw error when email is invalid');
    it('should throw error when password is wrong');
    it('should throw error when user not found');
    it('should lock account after 3 failed attempts');
  });
});
```

Reading this describes exactly what `login()` should do!

---

## Summary - Part 1

| Concept | Key Takeaway |
|---------|--------------|
| Why Test | Confidence, regression prevention, documentation |
| Testing Pyramid | Many unit tests, some integration, few E2E |
| TDD | Write test first → forces good design |
| What to Test | Business logic, state changes, edge cases |
| What NOT to Test | Framework code, trivial getters, implementation details |
| Coverage | Aim for ~80%, focus on quality over quantity |
| Testing Mindset | Ask "how can this break?" |

---

## Practice Exercise

Before moving to Part 2, think about your AuthService:

1. List 5 things you SHOULD test in AuthService
2. List 3 things you should NOT test
3. What are the edge cases for `login()`?
4. What error scenarios should you handle?

Write your answers, then we'll compare when starting Part 2.

---

---

## Part 2: Testing Tools & Setup

### 2.1 Jasmine - Test Framework

Jasmine is the default test framework in Angular. It provides the syntax for writing tests.

#### Core Building Blocks

```typescript
// describe() - Groups related tests (test suite)
describe('Calculator', () => {

  // it() - Individual test case (spec)
  it('should add two numbers', () => {

    // expect() - Assertion
    expect(2 + 3).toBe(5);
  });
});
```

Three functions form the foundation:

| Function | Purpose | Analogy |
|----------|---------|---------|
| `describe()` | Group tests | A chapter in a book |
| `it()` | Single test | A sentence describing behavior |
| `expect()` | Assertion | The actual verification |

#### Nesting describe Blocks

```typescript
describe('AuthService', () => {

  describe('login()', () => {
    it('should return user on valid credentials', () => { });
    it('should throw error on invalid email', () => { });
  });

  describe('logout()', () => {
    it('should clear tokens', () => { });
    it('should navigate to login', () => { });
  });
});
```

This creates a readable output:

```
AuthService
  login()
    ✓ should return user on valid credentials
    ✓ should throw error on invalid email
  logout()
    ✓ should clear tokens
    ✓ should navigate to login
```

#### Jasmine Matchers

Matchers are the `toXxx()` methods on `expect()`:

**Equality:**

| Matcher | Description | Example |
|---------|-------------|---------|
| `toBe()` | Strict equality (`===`) | `expect(1).toBe(1)` |
| `toEqual()` | Deep equality (objects/arrays) | `expect({a:1}).toEqual({a:1})` |

**Important: `toBe` vs `toEqual`**

```typescript
// toBe - checks reference (same object in memory)
const arr = [1, 2];
expect(arr).toBe(arr);        // ✅ Same reference
expect([1,2]).toBe([1,2]);    // ❌ Different references!

// toEqual - checks value (deep comparison)
expect([1,2]).toEqual([1,2]); // ✅ Same values
expect({a:1}).toEqual({a:1}); // ✅ Same values

// Rule of thumb:
// Primitives (string, number, boolean) → toBe
// Objects, Arrays → toEqual
```

**Truthiness:**

| Matcher | Description | Example |
|---------|-------------|---------|
| `toBeTruthy()` | Truthy check | `expect('hello').toBeTruthy()` |
| `toBeFalsy()` | Falsy check | `expect(null).toBeFalsy()` |
| `toBeNull()` | Null check | `expect(null).toBeNull()` |
| `toBeUndefined()` | Undefined check | `expect(undefined).toBeUndefined()` |
| `toBeDefined()` | Not undefined | `expect(value).toBeDefined()` |

**Comparison:**

| Matcher | Description | Example |
|---------|-------------|---------|
| `toBeGreaterThan()` | `>` | `expect(5).toBeGreaterThan(3)` |
| `toBeLessThan()` | `<` | `expect(3).toBeLessThan(5)` |
| `toBeGreaterThanOrEqual()` | `>=` | `expect(5).toBeGreaterThanOrEqual(5)` |

**Content:**

| Matcher | Description | Example |
|---------|-------------|---------|
| `toContain()` | Array/string contains | `expect([1,2]).toContain(1)` |
| `toMatch()` | Regex match | `expect('hello').toMatch(/ell/)` |

**Spy-specific:**

| Matcher | Description | Example |
|---------|-------------|---------|
| `toHaveBeenCalled()` | Spy was called | `expect(spy).toHaveBeenCalled()` |
| `toHaveBeenCalledWith()` | Spy called with args | `expect(spy).toHaveBeenCalledWith('x')` |
| `toHaveBeenCalledTimes()` | Call count | `expect(spy).toHaveBeenCalledTimes(2)` |

**Negation with `.not`:**

```typescript
expect(5).not.toBe(3);
expect([]).not.toContain(1);
expect(service).not.toBeNull();
```

---

### 2.2 Setup & Teardown Hooks

```typescript
describe('MyService', () => {
  let service: MyService;

  // Runs ONCE before all tests in this describe
  beforeAll(() => {
    // Expensive one-time setup (rarely used)
  });

  // Runs BEFORE EACH test
  beforeEach(() => {
    service = new MyService(); // Fresh instance per test
  });

  // Runs AFTER EACH test
  afterEach(() => {
    // Cleanup (clear mocks, localStorage, etc.)
  });

  // Runs ONCE after all tests
  afterAll(() => {
    // Teardown (rarely used)
  });
});
```

**Execution order:**

```
beforeAll()
  beforeEach()  → it('test 1')  → afterEach()
  beforeEach()  → it('test 2')  → afterEach()
  beforeEach()  → it('test 3')  → afterEach()
afterAll()
```

**Why `beforeEach` matters - Test Isolation:**

```typescript
// ❌ BAD - Tests share state, order-dependent
describe('Counter', () => {
  const counter = new Counter(); // Shared!

  it('should start at 0', () => {
    expect(counter.value).toBe(0);  // Passes first run
  });

  it('should increment', () => {
    counter.increment();
    expect(counter.value).toBe(1);  // Passes
  });

  it('should still be at 0', () => {
    expect(counter.value).toBe(0);  // FAILS! value is 1
  });
});

// ✅ GOOD - Each test gets fresh instance
describe('Counter', () => {
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter(); // Fresh every time
  });

  it('should start at 0', () => {
    expect(counter.value).toBe(0);  // Always passes
  });

  it('should increment', () => {
    counter.increment();
    expect(counter.value).toBe(1);  // Always passes
  });
});
```

---

### 2.3 Karma - Test Runner

Karma launches a real browser, runs your tests, and reports results.

#### How Karma Works

```
┌────────────┐     ┌──────────┐     ┌──────────────┐
│ Your Tests │ ──► │  Karma   │ ──► │   Browser    │
│ (.spec.ts) │     │  Server  │     │ (Chrome)     │
└────────────┘     └──────────┘     └──────┬───────┘
                                           │
                        ┌──────────────────┘
                        ▼
                   ┌──────────┐
                   │ Results  │
                   │ Terminal │
                   └──────────┘
```

#### CLI Commands

```bash
# Run all tests (watch mode - re-runs on file change)
ng test

# Run once and exit (useful for CI)
ng test --watch=false

# Run with code coverage report
ng test --code-coverage

# Run in headless mode (no browser window)
ng test --browsers=ChromeHeadless --watch=false

# Run specific test file
ng test --include=**/auth.service.spec.ts

# Run tests matching pattern
ng test --include=**/store/*.spec.ts
```

#### Reading Test Output

```
// Success:
Chrome 120.0: Executed 15 of 15 SUCCESS (0.234 secs)

// Failure:
Chrome 120.0: Executed 15 of 15 (2 FAILED) (0.456 secs)

FAILED TESTS:
  AuthService
    login()
      ✗ should return user on valid credentials
        Expected undefined to equal { id: '1', name: 'Test' }
        at line 42 in auth.service.spec.ts
```

---

### 2.4 Angular TestBed

TestBed is Angular's testing utility that creates a testing module similar to your `app.config.ts`.

#### Why TestBed?

Angular uses dependency injection. Services have dependencies:

```typescript
// AuthService depends on HttpClient
class AuthService {
  private http = inject(HttpClient);  // Where does this come from in tests?
}

// TestBed provides the DI container for tests
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(),
    provideHttpClientTesting(),  // Mock HTTP
  ],
});
```

#### TestBed for Services

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Step 1: Configure testing module
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    // Step 2: Get instances from DI
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

#### TestBed for Components

```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    // Step 1: Configure (async for template compilation)
    await TestBed.configureTestingModule({
      imports: [LoginComponent],  // Standalone component
      providers: [
        provideMockStore({ initialState }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    // Step 2: Create component
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Step 3: Trigger initial change detection
    fixture.detectChanges();
  });
});
```

#### Key TestBed Concepts

| Concept | Purpose |
|---------|---------|
| `configureTestingModule()` | Set up providers, imports |
| `TestBed.inject()` | Get service from DI |
| `createComponent()` | Create component instance |
| `fixture` | Wrapper with DOM access + change detection |
| `fixture.componentInstance` | The component class instance |
| `fixture.nativeElement` | The actual DOM element |
| `fixture.detectChanges()` | Trigger change detection manually |
| `compileComponents()` | Compile templates (async) |
| `NO_ERRORS_SCHEMA` | Ignore unknown child elements |

#### fixture.detectChanges() - Why Manual?

In tests, change detection doesn't run automatically:

```typescript
it('should display updated name', () => {
  component.userName = 'John';
  // DOM still shows old value!

  fixture.detectChanges(); // NOW the DOM updates

  const el = fixture.nativeElement.querySelector('.name');
  expect(el.textContent).toContain('John');
});
```

#### NO_ERRORS_SCHEMA - Shallow vs Deep Testing

```typescript
// LoginComponent uses <ui-button>, <ui-input>

// Option A: Deep Test - Import child components
imports: [LoginComponent, UiButtonComponent, UiInputComponent]
// Tests component + children interaction

// Option B: Shallow Test - Ignore children
schemas: [NO_ERRORS_SCHEMA]
// Tests only component logic
```

| Approach | When to Use |
|----------|-------------|
| Deep (import children) | Testing component interactions |
| Shallow (NO_ERRORS_SCHEMA) | Testing component logic only |

---

### 2.5 Test File Convention

Test files sit next to source files with `.spec.ts` suffix:

```
src/app/core/services/
├── auth.service.ts           ← Source
├── auth.service.spec.ts      ← Test
├── logger.service.ts
└── logger.service.spec.ts

src/app/features/auth/components/login/
├── login.component.ts        ← Source
├── login.component.spec.ts   ← Test
├── login.component.html
└── login.component.scss
```

#### Anatomy of a Spec File

```typescript
// ──── 1. IMPORTS ────
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

// ──── 2. TEST SUITE ────
describe('AuthService', () => {

  // ──── 3. VARIABLES ────
  let service: AuthService;

  // ──── 4. SETUP ────
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  // ──── 5. TEARDOWN ────
  afterEach(() => {
    localStorage.clear();
  });

  // ──── 6. TESTS (grouped by feature) ────
  describe('login()', () => {
    it('should call API with correct payload', () => {
      // Arrange
      const credentials = { email: 'a@b.com', password: '123' };

      // Act
      service.login(credentials);

      // Assert
      expect(/* something */).toBe(/* expected */);
    });
  });
});
```

---

### 2.6 Your Project's Test Setup

Your project uses:

| Tool | Config |
|------|--------|
| Framework | Jasmine |
| Runner | Karma |
| Builder | `@angular-devkit/build-angular:karma` |
| TS Config | `tsconfig.spec.json` |
| Polyfills | `zone.js`, `zone.js/testing` |

To verify everything works, run:

```bash
ng test --watch=false
```

---

## Summary - Part 2

| Concept | Key Takeaway |
|---------|--------------|
| `describe()` | Groups related tests into suites |
| `it()` | Individual test case |
| `expect().toBe()` | Primitives, `toEqual()` for objects |
| `beforeEach` | Fresh setup for each test (isolation) |
| Karma | Runs tests in real browser |
| TestBed | Angular's DI container for tests |
| `fixture` | Component wrapper with DOM + change detection |
| `.spec.ts` | Test files sit next to source files |

---

## Practice Exercise

Try running `ng test --watch=false` in your project. Observe:
1. Which spec files already exist?
2. Do any default tests pass or fail?
3. What does the output look like?

---

---

## Part 3: Unit Testing Patterns

### 3.1 The AAA Pattern (Arrange, Act, Assert)

Every test follows this structure. It's the most important pattern to learn.

```typescript
it('should calculate total with tax', () => {
  // ──── ARRANGE ────
  // Set up test data and preconditions
  const price = 100;
  const taxRate = 0.1;

  // ──── ACT ────
  // Perform the action being tested
  const total = calculateTotal(price, taxRate);

  // ──── ASSERT ────
  // Verify the result
  expect(total).toBe(110);
});
```

| Phase | Purpose | Question It Answers |
|-------|---------|---------------------|
| **Arrange** | Set up inputs, mocks, state | "What do I need before the action?" |
| **Act** | Execute the code under test | "What am I testing?" |
| **Assert** | Verify the outcome | "What should happen?" |

#### Real Example: Testing AuthService.login()

```typescript
it('should send login request and return user data', () => {
  // ARRANGE
  const credentials = { email: 'test@example.com', password: 'Password123' };
  const mockResponse = {
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    tokens: { accessToken: 'abc', refreshToken: 'xyz' },
  };

  // ACT
  service.login(credentials).subscribe((response) => {
    // ASSERT
    expect(response).toEqual(mockResponse);
  });

  // Also ASSERT: verify HTTP request was made correctly
  const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual(credentials);
  req.flush(mockResponse); // Simulate server response
});
```

#### Common Mistake: Mixing Phases

```typescript
// ❌ BAD - Arrange and Act mixed together
it('should work', () => {
  service.setToken('abc');
  expect(service.getToken()).toBe('abc');
  service.setToken('xyz');
  expect(service.getToken()).toBe('xyz');
  service.clearToken();
  expect(service.getToken()).toBeNull();
});

// ✅ GOOD - Separate tests, clear AAA
it('should store token', () => {
  service.setToken('abc');          // Act
  expect(service.getToken()).toBe('abc');  // Assert
});

it('should overwrite existing token', () => {
  service.setToken('abc');          // Arrange
  service.setToken('xyz');          // Act
  expect(service.getToken()).toBe('xyz');  // Assert
});

it('should clear token', () => {
  service.setToken('abc');          // Arrange
  service.clearToken();             // Act
  expect(service.getToken()).toBeNull();  // Assert
});
```

---

### 3.2 Testing Pure Functions

Pure functions are the easiest to test - same input always gives same output, no side effects.

```typescript
// Pure function - no dependencies, no side effects
function formatUserName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.toUpperCase();
}
```

#### Tests

```typescript
describe('formatUserName', () => {
  it('should format name in uppercase', () => {
    expect(formatUserName('john', 'doe')).toBe('JOHN DOE');
  });

  it('should trim whitespace', () => {
    expect(formatUserName('  john  ', '  doe  ')).toBe('JOHN DOE');
  });

  it('should handle empty strings', () => {
    expect(formatUserName('', '')).toBe(' ');
    // Or if this reveals a bug, fix the function!
  });
});
```

#### Testing Your Validators (Pure Functions!)

```typescript
// Your passwordStrengthValidator is a pure function
describe('passwordStrengthValidator', () => {
  let validator: ValidatorFn;

  beforeEach(() => {
    validator = passwordStrengthValidator();
  });

  it('should return null for strong password', () => {
    const control = new FormControl('Password123');
    expect(validator(control)).toBeNull();
  });

  it('should return error for lowercase only', () => {
    const control = new FormControl('password');
    expect(validator(control)).toEqual({
      passwordStrength: jasmine.any(String),
    });
  });

  it('should return error for no numbers', () => {
    const control = new FormControl('Password');
    expect(validator(control)).toEqual({
      passwordStrength: jasmine.any(String),
    });
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });
});
```

**Note:** `jasmine.any(String)` matches any string value - useful when you care about the error existing but not the exact message.

---

### 3.3 Testing Services with Dependencies

Most Angular services depend on other services. Use TestBed to provide them.

#### Pattern: Real Service + Mock Dependencies

```typescript
describe('ToastService', () => {
  let service: ToastService;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    // Create a mock for the dependency
    const spy = jasmine.createSpyObj('MessageService', ['add', 'clear']);

    TestBed.configureTestingModule({
      providers: [
        ToastService,                              // Real service
        { provide: MessageService, useValue: spy }, // Mock dependency
      ],
    });

    service = TestBed.inject(ToastService);
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should delegate to MessageService with correct params', () => {
    // Act
    service.success('Hello', 'Title');

    // Assert - verify the dependency was called correctly
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Title',
      detail: 'Hello',
      life: 3000,
    });
  });
});
```

#### Providing Mock Dependencies

```typescript
// Three ways to provide mock dependencies:

// 1. createSpyObj - creates an object with spy methods
const spy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);
{ provide: RealService, useValue: spy }

// 2. spyOn - spy on existing object's method
const service = new RealService();
spyOn(service, 'methodName').and.returnValue('mock value');

// 3. useClass - provide a different class
class MockAuthService {
  login() { return of(mockResponse); }
}
{ provide: AuthService, useClass: MockAuthService }
```

When to use each:

| Approach | When to Use |
|----------|-------------|
| `createSpyObj` | Most common, when you need to track calls |
| `spyOn` | When you want to partially mock (keep some real methods) |
| `useClass` | When mock needs complex behavior |

---

### 3.4 Testing Async Code (Observables)

Angular heavily uses Observables (RxJS). There are multiple ways to test async code.

#### Method 1: Subscribe + done callback

```typescript
it('should return user on login', (done) => {
  // The done callback tells Jasmine "wait for this to finish"
  service.login(credentials).subscribe({
    next: (response) => {
      expect(response.user.email).toBe('test@example.com');
      done(); // Tell Jasmine we're done
    },
    error: done.fail, // Fail test if error occurs
  });

  // Flush the mock HTTP response
  const req = httpMock.expectOne('/auth/login');
  req.flush(mockResponse);
});
```

**Important:** If you forget `done()`, the test passes even if the subscribe never runs!

#### Method 2: fakeAsync + tick

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('should update value after delay', fakeAsync(() => {
  let value = '';

  // Simulate something async
  setTimeout(() => { value = 'updated'; }, 1000);

  // Time hasn't passed yet
  expect(value).toBe('');

  // Fast-forward time
  tick(1000);

  // Now it's updated
  expect(value).toBe('updated');
}));
```

`fakeAsync` + `tick` gives you control over time:

| Function | Purpose |
|----------|---------|
| `fakeAsync()` | Wraps test in a fake async zone |
| `tick(ms)` | Fast-forward time by ms |
| `tick()` | Fast-forward all pending microtasks |
| `flush()` | Fast-forward all pending timers |

#### Method 3: waitForAsync

```typescript
import { waitForAsync } from '@angular/core/testing';

it('should load data', waitForAsync(() => {
  service.getData().subscribe((data) => {
    expect(data.length).toBe(3);
  });
}));
```

#### Which Method to Use?

| Method | Best For |
|--------|----------|
| `subscribe + done` | HTTP calls with HttpTestingController |
| `fakeAsync + tick` | setTimeout, debounce, interval |
| `waitForAsync` | Promises, simpler async |

---

### 3.5 Testing HTTP Calls (HttpTestingController)

This is one of the most important patterns for service testing.

#### Setup

```typescript
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(), // Intercepts all HTTP calls
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unexpected HTTP calls
  });
});
```

#### Testing a GET Request

```typescript
it('should fetch user profile', () => {
  const mockUser = { id: '1', name: 'John' };

  // ACT - subscribe to trigger HTTP call
  service.getProfile().subscribe((user) => {
    // ASSERT - verify response
    expect(user).toEqual(mockUser);
  });

  // ASSERT - verify request was made
  const req = httpMock.expectOne('/api/profile');
  expect(req.request.method).toBe('GET');

  // Provide mock response
  req.flush(mockUser);
});
```

#### Testing a POST Request

```typescript
it('should send login credentials', () => {
  const credentials = { email: 'test@test.com', password: 'pass' };
  const mockResponse = { user: { id: '1' }, tokens: { accessToken: 'abc' } };

  service.login(credentials).subscribe((response) => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne('/api/auth/login');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual(credentials);  // Verify body sent
  req.flush(mockResponse);
});
```

#### Testing Error Responses

```typescript
it('should handle 401 error', () => {
  service.login(credentials).subscribe({
    next: () => fail('Should have failed'),
    error: (error) => {
      expect(error.status).toBe(401);
    },
  });

  const req = httpMock.expectOne('/api/auth/login');
  req.flush(
    { message: 'Invalid credentials' },  // Error body
    { status: 401, statusText: 'Unauthorized' }  // Status
  );
});
```

#### HttpTestingController Methods

| Method | Purpose |
|--------|---------|
| `expectOne(url)` | Expect exactly one request to URL |
| `expectNone(url)` | Expect NO requests to URL |
| `match(predicate)` | Find requests matching condition |
| `verify()` | Fail if there are outstanding requests |
| `req.flush(data)` | Provide mock response |
| `req.error(event)` | Simulate network error |

#### Flow Diagram

```
Test Code                    HttpTestingController
────────                     ─────────────────────
service.login()  ───────►    Captures the request
                             (doesn't send to server)

httpMock.expectOne() ◄────   Returns the captured request

expect(req.request) ◄────   You verify request details

req.flush(mockData) ─────►  Sends mock response
                             to the subscriber

subscribe((response)) ◄──   Your assertion runs
```

---

### 3.6 Isolation - Testing One Thing at a Time

Each test should verify ONE behavior. If a test fails, you should immediately know what broke.

```typescript
// ❌ BAD - Tests too many things at once
it('should login, store tokens, and navigate', () => {
  service.login(credentials).subscribe((response) => {
    expect(response.user).toBeDefined();
    expect(response.tokens.accessToken).toBe('abc');
    expect(localStorage.getItem('token')).toBe('abc');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});

// ✅ GOOD - One behavior per test
it('should return user data on successful login', () => {
  service.login(credentials).subscribe((response) => {
    expect(response.user).toEqual(mockUser);
  });
  httpMock.expectOne('/auth/login').flush(mockResponse);
});

it('should send POST with correct body', () => {
  service.login(credentials).subscribe();
  const req = httpMock.expectOne('/auth/login');
  expect(req.request.body).toEqual(credentials);
  req.flush(mockResponse);
});
```

#### Test Naming Convention

Follow the pattern: `should [expected behavior] when [condition]`

```typescript
// ✅ Clear, descriptive names
it('should return null when no token stored')
it('should throw error when email is invalid')
it('should navigate to dashboard on login success')
it('should clear all tokens on logout')
it('should retry with refresh token on 401 error')

// ❌ Vague names
it('should work')
it('should handle login')
it('test error case')
it('token test')
```

---

## Summary - Part 3

| Pattern | Key Takeaway |
|---------|--------------|
| AAA | Arrange → Act → Assert (every test) |
| Pure Functions | Easiest to test - no dependencies |
| Service Dependencies | Use `createSpyObj` for mock dependencies |
| Async (Observable) | `subscribe + done` for HTTP, `fakeAsync + tick` for timers |
| HTTP Testing | `HttpTestingController` captures requests, `flush()` sends responses |
| Isolation | One behavior per test, clear naming |

---

## Practice Exercise

Using the AAA pattern and your understanding of `HttpTestingController`, try to write (mentally or on paper) a test for:

```typescript
// AuthService
refreshToken(): Observable<AuthResponse> {
  return this.http.post<AuthResponse>('/api/auth/refresh', {
    refreshToken: this.getRefreshToken(),
  });
}
```

Questions to answer:
1. What do you need to **Arrange**?
2. What is the **Act**?
3. What should you **Assert**?
4. What edge case would you add?

---

---

## Part 4: Component Testing

Component testing is more complex than service testing because components have:
- A TypeScript class (logic)
- An HTML template (view)
- Dependencies (services, store)
- Lifecycle hooks (ngOnInit)
- Child components (ui-input, ui-button)

### 4.1 Component Testing Strategies

Two main strategies:

```
SHALLOW TESTING                    DEEP TESTING
─────────────                      ────────────
Test component in isolation        Test with child components
Ignore child components            Import child components
NO_ERRORS_SCHEMA                   No schema needed
Fast, focused                      Slower, thorough
```

| Strategy | When to Use | Schema |
|----------|-------------|--------|
| **Shallow** | Testing component logic (most cases) | `NO_ERRORS_SCHEMA` |
| **Deep** | Testing parent-child interaction | Import children |

**Recommendation:** Start with shallow testing. Add deep tests only when needed.

---

### 4.2 Setting Up Component Tests

Using your actual `LoginComponent` as the example:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthActions } from '../../store/auth.actions';
import { initialAuthState } from '../../../../models/auth/auth-state.model';
import { LoggerService } from '../../../../core/services/logger.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  let loggerSpy: jasmine.SpyObj<LoggerService>;

  const initialState = { auth: initialAuthState };

  beforeEach(async () => {
    loggerSpy = jasmine.createSpyObj('LoggerService', [
      'debug', 'info', 'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: LoggerService, useValue: loggerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  // Tests go here...
});
```

#### Breakdown of Setup

| Line | Purpose |
|------|---------|
| `imports: [LoginComponent]` | The component being tested (standalone) |
| `ReactiveFormsModule` | Required for reactive forms |
| `RouterTestingModule` | Mock router (for routerLink in template) |
| `provideMockStore` | Provides a mock NgRx store |
| `LoggerService` spy | Mock the logger dependency |
| `NO_ERRORS_SCHEMA` | Ignore `<ui-input>`, `<ui-button>` etc. |
| `spyOn(store, 'dispatch')` | Track store dispatches |
| `fixture.detectChanges()` | Triggers `ngOnInit()` → `initializeForm()` |

---

### 4.3 Testing Component Class (Logic)

Test the TypeScript class directly through `component`:

#### Test: Component Created

```typescript
it('should create', () => {
  expect(component).toBeTruthy();
});
```

#### Test: Form Initialization

```typescript
describe('Form initialization', () => {
  it('should create form on init', () => {
    expect(component.form).toBeDefined();
  });

  it('should have email and password controls', () => {
    expect(component.form.contains('email')).toBe(true);
    expect(component.form.contains('password')).toBe(true);
  });

  it('should initialize with empty values', () => {
    expect(component.emailControl.value).toBe('');
    expect(component.passwordControl.value).toBe('');
  });

  it('should log form initialization', () => {
    expect(loggerSpy.debug).toHaveBeenCalledWith(
      'Form initialized',
      'LoginComponent'
    );
  });
});
```

#### Test: Control Getters

```typescript
describe('Control getters', () => {
  it('should return email control via getter', () => {
    expect(component.emailControl).toBe(component.form.controls.email);
  });

  it('should return password control via getter', () => {
    expect(component.passwordControl).toBe(component.form.controls.password);
  });
});
```

---

### 4.4 Testing Form Validation

Test validators by setting values and checking errors:

```typescript
describe('Form validation', () => {

  describe('email field', () => {
    it('should be invalid when empty', () => {
      component.emailControl.setValue('');
      expect(component.emailControl.hasError('required')).toBe(true);
    });

    it('should be invalid with bad email format', () => {
      component.emailControl.setValue('not-an-email');
      expect(component.emailControl.hasError('email')).toBe(true);
    });

    it('should be valid with correct email', () => {
      component.emailControl.setValue('test@example.com');
      expect(component.emailControl.valid).toBe(true);
    });
  });

  describe('password field', () => {
    it('should be invalid when empty', () => {
      component.passwordControl.setValue('');
      expect(component.passwordControl.hasError('required')).toBe(true);
    });

    it('should be invalid when less than 6 characters', () => {
      component.passwordControl.setValue('12345');
      expect(component.passwordControl.hasError('minlength')).toBe(true);
    });

    it('should be valid with 6+ characters', () => {
      component.passwordControl.setValue('123456');
      expect(component.passwordControl.valid).toBe(true);
    });
  });

  describe('form level', () => {
    it('should be invalid when both fields empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should be valid when both fields correct', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(component.form.valid).toBe(true);
    });
  });
});
```

#### Key Methods for Form Testing

| Method | Purpose |
|--------|---------|
| `control.setValue('value')` | Set single control value |
| `form.patchValue({...})` | Set multiple values at once |
| `control.hasError('required')` | Check specific validator error |
| `control.errors` | Get all errors object |
| `control.valid` / `form.valid` | Check validity |
| `control.markAsTouched()` | Simulate user blur |

---

### 4.5 Testing Form Submission

```typescript
describe('onSubmit()', () => {
  it('should dispatch login action when form is valid', () => {
    // Arrange
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    // Act
    component.onSubmit();

    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.login({
        request: { email: 'test@example.com', password: 'password123' },
      })
    );
  });

  it('should NOT dispatch when form is invalid', () => {
    component.form.patchValue({ email: '', password: '' });
    component.onSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched when invalid', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.onSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });
});
```

---

### 4.6 Testing Template (DOM)

Access DOM through `fixture.nativeElement`:

```typescript
describe('Template', () => {
  it('should have a form element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const form = compiled.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should render email input component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const emailInput = compiled.querySelector('app-ui-input');
    expect(emailInput).toBeTruthy();
  });

  it('should render submit button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('app-ui-button');
    expect(button).toBeTruthy();
  });
});
```

**Note:** With `NO_ERRORS_SCHEMA`, custom elements exist in DOM but aren't rendered. Focus on class logic for shallow tests.

---

### 4.7 Testing with NgRx MockStore

#### Providing Initial State

```typescript
provideMockStore({
  initialState: {
    auth: initialAuthState,
  },
})
```

#### Overriding Selectors

```typescript
import { selectAuthStatus } from '../../store/auth.selectors';

it('should reflect loading state from store', () => {
  // Override what the selector returns
  store.overrideSelector(selectAuthStatus, {
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  store.refreshState(); // Trigger emission

  component.authStatus$.subscribe((status) => {
    expect(status.isLoading).toBe(true);
  });
});

it('should reflect error state from store', () => {
  store.overrideSelector(selectAuthStatus, {
    isAuthenticated: false,
    isLoading: false,
    error: 'Invalid credentials',
  });
  store.refreshState();

  component.authStatus$.subscribe((status) => {
    expect(status.error).toBe('Invalid credentials');
  });
});
```

#### MockStore Key Methods

| Method | Purpose |
|--------|---------|
| `provideMockStore({ initialState })` | Create mock store |
| `store.overrideSelector(selector, value)` | Mock selector return |
| `store.refreshState()` | Trigger state emission |
| `spyOn(store, 'dispatch')` | Track dispatched actions |
| `store.setState(newState)` | Set entire state |

---

### 4.8 Testing @Input and @Output

For wrapper components like your `UiInputComponent`:

#### Testing @Input

```typescript
describe('UiInputComponent', () => {
  let component: UiInputComponent;
  let fixture: ComponentFixture<UiInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiInputComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UiInputComponent);
    component = fixture.componentInstance;
  });

  it('should accept control input', () => {
    component.control = new FormControl('test');
    fixture.detectChanges();
    expect(component.control.value).toBe('test');
  });

  it('should have default type as text', () => {
    expect(component.type).toBe('text');
  });

  it('should accept custom label', () => {
    component.label = 'Email Address';
    fixture.detectChanges();
    expect(component.label).toBe('Email Address');
  });
});
```

#### Testing @Output

```typescript
// For a component with: @Output() onClick = new EventEmitter<Event>();

it('should emit click event', () => {
  spyOn(component.onClick, 'emit');

  // Trigger the click
  component.onClick.emit(new Event('click'));

  expect(component.onClick.emit).toHaveBeenCalled();
});
```

---

## Summary - Part 4

| Topic | Key Takeaway |
|-------|--------------|
| Shallow vs Deep | Start shallow (NO_ERRORS_SCHEMA), go deep when needed |
| Setup | TestBed + MockStore + spy dependencies |
| Form Testing | `setValue()`, `patchValue()`, `hasError()` |
| Submit Testing | Verify `store.dispatch` with correct action |
| DOM Testing | `fixture.nativeElement.querySelector()` |
| MockStore | `overrideSelector()` + `refreshState()` |
| @Input/@Output | Set inputs directly, spy on output emitters |

---

## Practice Exercise

Think about your `RegisterComponent`:

1. How many `describe` blocks would you need?
   (Hint: form init, name validation, email validation, password strength, password match, submit)
2. How would you test `passwordMatchValidator` through the component?
   (Hint: patchValue both passwords, call `form.updateValueAndValidity()`)
3. What extra setup does RegisterComponent need vs LoginComponent?

---

**Next: Part 5 - Integration Testing (component + service, routing)**

---

---

## Part 5: Integration Testing

Integration tests verify that **multiple units work together correctly**. While unit tests isolate one thing, integration tests connect pieces and test their interaction.

### 5.1 Unit vs Integration Tests

```
UNIT TEST                         INTEGRATION TEST
──────────                        ─────────────────
Tests ONE thing                   Tests MULTIPLE things together
Mocks all dependencies            Uses REAL dependencies (some or all)
Fast, isolated                    Slower, realistic
"Does this function work?"        "Do these pieces work together?"
```

#### Visual Comparison

```
Unit Test: LoginComponent
┌────────────────────────────┐
│  LoginComponent            │
│  ┌─────────┐ ┌──────────┐ │
│  │MockStore│ │MockLogger│ │    ← Everything mocked
│  └─────────┘ └──────────┘ │
└────────────────────────────┘

Integration Test: LoginComponent + Store + Effects
┌─────────────────────────────────────────────┐
│  LoginComponent                             │
│  ┌───────────┐  ┌─────────┐  ┌───────────┐ │
│  │ Real Store │→│ Reducer │→│  Effects  │ │    ← Real store pipeline
│  └───────────┘  └─────────┘  └─────┬─────┘ │
│                                    │        │
│                              ┌─────▼─────┐  │
│                              │ MockHTTP  │  │    ← Only HTTP mocked
│                              └───────────┘  │
└─────────────────────────────────────────────┘
```

#### When to Use Each

| Scenario | Test Type |
|----------|-----------|
| Form validation logic | Unit |
| Service method returns correct data | Unit |
| Component dispatches correct action | Unit |
| Component → Store → Reducer → State → Component updates | **Integration** |
| Service → HTTP → Response → Side effects | **Integration** |
| Parent passes data to child, child emits back | **Integration** |
| Route navigation triggers guard + component load | **Integration** |

---

### 5.2 Integration Test: Component + Real Store

Instead of `provideMockStore`, use the **real** store with reducers. This tests the full NgRx cycle.

#### Setup

```typescript
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from '../../store/auth.reducer';

describe('LoginComponent (Integration)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        // REAL store with REAL reducer
        StoreModule.forRoot({}),
        StoreModule.forFeature('auth', authReducer),
      ],
      providers: [
        { provide: LoggerService, useValue: jasmine.createSpyObj('LoggerService', ['debug', 'info', 'error']) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
```

#### Why Real Store?

| MockStore | Real Store |
|-----------|------------|
| `overrideSelector()` returns fake data | Selectors derive from actual state |
| Dispatched actions go nowhere | Actions hit the reducer, state changes |
| Tests component in isolation | Tests component + store pipeline |
| Good for unit tests | Good for integration tests |

#### Test: Full Dispatch → State → View Cycle

```typescript
it('should show loading state after login dispatch', () => {
  // Arrange
  component.form.patchValue({
    email: 'test@example.com',
    password: 'password123',
  });

  // Act - dispatch login (this hits the REAL reducer)
  component.onSubmit();

  // The reducer sets isLoading: true for AuthActions.login
  // Assert - verify state changed
  store.select(selectIsLoading).subscribe((isLoading) => {
    expect(isLoading).toBe(true);
  });
});

it('should show error after login failure', () => {
  // Simulate error by dispatching failure directly
  store.dispatch(AuthActions.loginFailure({ error: 'Invalid credentials' }));

  // Assert - state reflects error
  store.select(selectError).subscribe((error) => {
    expect(error).toBe('Invalid credentials');
  });

  // Assert - component reflects error via authStatus$
  component.authStatus$.subscribe((status) => {
    expect(status.error).toBe('Invalid credentials');
    expect(status.isLoading).toBe(false);
  });
});
```

---

### 5.3 Integration Test: Component + Service + HTTP

Test the component calling a real service, but mock only the HTTP layer.

```typescript
describe('LoginComponent + AuthService (Integration)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('auth', authReducer),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([AuthEffects]),
      ],
      providers: [
        AuthService,               // REAL service
        provideHttpClient(),
        provideHttpClientTesting(), // Mock HTTP only
        { provide: LoggerService, useValue: jasmine.createSpyObj('LoggerService', ['debug', 'info', 'error', 'warn']) },
        { provide: ToastService, useValue: jasmine.createSpyObj('ToastService', ['success', 'error']) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

#### Test: Full Login Flow

```typescript
it('should complete login flow: form → dispatch → effect → HTTP → state', () => {
  const mockResponse = {
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    tokens: { accessToken: 'abc', refreshToken: 'xyz' },
  };

  // ARRANGE - fill form
  component.form.patchValue({
    email: 'test@example.com',
    password: 'password123',
  });

  // ACT - submit form
  component.onSubmit();

  // Effect triggers HTTP call via AuthService
  const req = httpMock.expectOne('/api/auth/login');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual({
    email: 'test@example.com',
    password: 'password123',
  });

  // Simulate server response
  req.flush(mockResponse);

  // ASSERT - store state updated
  store.select(selectIsAuthenticated).subscribe((isAuth) => {
    expect(isAuth).toBe(true);
  });

  store.select(selectUser).subscribe((user) => {
    expect(user?.email).toBe('test@example.com');
  });
});
```

#### What This Tests (Full Pipeline)

```
component.onSubmit()
    │
    ▼
store.dispatch(AuthActions.login({ request }))
    │
    ▼
AuthEffects.login$  ←── listens for AuthActions.login
    │
    ▼
AuthService.login()  ←── real service makes HTTP call
    │
    ▼
HttpTestingController  ←── we intercept and provide response
    │
    ▼
AuthEffects dispatches AuthActions.loginSuccess
    │
    ▼
authReducer  ←── updates state
    │
    ▼
Selectors  ←── component reads updated state
```

---

### 5.4 Testing Parent-Child Component Interaction

When a parent component passes data to a child and the child emits events back.

#### Scenario

```
┌─────────────────────────┐
│  ParentComponent        │
│                         │
│  ┌───────────────────┐  │
│  │  ChildComponent   │  │
│  │  @Input() data    │  │    ← Parent passes data down
│  │  @Output() action │  │    ← Child emits events up
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

#### Deep Test Setup (Import Real Child)

```typescript
describe('ParentComponent + ChildComponent', () => {
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ParentComponent,
        ChildComponent,   // REAL child component (deep test)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should pass items to child component', () => {
    // Arrange
    parentComponent.items = [{ id: 1, name: 'Task 1' }];
    fixture.detectChanges();

    // Assert - child received the data
    const childDebugEl = fixture.debugElement.query(
      By.directive(ChildComponent)
    );
    const childComponent = childDebugEl.componentInstance as ChildComponent;
    expect(childComponent.data).toEqual([{ id: 1, name: 'Task 1' }]);
  });

  it('should handle child event emission', () => {
    spyOn(parentComponent, 'onChildAction');

    // Find the child component
    const childDebugEl = fixture.debugElement.query(
      By.directive(ChildComponent)
    );
    const childComponent = childDebugEl.componentInstance as ChildComponent;

    // Trigger child's output
    childComponent.action.emit({ type: 'delete', id: 1 });

    // Parent should have handled it
    expect(parentComponent.onChildAction).toHaveBeenCalledWith({
      type: 'delete',
      id: 1,
    });
  });
});
```

#### Key Testing Utilities for Deep Tests

```typescript
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
```

| Utility | Purpose |
|---------|---------|
| `fixture.debugElement` | Root debug element with query abilities |
| `By.directive(Component)` | Find child component in template |
| `By.css('selector')` | Find elements by CSS selector |
| `.query()` | Returns first match (DebugElement) |
| `.queryAll()` | Returns all matches |
| `.componentInstance` | Get the component class from DebugElement |
| `.nativeElement` | Get the DOM element from DebugElement |

---

### 5.5 Testing Routing

Testing that navigation works correctly - guards, redirects, and route configuration.

#### Setup with RouterTestingModule

```typescript
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('Auth Routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
          { path: 'dashboard', component: DashboardComponent },
        ]),
        // Component declarations/imports as needed
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });
});
```

#### Test: Navigation

```typescript
it('should navigate to login page', fakeAsync(() => {
  router.navigate(['/login']);
  tick(); // Wait for navigation to complete
  expect(location.path()).toBe('/login');
}));

it('should redirect empty path to login', fakeAsync(() => {
  router.navigate(['']);
  tick();
  expect(location.path()).toBe('/login');
}));
```

#### Test: Route Guards

```typescript
describe('AuthGuard', () => {
  let router: Router;
  let location: Location;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
          {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [authGuard],  // Functional guard
          },
        ]),
      ],
      providers: [
        provideMockStore({
          initialState: { auth: initialAuthState },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store = TestBed.inject(MockStore);
  });

  it('should allow access to dashboard when authenticated', fakeAsync(() => {
    // Override selector to simulate authenticated user
    store.overrideSelector(selectIsAuthenticated, true);
    store.refreshState();

    router.navigate(['/dashboard']);
    tick();

    expect(location.path()).toBe('/dashboard');
  }));

  it('should redirect to login when not authenticated', fakeAsync(() => {
    store.overrideSelector(selectIsAuthenticated, false);
    store.refreshState();

    router.navigate(['/dashboard']);
    tick();

    expect(location.path()).toBe('/login');
  }));
});
```

---

### 5.6 Testing HTTP Interceptors (Integration)

Test that your interceptor properly modifies requests and handles responses.

#### Testing Auth Interceptor

```typescript
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('authInterceptor (Integration)', () => {
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let http: HttpClient;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', [
      'getAccessToken', 'getRefreshToken', 'setAccessToken',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([authInterceptor])  // Register interceptor
        ),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: LoggerService, useValue: jasmine.createSpyObj('LoggerService', ['warn', 'error', 'info']) },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', () => {
    authService.getAccessToken.and.returnValue('my-token');

    http.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush({});
  });

  it('should NOT add header when no token', () => {
    authService.getAccessToken.and.returnValue(null);

    http.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should handle 401 and attempt token refresh', () => {
    authService.getAccessToken.and.returnValue('expired-token');
    authService.getRefreshToken.and.returnValue('refresh-token');

    http.get('/api/data').subscribe();

    // First request returns 401
    const req = httpMock.expectOne('/api/data');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    // Interceptor should try to refresh token
    const refreshReq = httpMock.expectOne('/api/auth/refresh');
    expect(refreshReq.request.method).toBe('POST');
  });
});
```

---

### 5.7 Integration Testing Checklist

Before writing integration tests, ask yourself:

```
┌──────────────────────────────────────────────────┐
│  INTEGRATION TEST DECISION CHECKLIST             │
│                                                  │
│  □ Does the test involve 2+ units working        │
│    together?                                     │
│                                                  │
│  □ Is the interaction between units the thing    │
│    I want to verify?                             │
│                                                  │
│  □ Would a unit test miss this bug?              │
│                                                  │
│  □ Is it worth the extra setup complexity?       │
│                                                  │
│  If YES to most → Write an integration test      │
│  If NO to most → A unit test is sufficient       │
└──────────────────────────────────────────────────┘
```

#### Integration Test Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Testing too much | Slow, brittle, hard to debug | Keep integration scope small |
| Unclear failure | "Something broke somewhere" | Add focused assertions |
| Duplicating unit tests | Redundant coverage | Integration tests = interaction, not logic |
| Complex setup | 50 lines of setup for 3 lines of test | Extract setup into helpers |

---

## Summary - Part 5

| Topic | Key Takeaway |
|-------|--------------|
| Unit vs Integration | Unit = isolated, Integration = multiple units together |
| Component + Real Store | Use `StoreModule.forFeature` instead of `provideMockStore` |
| Component + Service + HTTP | Real service, mock only HTTP layer |
| Parent-Child | `By.directive()` to find child, test data flow + events |
| Routing | `fakeAsync + tick`, test guards with MockStore |
| Interceptors | `withInterceptors()` + HttpTestingController |
| When to use | When the *interaction* between units is what matters |

---

## Practice Exercise

Think about your auth module's full login flow:

1. **Map the chain**: LoginComponent → Store → Effects → AuthService → HTTP → State
2. **Identify boundaries**: Where would you mock? Where would you use real implementations?
3. **List 3 integration tests** you'd write that unit tests would miss
   - Hint: "Does the form submission actually trigger the HTTP call through the full NgRx pipeline?"
   - Hint: "Does the auth guard actually prevent navigation when store says not authenticated?"
   - Hint: "Does the interceptor actually attach the token that AuthService provides?"

---

**Next: Part 6 - Mocking & Test Doubles (spies, stubs, fakes, and when to use each)**

---

---

## Part 6: Mocking & Test Doubles

"Test doubles" is the umbrella term for any object that replaces a real dependency in tests. Understanding the different types and when to use each is essential for writing effective, maintainable tests.

### 6.1 What Are Test Doubles?

When you test a unit, you don't want its dependencies to interfere. Test doubles replace those dependencies with controlled substitutes.

```
REAL CODE                          TEST CODE
─────────                          ─────────
LoginComponent                     LoginComponent
    │                                  │
    ▼                                  ▼
Store (real NgRx)                  MockStore (test double)
    │                                  │
    ▼                                  ▼
AuthService (real HTTP)            SpyObj (test double)
    │                                  │
    ▼                                  ▼
Backend Server                     Nothing (controlled)
```

---

### 6.2 Types of Test Doubles

There are 5 types of test doubles. Each serves a different purpose:

```
┌──────────┬───────────────────────────────────────────────┐
│  Type    │  Purpose                                      │
├──────────┼───────────────────────────────────────────────┤
│  Dummy   │  Fills a parameter, never actually used       │
│  Stub    │  Returns predetermined data                   │
│  Spy     │  Records calls + can return data              │
│  Mock    │  Pre-programmed with expectations             │
│  Fake    │  Working implementation (simplified)          │
└──────────┴───────────────────────────────────────────────┘
```

#### 6.2.1 Dummy

A dummy is passed around but never actually used. It just satisfies a parameter requirement.

```typescript
// LoggerService is injected but we don't care about it in this test
const dummyLogger = {} as LoggerService;

TestBed.configureTestingModule({
  providers: [
    AuthService,
    { provide: LoggerService, useValue: dummyLogger },
  ],
});
```

**When to use:** When a dependency is required by the constructor but irrelevant to the test.

#### 6.2.2 Stub

A stub provides **predetermined answers** to calls. It doesn't track whether it was called.

```typescript
// Stub: always returns the same value
const authServiceStub = {
  getAccessToken: () => 'fake-token-123',
  getRefreshToken: () => 'fake-refresh-456',
  isAuthenticated: () => true,
};

TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useValue: authServiceStub },
  ],
});
```

**When to use:** When you need a dependency to return specific data but don't care if/how it was called.

#### 6.2.3 Spy

A spy **wraps or replaces** a method and **records** how it was called (arguments, count, etc.). This is the most common test double in Angular/Jasmine.

```typescript
// Jasmine Spy Object - tracks ALL calls
const authServiceSpy = jasmine.createSpyObj('AuthService', [
  'login', 'logout', 'getAccessToken', 'setAccessToken',
]);

// Configure what it returns
authServiceSpy.login.and.returnValue(of(mockResponse));
authServiceSpy.getAccessToken.and.returnValue('token-123');

// Later, verify it was called correctly
expect(authServiceSpy.login).toHaveBeenCalledWith(credentials);
expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
```

**When to use:** When you need to verify that a dependency was called with the right arguments.

#### 6.2.4 Mock

A mock is pre-programmed with expectations. In Jasmine, spies and mocks overlap — `createSpyObj` essentially creates a mock object.

```typescript
// Mock with pre-configured behavior
const mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
mockStore.select.and.returnValue(of({ isAuthenticated: false }));

// The mock expects dispatch to be called
// After the test, you verify:
expect(mockStore.dispatch).toHaveBeenCalledWith(
  AuthActions.login({ request: credentials })
);
```

**When to use:** When you want to verify interactions between your code and its dependencies.

#### 6.2.5 Fake

A fake has a **working implementation** but takes shortcuts (e.g., in-memory database instead of real DB).

```typescript
// Fake AuthService with in-memory storage
class FakeAuthService {
  private token: string | null = null;
  private users: Map<string, any> = new Map();

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const user = this.users.get(credentials.email);
    if (user && user.password === credentials.password) {
      this.token = 'fake-jwt-token';
      return of({
        user: { id: '1', name: 'Test', email: credentials.email },
        tokens: { accessToken: this.token, refreshToken: 'fake-refresh' },
      });
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  getAccessToken(): string | null {
    return this.token;
  }

  setAccessToken(token: string): void {
    this.token = token;
  }

  logout(): Observable<void> {
    this.token = null;
    return of(void 0);
  }
}

// Use it
TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useClass: FakeAuthService },
  ],
});
```

**When to use:** When a stub is too simple but the real implementation is too complex. Good for integration tests.

---

### 6.3 Comparison Table

| Type | Returns Data? | Tracks Calls? | Has Logic? | Common In Angular |
|------|:---:|:---:|:---:|:---:|
| **Dummy** | No | No | No | `{} as Service` |
| **Stub** | Yes (fixed) | No | No | `{ method: () => value }` |
| **Spy** | Configurable | Yes | No | `createSpyObj()` |
| **Mock** | Configurable | Yes (with expectations) | No | `createSpyObj()` + `expect()` |
| **Fake** | Yes (computed) | No | Yes | `useClass: FakeService` |

#### Decision Flowchart

```
Do you need the dependency at all?
├── NO → Dummy ({} as Service)
└── YES
    │
    Does the test check HOW the dependency was called?
    ├── YES → Spy / Mock (createSpyObj)
    └── NO
        │
        Does it need dynamic behavior?
        ├── YES → Fake (useClass: FakeService)
        └── NO → Stub ({ method: () => fixedValue })
```

---

### 6.4 Jasmine Spy Deep Dive

Since `jasmine.createSpyObj` is the most frequently used approach in Angular testing, let's master it.

#### Creating Spy Objects

```typescript
// Method 1: Spy with methods only
const spy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);

// Method 2: Spy with methods AND properties
const spy = jasmine.createSpyObj('ServiceName', ['method1'], {
  propertyName: 'value',
});

// Method 3: Spy with methods AND property getters
const spy = jasmine.createSpyObj('ServiceName', ['method1'], ['propGetter']);
```

#### Configuring Return Values

```typescript
const authSpy = jasmine.createSpyObj('AuthService', [
  'login', 'logout', 'getAccessToken',
]);

// Return a value
authSpy.getAccessToken.and.returnValue('token-123');

// Return an Observable
authSpy.login.and.returnValue(of(mockResponse));

// Return different values on consecutive calls
authSpy.getAccessToken.and.returnValues('token-1', 'token-2', 'token-3');
// First call returns 'token-1', second returns 'token-2', etc.

// Throw an error
authSpy.login.and.throwError(new Error('Network error'));

// Return an Observable error
authSpy.login.and.returnValue(
  throwError(() => ({ status: 401, message: 'Unauthorized' }))
);

// Call through to a fake implementation
authSpy.login.and.callFake((credentials: any) => {
  if (credentials.email === 'admin@test.com') {
    return of(adminResponse);
  }
  return of(userResponse);
});
```

#### Spy Assertions

```typescript
// Was it called?
expect(spy.method).toHaveBeenCalled();

// Was it called with specific arguments?
expect(spy.method).toHaveBeenCalledWith('arg1', 'arg2');

// How many times was it called?
expect(spy.method).toHaveBeenCalledTimes(2);

// Was it NOT called?
expect(spy.method).not.toHaveBeenCalled();

// Get call details
spy.method.calls.count();           // Number of calls
spy.method.calls.argsFor(0);        // Arguments of first call
spy.method.calls.mostRecent().args;  // Arguments of last call
spy.method.calls.first().args;       // Arguments of first call
spy.method.calls.allArgs();          // Array of all call arguments
spy.method.calls.reset();            // Reset call tracking
```

#### Spy Cheat Sheet

| Method | Purpose |
|--------|---------|
| `.and.returnValue(val)` | Always return `val` |
| `.and.returnValues(a, b, c)` | Return `a`, then `b`, then `c` |
| `.and.callFake(fn)` | Delegate to custom function |
| `.and.throwError(err)` | Throw an error when called |
| `.and.callThrough()` | Call the real method (for `spyOn`) |
| `.and.stub()` | Do nothing, return undefined |
| `.calls.count()` | How many times called |
| `.calls.argsFor(n)` | Arguments of nth call |
| `.calls.reset()` | Reset tracking |

---

### 6.5 spyOn vs createSpyObj

Two different approaches to creating spies:

#### spyOn - Spy on an EXISTING object

```typescript
// You have a real service instance
const router = TestBed.inject(Router);

// Spy on ONE method
spyOn(router, 'navigate');

// The spy replaces just that method
router.navigate(['/dashboard']);
expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
```

#### createSpyObj - Create a NEW spy object

```typescript
// No real service - create a full mock
const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

TestBed.configureTestingModule({
  providers: [
    { provide: Router, useValue: routerSpy },
  ],
});
```

#### When to Use Each

| Approach | Use When |
|----------|----------|
| `spyOn(obj, 'method')` | You have the real object and want to spy on specific methods |
| `createSpyObj('Name', [...])` | You want a complete replacement for the entire service |

```typescript
// Common pattern: spyOn for Store dispatch
store = TestBed.inject(MockStore);
spyOn(store, 'dispatch').and.callThrough();
// ↑ Uses real MockStore but tracks dispatch calls

// Common pattern: createSpyObj for services
const loggerSpy = jasmine.createSpyObj('LoggerService', ['debug', 'info', 'error']);
// ↑ Full replacement, no real LoggerService involved
```

---

### 6.6 Mocking in Your Auth Module

Let's map every dependency in your auth module and how to mock each:

#### LoginComponent Dependencies

```typescript
// LoginComponent injects:
private fb = inject(NonNullableFormBuilder);  // ← Provided by ReactiveFormsModule
private store = inject(Store);                // ← provideMockStore()
private loggerService = inject(LoggerService); // ← createSpyObj

// TestBed setup:
TestBed.configureTestingModule({
  imports: [
    LoginComponent,
    ReactiveFormsModule,              // Provides real FormBuilder
  ],
  providers: [
    provideMockStore({ initialState }), // NgRx MockStore (a Fake!)
    { provide: LoggerService, useValue: loggerSpy }, // Spy
  ],
  schemas: [NO_ERRORS_SCHEMA],          // Dummy for child components
});
```

#### AuthEffects Dependencies

```typescript
// AuthEffects injects:
private actions$ = inject(Actions);       // ← provideMockActions()
private authService = inject(AuthService); // ← createSpyObj
private loggerService = inject(LoggerService); // ← createSpyObj
private router = inject(Router);          // ← createSpyObj
private toast = inject(ToastService);     // ← createSpyObj

// TestBed setup:
let actions$: Observable<Action>;

TestBed.configureTestingModule({
  providers: [
    AuthEffects,
    provideMockActions(() => actions$),
    { provide: AuthService, useValue: authServiceSpy },
    { provide: LoggerService, useValue: loggerSpy },
    { provide: Router, useValue: routerSpy },
    { provide: ToastService, useValue: toastSpy },
  ],
});
```

#### AuthService Dependencies

```typescript
// AuthService injects:
private http = inject(HttpClient); // ← provideHttpClientTesting()

// TestBed setup:
TestBed.configureTestingModule({
  providers: [
    AuthService,                   // Real service
    provideHttpClient(),
    provideHttpClientTesting(),    // HttpTestingController (a Fake!)
  ],
});
```

#### Mock Map Summary

| Dependency | Mock Type | Method |
|-----------|-----------|--------|
| `HttpClient` | Fake | `provideHttpClientTesting()` |
| `Store` | Fake | `provideMockStore()` |
| `Actions` | Fake | `provideMockActions()` |
| `Router` | Spy | `createSpyObj('Router', ['navigate'])` |
| `LoggerService` | Spy | `createSpyObj('LoggerService', [...])` |
| `ToastService` | Spy | `createSpyObj('ToastService', [...])` |
| `AuthService` | Spy | `createSpyObj('AuthService', [...])` |
| `FormBuilder` | Real | `ReactiveFormsModule` (no mock needed) |
| Child components | Dummy | `NO_ERRORS_SCHEMA` |

---

### 6.7 Common Mocking Mistakes

#### Mistake 1: Over-mocking

```typescript
// ❌ BAD - Mocking what you're testing
const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
authServiceSpy.login.and.returnValue(of(mockResponse));

// You're testing that login returns mockResponse...
// which YOU just configured. This tests nothing!

// ✅ GOOD - Use real service, mock its DEPENDENCIES
TestBed.configureTestingModule({
  providers: [
    AuthService,           // Real service under test
    provideHttpClient(),
    provideHttpClientTesting(), // Mock the dependency (HTTP)
  ],
});
```

**Rule:** Never mock the thing you're testing.

#### Mistake 2: Under-mocking

```typescript
// ❌ BAD - Using real HTTP in tests
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(), // This will try to hit real endpoints!
  ],
});

// ✅ GOOD - Mock the HTTP layer
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(),
    provideHttpClientTesting(), // Intercepts HTTP calls
  ],
});
```

**Rule:** Always mock external boundaries (HTTP, localStorage, WebSocket, etc.)

#### Mistake 3: Fragile mocks

```typescript
// ❌ BAD - Mock breaks when service adds new method
const spy = jasmine.createSpyObj('AuthService', ['login', 'logout']);
// If AuthService adds 'register()', tests still pass but
// any code calling register() will get undefined

// ✅ BETTER - Use type checking
const spy = jasmine.createSpyObj<AuthService>('AuthService', [
  'login', 'logout', 'register',
]);
// TypeScript will warn if AuthService interface changes
```

#### Mistake 4: Not resetting spy state

```typescript
// ❌ BAD - Spy carries state between tests
describe('MyComponent', () => {
  const spy = jasmine.createSpyObj('Service', ['method']);

  it('test 1', () => {
    spy.method();
    expect(spy.method).toHaveBeenCalledTimes(1); // ✓
  });

  it('test 2', () => {
    spy.method();
    expect(spy.method).toHaveBeenCalledTimes(1); // ✗ FAILS - count is 2!
  });
});

// ✅ GOOD - Create spy in beforeEach
describe('MyComponent', () => {
  let spy: jasmine.SpyObj<Service>;

  beforeEach(() => {
    spy = jasmine.createSpyObj('Service', ['method']); // Fresh each test
  });
});
```

---

### 6.8 Advanced: Mocking Observables

Common patterns for mocking RxJS Observables:

```typescript
import { of, throwError, BehaviorSubject, EMPTY, NEVER } from 'rxjs';
import { delay } from 'rxjs/operators';

// Return success value
spy.login.and.returnValue(of(mockResponse));

// Return error
spy.login.and.returnValue(
  throwError(() => ({ status: 401, message: 'Unauthorized' }))
);

// Return empty (completes immediately, no value)
spy.logout.and.returnValue(EMPTY);

// Return never (never emits, never completes - simulates pending)
spy.login.and.returnValue(NEVER);

// Return delayed value (use with fakeAsync + tick)
spy.login.and.returnValue(of(mockResponse).pipe(delay(1000)));

// Dynamic behavior based on input
spy.login.and.callFake((creds: LoginRequest) => {
  if (creds.email === 'bad@test.com') {
    return throwError(() => ({ status: 401 }));
  }
  return of(mockResponse);
});

// BehaviorSubject for stateful mocks (like Store selectors)
const authStatus$ = new BehaviorSubject({
  isAuthenticated: false,
  isLoading: false,
  error: null,
});
// Later in test: authStatus$.next({ ...newState });
```

---

## Summary - Part 6

| Topic | Key Takeaway |
|-------|--------------|
| Dummy | Placeholder, never used (`{} as Service`) |
| Stub | Fixed return values, no tracking |
| Spy | Tracks calls + configurable returns (`createSpyObj`) |
| Mock | Spy with expectations verified after test |
| Fake | Simplified working implementation (`MockStore`, `HttpTestingController`) |
| `spyOn` | Spy on existing object's method |
| `createSpyObj` | Create entirely new mock object |
| Golden Rule | Never mock what you're testing |
| Observable mocks | `of()`, `throwError()`, `EMPTY`, `NEVER` |

---

## Practice Exercise

For your `AuthEffects` class, list:

1. **All 5 dependencies** it injects
2. **What type of test double** you'd use for each (spy, fake, stub?)
3. **Write the `beforeEach` setup** mentally — what goes in `providers[]`?
4. **For `loginSuccess$` effect** — what spy assertions would you write?
   - Hint: verify `authService.setAccessToken()`, `toast.success()`, `router.navigate()`

---

**Next: Part 7 - Testing Best Practices (patterns, anti-patterns, organization)**

---

---

## Part 7: Testing Best Practices

This part covers the patterns, anti-patterns, and organizational strategies that separate good test suites from great ones. These are lessons from real-world Angular projects.

### 7.1 Test Organization

#### File Structure

```
feature/
├── components/
│   └── login/
│       ├── login.component.ts
│       ├── login.component.spec.ts       ← Component unit tests
│       ├── login.component.html
│       └── login.component.scss
├── store/
│   ├── auth.actions.ts
│   ├── auth.reducer.ts
│   ├── auth.reducer.spec.ts              ← Reducer tests (pure functions!)
│   ├── auth.effects.ts
│   ├── auth.effects.spec.ts              ← Effects tests
│   ├── auth.selectors.ts
│   └── auth.selectors.spec.ts            ← Selector tests (pure functions!)
└── __tests__/                            ← Optional: integration tests
    └── auth-flow.integration.spec.ts
```

**Rule:** Unit tests sit next to the file they test. Integration tests can go in a `__tests__` folder.

#### Describe Block Organization

Structure your test file to mirror the component/service API:

```typescript
describe('LoginComponent', () => {

  // ──── Setup ────
  beforeEach(async () => { /* ... */ });

  // ──── Creation ────
  it('should create', () => { });

  // ──── Initialization ────
  describe('initialization', () => {
    it('should create form on init', () => { });
    it('should initialize with empty values', () => { });
    it('should log form init', () => { });
  });

  // ──── Group by feature/method ────
  describe('form validation', () => {
    describe('email', () => {
      it('should be invalid when empty', () => { });
      it('should be invalid with bad format', () => { });
      it('should be valid with correct email', () => { });
    });

    describe('password', () => {
      it('should be invalid when empty', () => { });
      it('should be invalid when too short', () => { });
      it('should be valid with 6+ characters', () => { });
    });
  });

  // ──── Actions/Methods ────
  describe('onSubmit()', () => {
    it('should dispatch login when valid', () => { });
    it('should NOT dispatch when invalid', () => { });
    it('should mark fields touched when invalid', () => { });
  });

  // ──── Store interaction ────
  describe('store state', () => {
    it('should reflect loading state', () => { });
    it('should reflect error state', () => { });
  });
});
```

---

### 7.2 The FIRST Principles

Good tests follow the FIRST acronym:

```
F - Fast        → Tests run quickly (milliseconds, not seconds)
I - Independent → Tests don't depend on each other
R - Repeatable  → Same result every time, anywhere
S - Self-validating → Pass or fail, no manual inspection
T - Timely      → Written close to the code they test
```

#### F - Fast

```typescript
// ❌ SLOW - Using real HTTP, real delays
it('should timeout after 5 seconds', async () => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  expect(component.timedOut).toBe(true);
});

// ✅ FAST - Use fakeAsync to skip time
it('should timeout after 5 seconds', fakeAsync(() => {
  tick(5000);  // Instant!
  expect(component.timedOut).toBe(true);
}));
```

#### I - Independent

```typescript
// ❌ BAD - Test 2 depends on test 1 running first
it('should login', () => {
  service.login(credentials);  // Sets internal state
});

it('should have token after login', () => {
  expect(service.getToken()).toBeTruthy(); // Depends on test above!
});

// ✅ GOOD - Each test sets up its own state
it('should have token after login', () => {
  service.login(credentials);  // Arrange
  const req = httpMock.expectOne('/login');
  req.flush(mockResponse);

  expect(service.getToken()).toBeTruthy();  // Self-contained
});
```

#### R - Repeatable

```typescript
// ❌ BAD - Depends on current time
it('should show greeting', () => {
  expect(component.greeting).toBe('Good morning'); // Fails after noon!
});

// ✅ GOOD - Control the time
it('should show morning greeting before noon', () => {
  jasmine.clock().install();
  jasmine.clock().mockDate(new Date(2024, 0, 1, 9, 0)); // 9 AM
  expect(component.greeting).toBe('Good morning');
  jasmine.clock().uninstall();
});
```

#### S - Self-Validating

```typescript
// ❌ BAD - Requires manual inspection
it('should log user data', () => {
  console.log(component.userData); // "Check the console output"
});

// ✅ GOOD - Automated assertion
it('should set user data', () => {
  expect(component.userData).toEqual({ name: 'John', email: 'john@test.com' });
});
```

---

### 7.3 What to Test (and What NOT to Test)

#### DO Test

| What | Why | Example |
|------|-----|---------|
| Public methods | They define the component's contract | `onSubmit()`, `login()` |
| Conditional logic | Branches can hide bugs | `if (form.valid)` paths |
| Error handling | Failures must be graceful | 401, 500, network errors |
| Edge cases | Boundaries cause bugs | Empty strings, null, 0, max length |
| State transitions | State machines need coverage | loading → success → idle |
| Validators | Form correctness depends on them | required, email, minLength |
| Selectors | They derive critical state | `selectAuthStatus` |
| Reducers | They manage state transitions | login → isLoading: true |

#### DO NOT Test

| What | Why |
|------|-----|
| Private methods | Test them through public methods |
| Framework code | Angular's `ngOnInit`, `ngOnDestroy` work correctly |
| Third-party libraries | PrimeNG, NgRx are already tested |
| Simple getters/setters | Unless they have logic |
| HTML structure details | Brittle — breaks on every template change |
| Implementation details | Test behavior, not how it's coded |

```typescript
// ❌ Testing implementation details
it('should call initializeForm in ngOnInit', () => {
  spyOn(component as any, 'initializeForm');
  component.ngOnInit();
  expect((component as any).initializeForm).toHaveBeenCalled();
});
// This tests HOW it works, not WHAT it does

// ✅ Testing behavior
it('should have a form after initialization', () => {
  // ngOnInit already ran via fixture.detectChanges()
  expect(component.form).toBeDefined();
  expect(component.form.contains('email')).toBe(true);
});
// This tests WHAT the user gets
```

---

### 7.4 Anti-Patterns to Avoid

#### Anti-Pattern 1: The Giant Test

```typescript
// ❌ BAD - Tests everything in one test
it('should handle the entire login flow', () => {
  // 50 lines of setup
  // 20 lines of actions
  // 30 lines of assertions
  // If it fails... which part broke?
});

// ✅ GOOD - Small, focused tests
describe('login flow', () => {
  it('should dispatch login action on submit', () => { /* 5-10 lines */ });
  it('should show loading during request', () => { /* 5-10 lines */ });
  it('should navigate on success', () => { /* 5-10 lines */ });
  it('should show error on failure', () => { /* 5-10 lines */ });
});
```

#### Anti-Pattern 2: Testing Private Methods

```typescript
// ❌ BAD - Accessing private method
it('should validate email format', () => {
  const result = (component as any).validateEmail('bad-email');
  expect(result).toBe(false);
});

// ✅ GOOD - Test through the public interface
it('should show email error for bad format', () => {
  component.emailControl.setValue('bad-email');
  expect(component.emailControl.hasError('email')).toBe(true);
});
```

#### Anti-Pattern 3: The Assertion-Free Test

```typescript
// ❌ BAD - No assertions! Always passes
it('should handle login', () => {
  component.form.patchValue({
    email: 'test@test.com',
    password: 'password',
  });
  component.onSubmit();
  // No expect()... this always "passes"
});

// ✅ GOOD - Clear assertions
it('should dispatch login on valid submit', () => {
  component.form.patchValue({
    email: 'test@test.com',
    password: 'password',
  });
  component.onSubmit();
  expect(store.dispatch).toHaveBeenCalledWith(
    AuthActions.login({ request: { email: 'test@test.com', password: 'password' } })
  );
});
```

#### Anti-Pattern 4: Excessive Setup

```typescript
// ❌ BAD - 60 lines of setup for every test
beforeEach(async () => {
  // ... 60 lines creating mocks, configuring module, etc.
});

// ✅ GOOD - Extract helper functions
function createComponent(overrides?: Partial<ComponentConfig>) {
  // Standard setup with configurable overrides
}

function fillLoginForm(email = 'test@test.com', password = 'password') {
  component.form.patchValue({ email, password });
}

// Tests become clean:
it('should dispatch login', () => {
  fillLoginForm();
  component.onSubmit();
  expect(store.dispatch).toHaveBeenCalled();
});
```

#### Anti-Pattern 5: Tightly Coupled to DOM

```typescript
// ❌ BAD - Breaks if CSS class changes
it('should show error', () => {
  const el = fixture.nativeElement.querySelector('.auth-form__error-message--visible.text-danger.mt-2');
  expect(el).toBeTruthy();
});

// ✅ GOOD - Use data-testid or semantic queries
it('should show error', () => {
  const el = fixture.nativeElement.querySelector('[data-testid="login-error"]');
  expect(el).toBeTruthy();
});

// ✅ ALSO GOOD - Test the logic, not the DOM
it('should have error in state', () => {
  store.overrideSelector(selectAuthStatus, {
    isAuthenticated: false,
    isLoading: false,
    error: 'Invalid credentials',
  });
  store.refreshState();

  component.authStatus$.subscribe((status) => {
    expect(status.error).toBe('Invalid credentials');
  });
});
```

---

### 7.5 Test Data Management

#### Use Factory Functions

```typescript
// ❌ BAD - Duplicated test data everywhere
it('test 1', () => {
  const user = { id: '1', name: 'Test User', email: 'test@test.com' };
  // ...
});

it('test 2', () => {
  const user = { id: '1', name: 'Test User', email: 'test@test.com' };
  // ...
});

// ✅ GOOD - Factory functions
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    ...overrides,
  };
}

function createMockAuthResponse(overrides?: Partial<AuthResponse>): AuthResponse {
  return {
    user: createMockUser(),
    tokens: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    },
    ...overrides,
  };
}

// Usage - clean and DRY
it('should store user on login success', () => {
  const response = createMockAuthResponse();
  // ...
});

it('should handle admin user', () => {
  const response = createMockAuthResponse({
    user: createMockUser({ name: 'Admin', email: 'admin@test.com' }),
  });
  // ...
});
```

#### Where to Put Test Helpers

```
src/
├── app/
│   └── testing/                     ← Shared test utilities
│       ├── mock-factories.ts        ← createMockUser(), createMockAuthResponse()
│       ├── test-helpers.ts          ← fillForm(), createComponentFixture()
│       └── mock-providers.ts        ← Reusable provider arrays
```

```typescript
// testing/mock-providers.ts
export const AUTH_MOCK_PROVIDERS = [
  provideMockStore({ initialState: { auth: initialAuthState } }),
  { provide: LoggerService, useValue: jasmine.createSpyObj('LoggerService', ['debug', 'info', 'error', 'warn']) },
];

// In spec files:
import { AUTH_MOCK_PROVIDERS } from '../../../../testing/mock-providers';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [LoginComponent, ReactiveFormsModule],
    providers: [...AUTH_MOCK_PROVIDERS],
    schemas: [NO_ERRORS_SCHEMA],
  }).compileComponents();
});
```

---

### 7.6 Code Coverage Guidelines

#### Running Coverage

```bash
ng test --code-coverage --watch=false
```

This generates a `coverage/` folder with an HTML report.

#### Coverage Metrics

| Metric | What It Measures |
|--------|-----------------|
| **Statements** | % of code statements executed |
| **Branches** | % of if/else/switch branches taken |
| **Functions** | % of functions called |
| **Lines** | % of lines executed |

#### Healthy Coverage Targets

```
┌─────────────────────────────────────────────┐
│  Coverage Targets                            │
│                                              │
│  Services:     80-90%   (business logic)     │
│  Components:   70-80%   (logic, not DOM)     │
│  Reducers:     95-100%  (pure functions!)    │
│  Selectors:    95-100%  (pure functions!)    │
│  Guards:       90-100%  (critical paths)     │
│  Interceptors: 80-90%   (network layer)      │
│  Validators:   95-100%  (pure functions!)    │
│                                              │
│  Overall Goal: 75-85%                        │
└─────────────────────────────────────────────┘
```

#### Coverage ≠ Quality

```typescript
// 100% coverage but TERRIBLE test:
it('should run all code paths', () => {
  component.form.patchValue({ email: 'a@b.com', password: '123456' });
  component.onSubmit();
  component.form.patchValue({ email: '', password: '' });
  component.onSubmit();
  // No assertions! 100% coverage, 0% confidence.
});

// 60% coverage but VALUABLE test:
it('should dispatch login with correct payload', () => {
  component.form.patchValue({ email: 'test@example.com', password: 'pass123' });
  component.onSubmit();
  expect(store.dispatch).toHaveBeenCalledWith(
    AuthActions.login({ request: { email: 'test@example.com', password: 'pass123' } })
  );
});
```

**Rule:** Aim for meaningful coverage. 80% with good assertions > 100% with no assertions.

---

### 7.7 Testing Checklist for Each Feature

When you build a new feature, use this checklist:

```
┌──────────────────────────────────────────────────────┐
│  FEATURE TESTING CHECKLIST                           │
│                                                      │
│  Services:                                           │
│  □ Happy path (success scenario)                     │
│  □ Error handling (HTTP errors, validation errors)   │
│  □ Edge cases (null, empty, boundary values)         │
│  □ HTTP method + URL + body verified                 │
│                                                      │
│  Components:                                         │
│  □ Component creates successfully                    │
│  □ Form initializes with correct defaults            │
│  □ Each validator works (required, format, length)   │
│  □ Form submission dispatches correct action          │
│  □ Invalid submission is handled                     │
│  □ Store state reflected in component                │
│                                                      │
│  NgRx:                                               │
│  □ Reducers handle each action correctly             │
│  □ Selectors derive correct state                    │
│  □ Effects trigger correct side effects              │
│  □ Effects handle errors gracefully                  │
│                                                      │
│  Guards:                                             │
│  □ Allows access when authorized                     │
│  □ Redirects when unauthorized                       │
│                                                      │
│  Interceptors:                                       │
│  □ Modifies request correctly (headers, tokens)      │
│  □ Handles error responses (401, 500)                │
└──────────────────────────────────────────────────────┘
```

---

### 7.8 Debugging Failing Tests

When a test fails, follow this process:

#### Step 1: Read the Error Message

```
FAILED: LoginComponent > onSubmit() > should dispatch login action
  Expected spy dispatch to have been called with:
    [ Object({ type: '[Auth] Login', request: Object({ email: 'test@test.com', password: 'pass' }) }) ]
  but actual calls were:
    [ ]

// Translation: dispatch was never called → form might be invalid
```

#### Step 2: Common Causes & Fixes

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `dispatch not called` | Form is invalid | Ensure `patchValue` makes form valid |
| `Expected undefined to be truthy` | Component not created | Check TestBed imports/providers |
| `No provider for X` | Missing dependency in TestBed | Add provider or mock |
| `Can't bind to 'formGroup'` | Missing ReactiveFormsModule | Add to imports |
| `Template parse errors` | Unknown child elements | Add `NO_ERRORS_SCHEMA` |
| `Expected spy to have been called with... but received...` | Wrong arguments | Log actual args: `spy.calls.allArgs()` |
| `Error during cleanup of component` | Unsubscribed observables | Add `afterEach` cleanup |

#### Step 3: Debugging Techniques

```typescript
// Temporarily log values
it('debug test', () => {
  console.log('Form valid?', component.form.valid);
  console.log('Form errors:', component.form.errors);
  console.log('Email errors:', component.emailControl.errors);
  console.log('Dispatch calls:', (store.dispatch as jasmine.Spy).calls.allArgs());
});

// Use fdescribe / fit to run only one test
fdescribe('LoginComponent', () => {  // Only this suite runs
  fit('should dispatch', () => {     // Only this test runs
    // ...
  });
});

// Use xdescribe / xit to SKIP tests
xdescribe('Broken suite', () => {  // Skipped
  xit('broken test', () => {       // Skipped
    // ...
  });
});
```

| Prefix | Effect |
|--------|--------|
| `fdescribe` / `fit` | **Focus** — run ONLY this suite/test |
| `xdescribe` / `xit` | **Exclude** — skip this suite/test |
| `describe` / `it` | Normal — runs as part of full suite |

**Important:** Never commit `fdescribe` or `fit` to version control! They skip all other tests.

---

## Summary - Part 7

| Topic | Key Takeaway |
|-------|--------------|
| Organization | Group by feature/method, tests next to source |
| FIRST | Fast, Independent, Repeatable, Self-validating, Timely |
| What to test | Public methods, logic, errors, edges — NOT private/framework |
| Anti-patterns | No giant tests, no assertion-free tests, no DOM coupling |
| Test data | Factory functions, shared helpers |
| Coverage | 75-85% target, quality over quantity |
| Debugging | Read errors, `fdescribe/fit`, log spy calls |

---

## Practice Exercise

Review your `LoginComponent` mentally:

1. **List 3 anti-patterns** you might accidentally introduce
2. **Create a factory function** for `createMockLoginCredentials()` and `createMockAuthResponse()`
3. **Using the testing checklist**, count how many tests LoginComponent needs
   (Hint: creation + form init + email validation + password validation + submit valid + submit invalid + store state = ~15-20 tests)

---

**Next: Part 8 - Hands-On Practice (writing real tests for your Auth module)**

---

---

## Part 8: Hands-On Practice — Testing Your Auth Module

This is the practical part. We'll set up the centralized mock system, then write real spec files for your auth module using everything from Parts 1-7.

### 8.1 Step 1: Create the Mock Utility

Create the generic `createMock` utility that works with any service.

**File:** `src/app/testing/create-mock.ts`

```typescript
/**
 * Generic mock factory — auto-discovers methods from a service class prototype
 * and creates a typed Jasmine SpyObj.
 *
 * Usage:
 *   const spy = createMock(AuthService);
 *   spy.getAccessToken.and.returnValue('token');
 */

type MockConfig<T> = {
  defaults?: Partial<Record<keyof T, any>>;
  methods?: string[];
};

export function createMock<T>(
  serviceClass: new (...args: any[]) => T,
  config?: MockConfig<T>,
): jasmine.SpyObj<T> {
  const protoMethods = Object.getOwnPropertyNames(serviceClass.prototype)
    .filter((name) => name !== 'constructor');

  const allMethods = [...new Set([...protoMethods, ...(config?.methods ?? [])])];

  const spy = jasmine.createSpyObj<T>(serviceClass.name, allMethods as any[]);

  if (config?.defaults) {
    for (const [method, value] of Object.entries(config.defaults)) {
      if ((spy as any)[method]?.and) {
        (spy as any)[method].and.returnValue(value);
      }
    }
  }

  return spy;
}
```

---

### 8.2 Step 2: Create Mock Data Factories

These provide consistent test data across all spec files.

**File:** `src/app/testing/mock-data/auth.mock-data.ts`

```typescript
import { User } from '../../models/auth/user.model';
import {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
} from '../../models/auth/auth.model';

// ──── User ────
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: null,
    theme: 'light',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

// ──── Tokens ────
export function createMockTokens(overrides?: Partial<AuthTokens>): AuthTokens {
  return {
    accessToken: 'mock-access-token-xyz',
    refreshToken: 'mock-refresh-token-abc',
    ...overrides,
  };
}

// ──── Auth Response (login/register result) ────
export function createMockAuthResponse(overrides?: Partial<AuthResponse>): AuthResponse {
  return {
    user: createMockUser(),
    tokens: createMockTokens(),
    ...overrides,
  };
}

// ──── Login Request ────
export function createMockLoginRequest(overrides?: Partial<LoginRequest>): LoginRequest {
  return {
    email: 'test@example.com',
    password: 'Password123',
    ...overrides,
  };
}

// ──── Register Request ────
export function createMockRegisterRequest(overrides?: Partial<RegisterRequest>): RegisterRequest {
  return {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
    ...overrides,
  };
}
```

**File:** `src/app/testing/mock-data/index.ts`

```typescript
export * from './auth.mock-data';
```

---

### 8.3 Step 3: Create Re-export Barrel

**File:** `src/app/testing/index.ts`

```typescript
export * from './create-mock';
export * from './mock-data';
```

---

### 8.4 Spec File 1: AuthService (Service Unit Tests)

**File:** `src/app/core/services/auth.service.spec.ts`

Tests the real `AuthService` with mocked HTTP.

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import { environment } from '../../../environments/environment';
import { createMock } from '../../testing/create-mock';
import {
  createMockAuthResponse,
  createMockLoginRequest,
  createMockRegisterRequest,
} from '../../testing/mock-data';
import { AppConstants } from '../../models/app-constants';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoggerService, useValue: createMock(LoggerService) },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ──── login() ────
  describe('login()', () => {
    it('should send POST to /auth/login with credentials', () => {
      const credentials = createMockLoginRequest();
      const mockResponse = createMockAuthResponse();

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush({ data: mockResponse }); // ApiResponse wrapper
    });

    it('should handle login error', () => {
      const credentials = createMockLoginRequest();

      service.login(credentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(
        { message: 'Invalid credentials' },
        { status: 401, statusText: 'Unauthorized' },
      );
    });
  });

  // ──── register() ────
  describe('register()', () => {
    it('should send POST to /auth/register', () => {
      const request = createMockRegisterRequest();
      const mockResponse = createMockAuthResponse();

      service.register(request).subscribe((response) => {
        expect(response.user.email).toBe('test@example.com');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({ data: mockResponse });
    });
  });

  // ──── logout() ────
  describe('logout()', () => {
    it('should send POST to /auth/logout', () => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });
  });

  // ──── refreshToken() ────
  describe('refreshToken()', () => {
    it('should send refresh token in body', () => {
      localStorage.setItem(AppConstants.REFRESH_TOKEN_KEY, 'my-refresh');
      const mockResponse = createMockAuthResponse();

      service.refreshToken().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh-token`);
      expect(req.request.body).toEqual({ refreshToken: 'my-refresh' });
      req.flush({ data: mockResponse });
    });

    it('should send empty string when no refresh token stored', () => {
      service.refreshToken().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh-token`);
      expect(req.request.body).toEqual({ refreshToken: '' });
      req.flush({ data: createMockAuthResponse() });
    });
  });

  // ──── Token Management ────
  describe('token management', () => {
    it('should store and retrieve access token', () => {
      service.setAccessToken('abc');
      expect(service.getAccessToken()).toBe('abc');
    });

    it('should store and retrieve refresh token', () => {
      service.setRefreshToken('xyz');
      expect(service.getRefreshToken()).toBe('xyz');
    });

    it('should return null when no token stored', () => {
      expect(service.getAccessToken()).toBeNull();
      expect(service.getRefreshToken()).toBeNull();
    });

    it('should clear all tokens', () => {
      service.setAccessToken('abc');
      service.setRefreshToken('xyz');
      service.clearTokens();
      expect(service.getAccessToken()).toBeNull();
      expect(service.getRefreshToken()).toBeNull();
    });
  });

  // ──── isAuthenticated() ────
  describe('isAuthenticated()', () => {
    it('should return true when access token exists', () => {
      service.setAccessToken('token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no access token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  // ──── User Storage ────
  describe('user storage', () => {
    it('should store and retrieve user', () => {
      const user = { id: '1', name: 'Test', email: 'test@example.com' };
      service.storeUser(user);
      expect(service.getStoredUser()).toEqual(user);
    });

    it('should return null when no user stored', () => {
      expect(service.getStoredUser()).toBeNull();
    });
  });
});
```

**Pattern highlights:**
- `createMock(LoggerService)` — auto-mocks the injected dependency
- `createMockLoginRequest()` — clean test data from factories
- `req.flush({ data: mockResponse })` — matches your `ApiResponse<T>` wrapper
- `localStorage.clear()` in `afterEach` — isolation

---

### 8.5 Spec File 2: LoginComponent (Component Unit Tests)

**File:** `src/app/features/auth/components/login/login.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthActions } from '../../store/auth.actions';
import { LoggerService } from '../../../../core/services/logger.service';
import { initialAuthState } from '../../../../models/auth/auth-state.model';
import { selectAuthStatus } from '../../store/auth.selectors';
import { createMock } from '../../../../testing/create-mock';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  let loggerSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(async () => {
    loggerSpy = createMock(LoggerService);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState: { auth: initialAuthState } }),
        { provide: LoggerService, useValue: loggerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ──── Creation ────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ──── Form Initialization ────
  describe('form initialization', () => {
    it('should create form on init', () => {
      expect(component.form).toBeDefined();
    });

    it('should have email and password controls', () => {
      expect(component.form.contains('email')).toBe(true);
      expect(component.form.contains('password')).toBe(true);
    });

    it('should initialize with empty values', () => {
      expect(component.emailControl.value).toBe('');
      expect(component.passwordControl.value).toBe('');
    });

    it('should log form initialization', () => {
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'Form initialized',
        'LoginComponent',
      );
    });
  });

  // ──── Control Getters ────
  describe('control getters', () => {
    it('should return email control', () => {
      expect(component.emailControl).toBe(component.form.controls.email);
    });

    it('should return password control', () => {
      expect(component.passwordControl).toBe(component.form.controls.password);
    });
  });

  // ──── Email Validation ────
  describe('email validation', () => {
    it('should be invalid when empty', () => {
      component.emailControl.setValue('');
      expect(component.emailControl.hasError('required')).toBe(true);
    });

    it('should be invalid with bad format', () => {
      component.emailControl.setValue('not-an-email');
      expect(component.emailControl.hasError('email')).toBe(true);
    });

    it('should be valid with correct email', () => {
      component.emailControl.setValue('test@example.com');
      expect(component.emailControl.valid).toBe(true);
    });
  });

  // ──── Password Validation ────
  describe('password validation', () => {
    it('should be invalid when empty', () => {
      component.passwordControl.setValue('');
      expect(component.passwordControl.hasError('required')).toBe(true);
    });

    it('should be invalid when less than 6 characters', () => {
      component.passwordControl.setValue('12345');
      expect(component.passwordControl.hasError('minlength')).toBe(true);
    });

    it('should be valid with 6+ characters', () => {
      component.passwordControl.setValue('123456');
      expect(component.passwordControl.valid).toBe(true);
    });
  });

  // ──── Form Level ────
  describe('form level validation', () => {
    it('should be invalid when both fields empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should be valid when both fields correct', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'Password123',
      });
      expect(component.form.valid).toBe(true);
    });
  });

  // ──── onSubmit() ────
  describe('onSubmit()', () => {
    it('should dispatch login action when form is valid', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'Password123',
      });

      component.onSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.login({
          request: { email: 'test@example.com', password: 'Password123' },
        }),
      );
    });

    it('should NOT dispatch when form is invalid', () => {
      component.form.patchValue({ email: '', password: '' });
      component.onSubmit();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      spyOn(component.form, 'markAllAsTouched');
      component.onSubmit();
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
    });
  });

  // ──── Store State ────
  describe('store state', () => {
    it('should reflect loading state', () => {
      store.overrideSelector(selectAuthStatus, {
        isAuthenticated: false,
        isLoading: true,
        error: null,
      });
      store.refreshState();

      component.authStatus$.subscribe((status) => {
        expect(status.isLoading).toBe(true);
      });
    });

    it('should reflect error state', () => {
      store.overrideSelector(selectAuthStatus, {
        isAuthenticated: false,
        isLoading: false,
        error: 'Invalid credentials',
      });
      store.refreshState();

      component.authStatus$.subscribe((status) => {
        expect(status.error).toBe('Invalid credentials');
      });
    });
  });
});
```

---

### 8.6 Spec File 3: Auth Reducer (Pure Function Tests)

**File:** `src/app/features/auth/store/auth.reducer.spec.ts`

Reducers are pure functions — the easiest to test! No TestBed needed.

```typescript
import { authReducer } from './auth.reducer';
import { AuthActions } from './auth.actions';
import {
  AuthState,
  initialAuthState,
} from '../../../models/auth/auth-state.model';
import {
  createMockAuthResponse,
  createMockLoginRequest,
  createMockUser,
} from '../../../testing/mock-data';

describe('authReducer', () => {
  // ──── Initial State ────
  it('should return initial state for unknown action', () => {
    const action = { type: 'UNKNOWN' };
    const state = authReducer(initialAuthState, action);
    expect(state).toEqual(initialAuthState);
  });

  // ──── Login ────
  describe('Login', () => {
    it('should set isLoading true and clear error on login', () => {
      const request = createMockLoginRequest();
      const action = AuthActions.login({ request });
      const state = authReducer(initialAuthState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user, tokens, isAuthenticated on loginSuccess', () => {
      const response = createMockAuthResponse();
      const action = AuthActions.loginSuccess({ response });
      const state = authReducer(initialAuthState, action);

      expect(state.user).toEqual(response.user);
      expect(state.accessToken).toBe('mock-access-token-xyz');
      expect(state.refreshToken).toBe('mock-refresh-token-abc');
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set error and stop loading on loginFailure', () => {
      const action = AuthActions.loginFailure({ error: 'Invalid credentials' });
      const state = authReducer(
        { ...initialAuthState, isLoading: true },
        action,
      );

      expect(state.error).toBe('Invalid credentials');
      expect(state.isLoading).toBe(false);
    });
  });

  // ──── Register ────
  describe('Register', () => {
    it('should set isLoading true on register', () => {
      const action = AuthActions.register({
        request: { name: 'Test', email: 'a@b.com', password: 'Pass123' },
      });
      const state = authReducer(initialAuthState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user and tokens on registerSuccess', () => {
      const response = createMockAuthResponse();
      const action = AuthActions.registerSuccess({ response });
      const state = authReducer(initialAuthState, action);

      expect(state.user).toEqual(response.user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should set error on registerFailure', () => {
      const action = AuthActions.registerFailure({ error: 'Email taken' });
      const state = authReducer(
        { ...initialAuthState, isLoading: true },
        action,
      );

      expect(state.error).toBe('Email taken');
      expect(state.isLoading).toBe(false);
    });
  });

  // ──── Logout ────
  describe('Logout', () => {
    const authenticatedState: AuthState = {
      user: createMockUser(),
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    it('should set isLoading on logout', () => {
      const action = AuthActions.logout();
      const state = authReducer(authenticatedState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should reset to initial state on logoutSuccess', () => {
      const action = AuthActions.logoutSuccess();
      const state = authReducer(authenticatedState, action);
      expect(state).toEqual(initialAuthState);
    });

    it('should set error on logoutFailure', () => {
      const action = AuthActions.logoutFailure({ error: 'Server error' });
      const state = authReducer(authenticatedState, action);
      expect(state.error).toBe('Server error');
      expect(state.isLoading).toBe(false);
    });
  });

  // ──── Refresh Token ────
  describe('Refresh Token', () => {
    it('should update tokens on refreshTokenSuccess', () => {
      const response = createMockAuthResponse({
        tokens: { accessToken: 'new-access', refreshToken: 'new-refresh' },
      });
      const action = AuthActions.refreshTokenSuccess({ response });
      const state = authReducer(initialAuthState, action);

      expect(state.accessToken).toBe('new-access');
      expect(state.refreshToken).toBe('new-refresh');
    });

    it('should reset state on refreshTokenFailure', () => {
      const action = AuthActions.refreshTokenFailure({ error: 'Expired' });
      const state = authReducer(
        { ...initialAuthState, accessToken: 'old' },
        action,
      );
      expect(state).toEqual(initialAuthState);
    });
  });

  // ──── Load User From Storage ────
  describe('Load User From Storage', () => {
    it('should set user and tokens on success', () => {
      const user = createMockUser();
      const action = AuthActions.loadUserFromStorageSuccess({
        user,
        accessToken: 'stored-access',
        refreshToken: 'stored-refresh',
      });
      const state = authReducer(initialAuthState, action);

      expect(state.user).toEqual(user);
      expect(state.accessToken).toBe('stored-access');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should not change state on failure', () => {
      const action = AuthActions.loadUserFromStorageFailure();
      const state = authReducer(initialAuthState, action);
      expect(state).toEqual(initialAuthState);
    });
  });

  // ──── Clear Error ────
  describe('Clear Error', () => {
    it('should clear error', () => {
      const errorState = { ...initialAuthState, error: 'Some error' };
      const action = AuthActions.clearError();
      const state = authReducer(errorState, action);
      expect(state.error).toBeNull();
    });
  });
});
```

**Notice:** No `TestBed` at all — reducers are pure functions, so testing them is just `function(input) → assert(output)`.

---

### 8.7 Spec File 4: Auth Selectors (Pure Function Tests)

**File:** `src/app/features/auth/store/auth.selectors.spec.ts`

```typescript
import {
  selectAuthState,
  selectUser,
  selectAccessToken,
  selectRefreshToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAuthStatus,
} from './auth.selectors';
import { AuthState } from '../../../models/auth/auth-state.model';
import { createMockUser } from '../../../testing/mock-data';

describe('Auth Selectors', () => {
  const mockUser = createMockUser();

  const state: { auth: AuthState } = {
    auth: {
      user: mockUser,
      accessToken: 'token-abc',
      refreshToken: 'refresh-xyz',
      isAuthenticated: true,
      isLoading: false,
      error: 'Some error',
    },
  };

  it('should select auth state', () => {
    expect(selectAuthState(state as any)).toEqual(state.auth);
  });

  it('should select user', () => {
    expect(selectUser(state as any)).toEqual(mockUser);
  });

  it('should select access token', () => {
    expect(selectAccessToken(state as any)).toBe('token-abc');
  });

  it('should select refresh token', () => {
    expect(selectRefreshToken(state as any)).toBe('refresh-xyz');
  });

  it('should select isAuthenticated', () => {
    expect(selectIsAuthenticated(state as any)).toBe(true);
  });

  it('should select isLoading', () => {
    expect(selectIsLoading(state as any)).toBe(false);
  });

  it('should select error', () => {
    expect(selectError(state as any)).toBe('Some error');
  });

  it('should select combined authStatus', () => {
    expect(selectAuthStatus(state as any)).toEqual({
      isAuthenticated: true,
      isLoading: false,
      error: 'Some error',
    });
  });
});
```

---

### 8.8 Spec File 5: Auth Guard (Functional Guard Tests)

**File:** `src/app/core/guards/auth.guard.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { createMock } from '../../testing/create-mock';

describe('Auth Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const mockRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    authServiceSpy = createMock(AuthService);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  // ──── authGuard ────
  describe('authGuard', () => {
    it('should allow access when token exists', () => {
      authServiceSpy.getAccessToken.and.returnValue('valid-token');
      const mockState = { url: '/dashboard' } as RouterStateSnapshot;

      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState),
      );

      expect(result).toBe(true);
    });

    it('should redirect to login when no token', () => {
      authServiceSpy.getAccessToken.and.returnValue(null);
      const mockState = { url: '/dashboard' } as RouterStateSnapshot;

      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState),
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/dashboard' } },
      );
    });
  });

  // ──── guestGuard ────
  describe('guestGuard', () => {
    it('should allow access when no token (guest)', () => {
      authServiceSpy.getAccessToken.and.returnValue(null);
      const mockState = { url: '/auth/login' } as RouterStateSnapshot;

      const result = TestBed.runInInjectionContext(() =>
        guestGuard(mockRoute, mockState),
      );

      expect(result).toBe(true);
    });

    it('should redirect to dashboard when already authenticated', () => {
      authServiceSpy.getAccessToken.and.returnValue('token');
      const mockState = { url: '/auth/login' } as RouterStateSnapshot;

      const result = TestBed.runInInjectionContext(() =>
        guestGuard(mockRoute, mockState),
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });
});
```

**Key:** `TestBed.runInInjectionContext()` is required for functional guards that use `inject()`.

---

### 8.9 Implementation Order

When you start implementing, follow this order (easiest → hardest):

```
ORDER   FILE                          WHY
─────   ────                          ───
  1     auth.reducer.spec.ts          Pure functions, no TestBed
  2     auth.selectors.spec.ts        Pure functions, no TestBed
  3     auth.service.spec.ts          TestBed + HttpTestingController
  4     auth.guard.spec.ts            TestBed + createMock
  5     login.component.spec.ts       TestBed + MockStore + forms
  6     register.component.spec.ts    Same pattern, more validators
```

### 8.10 Running & Verifying

```bash
# Run all tests
ng test --watch=false

# Run specific spec file
ng test --include=**/auth.reducer.spec.ts --watch=false

# Run with coverage
ng test --code-coverage --watch=false

# Run auth module tests only
ng test --include=**/auth/**/*.spec.ts --watch=false
```

#### Expected Output (when all pass)

```
Chrome: Executed 45 of 45 SUCCESS

  AuthService
    ✓ should be created
    login()
      ✓ should send POST to /auth/login with credentials
      ✓ should handle login error
    register()
      ✓ should send POST to /auth/register
    ...

  LoginComponent
    ✓ should create
    form initialization
      ✓ should create form on init
      ✓ should have email and password controls
    ...

  authReducer
    ✓ should return initial state for unknown action
    Login
      ✓ should set isLoading true
      ✓ should set user on loginSuccess
    ...
```

---

## Summary - Part 8

| What | Pattern Used |
|------|-------------|
| `create-mock.ts` | Generic mock factory via prototype introspection |
| `auth.mock-data.ts` | Factory functions with `Partial<T>` overrides |
| `auth.service.spec.ts` | Real service + `HttpTestingController` + `ApiResponse` wrapper |
| `login.component.spec.ts` | `MockStore` + `createMock()` + `NO_ERRORS_SCHEMA` |
| `auth.reducer.spec.ts` | Pure function tests — no TestBed at all |
| `auth.selectors.spec.ts` | Pure function tests — provide mock state object |
| `auth.guard.spec.ts` | `runInInjectionContext()` for functional guards |

---

## What's Next?

You now have the complete testing fundamentals knowledge and ready-to-implement spec files. Here's the recommended path:

1. **Create** `src/app/testing/` folder structure (create-mock + mock-data)
2. **Start with** `auth.reducer.spec.ts` and `auth.selectors.spec.ts` (easiest wins)
3. **Move to** `auth.service.spec.ts` (introduces HttpTestingController)
4. **Then** `auth.guard.spec.ts` (introduces createMock + runInInjectionContext)
5. **Finally** `login.component.spec.ts` (brings it all together)
6. **Stretch goal:** `register.component.spec.ts` (same patterns, more validators)

Run `ng test --watch=false` after each file to verify green tests before moving on.

**Congratulations — you've completed the Testing Fundamentals Module!**
