import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const tournaments = sqliteTable(
  "tournaments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    status: text("status", { enum: ["UPCOMING", "ONGOING", "COMPLETED"] })
      .notNull()
      .default("UPCOMING"),
    venue: text("venue"),
    organizer: text("organizer"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("tournaments_slug_unique").on(table.slug)],
);

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logo: text("logo"),
  captainName: text("captain_name").notNull(),
  captainEmail: text("captain_email").notNull(),
  captainPhone: text("captain_phone").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const registrations = sqliteTable("registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tournamentId: integer("tournament_id")
    .notNull()
    .references(() => tournaments.id, { onDelete: "cascade" }),
  teamName: text("team_name").notNull(),
  captainName: text("captain_name").notNull(),
  captainEmail: text("captain_email").notNull(),
  captainPhone: text("captain_phone").notNull(),
  playerCount: integer("player_count").notNull(),
  paymentReceiptUrl: text("payment_receipt_url"),
  status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] })
    .notNull()
    .default("PENDING"),
  rejectionReason: text("rejection_reason"),
  teamId: integer("team_id").references(() => teams.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const fixtures = sqliteTable("fixtures", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  homeTeamId: integer("home_team_id")
    .notNull()
    .references(() => teams.id),
  awayTeamId: integer("away_team_id")
    .notNull()
    .references(() => teams.id),
  tournamentId: integer("tournament_id")
    .notNull()
    .references(() => tournaments.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  time: text("time").notNull(),
  venue: text("venue").notNull(),
  status: text("status", { enum: ["upcoming", "finished", "live"] })
    .notNull()
    .default("upcoming"),
  scoreA: integer("score_a"),
  scoreB: integer("score_b"),
});

export const standings = sqliteTable("standings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  tournamentId: integer("tournament_id")
    .notNull()
    .references(() => tournaments.id, { onDelete: "cascade" }),
  group: text("group").notNull(),
  played: integer("played").notNull().default(0),
  won: integer("won").notNull().default(0),
  draw: integer("draw").notNull().default(0),
  lost: integer("lost").notNull().default(0),
  goalFor: integer("goal_for").notNull().default(0),
  goalAgainst: integer("goal_against").notNull().default(0),
  goalDifference: integer("goal_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  position: integer("position"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const scorers = sqliteTable("scorers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playerName: text("player_name").notNull(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  tournamentId: integer("tournament_id")
    .notNull()
    .references(() => tournaments.id, { onDelete: "cascade" }),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  rank: integer("rank"),
  avatar: text("avatar"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const galleryCategories = sqliteTable("gallery_categories", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  photoCount: integer("photo_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const galleryMedia = sqliteTable("gallery_media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("general"),
  albumId: integer("album_id"),
  mediaUrl: text("media_url").notNull(),
  fileKey: text("file_key").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const galleryPhotos = sqliteTable("gallery_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: text("category_id")
    .notNull()
    .references(() => galleryCategories.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  caption: text("caption"),
  imagePath: text("image_path").notNull(),
  sortOrder: integer("sort_order"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "read", "archived"] })
    .notNull()
    .default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
