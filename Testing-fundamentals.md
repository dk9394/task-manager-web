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

**Next: Part 4 - Component Testing (forms, DOM, NgRx)**
