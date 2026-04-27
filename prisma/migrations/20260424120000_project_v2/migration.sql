-- Project v2: new fields, flexible content blocks, scope as array
-- Migrates old `scope` (text) → `scopeOfWork` (JSON array), `image` → `featuredImage`

-- Step 1: Add new scalar columns
ALTER TABLE `projects`
  ADD COLUMN `location`       VARCHAR(255) NULL,
  ADD COLUMN `projectSize`    VARCHAR(100) NULL,
  ADD COLUMN `timeline`       VARCHAR(100) NULL,
  ADD COLUMN `numberOfUnits`  VARCHAR(100) NULL,
  ADD COLUMN `clientType`     VARCHAR(100) NULL,
  ADD COLUMN `featuredImage`  VARCHAR(500) NULL,
  ADD COLUMN `status`         VARCHAR(20)  NOT NULL DEFAULT 'published',
  ADD COLUMN `featured`       TINYINT(1)   NOT NULL DEFAULT 0,
  ADD COLUMN `seoTitle`       VARCHAR(255) NULL,
  ADD COLUMN `seoDescription` TEXT         NULL;

-- Step 2: Add new JSON columns (nullable — MariaDB TEXT/JSON cannot have DEFAULT in all versions)
ALTER TABLE `projects`
  ADD COLUMN `scopeOfWork`    JSON NULL,
  ADD COLUMN `toolsAndTech`   JSON NULL,
  ADD COLUMN `valueDelivered` JSON NULL,
  ADD COLUMN `media`          JSON NULL,
  ADD COLUMN `contentBlocks`  JSON NULL;

-- Step 3: Migrate existing data
--   Wrap old scope string into a single-element JSON array
--   Copy image URL to featuredImage
--   Initialise new arrays to empty
UPDATE `projects`
SET
  `featuredImage`  = `image`,
  `scopeOfWork`    = JSON_ARRAY(`scope`),
  `toolsAndTech`   = '[]',
  `valueDelivered` = '[]',
  `media`          = '[]',
  `contentBlocks`  = '[]';

-- Step 4: Make challenge and solution nullable (they were TEXT NOT NULL)
ALTER TABLE `projects`
  MODIFY COLUMN `challenge` TEXT NULL,
  MODIFY COLUMN `solution`  TEXT NULL;

-- Step 5: Remove the old columns
ALTER TABLE `projects`
  DROP COLUMN `scope`,
  DROP COLUMN `image`;
