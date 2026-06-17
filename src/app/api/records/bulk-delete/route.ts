import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteObject } from "@/lib/s3";

const schema = z.object({
  ids: z.array(z.string().min(1)),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { ids } = parsed.data;

  // Verify all records belong to user
  const records = await prisma.record.findMany({
    where: {
      id: { in: ids },
      userId: session.user.id,
    },
    select: { id: true, coverImage: true },
  });

  if (records.length !== ids.length) {
    return NextResponse.json({ error: "Some records not found or unauthorized" }, { status: 403 });
  }

  // Delete cover images from S3
  for (const record of records) {
    if (record.coverImage) {
      try {
        await deleteObject(record.coverImage);
      } catch (error) {
        console.error(`Failed to delete cover image: ${record.coverImage}`, error);
      }
    }
  }

  // Delete records from database
  await prisma.record.deleteMany({
    where: {
      id: { in: ids },
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true, deleted: ids.length });
}
