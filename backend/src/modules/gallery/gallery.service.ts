import { unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

import { GalleryRepository, galleryRepository } from "./gallery.repository";
import {
  insertGalleryMediaSchema,
  type DBInput,
  type DBReturnType,
  type ZodInput,
} from "./gallery.schema";
import { NotFoundError } from "../../utils/app-error";
import {
  deleteLocalFile,
  getUploadUrl,
  UPLOAD_SUBDIRS,
} from "../../utils/local-storage";

export class GalleryService {
  constructor(private readonly repo: GalleryRepository = galleryRepository) {}

  async getMedia(category?: string): Promise<DBReturnType[]> {
    return this.repo.getAllMedia(category);
  }

  async getMediaById(id: number): Promise<DBReturnType> {
    const result = await this.repo.getMediaById(id);
    if (!result) throw new NotFoundError(`Gallery media with ID ${id} not found`);
    return result;
  }

  /**
   * Create a gallery media record for a file already written to disk by
   * the uploadGallery multer diskStorage middleware.
   *
   * Images are post-processed with sharp (max 1920×1080, WebP quality 80).
   * The original file is replaced in-place with the WebP output when the
   * extension differs.
   */
  async createMedia(
    payload: ZodInput,
    file: Express.Multer.File,
  ): Promise<DBReturnType> {
    const validated = insertGalleryMediaSchema.parse(payload);

    let fileKey = file.filename;
    let finalMimeType = file.mimetype;
    let finalSize = file.size;

    if (file.mimetype.startsWith("image/")) {
      // Convert to WebP for consistent quality and smaller file sizes.
      const webpBuffer = await sharp(file.path)
        .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const webpFilename = file.filename.replace(/\.[^.]+$/, ".webp");
      const webpPath = join(dirname(file.path), webpFilename);

      await writeFile(webpPath, webpBuffer);

      // Remove the original only when the filename actually changed.
      if (webpPath !== file.path) {
        await unlink(file.path).catch(() => {
          // Best-effort: do not fail the request if the original is already gone.
        });
      }

      fileKey = webpFilename;
      finalMimeType = "image/webp";
      finalSize = webpBuffer.length;
    }

    const mediaUrl = getUploadUrl(UPLOAD_SUBDIRS.gallery, fileKey);

    const result = await this.repo.createMedia({
      ...(validated as DBInput),
      mediaUrl,
      fileKey,
      mimeType: finalMimeType,
      fileSize: finalSize,
    });
    if (!result) throw new Error("Failed to create gallery media");
    return result;
  }

  async updateMedia(id: number, payload: Partial<ZodInput>): Promise<DBReturnType> {
    const validated = insertGalleryMediaSchema.partial().parse(payload);
    const result = await this.repo.updateMedia(id, validated as Partial<DBInput>);
    if (!result) throw new NotFoundError(`Gallery media with ID ${id} not found`);
    return result;
  }

  async deleteMedia(id: number): Promise<DBReturnType> {
    const result = await this.repo.getMediaById(id);
    if (!result) throw new NotFoundError(`Gallery media with ID ${id} not found`);
    await deleteLocalFile(result.fileKey, UPLOAD_SUBDIRS.gallery);
    await this.repo.deleteMedia(id);
    return result;
  }
}

export const galleryService = new GalleryService();
