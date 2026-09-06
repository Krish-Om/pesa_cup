import { mkdirSync } from "node:fs";
import { unlink, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import sharp from "sharp";

/** Absolute path to the root upload directory. */
export const BASE_UPLOAD_DIR =
  process.env.UPLOAD_DIR?.replace(/\/$/, "") ?? join(process.cwd(), "uploads");

/** Named upload subdirectories. */
export const UPLOAD_SUBDIRS = {
  receipts: "receipts",
  gallery: "gallery",
  misc: "misc",
} as const;

export type UploadSubdir = (typeof UPLOAD_SUBDIRS)[keyof typeof UPLOAD_SUBDIRS];

// Keep the old export alias so any code still referencing it compiles without changes.
export const LOCAL_UPLOAD_DIRECTORY = BASE_UPLOAD_DIR;

/** Absolute path to a given upload subdirectory. */
export const getSubdirPath = (subdir: UploadSubdir): string =>
  join(BASE_UPLOAD_DIR, subdir);

/** Relative public URL for a stored file, e.g. /uploads/gallery/file.webp */
export const getUploadUrl = (subdir: UploadSubdir, filename: string): string =>
  `/uploads/${subdir}/${filename}`;

// Ensure all subdirectories exist at startup.
for (const subdir of Object.values(UPLOAD_SUBDIRS)) {
  mkdirSync(join(BASE_UPLOAD_DIR, subdir), { recursive: true });
}

const sanitizeFileName = (originalName: string): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const cleanName = basename(nameWithoutExt).replace(/[^a-zA-Z0-9_-]/g, "-");
  return cleanName || "upload";
};

/**
 * Save a raw file buffer to the given upload subdirectory.
 * Images are converted to WebP (max 1920×1080, quality 80).
 * Used by modules that receive file buffers (e.g. memory-storage multer).
 */
export async function saveLocalFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  subdir: UploadSubdir = "misc",
): Promise<{ mediaUrl: string; fileKey: string; fileSize: number }> {
  const dir = getSubdirPath(subdir);
  mkdirSync(dir, { recursive: true });

  const isImage = mimeType.startsWith("image/");
  let finalBuffer = fileBuffer;
  let fileKey: string;

  if (isImage) {
    finalBuffer = await sharp(fileBuffer)
      .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    fileKey = `${Date.now()}_${sanitizeFileName(originalName)}.webp`;
  } else {
    const ext = originalName.split(".").pop() ?? "bin";
    fileKey = `${Date.now()}_${sanitizeFileName(originalName)}.${ext}`;
  }

  await writeFile(join(dir, fileKey), finalBuffer);

  return {
    fileKey,
    mediaUrl: getUploadUrl(subdir, fileKey),
    fileSize: finalBuffer.length,
  };
}

/**
 * Delete a stored file by filename and subdirectory.
 * Silently ignores missing files (ENOENT).
 */
export async function deleteLocalFile(
  fileKey: string,
  subdir: UploadSubdir = "misc",
): Promise<void> {
  const safeKey = basename(fileKey);
  try {
    await unlink(join(getSubdirPath(subdir), safeKey));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
