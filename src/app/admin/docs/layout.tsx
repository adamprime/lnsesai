import Link from "next/link";

const docSections = [
  { href: "/admin/docs", label: "Overview" },
  { href: "/admin/docs/content", label: "Content Units" },
  { href: "/admin/docs/components", label: "Components" },
  { href: "/admin/docs/tags", label: "Tags & Weights" },
  { href: "/admin/docs/markdown", label: "Markdown Guide" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-850 border-r border-gray-700 p-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Documentation
        </h2>
        <nav className="space-y-1">
          {docSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition"
            >
              {section.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-gray-700">
          <Link
            href="/admin"
            className="block px-3 py-2 text-gray-400 hover:text-white text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 max-w-4xl">
        {children}
      </main>
    </div>
  );
}
