import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { coverUrl } from "@/lib/s3";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Edit, Disc3 } from "lucide-react";
import DeleteRecordButton from "./DeleteRecordButton";

export default async function RecordPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const record = await prisma.record.findFirst({
    where: { id, userId: session!.user!.id },
    include: { tracks: { orderBy: { position: "asc" } } },
  });

  if (!record) notFound();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/collection" className="text-zinc-400 hover:text-zinc-100">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold">{record.artist}</h1>
      </div>

      <div className="flex gap-6 flex-col sm:flex-row">
        {/* Cover */}
        <div className="w-full sm:w-64 shrink-0">
          <div className="aspect-square bg-zinc-800 rounded-xl overflow-hidden relative">
            {record.coverImage ? (
              <Image src={coverUrl(record.coverImage)} alt={record.title} fill unoptimized className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Disc3 size={64} className="text-zinc-600" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold mb-1">{record.title}</h2>
          <p className="text-zinc-400 text-lg mb-4">{record.artist}</p>

          {record.rating && (
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < record.rating! ? "fill-amber-400 text-amber-400" : "text-zinc-600"}
                />
              ))}
            </div>
          )}

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
            {record.year && <><dt className="text-zinc-500">Year</dt><dd>{record.year}</dd></>}
            {record.label && <><dt className="text-zinc-500">Label</dt><dd>{record.label}</dd></>}
            {record.catalogNumber && <><dt className="text-zinc-500">Cat. No.</dt><dd className="font-mono text-xs">{record.catalogNumber}</dd></>}
            {record.format && <><dt className="text-zinc-500">Format</dt><dd>{record.format}</dd></>}
            {record.country && <><dt className="text-zinc-500">Country</dt><dd>{record.country}</dd></>}
            {record.mediaCondition && <><dt className="text-zinc-500">Media</dt><dd>{record.mediaCondition}</dd></>}
            {record.sleeveCondition && <><dt className="text-zinc-500">Sleeve</dt><dd>{record.sleeveCondition}</dd></>}
            {record.purchasePrice && <><dt className="text-zinc-500">Paid</dt><dd>€{record.purchasePrice.toFixed(2)}</dd></>}
          </dl>

          {record.genre.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {[...record.genre, ...record.style].map((tag) => (
                <span key={tag} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {record.notes && <p className="text-sm text-zinc-400 mb-6">{record.notes}</p>}

          <div className="flex gap-3">
            <Link
              href={`/record/${record.id}/edit`}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Edit size={14} />
              Edit
            </Link>
            <DeleteRecordButton id={record.id} />
          </div>
        </div>
      </div>

      {/* Tracklist */}
      {record.tracks.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-3 text-zinc-300">Tracklist</h3>
          <div className="bg-zinc-900 rounded-lg divide-y divide-zinc-800">
            {record.tracks.map((track) => (
              <div key={track.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="text-zinc-500 w-8 text-right shrink-0">{track.position}</span>
                <span className="flex-1">{track.title}</span>
                {track.duration && <span className="text-zinc-500 text-xs">{track.duration}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
