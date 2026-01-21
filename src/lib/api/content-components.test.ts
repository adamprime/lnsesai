import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateComponent } from "./content-components";

// Mock Supabase
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase-server", () => ({
  createServerSupabaseClient: () => ({
    from: () => ({
      update: mockUpdate,
    }),
  }),
}));

describe("updateComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
  });

  describe("validation", () => {
    it("returns error when id is missing", async () => {
      const result = await updateComponent("", { content: "New content" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Component ID is required");
    });

    it("returns error when no updates provided", async () => {
      const result = await updateComponent("123", {});
      expect(result.success).toBe(false);
      expect(result.error).toBe("No updates provided");
    });

    it("returns error when content is empty string", async () => {
      const result = await updateComponent("123", { content: "   " });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Content cannot be empty");
    });
  });

  describe("successful updates", () => {
    it("updates content successfully", async () => {
      const mockData = {
        id: "123",
        title: "Summary",
        content: "Updated content",
        explanation: null,
        examples: null,
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateComponent("123", { content: "Updated content" });

      expect(result.success).toBe(true);
      expect(result.data?.content).toBe("Updated content");
    });

    it("updates title successfully", async () => {
      const mockData = {
        id: "123",
        title: "New Title",
        content: "Some content",
        explanation: null,
        examples: null,
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateComponent("123", { title: "New Title" });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("New Title");
    });

    it("updates explanation and examples for themes", async () => {
      const mockData = {
        id: "123",
        title: "Theme 1",
        content: "Content",
        explanation: "New explanation",
        examples: "New examples",
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateComponent("123", {
        explanation: "New explanation",
        examples: "New examples",
      });

      expect(result.success).toBe(true);
      expect(result.data?.explanation).toBe("New explanation");
      expect(result.data?.examples).toBe("New examples");
    });

    it("updates multiple fields at once", async () => {
      const mockData = {
        id: "123",
        title: "Updated Title",
        content: "Updated content",
        explanation: "Updated explanation",
        examples: null,
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateComponent("123", {
        title: "Updated Title",
        content: "Updated content",
        explanation: "Updated explanation",
      });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Updated Title");
      expect(result.data?.content).toBe("Updated content");
    });
  });

  describe("database errors", () => {
    it("returns error when database update fails", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const result = await updateComponent("123", { content: "New content" });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Database error");
    });

    it("returns error when component not found", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "No rows found" },
      });

      const result = await updateComponent("nonexistent", { content: "Content" });

      expect(result.success).toBe(false);
      expect(result.error).toBe("No rows found");
    });
  });
});
