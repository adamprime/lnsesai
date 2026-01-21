"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";

type ContentComponent = {
  id: string;
  component_type: string;
  title: string | null;
  content: string;
  explanation: string | null;
  examples: string | null;
  display_order: number;
  token_count: number | null;
};

type Props = {
  component: ContentComponent;
};

export function EditComponentCard({ component }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(component.title || "");
  const [content, setContent] = useState(component.content);
  const [explanation, setExplanation] = useState(component.explanation || "");
  const [examples, setExamples] = useState(component.examples || "");

  const isTheme = component.component_type === "theme";

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updates: Record<string, string> = { content };
      if (title) updates.title = title;
      if (isTheme) {
        updates.explanation = explanation;
        updates.examples = examples;
      }

      const response = await fetch(`/api/admin/components/${component.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
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
    setTitle(component.title || "");
    setContent(component.content);
    setExplanation(component.explanation || "");
    setExamples(component.examples || "");
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              component.component_type === "summary"
                ? "bg-purple-600"
                : component.component_type === "theme"
                  ? "bg-blue-600"
                  : "bg-gray-600"
            }`}
          >
            {component.component_type}
          </span>
          <span className="font-medium">
            {component.title || `${component.component_type} #${component.display_order}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {component.token_count && (
            <span className="text-gray-500 text-sm">
              {component.token_count} tokens
            </span>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              placeholder={`${component.component_type} title`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
            />
          </div>

          {isTheme && (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Explanation
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Examples
                </label>
                <textarea
                  value={examples}
                  onChange={(e) => setExamples(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
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
      ) : (
        /* View Mode - Render markdown */
        <div>
          <div
            className={`${isExpanded ? "" : "max-h-60 overflow-hidden"}`}
          >
            <MarkdownContent content={component.content} />
          </div>
          {component.content.length > 500 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 text-sm mt-2 hover:underline"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
          {component.explanation && (
            <div className="mt-3 text-sm border-t border-gray-700 pt-3">
              <span className="text-gray-400 font-medium">Explanation: </span>
              <MarkdownContent content={component.explanation} className="inline" />
            </div>
          )}
          {component.examples && (
            <div className="mt-2 text-sm">
              <span className="text-gray-400 font-medium">Examples: </span>
              <MarkdownContent content={component.examples} className="inline" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
