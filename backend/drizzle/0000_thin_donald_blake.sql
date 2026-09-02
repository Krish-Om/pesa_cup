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
CREATE TABLE `fixtures` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_a` text NOT NULL,
	`team_b` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`venue` text NOT NULL,
	`status` text DEFAULT 'upcoming' NOT NULL,
	`score_a` integer,
	`score_b` integer
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
CREATE TABLE `scorers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`team` text NOT NULL,
	`goals` integer DEFAULT 0 NOT NULL,
	`assists` integer DEFAULT 0 NOT NULL,
	`rank` integer,
	`avatar` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `standings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team` text NOT NULL,
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
