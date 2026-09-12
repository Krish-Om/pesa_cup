PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_standings`("id", "team_id", "tournament_id", "group", "played", "won", "draw", "lost", "goal_for", "goal_against", "goal_difference", "points", "created_at") SELECT "id", "team_id", "tournament_id", "group", "played", "won", "draw", "lost", "goal_for", "goal_against", "goal_difference", "points", "created_at" FROM `standings`;--> statement-breakpoint
DROP TABLE `standings`;--> statement-breakpoint
ALTER TABLE `__new_standings` RENAME TO `standings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;