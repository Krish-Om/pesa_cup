import { sqliteTable, AnySQLiteColumn, integer, text, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const contactMessages = sqliteTable("contact_messages", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	subject: text().notNull(),
	message: text().notNull(),
	status: text().default("new").notNull(),
	createdAt: integer("created_at").notNull(),
});

export const fixtures = sqliteTable("fixtures", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	teamA: text("team_a").notNull(),
	teamB: text("team_b").notNull(),
	date: text().notNull(),
	time: text().notNull(),
	venue: text().notNull(),
	status: text().default("upcoming").notNull(),
	scoreA: integer("score_a"),
	scoreB: integer("score_b"),
});

export const galleryCategories = sqliteTable("gallery_categories", {
	id: text().primaryKey().notNull(),
	label: text().notNull(),
	description: text(),
	coverImage: text("cover_image"),
	photoCount: integer("photo_count").default(0).notNull(),
	createdAt: integer("created_at").notNull(),
});

export const galleryPhotos = sqliteTable("gallery_photos", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	categoryId: text("category_id").notNull().references(() => galleryCategories.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	caption: text(),
	imagePath: text("image_path").notNull(),
	sortOrder: integer("sort_order"),
	createdAt: integer("created_at").notNull(),
});

export const scorers = sqliteTable("scorers", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	team: text().notNull(),
	goals: integer().default(0).notNull(),
	assists: integer().default(0).notNull(),
	rank: integer(),
	avatar: text(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const standings = sqliteTable("standings", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	team: text().notNull(),
	group: text().notNull(),
	played: integer().default(0).notNull(),
	won: integer().default(0).notNull(),
	draw: integer().default(0).notNull(),
	lost: integer().default(0).notNull(),
	goalFor: integer("goal_for").default(0).notNull(),
	goalAgainst: integer("goal_against").default(0).notNull(),
	goalDifference: integer("goal_difference").default(0).notNull(),
	points: integer().default(0).notNull(),
	position: integer(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

