import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

async function getStats() {
  const supabase = createServerSupabaseClient();

  const [contentUnits, components, tags] = await Promise.all([
    supabase.from("content_units").select("id", { count: "exact", head: true }),
    supabase
      .from("content_components")
      .select("id", { count: "exact", head: true }),
    supabase.from("tags").select("id", { count: "exact", head: true }),
  ]);

  return {
    contentUnits: contentUnits.count || 0,
    components: components.count || 0,
    tags: tags.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-4xl font-bold text-blue-400">
            {stats.contentUnits}
          </div>
          <div className="text-gray-400 mt-1">Content Units</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-4xl font-bold text-green-400">
            {stats.components}
          </div>
          <div className="text-gray-400 mt-1">Components</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-4xl font-bold text-purple-400">{stats.tags}</div>
          <div className="text-gray-400 mt-1">Tags</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/admin/content"
          className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition block"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Content</h2>
          <p className="text-gray-400">
            Browse, edit, and add content units (books, articles, etc.)
          </p>
        </Link>

        <Link
          href="/admin/tags"
          className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition block"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Tags</h2>
          <p className="text-gray-400">
            View and organize tags used to categorize content
          </p>
        </Link>
      </div>
    </div>
  );
}
