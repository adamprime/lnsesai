export default function TagsDocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tags & Weights</h1>

      <p className="text-gray-300 text-lg mb-8">
        Tags organize content by topic, and <strong>weights</strong> tell us how 
        important a piece of content is for that topic.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">What Are Tags?</h2>
        <p className="text-gray-300 mb-4">
          Tags are topic labels that help us find relevant content when building a lens. 
          A book about management might have tags like "leadership," "feedback," "delegation," 
          and "motivation."
        </p>
        <p className="text-gray-300">
          When a user wants a lens about "giving feedback," we look for all content 
          tagged with "feedback" and assemble the most relevant pieces.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4" id="weight-system">The Weight System (1-2-3)</h2>
        <p className="text-gray-300 mb-6">
          Not all tagged content is equally relevant. A book entirely about feedback 
          should be weighted higher than a general management book that mentions feedback 
          in one chapter. That's what weights are for.
        </p>

        <div className="space-y-4">
          {/* Weight 3 */}
          <div className="bg-gray-800 rounded-lg p-5 border-l-4 border-yellow-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-600 rounded-full font-bold text-lg">
                3
              </span>
              <h3 className="font-semibold text-lg">High Priority</h3>
            </div>
            <p className="text-gray-300 mb-3">
              This content is <strong>primarily about</strong> this topic. It's the 
              definitive or most authoritative source on the subject.
            </p>
            <div className="p-3 bg-gray-900 rounded text-sm">
              <strong>Examples:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-300 space-y-1">
                <li>"Radical Candor" → feedback (weight 3) — the entire book is about feedback</li>
                <li>"Crucial Conversations" → difficult conversations (weight 3)</li>
                <li>"Thinking, Fast and Slow" → cognitive bias (weight 3)</li>
              </ul>
            </div>
          </div>

          {/* Weight 2 */}
          <div className="bg-gray-800 rounded-lg p-5 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full font-bold text-lg">
                2
              </span>
              <h3 className="font-semibold text-lg">Medium Priority</h3>
            </div>
            <p className="text-gray-300 mb-3">
              This content has <strong>substantial coverage</strong> of this topic—perhaps 
              a major chapter or section—but it's not the primary focus.
            </p>
            <div className="p-3 bg-gray-900 rounded text-sm">
              <strong>Examples:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-300 space-y-1">
                <li>"The Manager's Path" → feedback (weight 2) — has chapters on feedback but covers many topics</li>
                <li>"Good to Great" → leadership (weight 2) — about company success, but leadership is a key theme</li>
              </ul>
            </div>
          </div>

          {/* Weight 1 */}
          <div className="bg-gray-800 rounded-lg p-5 border-l-4 border-gray-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full font-bold text-lg">
                1
              </span>
              <h3 className="font-semibold text-lg">Low Priority</h3>
            </div>
            <p className="text-gray-300 mb-3">
              This content <strong>mentions or touches on</strong> this topic, but it's 
              not a major focus. Include only if space allows or if we need more breadth.
            </p>
            <div className="p-3 bg-gray-900 rounded text-sm">
              <strong>Examples:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-300 space-y-1">
                <li>"High Output Management" → meetings (weight 1) — touches on meetings but covers much more</li>
                <li>"The Hard Thing About Hard Things" → hiring (weight 1) — mentions hiring but isn't primarily about it</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">How Weights Affect Lenses</h2>
        <p className="text-gray-300 mb-4">
          When we compile a lens for a user, we prioritize content by weight:
        </p>
        <ol className="list-decimal list-inside text-gray-300 space-y-2">
          <li>
            <strong>Weight 3 content</strong> is included first—these are the must-haves
          </li>
          <li>
            <strong>Weight 2 content</strong> is added if there's room in the context window
          </li>
          <li>
            <strong>Weight 1 content</strong> is included only if we have space and need 
            additional perspectives
          </li>
        </ol>
        <p className="text-gray-400 text-sm mt-4">
          This ensures users always get the most relevant, authoritative content first, 
          even when context window limits force us to be selective.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Managing Tags</h2>
        <div className="bg-gray-800 rounded-lg p-5">
          <h3 className="font-semibold mb-3">Adding a Tag</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
            <li>Open a content unit's detail page</li>
            <li>In the "Tags" section, select a tag from the dropdown</li>
            <li>Choose the appropriate weight (1, 2, or 3)</li>
            <li>Click "Add Tag"</li>
          </ol>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 mt-4">
          <h3 className="font-semibold mb-3">Changing a Tag's Weight</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
            <li>Find the tag in the "Assigned Tags" list</li>
            <li>Use the weight dropdown to select a new value</li>
            <li>Changes save automatically</li>
          </ol>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 mt-4">
          <h3 className="font-semibold mb-3">Removing a Tag</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
            <li>Find the tag in the "Assigned Tags" list</li>
            <li>Click the × button next to it</li>
          </ol>
        </div>
      </section>

      <section className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Tagging Best Practices</h3>
        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
          <li>Be conservative with weight 3—reserve it for content that's truly definitive</li>
          <li>It's okay to have multiple weight 3 tags if a book covers multiple topics deeply</li>
          <li>When in doubt, start with weight 2 and adjust later based on user feedback</li>
          <li>Review tags periodically as our library grows—relative importance may shift</li>
        </ul>
      </section>
    </div>
  );
}
