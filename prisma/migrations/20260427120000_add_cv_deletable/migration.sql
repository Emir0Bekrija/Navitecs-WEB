-- Add cvDeletable flag to applications table.
-- Admin can mark a CV as safe to delete; the UI will then show a "Delete CV file" button.
ALTER TABLE `applications`
  ADD COLUMN `cvDeletable` TINYINT(1) NOT NULL DEFAULT 0;
