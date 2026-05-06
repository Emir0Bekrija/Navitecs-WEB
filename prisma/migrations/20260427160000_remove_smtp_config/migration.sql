-- Remove smtp_config table — SMTP settings are no longer managed through the admin panel.
DROP TABLE IF EXISTS `smtp_config`;
