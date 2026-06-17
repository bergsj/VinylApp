import { s3, BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function downloadCoverToMinio(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch cover: ${res.status}`);

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpg";
  const key = `${Date.now()}.${ext}`;
  const buffer = Buffer.from(await res.arrayBuffer());

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return key;
}
