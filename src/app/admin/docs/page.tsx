import Link from "next/link";

export default function DocsOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Documentation</h1>
      
      <p className="text-gray-300 text-lg mb-8">
        Welcome to the Lnses admin dashboard. This documentation will help you 
        understand how to manage content units, organize them with tags, and 
        prepare knowledge for lens compilation.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">What is Lnses?</h2>
        <p className="text-gray-300 mb-4">
          Lnses is a platform-agnostic knowledge lens service. We curate expert 
          knowledge from books, articles, and other sources, then compile it into 
          "lenses" that users can paste into any AI chat (ChatGPT, Claude, Gemini, etc.) 
          to get better, more informed answers.
        </p>
        <p className="text-gray-300">
          As an admin, your job is to manage the underlying content—ensuring it's 
          accurate, well-organized, and properly tagged so it can be assembled into 
          effective lenses.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-3">
          <li>
            <strong>Browse content</strong> — Go to{" "}
            <Link href="/admin/content" className="text-blue-400 hover:underline">
              Content
            </Link>{" "}
            to see all content units (books, articles, etc.)
          </li>
          <li>
            <strong>Edit a content unit</strong> — Click any title to view and edit 
            its metadata, tags, and components
          </li>
          <li>
            <strong>Manage tags</strong> — Add or remove tags, and set weights (1-3) 
            to indicate how important a piece of content is for that topic
          </li>
          <li>
            <strong>Edit components</strong> — Each content unit has components 
            (summary, themes) that can be individually edited
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Documentation Sections</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/admin/docs/content"
            className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
          >
            <h3 className="font-semibold mb-1">Content Units</h3>
            <p className="text-gray-400 text-sm">
              Learn about books, articles, videos, and their metadata fields
            </p>
          </Link>
          <Link
            href="/admin/docs/components"
            className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
          >
            <h3 className="font-semibold mb-1">Components</h3>
            <p className="text-gray-400 text-sm">
              Understand summaries, themes, and why we break content into pieces
            </p>
          </Link>
          <Link
            href="/admin/docs/tags"
            className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
          >
            <h3 className="font-semibold mb-1">Tags & Weights</h3>
            <p className="text-gray-400 text-sm">
              Master the 1-2-3 weight system for prioritizing content
            </p>
          </Link>
          <Link
            href="/admin/docs/markdown"
            className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
          >
            <h3 className="font-semibold mb-1">Markdown Guide</h3>
            <p className="text-gray-400 text-sm">
              Format your content with headers, bold, lists, and more
            </p>
          </Link>
        </div>
      </section>

      <section className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
        <p className="text-gray-300 text-sm">
          Look for the <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-700 rounded-full text-xs">?</span> icon 
          next to fields throughout the admin interface. Click it to jump directly 
          to the relevant documentation section.
        </p>
      </section>
    </div>
  );
}
