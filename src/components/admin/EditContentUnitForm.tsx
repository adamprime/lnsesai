"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpTooltip } from "./HelpTooltip";

type ContentUnit = {
  id: string;
  title: string;
  author: string;
  source_type: string;
  publication_year: number | null;
  status: string;
  // Article-specific fields
  publication?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  doi?: string | null;
  url?: string | null;
  // Book fields
  edition?: string | null;
};

type Props = {
  contentUnit: ContentUnit;
};

export function EditContentUnitForm({ contentUnit }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core fields
  const [title, setTitle] = useState(contentUnit.title);
  const [author, setAuthor] = useState(contentUnit.author);
  const [sourceType, setSourceType] = useState(contentUnit.source_type);
  const [publicationYear, setPublicationYear] = useState(
    contentUnit.publication_year?.toString() || ""
  );
  const [status, setStatus] = useState(contentUnit.status);

  // Article-specific fields
  const [publication, setPublication] = useState(contentUnit.publication || "");
  const [volume, setVolume] = useState(contentUnit.volume || "");
  const [issue, setIssue] = useState(contentUnit.issue || "");
  const [pages, setPages] = useState(contentUnit.pages || "");
  const [doi, setDoi] = useState(contentUnit.doi || "");
  const [url, setUrl] = useState(contentUnit.url || "");

  // Book fields
  const [edition, setEdition] = useState(contentUnit.edition || "");

  const isArticle = sourceType === "article";
  const isBook = sourceType === "book";

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        title,
        author,
        source_type: sourceType,
        publication_year: publicationYear ? parseInt(publicationYear) : null,
        status,
      };

      // Add article-specific fields
      if (isArticle) {
        payload.publication = publication || null;
        payload.volume = volume || null;
        payload.issue = issue || null;
        payload.pages = pages || null;
        payload.doi = doi || null;
        payload.url = url || null;
      }

      // Add book fields
      if (isBook) {
        payload.edition = edition || null;
      }

      const response = await fetch(`/api/admin/content-units/${contentUnit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(contentUnit.title);
    setAuthor(contentUnit.author);
    setSourceType(contentUnit.source_type);
    setPublicationYear(contentUnit.publication_year?.toString() || "");
    setStatus(contentUnit.status);
    setPublication(contentUnit.publication || "");
    setVolume(contentUnit.volume || "");
    setIssue(contentUnit.issue || "");
    setPages(contentUnit.pages || "");
    setDoi(contentUnit.doi || "");
    setUrl(contentUnit.url || "");
    setEdition(contentUnit.edition || "");
    setError(null);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">
            Metadata
            <HelpTooltip href="/admin/docs/content" label="Learn about content types" />
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition text-sm"
          >
            Edit
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Title:</span>{" "}
            <span>{contentUnit.title}</span>
          </div>
          <div>
            <span className="text-gray-400">Author:</span>{" "}
            <span>{contentUnit.author}</span>
          </div>
          <div>
            <span className="text-gray-400">Type:</span>{" "}
            <span className="capitalize">{contentUnit.source_type}</span>
          </div>
          <div>
            <span className="text-gray-400">Publication Year:</span>{" "}
            <span>{contentUnit.publication_year || "Unknown"}</span>
          </div>

          {/* Article-specific display */}
          {contentUnit.source_type === "article" && (
            <>
              {contentUnit.publication && (
                <div>
                  <span className="text-gray-400">Publication:</span>{" "}
                  <span>{contentUnit.publication}</span>
                </div>
              )}
              {(contentUnit.volume || contentUnit.issue) && (
                <div>
                  <span className="text-gray-400">Vol/Issue:</span>{" "}
                  <span>
                    {contentUnit.volume && `Vol. ${contentUnit.volume}`}
                    {contentUnit.volume && contentUnit.issue && ", "}
                    {contentUnit.issue && `No. ${contentUnit.issue}`}
                  </span>
                </div>
              )}
              {contentUnit.pages && (
                <div>
                  <span className="text-gray-400">Pages:</span>{" "}
                  <span>{contentUnit.pages}</span>
                </div>
              )}
              {contentUnit.doi && (
                <div>
                  <span className="text-gray-400">DOI:</span>{" "}
                  <span className="font-mono text-xs">{contentUnit.doi}</span>
                </div>
              )}
            </>
          )}

          {/* Book-specific display */}
          {contentUnit.source_type === "book" && contentUnit.edition && (
            <div>
              <span className="text-gray-400">Edition:</span>{" "}
              <span>{contentUnit.edition}</span>
            </div>
          )}

          <div>
            <span className="text-gray-400">Status:</span>{" "}
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                contentUnit.status === "published"
                  ? "bg-green-600"
                  : "bg-gray-600"
              }`}
            >
              {contentUnit.status}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">Edit Metadata</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Type</label>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="book">Book</option>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="podcast">Podcast</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Publication Year
          </label>
          <input
            type="number"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
            placeholder="e.g., 2020"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Book-specific fields */}
        {isBook && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Edition</label>
            <input
              type="text"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              placeholder="e.g., 3rd"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* Article-specific fields */}
      {isArticle && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Article Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">
                Publication / Journal
              </label>
              <input
                type="text"
                value={publication}
                onChange={(e) => setPublication(e.target.value)}
                placeholder="e.g., Harvard Business Review"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Volume</label>
              <input
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g., 13"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Issue</label>
              <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="e.g., 3"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Pages</label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g., 277-300"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">DOI</label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="e.g., 10.4324/9781410612076"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
