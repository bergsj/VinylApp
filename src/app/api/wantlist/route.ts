import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, artist, year, label, notes } = await req.json();
  if (!title || !artist) return NextResponse.json({ error: "title and artist required" }, { status: 400 });

  const item = await prisma.wantlist.create({
    data: { title, artist, year, label, notes, userId: session.user.id },
  });

  return NextResponse.json(item, { status: 201 });
}
