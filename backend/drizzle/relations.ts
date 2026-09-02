import { relations } from "drizzle-orm/relations";
import { galleryCategories, galleryPhotos } from "./schema";

export const galleryPhotosRelations = relations(galleryPhotos, ({one}) => ({
	galleryCategory: one(galleryCategories, {
		fields: [galleryPhotos.categoryId],
		references: [galleryCategories.id]
	}),
}));

export const galleryCategoriesRelations = relations(galleryCategories, ({many}) => ({
	galleryPhotos: many(galleryPhotos),
}));