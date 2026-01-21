// Content components API functions
import { createServerSupabaseClient } from "@/lib/supabase-server";

export type ComponentUpdate = {
  title?: string;
  content?: string;
  explanation?: string;
  examples?: string;
};

export type ComponentUpdateResult = {
  success: boolean;
  data?: {
    id: string;
    title: string | null;
    content: string;
    explanation: string | null;
    examples: string | null;
    updated_at: string;
  };
  error?: string;
};

export async function updateComponent(
  id: string,
  updates: ComponentUpdate
): Promise<ComponentUpdateResult> {
  if (!id) {
    return { success: false, error: "Component ID is required" };
  }

  if (Object.keys(updates).length === 0) {
    return { success: false, error: "No updates provided" };
  }

  // Content is required and cannot be empty
  if (updates.content !== undefined && updates.content.trim() === "") {
    return { success: false, error: "Content cannot be empty" };
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("content_components")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getComponent(id: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("content_components")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
