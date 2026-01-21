export default function ComponentsDocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Components</h1>

      <p className="text-gray-300 text-lg mb-8">
        Each content unit is broken into <strong>components</strong>—smaller pieces 
        of content that can be selectively included when building a lens.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Why Components?</h2>
        <div className="bg-gray-800 rounded-lg p-5 mb-4">
          <h3 className="font-semibold mb-2">🎯 Context Window Limits</h3>
          <p className="text-gray-300 text-sm">
            AI models have limited context windows (e.g., 8K-128K tokens). A full 
            book summary might be 2,000+ tokens. By breaking content into components, 
            we can include just the most relevant pieces and fit more sources into 
            a single lens.
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 mb-4">
          <h3 className="font-semibold mb-2">🔧 Selective Assembly</h3>
          <p className="text-gray-300 text-sm">
            A user asking about "giving feedback" might benefit from the feedback-related 
            themes from multiple books, but not need the full summary of each. Components 
            let us cherry-pick the most relevant pieces.
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-5">
          <h3 className="font-semibold mb-2">📊 Better Targeting</h3>
          <p className="text-gray-300 text-sm">
            Components can be individually tagged, allowing us to match specific 
            frameworks or concepts to user needs rather than relying on book-level tags alone.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Component Types</h2>
        
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-600 rounded text-sm">summary</span>
              Summary
            </h3>
            <p className="text-gray-300 mb-3">
              A comprehensive overview of the entire content unit. Explains what the 
              book/article is about, its main arguments, and key takeaways.
            </p>
            <p className="text-gray-400 text-sm mb-3">
              <strong>Typical length:</strong> 500-1500 words
            </p>
            <div className="p-3 bg-gray-900 rounded text-sm text-gray-300">
              <strong>When it's used:</strong> When a user needs general understanding 
              of a topic and we want to introduce them to a key source.
            </div>
          </div>

          {/* Theme */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 rounded text-sm">theme</span>
              Theme
            </h3>
            <p className="text-gray-300 mb-3">
              A specific concept, principle, or idea from the content. Themes have 
              three parts: title, explanation, and examples.
            </p>
            <p className="text-gray-400 text-sm mb-3">
              <strong>Typical length:</strong> 100-400 words per theme
            </p>
            <div className="p-3 bg-gray-900 rounded text-sm text-gray-300 mb-3">
              <strong>Structure:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Title:</strong> Name of the theme (e.g., "Theme 1: Radical Candor Framework")</li>
                <li><strong>Explanation:</strong> What this concept means and why it matters</li>
                <li><strong>Examples:</strong> Concrete examples of the concept in action</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-900 rounded text-sm text-gray-300">
              <strong>When it's used:</strong> When a user has a specific question that 
              aligns with one of the book's key concepts. We can include just the relevant 
              theme(s) rather than the entire summary.
            </div>
          </div>

          {/* Framework */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-600 rounded text-sm">framework</span>
              Framework
            </h3>
            <p className="text-gray-300 mb-3">
              A practical model, process, or methodology that can be applied. 
              Frameworks are action-oriented and give users something they can use.
            </p>
            <p className="text-gray-400 text-sm mb-3">
              <strong>Examples:</strong> GROW model, SBI feedback model, 5 Whys, etc.
            </p>
            <div className="p-3 bg-gray-900 rounded text-sm text-gray-300">
              <strong>When it's used:</strong> When a user needs a specific tool or 
              process to follow. Frameworks are highly actionable.
            </div>
          </div>

          {/* Key Concept */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gray-600 rounded text-sm">key_concept</span>
              Key Concept
            </h3>
            <p className="text-gray-300 mb-3">
              A definition or explanation of an important term or idea. Shorter than 
              a theme, focused on clarifying terminology.
            </p>
            <p className="text-gray-400 text-sm mb-3">
              <strong>Typical length:</strong> 50-150 words
            </p>
            <div className="p-3 bg-gray-900 rounded text-sm text-gray-300">
              <strong>When it's used:</strong> When we need to ensure the AI (and user) 
              understands a specific term the way the source defines it.
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Editing Components</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>
            Click the <strong>Edit</strong> button on any component to modify it
          </li>
          <li>
            Content is written in <strong>Markdown</strong> format (see Markdown Guide)
          </li>
          <li>
            The preview shows rendered Markdown; the editor shows raw Markdown
          </li>
          <li>
            For themes, fill in all three fields: title, explanation, and examples
          </li>
          <li>
            Keep components focused—if a theme covers multiple concepts, consider 
            splitting it into separate themes
          </li>
        </ul>
      </section>
    </div>
  );
}
