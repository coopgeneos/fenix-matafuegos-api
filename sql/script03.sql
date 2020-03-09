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

ALTER TABLE workorder ADD COLUMN reception date;
ALTER TABLE workorder ADD COLUMN delivery date;
ALTER TABLE workorder ADD COLUMN "partialLoad" real DEFAULT NULL;

INSERT INTO job ("createdAt", "updatedAt", deleted, name) values (now(), now(), false, 'Tobera');
INSERT INTO job ("createdAt", "updatedAt", deleted, name) values (now(), now(), false, 'Carga parcial');
INSERT INTO job ("createdAt", "updatedAt", deleted, name) values (now(), now(), false, 'Pintura');

CREATE SEQUENCE configuration_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

CREATE TABLE "configuration"  
(
  "createdAt" date,
  "updatedAt" date,
  "deletedAt" date,
  deleted boolean,
  id integer NOT NULL DEFAULT nextval('configuration_id_seq'::regclass),
  "vehicularDPSPrefix" text,
  "vehicularDPSInit" real DEFAULT NULL,
  "vehicularDPSEnd" real DEFAULT NULL,
  "vehicularDPSCurrent" real DEFAULT NULL,
  "vehicularDPSIncrement" real DEFAULT NULL,
  "domiciliaryDPSPrefix" text,
  "domiciliaryDPSInit" real DEFAULT NULL,
  "domiciliaryDPSEnd" real DEFAULT NULL,
  "domiciliaryDPSCurrent" real DEFAULT NULL,
  "domiciliaryDPSIncrement" real DEFAULT NULL,
  CONSTRAINT configuration_pkey PRIMARY KEY (id)
);

INSERT INTO Configuration ("createdAt","updatedAt",deleted,"vehicularDPSPrefix","vehicularDPSInit","vehicularDPSEnd","vehicularDPSCurrent","vehicularDPSIncrement","domiciliaryDPSPrefix","domiciliaryDPSInit","domiciliaryDPSEnd","domiciliaryDPSCurrent","domiciliaryDPSIncrement") 
VALUES (now(),now(),false,'3B0111',8157,8300,8157,1,'1B0913',1640,800,1640,2);