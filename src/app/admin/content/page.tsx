import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

type ContentUnit = {
  id: string;
  title: string;
  author: string;
  source_type: string;
  status: string;
  created_at: string;
  content_unit_tags: {
    weight: number;
    tags: {
      name: string;
      slug: string;
    };
  }[];
  content_components: {
    id: string;
  }[];
};

async function getContentUnits(
  search?: string,
  tag?: string
): Promise<ContentUnit[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from("content_units")
    .select(
      `
      id,
      title,
      author,
      source_type,
      status,
      created_at,
      content_unit_tags (
        weight,
        tags (
          name,
          slug
        )
      ),
      content_components (
        id
      )
    `
    )
    .order("title");

  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching content units:", error);
    return [];
  }

  let results = (data as unknown as ContentUnit[]) || [];

  // Filter by tag if specified
  if (tag) {
    results = results.filter((unit) =>
      unit.content_unit_tags?.some((t) => t.tags?.slug === tag)
    );
  }

  return results;
}

async function getTags() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("tags")
    .select("name, slug")
    .order("name");
  return data || [];
}

export default async function ContentListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const [contentUnits, tags] = await Promise.all([
    getContentUnits(params.search, params.tag),
    getTags(),
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Units</h1>
        <Link
          href="/admin/content/new"
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          + Add Content
        </Link>
      </div>

      {/* Filters */}
      <form className="flex gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search by title or author..."
          defaultValue={params.search || ""}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
        />
        <select
          name="tag"
          defaultValue={params.tag || ""}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.slug} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Filter
        </button>
      </form>

      {/* Results count */}
      <p className="text-gray-400 mb-4">{contentUnits.length} content units</p>

      {/* Content table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left p-4 font-medium text-gray-400">Title</th>
              <th className="text-left p-4 font-medium text-gray-400">
                Author
              </th>
              <th className="text-left p-4 font-medium text-gray-400">Type</th>
              <th className="text-left p-4 font-medium text-gray-400">Tags</th>
              <th className="text-left p-4 font-medium text-gray-400">
                Components
              </th>
              <th className="text-left p-4 font-medium text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {contentUnits.map((unit) => (
              <tr
                key={unit.id}
                className="border-t border-gray-700 hover:bg-gray-750"
              >
                <td className="p-4">
                  <Link
                    href={`/admin/content/${unit.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {unit.title}
                  </Link>
                </td>
                <td className="p-4 text-gray-300">{unit.author}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                    {unit.source_type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {unit.content_unit_tags?.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded text-xs ${
                          t.weight === 3
                            ? "bg-yellow-600 text-yellow-100"
                            : t.weight === 2
                              ? "bg-blue-600 text-blue-100"
                              : "bg-gray-600 text-gray-200"
                        }`}
                      >
                        {t.tags?.name}
                      </span>
                    ))}
                    {unit.content_unit_tags?.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{unit.content_unit_tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-gray-400">
                  {unit.content_components?.length || 0}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      unit.status === "published"
                        ? "bg-green-600 text-green-100"
                        : "bg-gray-600 text-gray-200"
                    }`}
                  >
                    {unit.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
