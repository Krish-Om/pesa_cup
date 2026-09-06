/**
 * Central Multer upload middleware.
 *
 * All file uploads flow through one of the typed instances exported here.
 * Each instance uses diskStorage so files land directly in the correct
 * subdirectory without an extra write step in the controller.
 *
 * Directory layout (relative to BASE_UPLOAD_DIR):
 *   receipts/  — payment receipt screenshots (admin-read-only)
 *   gallery/   — tournament photos & media   (public-read)
 *   misc/      — any other uploads           (public-read)
 */
import multer from "multer";
import { join } from "node:path";
import { BASE_UPLOAD_DIR, UPLOAD_SUBDIRS } from "../utils/local-storage";

/**
 * Build a disk-storage filename in the format:
 *   <fieldname>-<timestamp>-<random>.<original-ext>
 *
 * Using the field name as a prefix makes files easy to identify by type
 * (e.g. `receipt-1725518232-483920183.jpg`).
 */
const makeFilename = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (err: Error | null, name: string) => void,
): void => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = file.originalname.split(".").pop() ?? "bin";
  cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
};

// ── Receipt uploads ─────────────────────────────────────────────────────────
// Accepted: PNG, JPEG, WebP — max 5 MB
// Destination: uploads/receipts/
export const uploadReceipt = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) =>
      cb(null, join(BASE_UPLOAD_DIR, UPLOAD_SUBDIRS.receipts)),
    filename: makeFilename,
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PNG, JPEG, and WebP images are accepted for receipts"));
  },
});

// ── Gallery uploads ─────────────────────────────────────────────────────────
// Accepted: common image formats + MP4/WebM — max 20 MB
// Destination: uploads/gallery/
// Note: the gallery service post-processes images to WebP via sharp.
export const uploadGallery = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) =>
      cb(null, join(BASE_UPLOAD_DIR, UPLOAD_SUBDIRS.gallery)),
    filename: makeFilename,
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type for gallery"));
  },
});

