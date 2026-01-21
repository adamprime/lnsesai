import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateContentUnit, ContentUnitUpdate } from "./content-units";

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

describe("updateContentUnit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up the mock chain
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
  });

  describe("validation", () => {
    it("returns error when id is missing", async () => {
      const result = await updateContentUnit("", { title: "New Title" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Content unit ID is required");
    });

    it("returns error when no updates provided", async () => {
      const result = await updateContentUnit("123", {});
      expect(result.success).toBe(false);
      expect(result.error).toBe("No updates provided");
    });

    it("returns error when title is empty string", async () => {
      const result = await updateContentUnit("123", { title: "  " });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Title cannot be empty");
    });

    it("returns error when author is empty string", async () => {
      const result = await updateContentUnit("123", { author: "" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Author cannot be empty");
    });

    it("returns error for invalid source_type", async () => {
      const result = await updateContentUnit("123", {
        source_type: "invalid" as any,
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid source type");
    });

    it("returns error for invalid status", async () => {
      const result = await updateContentUnit("123", {
        status: "invalid" as any,
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid status");
    });
  });

  describe("successful updates", () => {
    it("updates title successfully", async () => {
      const mockData = {
        id: "123",
        title: "Updated Title",
        author: "Author",
        source_type: "book",
        publication_year: 2020,
        status: "published",
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateContentUnit("123", { title: "Updated Title" });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Updated Title");
      expect(mockUpdate).toHaveBeenCalledWith({ title: "Updated Title" });
    });

    it("updates multiple fields at once", async () => {
      const updates: ContentUnitUpdate = {
        title: "New Title",
        author: "New Author",
        status: "draft",
      };

      const mockData = {
        id: "123",
        title: "New Title",
        author: "New Author",
        source_type: "book",
        publication_year: null,
        status: "draft",
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateContentUnit("123", updates);

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("New Title");
      expect(result.data?.author).toBe("New Author");
      expect(result.data?.status).toBe("draft");
    });

    it("updates status to published", async () => {
      const mockData = {
        id: "123",
        title: "Title",
        author: "Author",
        source_type: "book",
        publication_year: 2020,
        status: "published",
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateContentUnit("123", { status: "published" });

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe("published");
    });

    it("updates source_type", async () => {
      const mockData = {
        id: "123",
        title: "Title",
        author: "Author",
        source_type: "article",
        publication_year: 2020,
        status: "published",
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateContentUnit("123", { source_type: "article" });

      expect(result.success).toBe(true);
      expect(result.data?.source_type).toBe("article");
    });

    it("allows null publication_year", async () => {
      const mockData = {
        id: "123",
        title: "Title",
        author: "Author",
        source_type: "book",
        publication_year: null,
        status: "published",
        updated_at: "2025-01-21T00:00:00Z",
      };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await updateContentUnit("123", { publication_year: null });

      expect(result.success).toBe(true);
      expect(result.data?.publication_year).toBeNull();
    });
  });

  describe("database errors", () => {
    it("returns error when database update fails", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Database connection failed" },
      });

      const result = await updateContentUnit("123", { title: "New Title" });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Database connection failed");
    });

    it("returns error when content unit not found", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "No rows found" },
      });

      const result = await updateContentUnit("nonexistent", {
        title: "New Title",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("No rows found");
    });
  });
});
