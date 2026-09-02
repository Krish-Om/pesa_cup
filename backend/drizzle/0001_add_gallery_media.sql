CREATE TABLE IF NOT EXISTS `gallery_media` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `media_url` text NOT NULL,
  `file_key` text NOT NULL,
  `created_at` integer NOT NULL
);
