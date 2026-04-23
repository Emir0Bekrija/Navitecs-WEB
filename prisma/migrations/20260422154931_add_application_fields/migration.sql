-- AlterTable
ALTER TABLE `applications` ADD COLUMN `bimSoftware` VARCHAR(500) NULL,
    ADD COLUMN `currentlyEmployed` BOOLEAN NULL,
    ADD COLUMN `location` VARCHAR(255) NULL,
    ADD COLUMN `noticePeriod` VARCHAR(50) NULL,
    ADD COLUMN `yearsOfExperience` VARCHAR(20) NULL;
