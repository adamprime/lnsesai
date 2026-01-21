import { createServerSupabaseClient } from "@/lib/supabase-server";

type Tag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  content_unit_tags: { content_unit_id: string }[];
};

async function getTags(): Promise<Tag[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("tags")
    .select(
      `
      id,
      name,
      slug,
      description,
      created_at,
      content_unit_tags (
        content_unit_id
      )
    `
    )
    .order("name");

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return (data as unknown as Tag[]) || [];
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
          + Add Tag
        </button>
      </div>

      <p className="text-gray-400 mb-4">{tags.length} tags</p>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left p-4 font-medium text-gray-400">Name</th>
              <th className="text-left p-4 font-medium text-gray-400">Slug</th>
              <th className="text-left p-4 font-medium text-gray-400">
                Content Units
              </th>
              <th className="text-left p-4 font-medium text-gray-400">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr
                key={tag.id}
                className="border-t border-gray-700 hover:bg-gray-750"
              >
                <td className="p-4 font-medium">{tag.name}</td>
                <td className="p-4 text-gray-400 font-mono text-sm">
                  {tag.slug}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                    {tag.content_unit_tags?.length || 0}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {tag.description || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
