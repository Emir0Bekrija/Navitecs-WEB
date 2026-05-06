-- AlterTable
ALTER TABLE `popup_config` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `projects` MODIFY `results` JSON NULL;
