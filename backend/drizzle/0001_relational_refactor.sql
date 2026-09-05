PRAGMA foreign_keys=OFF;
--> statement-breakpoint
DROP TABLE IF EXISTS `gallery_photos`;
--> statement-breakpoint
DROP TABLE IF EXISTS `gallery_media`;
--> statement-breakpoint
DROP TABLE IF EXISTS `gallery_categories`;
--> statement-breakpoint
DROP TABLE IF EXISTS `registrations`;
--> statement-breakpoint
DROP TABLE IF EXISTS `scorers`;
--> statement-breakpoint
DROP TABLE IF EXISTS `standings`;
--> statement-breakpoint
DROP TABLE IF EXISTS `fixtures`;
--> statement-breakpoint
DROP TABLE IF EXISTS `teams`;
--> statement-breakpoint
DROP TABLE IF EXISTS `contact_messages`;
--> statement-breakpoint
DROP TABLE IF EXISTS `tournaments`;
--> statement-breakpoint
CREATE TABLE `tournaments` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `start_date` text NOT NULL,
  `end_date` text NOT NULL,
  `status` text DEFAULT 'UPCOMING' NOT NULL,
  `venue` text,
  `organizer` text,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tournaments_slug_unique` ON `tournaments` (`slug`);
--> statement-breakpoint
CREATE TABLE `teams` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `logo` text,
  `captain_name` text NOT NULL,
  `captain_email` text NOT NULL,
  `captain_phone` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `registrations` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `tournament_id` integer NOT NULL,
  `team_name` text NOT NULL,
  `captain_name` text NOT NULL,
  `captain_email` text NOT NULL,
  `captain_phone` text NOT NULL,
  `player_count` integer NOT NULL,
  `payment_receipt_url` text,
  `status` text DEFAULT 'PENDING' NOT NULL,
  `rejection_reason` text,
  `team_id` integer,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE cascade,
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `fixtures` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `home_team_id` integer NOT NULL,
  `away_team_id` integer NOT NULL,
  `tournament_id` integer NOT NULL,
  `date` text NOT NULL,
  `time` text NOT NULL,
  `venue` text NOT NULL,
  `status` text DEFAULT 'upcoming' NOT NULL,
  `score_a` integer,
  `score_b` integer,
  FOREIGN KEY (`home_team_id`) REFERENCES `teams`(`id`),
  FOREIGN KEY (`away_team_id`) REFERENCES `teams`(`id`),
  FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `standings` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `team_id` integer NOT NULL,
  `tournament_id` integer NOT NULL,
  `group` text NOT NULL,
  `played` integer DEFAULT 0 NOT NULL,
  `won` integer DEFAULT 0 NOT NULL,
  `draw` integer DEFAULT 0 NOT NULL,
  `lost` integer DEFAULT 0 NOT NULL,
  `goal_for` integer DEFAULT 0 NOT NULL,
  `goal_against` integer DEFAULT 0 NOT NULL,
  `goal_difference` integer DEFAULT 0 NOT NULL,
  `points` integer DEFAULT 0 NOT NULL,
  `position` integer,
  `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE cascade,
  FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `scorers` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `player_name` text NOT NULL,
  `team_id` integer NOT NULL,
  `tournament_id` integer NOT NULL,
  `goals` integer DEFAULT 0 NOT NULL,
  `assists` integer DEFAULT 0 NOT NULL,
  `rank` integer,
  `avatar` text,
  `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE cascade,
  FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `gallery_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `label` text NOT NULL,
  `description` text,
  `cover_image` text,
  `photo_count` integer DEFAULT 0 NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery_media` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `category` text DEFAULT 'general' NOT NULL,
  `album_id` integer,
  `media_url` text NOT NULL,
  `file_key` text NOT NULL,
  `mime_type` text NOT NULL,
  `file_size` integer NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery_photos` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `category_id` text NOT NULL,
  `caption` text,
  `image_path` text NOT NULL,
  `sort_order` integer,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `gallery_categories`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `subject` text NOT NULL,
  `message` text NOT NULL,
  `status` text DEFAULT 'new' NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=ON;