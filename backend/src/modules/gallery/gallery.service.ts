import { ZodError } from "zod";
import { GalleryRepository, galleryRepository } from "./gallery.repository";
import {
  insertGalleryMediaSchema,
  type DBInput,
  type DBReturnType,
  type ZodInput,
} from "./gallery.schema";
import { NotFoundError } from "../../utils/app-error";
import {
  deleteFromS3Placeholder,
  uploadToS3Placeholder,
} from "../../utils/s3-storage";

export class GalleryService {
  constructor(private readonly repo: GalleryRepository = galleryRepository) {}

  async getMedia(): Promise<DBReturnType[]> {
    return this.repo.getAllMedia();
  }

  async getMediaById(id: number): Promise<DBReturnType> {
    const result = await this.repo.getMediaById(id);
    if (!result)
      throw new NotFoundError(`Gallery media with ID ${id} not found`);
    return result;
  }

  async createMedia(
    payload: ZodInput,
    file?: { buffer: Buffer; originalname: string },
  ): Promise<DBReturnType> {
    const validated = insertGalleryMediaSchema.parse(payload);
    const stored = file
      ? await uploadToS3Placeholder(file.buffer, file.originalname)
      : { mediaUrl: validated.mediaUrl, fileKey: validated.fileKey };

    if (!stored.mediaUrl || !stored.fileKey) {
      throw new ZodError([
        {
          code: "custom",
          path: ["mediaUrl"],
          message: "Media URL is required when no file is uploaded",
        },
      ]);
    }

    const result = await this.repo.createMedia({
      ...(validated as DBInput),
      mediaUrl: stored.mediaUrl,
      fileKey: stored.fileKey,
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
    await deleteFromS3Placeholder(result.fileKey);
    await this.repo.deleteMedia(id);
    return result;
  }
}

export const galleryService = new GalleryService();
export default galleryService;
