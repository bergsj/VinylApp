"use client";

import { useState } from "react";
import { LayoutGrid, GalleryHorizontal } from "lucide-react";
import CollectionGrid from "./CollectionGrid";
import CollectionCarousel from "./CollectionCarousel";

interface Record {
  id: string;
  title: string;
  artist: string;
  year?: number | null;
  coverImage?: string | null;
  rating?: number | null;
}

export default function CollectionView({ records }: { records: Record[] }) {
  const [view, setView] = useState<"grid" | "carousel">("grid");

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex gap-1 bg-zinc-900 rounded-lg p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("carousel")}
            className={`p-2 rounded-md transition-colors ${view === "carousel" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            aria-label="Carousel view"
          >
            <GalleryHorizontal size={16} />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <CollectionGrid records={records} />
      ) : (
        <CollectionCarousel records={records} />
      )}
    </>
  );
}
