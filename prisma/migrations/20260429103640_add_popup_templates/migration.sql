-- AlterTable
ALTER TABLE `popup_config` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `popup_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `badge` VARCHAR(50) NOT NULL DEFAULT 'INSIGHT',
    `category` VARCHAR(100) NOT NULL DEFAULT '',
    `title` VARCHAR(255) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL DEFAULT '',
    `buttonText` VARCHAR(100) NOT NULL DEFAULT '',
    `linkUrl` VARCHAR(500) NOT NULL DEFAULT '',
    `linkType` VARCHAR(20) NOT NULL DEFAULT 'external',
    `openInNewTab` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
