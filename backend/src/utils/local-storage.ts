import { mkdirSync } from "node:fs";
import { unlink, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import sharp from "sharp";

export const LOCAL_UPLOAD_DIRECTORY = process.env.UPLOAD_DIR || "/var/lib/pesa_cup/uploads/";

// Ensure root upload directory exists at startup
mkdirSync(LOCAL_UPLOAD_DIRECTORY, { recursive: true });

const sanitizeFileName = (originalName: string): string => {
  // Strip extension and sanitize base name
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const cleanName = basename(nameWithoutExt).replace(/[^a-zA-Z0-9_-]/g, "-");
  return cleanName || "upload";
};

export async function saveLocalFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<{ mediaUrl: string; fileKey: string; fileSize: number }> {
  mkdirSync(LOCAL_UPLOAD_DIRECTORY, { recursive: true });

  const isImage = mimeType.startsWith("image/");
  let finalBuffer = fileBuffer;
  let fileKey = "";

  if (isImage) {
    // 1. Process image: resize if larger than 1920x1080 & convert to WebP
    finalBuffer = await sharp(fileBuffer)
      .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    fileKey = `${Date.now()}_${sanitizeFileName(originalName)}.webp`;
  } else {
    // 2. Non-image files (videos, PDFs, etc.): preserve original extension
    const ext = originalName.split(".").pop() || "bin";
    fileKey = `${Date.now()}_${sanitizeFileName(originalName)}.${ext}`;
  }

  await writeFile(join(LOCAL_UPLOAD_DIRECTORY, fileKey), finalBuffer);

  return {
    fileKey,
    mediaUrl: `/uploads/${fileKey}`,
    fileSize: finalBuffer.length,
  };
}

export async function deleteLocalFile(fileKey: string): Promise<void> {
  const safeKey = basename(fileKey);
  try {
    await unlink(join(LOCAL_UPLOAD_DIRECTORY, safeKey));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}