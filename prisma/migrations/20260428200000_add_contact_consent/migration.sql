-- Add legal consent field to contacts table.
-- consentDataProcessing: user consented to NAVITECS collecting and processing their personal data.
ALTER TABLE `contacts`
  ADD COLUMN `consentDataProcessing` TINYINT(1) NOT NULL DEFAULT 0;
