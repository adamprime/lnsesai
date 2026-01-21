# Testing Guide

## Philosophy: Test-Driven Development (TDD)

We follow TDD for all new features:

1. **Write the test first** - Define expected behavior before implementation
2. **Watch it fail** - Confirm the test fails (red)
3. **Write minimal code** - Just enough to pass the test (green)
4. **Refactor** - Clean up while keeping tests green
5. **Repeat**

## Running Tests

```bash
# Watch mode (recommended during development)
npm test

# Single run
npm run test:run

# With coverage
npm run test:coverage
```

## Test Structure

Tests live alongside the code they test:

```
src/
├── lib/
│   ├── admin.ts
│   └── admin.test.ts      # Tests for admin.ts
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx    # Tests for Button.tsx
└── test/
    └── setup.ts           # Global test setup
```

## Writing Tests

### Unit Tests (Functions/Utilities)

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "./myModule";

describe("myFunction", () => {
  it("does something expected", () => {
    expect(myFunction("input")).toBe("expected output");
  });

  it("handles edge cases", () => {
    expect(myFunction(null)).toBe(null);
  });
});
```

### Component Tests

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

## Mocking

### Clerk Auth (already set up in setup.ts)

```typescript
import { vi } from "vitest";
import { currentUser } from "@clerk/nextjs/server";

// Mock a specific user
vi.mocked(currentUser).mockResolvedValue({
  emailAddresses: [{ emailAddress: "test@example.com" }],
});
```

### Supabase

```typescript
import { vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createServerSupabaseClient: () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
}));
```

## Current Test Coverage

| Area | Tests | Status |
|------|-------|--------|
| Admin Authorization | 7 | ✅ |
| Content API | 0 | 🔲 |
| Components | 0 | 🔲 |

## Adding Tests for New Features

Before implementing any new feature:

1. Create `feature.test.ts` file
2. Write tests describing expected behavior
3. Run tests to confirm they fail
4. Implement the feature
5. Run tests to confirm they pass
6. Commit both test and implementation together
