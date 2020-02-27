ALTER TABLE customer ADD COLUMN "cNumber" real DEFAULT NULL;
ALTER TABLE customer ADD COLUMN cuit real DEFAULT NULL;

ALTER TABLE extinguisher RENAME COLUMN "factoryNo" TO "extinguisherNo";
ALTER TABLE extinguisher ADD COLUMN "locationNo" real DEFAULT NULL;
ALTER TABLE extinguisher ADD COLUMN dps text DEFAULT NULL;
ALTER TABLE extinguisher ADD COLUMN mark text DEFAULT NULL;
ALTER TABLE extinguisher DROP COLUMN code;

CREATE SEQUENCE mark_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

CREATE TABLE mark
(
  "createdAt" date,
  "updatedAt" date,
  "deletedAt" date,
  deleted boolean,
  id integer NOT NULL DEFAULT nextval('mark_id_seq'::regclass),
  name text,
  CONSTRAINT mark_pkey PRIMARY KEY (id)
);


