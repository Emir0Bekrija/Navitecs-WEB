-- Secure session storage migration
-- Replaces raw token storage with SHA-256 hashes.
-- Adds absoluteExpiresAt for a 24-hour hard session cap.
--
-- All existing sessions are intentionally deleted: the old raw tokens cannot
-- be rehashed retroactively, so every admin will need to log in once after
-- this migration is applied. This is expected and correct behaviour.

-- 1. Clear all existing sessions (incompatible raw-token format)
DELETE FROM `admin_sessions`;

-- 2. Drop the old raw-token column
ALTER TABLE `admin_sessions` DROP COLUMN `token`;

-- 3. Add tokenHash — stores only the SHA-256 hex digest of the cookie value
ALTER TABLE `admin_sessions`
  ADD COLUMN `tokenHash` VARCHAR(64) NOT NULL AFTER `userId`;

-- 4. Add absoluteExpiresAt — hard 24-hour cap, set at login and never extended
ALTER TABLE `admin_sessions`
  ADD COLUMN `absoluteExpiresAt` DATETIME(3) NOT NULL AFTER `expiresAt`;

-- 5. Unique index on the hash (replaces the old unique index on token)
ALTER TABLE `admin_sessions`
  ADD UNIQUE INDEX `admin_sessions_tokenHash_key` (`tokenHash`);
