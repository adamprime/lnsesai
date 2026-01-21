// Content unit API functions
// These will be implemented after tests are written

import { createServerSupabaseClient } from "@/lib/supabase-server";

export type ContentUnitUpdate = {
  title?: string;
  author?: string;
  source_type?: "book" | "article" | "video" | "podcast";
  publication_year?: number | null;
  status?: "draft" | "published";
  // Article-specific fields
  publication?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  doi?: string | null;
  url?: string | null;
  // Book fields
  edition?: string | null;
};

export type ContentUnitUpdateResult = {
  success: boolean;
  data?: {
    id: string;
    title: string;
    author: string;
    source_type: string;
    publication_year: number | null;
    status: string;
    updated_at: string;
  };
  error?: string;
};

export async function updateContentUnit(
  id: string,
  updates: ContentUnitUpdate
): Promise<ContentUnitUpdateResult> {
  // Validate inputs
  if (!id) {
    return { success: false, error: "Content unit ID is required" };
  }

  if (Object.keys(updates).length === 0) {
    return { success: false, error: "No updates provided" };
  }

  // Validate title if provided
  if (updates.title !== undefined && updates.title.trim() === "") {
    return { success: false, error: "Title cannot be empty" };
  }

  // Validate author if provided
  if (updates.author !== undefined && updates.author.trim() === "") {
    return { success: false, error: "Author cannot be empty" };
  }

  // Validate source_type if provided
  const validSourceTypes = ["book", "article", "video", "podcast"];
  if (updates.source_type && !validSourceTypes.includes(updates.source_type)) {
    return { success: false, error: "Invalid source type" };
  }

  // Validate status if provided
  const validStatuses = ["draft", "published"];
  if (updates.status && !validStatuses.includes(updates.status)) {
    return { success: false, error: "Invalid status" };
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("content_units")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
