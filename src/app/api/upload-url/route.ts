import { auth } from "@/lib/auth";
import { getUploadUrl } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const type = searchParams.get("type");

  if (!key || !type) return NextResponse.json({ error: "Missing params" }, { status: 400 });
  if (!type.startsWith("image/")) return NextResponse.json({ error: "Only images allowed" }, { status: 400 });

  const url = await getUploadUrl(key, type);
  return NextResponse.json({ url });
}
