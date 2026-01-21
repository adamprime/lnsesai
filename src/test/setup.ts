import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: ({ children }: { children: React.ReactNode }) => null,
  UserButton: () => null,
  SignIn: () => null,
  SignUp: () => null,
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser: vi.fn(),
  auth: vi.fn(),
}));
