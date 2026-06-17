"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Disc3, Trash2 } from "lucide-react";
import { coverUrl } from "@/lib/s3";

interface Record {
  id: string;
  title: string;
  artist: string;
  year?: number | null;
  coverImage?: string | null;
}

interface CollectionGridProps {
  records: Record[];
}

export default function CollectionGrid({ records }: CollectionGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === records.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map((r) => r.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} record(s)? This cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/records/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error("Failed to delete records");

      window.location.reload();
    } catch (error) {
      alert("Error deleting records");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {selectedIds.size > 0 && (
        <div className="mb-6 p-4 bg-amber-900/20 border border-amber-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.size === records.length}
              onChange={toggleSelectAll}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">
              {selectedIds.size} of {records.length} selected
            </span>
          </div>
          <button
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {records.map((record) => (
          <div key={record.id} className="relative group">
            <input
              type="checkbox"
              checked={selectedIds.has(record.id)}
              onChange={() => toggleSelect(record.id)}
              className="absolute top-2 left-2 w-4 h-4 z-10 cursor-pointer"
            />
            <Link href={`/record/${record.id}`} className="block">
              <div className={`aspect-square bg-zinc-800 rounded-lg overflow-hidden mb-2 relative ${
                selectedIds.has(record.id) ? "ring-2 ring-amber-400" : ""
              }`}>
                {record.coverImage ? (
                  <Image
                    src={coverUrl(record.coverImage)}
                    alt={record.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Disc3 size={40} className="text-zinc-600" />
                  </div>
                )}
              </div>
              <p className="text-sm font-medium leading-tight truncate">{record.title}</p>
              <p className="text-xs text-zinc-400 truncate">{record.artist}</p>
              {record.year && <p className="text-xs text-zinc-500">{record.year}</p>}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
