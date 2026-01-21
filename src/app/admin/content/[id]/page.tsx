import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

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

  return {
    unit: unit as ContentUnit,
    components: (components as ContentComponent[]) || [],
    tags: (unitTags as unknown as ContentUnitTag[]) || [],
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

  const { unit, components, tags } = data;

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

      {/* Metadata */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Metadata</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Publication Year:</span>{" "}
            <span>{unit.publication_year || "Unknown"}</span>
          </div>
          <div>
            <span className="text-gray-400">Created:</span>{" "}
            <span>{new Date(unit.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Updated:</span>{" "}
            <span>{new Date(unit.updated_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Source Files:</span>{" "}
            <span>{unit.source_files?.join(", ") || "None"}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Tags ({tags.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t.tag_id}
              className={`px-3 py-1 rounded flex items-center gap-2 ${
                t.weight === 3
                  ? "bg-yellow-600 text-yellow-100"
                  : t.weight === 2
                    ? "bg-blue-600 text-blue-100"
                    : "bg-gray-600 text-gray-200"
              }`}
            >
              {t.tags.name}
              <span className="text-xs opacity-75">
                (weight: {t.weight})
              </span>
            </span>
          ))}
          {tags.length === 0 && (
            <span className="text-gray-500">No tags assigned</span>
          )}
        </div>
      </div>

      {/* Components */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Components ({components.length})
        </h2>
        <div className="space-y-4">
          {components.map((comp) => (
            <div
              key={comp.id}
              className="border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      comp.component_type === "summary"
                        ? "bg-purple-600"
                        : comp.component_type === "theme"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                    }`}
                  >
                    {comp.component_type}
                  </span>
                  <span className="font-medium">
                    {comp.title || `${comp.component_type} #${comp.display_order}`}
                  </span>
                </div>
                {comp.token_count && (
                  <span className="text-gray-500 text-sm">
                    {comp.token_count} tokens
                  </span>
                )}
              </div>
              <div className="text-gray-300 text-sm max-h-40 overflow-y-auto whitespace-pre-wrap">
                {comp.content.slice(0, 500)}
                {comp.content.length > 500 && "..."}
              </div>
              {comp.explanation && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-400">Explanation: </span>
                  <span className="text-gray-300">{comp.explanation.slice(0, 200)}...</span>
                </div>
              )}
            </div>
          ))}
          {components.length === 0 && (
            <p className="text-gray-500">No components yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
