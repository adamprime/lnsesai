export default function ContentDocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Content Units</h1>

      <p className="text-gray-300 text-lg mb-8">
        A <strong>content unit</strong> is a single piece of source material—typically 
        a book or article—that contains knowledge we want to include in lenses.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Content Types</h2>
        <p className="text-gray-300 mb-4">
          Each content unit has a type that determines what metadata fields are available:
        </p>

        <div className="space-y-6">
          {/* Book */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-600 rounded text-sm">book</span>
              Book
            </h3>
            <p className="text-gray-300 mb-3">
              A published book. The most common content type in our library.
            </p>
            <div className="text-sm text-gray-400">
              <strong>Fields:</strong> Title, Author, Publication Year, Edition, Status
            </div>
            <div className="mt-3 p-3 bg-gray-900 rounded text-sm">
              <strong>Example:</strong> "Radical Candor" by Kim Scott (2017), 2nd Edition
            </div>
          </div>

          {/* Article */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 rounded text-sm">article</span>
              Article
            </h3>
            <p className="text-gray-300 mb-3">
              A journal article, research paper, or published essay. Has additional 
              fields for academic citation.
            </p>
            <div className="text-sm text-gray-400">
              <strong>Fields:</strong> Title, Author, Publication Year, Publication (journal name), 
              Volume, Issue, Pages, DOI, URL, Status
            </div>
            <div className="mt-3 p-3 bg-gray-900 rounded text-sm">
              <strong>Example:</strong> "The Power of Talk" by Deborah Tannen, 
              Harvard Business Review, Vol. 73, No. 5, pp. 138-148
            </div>
          </div>

          {/* Video */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-600 rounded text-sm">video</span>
              Video
            </h3>
            <p className="text-gray-300 mb-3">
              A video presentation, lecture, or talk (e.g., TED talks, conference presentations).
            </p>
            <div className="text-sm text-gray-400">
              <strong>Fields:</strong> Title, Author/Speaker, Publication Year, URL, Status
            </div>
          </div>

          {/* Podcast */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-600 rounded text-sm">podcast</span>
              Podcast
            </h3>
            <p className="text-gray-300 mb-3">
              A podcast episode or series with valuable insights.
            </p>
            <div className="text-sm text-gray-400">
              <strong>Fields:</strong> Title, Host/Author, Publication Year, URL, Status
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Status: Draft vs Published</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <span className="px-2 py-0.5 bg-gray-600 rounded text-sm">draft</span>
            <p className="text-gray-300 mt-2 text-sm">
              Content is being worked on and should <strong>not</strong> appear in 
              customer-facing lenses. Use this for incomplete or unreviewed content.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <span className="px-2 py-0.5 bg-green-600 rounded text-sm">published</span>
            <p className="text-gray-300 mt-2 text-sm">
              Content is ready and <strong>can</strong> be included in lenses 
              for customers. Only publish content that has been reviewed and verified.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>
            <strong>Accurate titles:</strong> Use the exact title as published. 
            Include subtitles if they add clarity.
          </li>
          <li>
            <strong>Author format:</strong> Use "Last name" or "Last name, First name" 
            consistently. For multiple authors, separate with commas.
          </li>
          <li>
            <strong>DOI for articles:</strong> Always include the DOI when available—it's 
            the most reliable way to identify academic content.
          </li>
          <li>
            <strong>Publication year:</strong> Use the year of the edition you're 
            referencing, not necessarily the original publication.
          </li>
        </ul>
      </section>
    </div>
  );
}
