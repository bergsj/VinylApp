import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // required for MinIO
});

export const BUCKET = process.env.S3_BUCKET ?? "vinyl-covers";

export function coverUrl(key: string) {
  return `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${key}`;
}

export async function getUploadUrl(key: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, cmd, { expiresIn: 300 });
}

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
