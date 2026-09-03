import { relations } from "drizzle-orm/relations";
import { galleryCategories, galleryPhotos, tournaments, scorers } from "./schema";

export const galleryPhotosRelations = relations(galleryPhotos, ({one}) => ({
	galleryCategory: one(galleryCategories, {
		fields: [galleryPhotos.categoryId],
		references: [galleryCategories.id]
	}),
}));

export const galleryCategoriesRelations = relations(galleryCategories, ({many}) => ({
	galleryPhotos: many(galleryPhotos),
}));

export const scorersRelations = relations(scorers, ({one}) => ({
	tournament: one(tournaments, {
		fields: [scorers.tournamentId],
		references: [tournaments.id]
	}),
}));

export const tournamentsRelations = relations(tournaments, ({many}) => ({
	scorers: many(scorers),
}));