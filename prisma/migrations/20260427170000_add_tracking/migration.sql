-- Add country, referrer, duration to page_views
ALTER TABLE `page_views` ADD COLUMN `country` VARCHAR(2) NULL;
ALTER TABLE `page_views` ADD COLUMN `referrer` VARCHAR(500) NULL;
ALTER TABLE `page_views` ADD COLUMN `duration` INT NULL;

CREATE INDEX `page_views_country_createdAt_idx` ON `page_views`(`country`, `createdAt`);
CREATE INDEX `page_views_createdAt_idx` ON `page_views`(`createdAt`);

-- Popup click tracking
CREATE TABLE `popup_clicks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `linkUrl` VARCHAR(500) NOT NULL,
  `linkTitle` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `popup_clicks_createdAt_idx`(`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;
