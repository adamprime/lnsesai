// Content unit tags API functions
import { createServerSupabaseClient } from "@/lib/supabase-server";

export type TagAssignment = {
  tag_id: string;
  weight: 1 | 2 | 3;
};

export type AddTagResult = {
  success: boolean;
  error?: string;
};

export type RemoveTagResult = {
  success: boolean;
  error?: string;
};

export type UpdateTagWeightResult = {
  success: boolean;
  error?: string;
};

export async function addTagToContentUnit(
  contentUnitId: string,
  tagId: string,
  weight: number = 1
): Promise<AddTagResult> {
  if (!contentUnitId) {
    return { success: false, error: "Content unit ID is required" };
  }

  if (!tagId) {
    return { success: false, error: "Tag ID is required" };
  }

  if (weight < 1 || weight > 3) {
    return { success: false, error: "Weight must be between 1 and 3" };
  }

  const supabase = createServerSupabaseClient();

  // Check if already assigned
  const { data: existing } = await supabase
    .from("content_unit_tags")
    .select("*")
    .eq("content_unit_id", contentUnitId)
    .eq("tag_id", tagId)
    .single();

  if (existing) {
    return { success: false, error: "Tag already assigned to this content unit" };
  }

  const { error } = await supabase.from("content_unit_tags").insert({
    content_unit_id: contentUnitId,
    tag_id: tagId,
    weight,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function removeTagFromContentUnit(
  contentUnitId: string,
  tagId: string
): Promise<RemoveTagResult> {
  if (!contentUnitId) {
    return { success: false, error: "Content unit ID is required" };
  }

  if (!tagId) {
    return { success: false, error: "Tag ID is required" };
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("content_unit_tags")
    .delete()
    .eq("content_unit_id", contentUnitId)
    .eq("tag_id", tagId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateTagWeight(
  contentUnitId: string,
  tagId: string,
  weight: number
): Promise<UpdateTagWeightResult> {
  if (!contentUnitId) {
    return { success: false, error: "Content unit ID is required" };
  }

  if (!tagId) {
    return { success: false, error: "Tag ID is required" };
  }

  if (weight < 1 || weight > 3) {
    return { success: false, error: "Weight must be between 1 and 3" };
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("content_unit_tags")
    .update({ weight })
    .eq("content_unit_id", contentUnitId)
    .eq("tag_id", tagId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getAllTags() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("tags")
    .select("id, name, slug")
    .order("name");

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [] };
}
