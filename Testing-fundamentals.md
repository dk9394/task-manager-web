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

**Next: Part 2 - Testing Tools & Setup (Jasmine, Karma, TestBed)**
