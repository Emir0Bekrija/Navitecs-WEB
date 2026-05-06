-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `isGeneral` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `popup_config` ALTER COLUMN `updatedAt` DROP DEFAULT;
