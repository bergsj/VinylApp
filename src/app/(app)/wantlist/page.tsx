import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Heart, PlusCircle, Trash2 } from "lucide-react";
import WantlistActions from "./WantlistActions";

export const dynamic = "force-dynamic";

export default async function WantlistPage() {
  const session = await auth();

  const items = await prisma.wantlist.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Wantlist</h1>
          <p className="text-zinc-400 text-sm">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/wantlist/add"
          className="flex items-center gap-2 bg-amber-400 text-zinc-950 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-300 transition-colors"
        >
          <PlusCircle size={16} />
          Add
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <Heart size={48} className="mx-auto mb-4 opacity-30" />
          <p>Nothing on your wantlist yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-zinc-900 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-sm text-zinc-400 truncate">{item.artist}{item.year ? ` · ${item.year}` : ""}{item.label ? ` · ${item.label}` : ""}</p>
                {item.notes && <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.notes}</p>}
              </div>
              <WantlistActions id={item.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
