import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { EditContentUnitForm } from "@/components/admin/EditContentUnitForm";
import { ManageTagsSection } from "@/components/admin/ManageTagsSection";
import { EditComponentCard } from "@/components/admin/EditComponentCard";

type ContentUnit = {
  id: string;
  title: string;
  author: string;
  source_type: string;
  publication_year: number | null;
  status: string;
  source_files: string[] | null;
  created_at: string;
  updated_at: string;
};

type ContentComponent = {
  id: string;
  component_type: string;
  title: string | null;
  content: string;
  explanation: string | null;
  examples: string | null;
  display_order: number;
  token_count: number | null;
};

type ContentUnitTag = {
  weight: number;
  tag_id: string;
  tags: {
    id: string;
    name: string;
    slug: string;
  };
};

async function getContentUnit(id: string) {
  const supabase = createServerSupabaseClient();

  const { data: unit, error: unitError } = await supabase
    .from("content_units")
    .select("*")
    .eq("id", id)
    .single();

  if (unitError || !unit) {
    return null;
  }

  const { data: components } = await supabase
    .from("content_components")
    .select("*")
    .eq("content_unit_id", id)
    .order("display_order");

  const { data: unitTags } = await supabase
    .from("content_unit_tags")
    .select(
      `
      weight,
      tag_id,
      tags (
        id,
        name,
        slug
      )
    `
    )
    .eq("content_unit_id", id);

  // Get all tags for the dropdown
  const { data: allTags } = await supabase
    .from("tags")
    .select("id, name, slug")
    .order("name");

  return {
    unit: unit as ContentUnit,
    components: (components as ContentComponent[]) || [],
    tags: (unitTags as unknown as ContentUnitTag[]) || [],
    allTags: (allTags as { id: string; name: string; slug: string }[]) || [],
  };
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getContentUnit(id);

  if (!data) {
    notFound();
  }

  const { unit, components, tags, allTags } = data;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/admin/content"
            className="text-gray-400 hover:text-white text-sm mb-2 inline-block"
          >
            ← Back to Content
          </Link>
          <h1 className="text-3xl font-bold">{unit.title}</h1>
          <p className="text-gray-400 mt-1">by {unit.author}</p>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded ${
              unit.status === "published"
                ? "bg-green-600 text-green-100"
                : "bg-gray-600 text-gray-200"
            }`}
          >
            {unit.status}
          </span>
          <span className="px-3 py-1 bg-gray-700 rounded">{unit.source_type}</span>
        </div>
      </div>

      {/* Metadata - Editable */}
      <EditContentUnitForm contentUnit={unit} />

      {/* Tags - Editable */}
      <ManageTagsSection
        contentUnitId={unit.id}
        assignedTags={tags}
        allTags={allTags}
      />

      {/* Components - Editable */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Components ({components.length})
        </h2>
        <div className="space-y-4">
          {components.map((comp) => (
            <EditComponentCard key={comp.id} component={comp} />
          ))}
          {components.length === 0 && (
            <p className="text-gray-500">No components yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
