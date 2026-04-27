-- Remove schedule and showAfterDays fields from popup_config — popup now shows on every page load.
ALTER TABLE `popup_config`
  DROP COLUMN `showAfterDays`,
  DROP COLUMN `scheduleStart`,
  DROP COLUMN `scheduleEnd`;
