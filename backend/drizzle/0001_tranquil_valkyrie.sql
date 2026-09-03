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
	FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE set null
);
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
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_scorers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_name` text NOT NULL,
	`team_id` integer NOT NULL,
	`tournament_id` integer NOT NULL,
	`goals` integer DEFAULT 0 NOT NULL,
	`assists` integer DEFAULT 0 NOT NULL,
	`rank` integer,
	`avatar` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_scorers`("id", "player_name", "team_id", "tournament_id", "goals", "assists", "rank", "avatar", "created_at") SELECT "id", "player_name", "team_id", "tournament_id", "goals", "assists", "rank", "avatar", "created_at" FROM `scorers`;--> statement-breakpoint
DROP TABLE `scorers`;--> statement-breakpoint
ALTER TABLE `__new_scorers` RENAME TO `scorers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_standings` (
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
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_standings`("id", "team_id", "tournament_id", "group", "played", "won", "draw", "lost", "goal_for", "goal_against", "goal_difference", "points", "position", "created_at") SELECT "id", "team_id", "tournament_id", "group", "played", "won", "draw", "lost", "goal_for", "goal_against", "goal_difference", "points", "position", "created_at" FROM `standings`;--> statement-breakpoint
DROP TABLE `standings`;--> statement-breakpoint
ALTER TABLE `__new_standings` RENAME TO `standings`;--> statement-breakpoint
ALTER TABLE `fixtures` ADD `home_team_id` integer NOT NULL REFERENCES teams(id);--> statement-breakpoint
ALTER TABLE `fixtures` ADD `away_team_id` integer NOT NULL REFERENCES teams(id);--> statement-breakpoint
ALTER TABLE `fixtures` ADD `tournament_id` integer NOT NULL REFERENCES tournaments(id);--> statement-breakpoint
ALTER TABLE `fixtures` DROP COLUMN `team_a`;--> statement-breakpoint
ALTER TABLE `fixtures` DROP COLUMN `team_b`;