ALTER TABLE user ADD CONSTRAINT UN_user_username UNIQUE (username, deleted, deletedAt); 
ALTER TABLE customer ADD CONSTRAINT UN_customer_phone UNIQUE (phone, deleted, deletedAt); 
ALTER TABLE extinguisher ADD CONSTRAINT UN_extinguisher_code UNIQUE (code, deleted, deletedAt); 