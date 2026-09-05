import { sqliteTable, AnySQLiteColumn, integer, text, foreignKey, uniqueIndex } from "drizzle-orm/sqlite-core"
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
	date: text().notNull(),
	time: text().notNull(),
	venue: text().notNull(),
	status: text().default("upcoming").notNull(),
	scoreA: integer("score_a"),
	scoreB: integer("score_b"),
	homeTeamId: integer("home_team_id").notNull().references(() => teams.id),
	awayTeamId: integer("away_team_id").notNull().references(() => teams.id),
	tournamentId: integer("tournament_id").notNull().references(() => tournaments.id),
});

export const galleryCategories = sqliteTable("gallery_categories", {
	id: text().primaryKey().notNull(),
	label: text().notNull(),
	description: text(),
	coverImage: text("cover_image"),
	photoCount: integer("photo_count").default(0).notNull(),
	createdAt: integer("created_at").notNull(),
});

export const galleryMedia = sqliteTable("gallery_media", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	description: text(),
	category: text().default("general").notNull(),
	albumId: integer("album_id"),
	mediaUrl: text("media_url").notNull(),
	fileKey: text("file_key").notNull(),
	mimeType: text("mime_type").notNull(),
	fileSize: integer("file_size").notNull(),
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

export const tournaments = sqliteTable("tournaments", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	status: text().default("UPCOMING").notNull(),
	venue: text(),
	organizer: text(),
	createdAt: integer("created_at").notNull(),
},
(table) => [
	uniqueIndex("tournaments_slug_unique").on(table.slug),
]);

export const registrations = sqliteTable("registrations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	tournamentId: integer("tournament_id").notNull().references(() => tournaments.id, { onDelete: "cascade" } ),
	teamName: text("team_name").notNull(),
	captainName: text("captain_name").notNull(),
	captainEmail: text("captain_email").notNull(),
	captainPhone: text("captain_phone").notNull(),
	playerCount: integer("player_count").notNull(),
	paymentReceiptUrl: text("payment_receipt_url"),
	status: text().default("PENDING").notNull(),
	rejectionReason: text("rejection_reason"),
	teamId: integer("team_id").references(() => teams.id, { onDelete: "set null" } ),
	createdAt: integer("created_at").notNull(),
});

export const teams = sqliteTable("teams", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	logo: text(),
	captainName: text("captain_name").notNull(),
	captainEmail: text("captain_email").notNull(),
	captainPhone: text("captain_phone").notNull(),
	createdAt: integer("created_at").notNull(),
});

export const scorers = sqliteTable("scorers", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	playerName: text("player_name").notNull(),
	teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" } ),
	tournamentId: integer("tournament_id").notNull().references(() => tournaments.id, { onDelete: "cascade" } ),
	goals: integer().default(0).notNull(),
	assists: integer().default(0).notNull(),
	rank: integer(),
	avatar: text(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const standings = sqliteTable("standings", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" } ),
	tournamentId: integer("tournament_id").notNull().references(() => tournaments.id, { onDelete: "cascade" } ),
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
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

