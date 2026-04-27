-- Create popup_config singleton table for the promotional popup feature.
CREATE TABLE `popup_config` (
  `id`            INT          NOT NULL DEFAULT 1,
  `enabled`       TINYINT(1)   NOT NULL DEFAULT 0,
  `badge`         VARCHAR(50)  NOT NULL DEFAULT 'INSIGHT',
  `category`      VARCHAR(100) NOT NULL DEFAULT '',
  `title`         VARCHAR(255) NOT NULL DEFAULT 'New BIM Coordination Insight',
  `description`   TEXT         NOT NULL DEFAULT ('See how coordinated Revit models help reduce clashes, improve documentation accuracy, and streamline collaboration across architectural, structural, and MEP teams.'),
  `buttonText`    VARCHAR(100) NOT NULL DEFAULT 'Read the article',
  `linkUrl`       VARCHAR(500) NOT NULL DEFAULT '',
  `linkType`      VARCHAR(20)  NOT NULL DEFAULT 'external',
  `openInNewTab`  TINYINT(1)   NOT NULL DEFAULT 1,
  `showAfterDays` INT          NOT NULL DEFAULT 7,
  `scheduleStart` DATETIME(3)  NULL,
  `scheduleEnd`   DATETIME(3)  NULL,
  `updatedAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
