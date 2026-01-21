import { describe, it, expect } from "vitest";
import { isAdminEmail, ADMIN_EMAILS } from "./admin";

describe("isAdminEmail", () => {
  it("returns true for allowed admin emails", () => {
    expect(isAdminEmail("adam@tervort.org")).toBe(true);
    expect(isAdminEmail("charles.thomas809@gmail.com")).toBe(true);
    expect(isAdminEmail("jfboyce57@gmail.com")).toBe(true);
  });

  it("is case insensitive", () => {
    expect(isAdminEmail("ADAM@TERVORT.ORG")).toBe(true);
    expect(isAdminEmail("Adam@Tervort.Org")).toBe(true);
  });

  it("returns false for non-admin emails", () => {
    expect(isAdminEmail("random@example.com")).toBe(false);
    expect(isAdminEmail("hacker@evil.com")).toBe(false);
  });

  it("returns false for null/undefined", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isAdminEmail("")).toBe(false);
  });
});

describe("ADMIN_EMAILS", () => {
  it("contains exactly 3 admin emails", () => {
    expect(ADMIN_EMAILS).toHaveLength(3);
  });

  it("contains all expected admins", () => {
    expect(ADMIN_EMAILS).toContain("adam@tervort.org");
    expect(ADMIN_EMAILS).toContain("charles.thomas809@gmail.com");
    expect(ADMIN_EMAILS).toContain("jfboyce57@gmail.com");
  });
});
