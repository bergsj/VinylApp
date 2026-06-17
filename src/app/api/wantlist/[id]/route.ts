import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.wantlist.findFirst({ where: { id, userId: session.user.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.wantlist.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
