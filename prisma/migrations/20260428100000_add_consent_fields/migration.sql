-- Add legal consent fields to applications table.
-- consentDataSharing: user consented to processing their personal data for evaluation.
-- consentFutureUse:   user agreed their data may be retained for future job opportunities.
ALTER TABLE `applications`
  ADD COLUMN `consentDataSharing` TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN `consentFutureUse`   TINYINT(1) NOT NULL DEFAULT 0;
