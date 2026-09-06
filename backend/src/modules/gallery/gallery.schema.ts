// - GalleryCategory: id, label, description, cover image, photo count
// - GalleryPhoto: category id, caption, image path, sort order
// - ContactMessage: name, email, subject, message, createdAt, status

import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  galleryCategories,
  galleryMedia,
  galleryPhotos,
} from "../../db/schema";

export { galleryCategories, galleryMedia, galleryPhotos };

export const insertGalleryMediaSchema = createInsertSchema(galleryMedia, {
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required").trim().default("general"),
  albumId: z.number().int().positive().nullable().optional(),
  mediaUrl: z.string().url("Media URL must be valid").optional(),
  fileKey: z.string().min(1, "File key is required").optional(),
  mimeType: z.string().min(1, "MIME type is required").optional(),
  fileSize: z.number().int().nonnegative().optional(),
});

export const selectGalleryMediaSchema = createSelectSchema(galleryMedia);

export const insertGalleryCategorySchema = createInsertSchema(
  galleryCategories,
  {
    id: z.string().min(1, "Category ID is required"),
    label: z.string().min(1, "Category label is required"),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    photoCount: z.number().int().nonnegative().default(0),
  },
);

export const selectGalleryCategorySchema =
  createSelectSchema(galleryCategories);

export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotos, {
  categoryId: z.string().min(1, "Category ID is required"),
  caption: z.string().optional(),
  imagePath: z.string().min(1, "Image path is required"),
  sortOrder: z.number().int().optional(),
});

export const selectGalleryPhotoSchema = createSelectSchema(galleryPhotos);

// 4. Typescript Types

export type GalleryCategory = z.infer<typeof selectGalleryCategorySchema>;
export type InsertGalleryCategoryPayload = z.infer<
  typeof insertGalleryCategorySchema
>;

export type GalleryPhoto = z.infer<typeof selectGalleryPhotoSchema>;
export type InsertGalleryPhotoPayload = z.infer<
  typeof insertGalleryPhotoSchema
>;

export type ZodInput = z.infer<typeof insertGalleryMediaSchema>;
export type ZodReturnType = z.infer<typeof selectGalleryMediaSchema>;
export type DBInput = typeof galleryMedia.$inferInsert;
export type DBReturnType = typeof galleryMedia.$inferSelect;

export type GalleryMedia = DBReturnType;
