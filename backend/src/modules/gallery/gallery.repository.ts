import { eq } from "drizzle-orm";
import { dbSession } from "../../config/database";
import {
  galleryMedia,
  type DBInput,
  type DBReturnType,
} from "./gallery.schema";

export class GalleryRepository {
  async getAllMedia(category?: string): Promise<DBReturnType[]> {
    const query = dbSession.select().from(galleryMedia);
    if (category) return query.where(eq(galleryMedia.category, category)).all();
    return query.all();
  }
  async getMediaById(id: number): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .select()
      .from(galleryMedia)
      .where(eq(galleryMedia.id, id));
    return result ?? null;
  }
  async createMedia(data: DBInput): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .insert(galleryMedia)
      .values(data)
      .returning();
    return result ?? null;
  }
  async updateMedia(
    id: number,
    data: Partial<DBInput>,
  ): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .update(galleryMedia)
      .set(data)
      .where(eq(galleryMedia.id, id))
      .returning();
    return result ?? null;
  }
  async deleteMedia(id: number): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .delete(galleryMedia)
      .where(eq(galleryMedia.id, id))
      .returning();
    return result ?? null;
  }
}
export const galleryRepository = new GalleryRepository();
