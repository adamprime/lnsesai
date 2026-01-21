"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpTooltip } from "./HelpTooltip";

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type ContentUnitTag = {
  weight: number;
  tag_id: string;
  tags: Tag;
};

type Props = {
  contentUnitId: string;
  assignedTags: ContentUnitTag[];
  allTags: Tag[];
};

export function ManageTagsSection({
  contentUnitId,
  assignedTags,
  allTags,
}: Props) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [selectedWeight, setSelectedWeight] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignedTagIds = new Set(assignedTags.map((t) => t.tag_id));
  const availableTags = allTags.filter((t) => !assignedTagIds.has(t.id));

  const handleAddTag = async () => {
    if (!selectedTagId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/content-units/${contentUnitId}/tags`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag_id: selectedTagId, weight: selectedWeight }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add tag");
      }

      setIsAdding(false);
      setSelectedTagId("");
      setSelectedWeight(1);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    if (!confirm("Remove this tag?")) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/content-units/${contentUnitId}/tags?tag_id=${tagId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove tag");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWeight = async (tagId: string, newWeight: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/content-units/${contentUnitId}/tags`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag_id: tagId, weight: newWeight }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update weight");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Tags ({assignedTags.length})
          <HelpTooltip href="/admin/docs/tags#weight-system" label="Learn about tag weights" />
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition text-sm"
          >
            + Add Tag
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Tag</label>
              <select
                value={selectedTagId}
                onChange={(e) => setSelectedTagId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a tag...</option>
                {availableTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Weight</label>
              <select
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(Number(e.target.value))}
                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:border-blue-500"
              >
                <option value={1}>1 - Low</option>
                <option value={2}>2 - Medium</option>
                <option value={3}>3 - High</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddTag}
                disabled={!selectedTagId || isLoading}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setSelectedTagId("");
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {assignedTags.map((t) => (
          <div
            key={t.tag_id}
            className={`px-3 py-2 rounded flex items-center gap-3 ${
              t.weight === 3
                ? "bg-yellow-600 text-yellow-100"
                : t.weight === 2
                  ? "bg-blue-600 text-blue-100"
                  : "bg-gray-600 text-gray-200"
            }`}
          >
            <span className="font-medium">{t.tags.name}</span>
            <select
              value={t.weight}
              onChange={(e) => handleUpdateWeight(t.tag_id, Number(e.target.value))}
              disabled={isLoading}
              className="bg-transparent border border-current/30 rounded px-1 py-0.5 text-sm focus:outline-none"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
            <button
              onClick={() => handleRemoveTag(t.tag_id)}
              disabled={isLoading}
              className="hover:text-red-300 transition"
              title="Remove tag"
            >
              ×
            </button>
          </div>
        ))}
        {assignedTags.length === 0 && !isAdding && (
          <span className="text-gray-500">No tags assigned</span>
        )}
      </div>
    </div>
  );
}
