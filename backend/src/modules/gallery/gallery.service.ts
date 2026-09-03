import { GalleryRepository, galleryRepository } from "./gallery.repository";
import {
  insertGalleryMediaSchema,
  type DBInput,
  type DBReturnType,
  type ZodInput,
} from "./gallery.schema";
import { NotFoundError } from "../../utils/app-error";
import { deleteLocalFile, saveLocalFile } from "../../utils/local-storage";

export class GalleryService {
  constructor(private readonly repo: GalleryRepository = galleryRepository) {}

  async getMedia(category?: string): Promise<DBReturnType[]> {
    return this.repo.getAllMedia(category);
  }

  async getMediaById(id: number): Promise<DBReturnType> {
    const result = await this.repo.getMediaById(id);
    if (!result)
      throw new NotFoundError(`Gallery media with ID ${id} not found`);
    return result;
  }

  async createMedia(
    payload: ZodInput,
    file: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    },
  ): Promise<DBReturnType> {
    const validated = insertGalleryMediaSchema.parse(payload);
    const stored = await saveLocalFile(file.buffer, file.originalname,file.mimetype);

    const result = await this.repo.createMedia({
      ...(validated as DBInput),
      mediaUrl: stored.mediaUrl,
      fileKey: stored.fileKey,
      mimeType: file.mimetype,
      fileSize: file.size,
    });
    if (!result) throw new Error("Failed to create gallery media");
    return result;
  }

  async updateMedia(
    id: number,
    payload: Partial<ZodInput>,
  ): Promise<DBReturnType> {
    const validated = insertGalleryMediaSchema.partial().parse(payload);
    const result = await this.repo.updateMedia(
      id,
      validated as Partial<DBInput>,
    );
    if (!result)
      throw new NotFoundError(`Gallery media with ID ${id} not found`);
    return result;
  }

  async deleteMedia(id: number): Promise<DBReturnType> {
    const result = await this.repo.getMediaById(id);
    if (!result)
      throw new NotFoundError(`Gallery media with ID ${id} not found`);
    await deleteLocalFile(result.fileKey);
    await this.repo.deleteMedia(id);
    return result;
  }
}

export const galleryService = new GalleryService();
