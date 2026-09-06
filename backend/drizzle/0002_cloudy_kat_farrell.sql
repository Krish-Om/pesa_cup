PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tournament_id` integer NOT NULL,
	`team_name` text NOT NULL,
	`captain_name` text NOT NULL,
	`captain_email` text NOT NULL,
	`captain_phone` text NOT NULL,
	`player_count` integer NOT NULL,
	`batch_year` text NOT NULL,
	`transaction_code` text,
	`payment_receipt_url` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`rejection_reason` text,
	`team_id` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_registrations`("id", "tournament_id", "team_name", "captain_name", "captain_email", "captain_phone", "player_count", "batch_year", "transaction_code", "payment_receipt_url", "status", "rejection_reason", "team_id", "created_at") SELECT "id", "tournament_id", "team_name", "captain_name", "captain_email", "captain_phone", "player_count", "batch_year", "transaction_code", "payment_receipt_url", "status", "rejection_reason", "team_id", "created_at" FROM `registrations`;--> statement-breakpoint
DROP TABLE `registrations`;--> statement-breakpoint
ALTER TABLE `__new_registrations` RENAME TO `registrations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;