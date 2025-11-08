-- Initialize roles if they don't exist
INSERT INTO role (name) VALUES ('ROLE_TENANT') ON DUPLICATE KEY UPDATE name = name;
INSERT INTO role (name) VALUES ('ROLE_OWNER') ON DUPLICATE KEY UPDATE name = name;