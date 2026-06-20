"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Disc3 } from "lucide-react";
import { coverUrl } from "@/lib/s3";

interface Record {
  id: string;
  title: string;
  artist: string;
  year?: number | null;
  coverImage?: string | null;
}

export default function CollectionCarousel({ records }: { records: Record[] }) {
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive((i) => (i - 1 + records.length) % records.length), [records.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % records.length), [records.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (records.length === 0) return null;

  const getRecord = (offset: number) =>
    records[(active + offset + records.length) % records.length];

  const slots = [
    { offset: -2, scale: "scale-[0.55]", opacity: "opacity-20", z: "z-0", translate: "-translate-x-[210%]" },
    { offset: -1, scale: "scale-[0.75]", opacity: "opacity-50", z: "z-10", translate: "-translate-x-[115%]" },
    { offset:  0, scale: "scale-100",    opacity: "opacity-100", z: "z-20", translate: "translate-x-0" },
    { offset:  1, scale: "scale-[0.75]", opacity: "opacity-50", z: "z-10", translate: "translate-x-[115%]" },
    { offset:  2, scale: "scale-[0.55]", opacity: "opacity-20", z: "z-0", translate: "translate-x-[210%]" },
  ];

  const current = getRecord(0);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Carousel track */}
      <div className="relative w-full flex items-center justify-center" style={{ height: "340px" }}>
        {slots.map(({ offset, scale, opacity, z, translate }) => {
          const record = getRecord(offset);
          const isActive = offset === 0;
          return (
            <div
              key={offset}
              className={`absolute transition-all duration-300 ease-in-out ${scale} ${opacity} ${z} ${translate}`}
              style={{ width: 260, height: 260 }}
            >
              {isActive ? (
                <Link href={`/record/${record.id}`}>
                  <AlbumCover record={record} />
                </Link>
              ) : (
                <button
                  onClick={() => setActive((active + offset + records.length) % records.length)}
                  className="w-full h-full"
                >
                  <AlbumCover record={record} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-4 text-center min-h-[56px]">
        <p className="text-lg font-semibold leading-tight">{current.title}</p>
        <p className="text-zinc-400 text-sm">{current.artist}</p>
        {current.year && <p className="text-zinc-500 text-xs mt-0.5">{current.year}</p>}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-4">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-zinc-500 text-sm tabular-nums">
          {active + 1} / {records.length}
        </span>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot strip */}
      <div className="flex gap-1 mt-4 flex-wrap justify-center max-w-xs">
        {records.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === active ? "bg-amber-400" : "bg-zinc-700 hover:bg-zinc-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function AlbumCover({ record }: { record: { title: string; coverImage?: string | null } }) {
  return (
    <div className="w-full h-full bg-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
      {record.coverImage ? (
        <Image
          src={coverUrl(record.coverImage)}
          alt={record.title}
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Disc3 size={56} className="text-zinc-600" />
        </div>
      )}
    </div>
  );
}
