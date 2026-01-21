"use client";

import { MarkdownContent } from "@/components/MarkdownContent";

const exampleMarkdown = `# Main Heading

This is a paragraph with **bold text** and *italic text*.

## Subheading

Here's a list of items:
- First item
- Second item  
- Third item with **emphasis**

### Numbered List

1. Step one
2. Step two
3. Step three

> This is a blockquote. Use it for important quotes or callouts.

Here's some \`inline code\` in a sentence.`;

export default function MarkdownDocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Markdown Guide</h1>

      <p className="text-gray-300 text-lg mb-8">
        Content in Lnses is written in <strong>Markdown</strong>—a simple formatting 
        language that's easy to read and write. When you edit a component, you write 
        Markdown; when you view it, you see the rendered result.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Basic Formatting</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left p-3 text-gray-400">What you type</th>
                <th className="text-left p-3 text-gray-400">What you get</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="p-3 font-mono text-gray-300">**bold text**</td>
                <td className="p-3"><strong className="text-white">bold text</strong></td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-gray-300">*italic text*</td>
                <td className="p-3"><em className="text-gray-200">italic text</em></td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-gray-300">***bold and italic***</td>
                <td className="p-3"><strong><em className="text-white">bold and italic</em></strong></td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-gray-300">`code`</td>
                <td className="p-3"><code className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-200">code</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Headings</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left p-3 text-gray-400">What you type</th>
                <th className="text-left p-3 text-gray-400">What you get</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="p-3 font-mono text-gray-300"># Heading 1</td>
                <td className="p-3 text-xl font-bold text-white">Heading 1</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-gray-300">## Heading 2</td>
                <td className="p-3 text-lg font-semibold text-white">Heading 2</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-gray-300">### Heading 3</td>
                <td className="p-3 text-base font-semibold text-gray-200">Heading 3</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-400 text-sm mt-3">
          Note: In component content, you'll rarely need Heading 1. Use Heading 2 (##) 
          for main sections and Heading 3 (###) for subsections.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Lists</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-400">Bullet List</h3>
            <pre className="text-sm font-mono text-gray-300 mb-3">
{`- First item
- Second item
- Third item`}
            </pre>
            <div className="border-t border-gray-700 pt-3">
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-400">Numbered List</h3>
            <pre className="text-sm font-mono text-gray-300 mb-3">
{`1. First step
2. Second step
3. Third step`}
            </pre>
            <div className="border-t border-gray-700 pt-3">
              <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
                <li>First step</li>
                <li>Second step</li>
                <li>Third step</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Blockquotes</h2>
        <div className="bg-gray-800 rounded-lg p-4">
          <pre className="text-sm font-mono text-gray-300 mb-3">
{`> This is a blockquote.
> Use it for important quotes or callouts.`}
          </pre>
          <div className="border-t border-gray-700 pt-3">
            <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400">
              This is a blockquote. Use it for important quotes or callouts.
            </blockquote>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Live Example</h2>
        <p className="text-gray-300 mb-4">
          Here's a complete example showing what you'd type (left) and what it looks like (right):
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-400">Markdown (what you type)</h3>
            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto">
              {exampleMarkdown}
            </pre>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-400">Rendered (what users see)</h3>
            <MarkdownContent content={exampleMarkdown} />
          </div>
        </div>
      </section>

      <section className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Tips for Writing Good Markdown</h3>
        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
          <li>Keep paragraphs short—one idea per paragraph</li>
          <li>Use **bold** for key terms you want to stand out</li>
          <li>Use bullet lists for items that don't need a specific order</li>
          <li>Use numbered lists for steps or sequences</li>
          <li>Leave a blank line between paragraphs and sections</li>
          <li>Don't overdo the formatting—readability is the goal</li>
        </ul>
      </section>
    </div>
  );
}
