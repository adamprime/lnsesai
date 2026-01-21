import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  addTagToContentUnit,
  removeTagFromContentUnit,
  updateTagWeight,
} from "./content-unit-tags";

// Mock Supabase
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockUpdate = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase-server", () => ({
  createServerSupabaseClient: () => ({
    from: (table: string) => {
      if (table === "content_unit_tags") {
        return {
          insert: mockInsert,
          delete: () => ({ eq: mockEq }),
          update: mockUpdate,
          select: mockSelect,
        };
      }
      return {};
    },
  }),
}));

describe("addTagToContentUnit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ eq: () => ({ eq: () => ({ single: mockSingle }) }) });
    mockInsert.mockResolvedValue({ error: null });
  });

  describe("validation", () => {
    it("returns error when content unit ID is missing", async () => {
      const result = await addTagToContentUnit("", "tag-123");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Content unit ID is required");
    });

    it("returns error when tag ID is missing", async () => {
      const result = await addTagToContentUnit("unit-123", "");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Tag ID is required");
    });

    it("returns error when weight is less than 1", async () => {
      const result = await addTagToContentUnit("unit-123", "tag-123", 0);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Weight must be between 1 and 3");
    });

    it("returns error when weight is greater than 3", async () => {
      const result = await addTagToContentUnit("unit-123", "tag-123", 4);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Weight must be between 1 and 3");
    });
  });

  describe("successful operations", () => {
    it("adds tag with default weight of 1", async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });
      mockInsert.mockResolvedValue({ error: null });

      const result = await addTagToContentUnit("unit-123", "tag-123");

      expect(result.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith({
        content_unit_id: "unit-123",
        tag_id: "tag-123",
        weight: 1,
      });
    });

    it("adds tag with specified weight", async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });
      mockInsert.mockResolvedValue({ error: null });

      const result = await addTagToContentUnit("unit-123", "tag-123", 3);

      expect(result.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith({
        content_unit_id: "unit-123",
        tag_id: "tag-123",
        weight: 3,
      });
    });
  });

  describe("duplicate handling", () => {
    it("returns error when tag is already assigned", async () => {
      mockSingle.mockResolvedValue({
        data: { content_unit_id: "unit-123", tag_id: "tag-123" },
        error: null,
      });

      const result = await addTagToContentUnit("unit-123", "tag-123");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Tag already assigned to this content unit");
    });
  });
});

describe("removeTagFromContentUnit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEq.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
  });

  describe("validation", () => {
    it("returns error when content unit ID is missing", async () => {
      const result = await removeTagFromContentUnit("", "tag-123");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Content unit ID is required");
    });

    it("returns error when tag ID is missing", async () => {
      const result = await removeTagFromContentUnit("unit-123", "");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Tag ID is required");
    });
  });

  describe("successful operations", () => {
    it("removes tag successfully", async () => {
      const result = await removeTagFromContentUnit("unit-123", "tag-123");
      expect(result.success).toBe(true);
    });
  });
});

describe("updateTagWeight", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockReturnValue({
      eq: () => ({ eq: vi.fn().mockResolvedValue({ error: null }) }),
    });
  });

  describe("validation", () => {
    it("returns error when content unit ID is missing", async () => {
      const result = await updateTagWeight("", "tag-123", 2);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Content unit ID is required");
    });

    it("returns error when tag ID is missing", async () => {
      const result = await updateTagWeight("unit-123", "", 2);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Tag ID is required");
    });

    it("returns error when weight is invalid", async () => {
      const result = await updateTagWeight("unit-123", "tag-123", 5);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Weight must be between 1 and 3");
    });
  });

  describe("successful operations", () => {
    it("updates weight successfully", async () => {
      const result = await updateTagWeight("unit-123", "tag-123", 3);
      expect(result.success).toBe(true);
    });
  });
});
