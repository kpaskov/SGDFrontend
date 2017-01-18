-- Generated by Ora2Pg, the Oracle database Schema converter, version 17.4
-- Copyright 2000-2016 Gilles DAROLD. All rights reserved.
-- DATASOURCE: dbi:Oracle:host=sgd-nex2-db.stanford.edu;sid=SGD

SET client_encoding TO 'UTF8';

\set ON_ERROR_STOP ON

-- Curation tables

DROP TABLE IF EXISTS nex.curation CASCADE;
CREATE TABLE nex.curation (
	curation_id bigint NOT NULL DEFAULT nextval('curation_seq'),
	dbentity_id bigint NOT NULL,
	source_id bigint NOT NULL,
	locus_id bigint,
	subclass varchar(40) NOT NULL,
	curation_task varchar(40) NOT NULL,
	curator_comment varchar(2000),
	date_created timestamp NOT NULL DEFAULT LOCALTIMESTAMP,
	created_by varchar(12) NOT NULL,
	CONSTRAINT curation_pk PRIMARY KEY (curation_id)
) ;
COMMENT ON TABLE nex.curation IS 'Tasks and notes associated with locus and reference curation.';
COMMENT ON COLUMN nex.curation.curator_comment IS 'Comment or note.';
COMMENT ON COLUMN nex.curation.dbentity_id IS 'FK to DBENTITY.DBENTITY_ID.';
COMMENT ON COLUMN nex.curation.locus_id IS 'FK to LOCUSDBENTITY.DBENTITY_ID. Used only when SUBCLASS = REFERENCE.';
COMMENT ON COLUMN nex.curation.curation_id IS 'Unique identifier (serial number).';
COMMENT ON COLUMN nex.curation.source_id IS 'FK to SOURCE.SOURCE_ID.';
COMMENT ON COLUMN nex.curation.created_by IS 'Username of the person who entered the record into the database.';
COMMENT ON COLUMN nex.curation.subclass IS 'Type of curation (LOCUS, REFERENCE).';
COMMENT ON COLUMN nex.curation.date_created IS 'Date the record was entered into the database.';
COMMENT ON COLUMN nex.curation.curation_task IS 'Type of curation task (Classical phenotype information,Delay,Fast Track,GO information,GO needs review,Gene model,Headline needs review,Headline reviewed,Headline information,High Priority,Homology/Disease,HTP phenotype,Non-phenotype HTP,Not yet curated,Paragraph needs review,Paragraph not needed,Pathways,Phenotype needs review,Phenotype uncuratable,Post-translational modifications,Regulation information).';
ALTER TABLE nex.curation ADD CONSTRAINT curation_uk UNIQUE (dbentity_id,subclass,curation_task,locus_id);
ALTER TABLE nex.curation ADD CONSTRAINT curation_task_ck CHECK (CURATION_TASK IN ('Classical phenotype information','Delay','Fast Track','GO information',
'GO needs review','Gene model','Headline needs review','Headline reviewed','Headline information','High Priority','Homology/Disease',
'HTP phenotype','Non-phenotype HTP','Not yet curated','Paragraph needs review','Paragraph not needed','Pathways','Phenotype needs review',
'Phenotype uncuratable','Post-translational modifications','Regulation information'));
ALTER TABLE nex.curation ADD CONSTRAINT curation_subclass_ck CHECK (SUBCLASS IN ('LOCUS', 'REFERENCE'));
CREATE INDEX curation_locus_fk_index ON nex.curation (locus_id);
CREATE INDEX curation_source_fk_index ON nex.curation (source_id);

DROP TABLE IF EXISTS nex.authorresponse CASCADE;
CREATE TABLE nex.authorresponse (
	curation_id bigint NOT NULL DEFAULT nextval('curation_seq'),
	reference_id bigint NOT NULL,
	source_id bigint NOT NULL,
	colleague_id bigint,
	author_email varchar(100) NOT NULL,
	has_novel_research boolean NOT NULL,
	has_large_scale_data boolean NOT NULL,
	has_fast_track_tag boolean NOT NULL,
	curator_checked_datasets boolean NOT NULL,
	curator_checked_genelist boolean NOT NULL,
	no_action_required boolean NOT NULL,
	research_results text,
	gene_list varchar(4000),
	dataset_description varchar(4000),
	other_description varchar(4000),
	date_created timestamp NOT NULL DEFAULT LOCALTIMESTAMP,
	created_by varchar(12) NOT NULL,
	CONSTRAINT authorresponse_pk PRIMARY KEY (curation_id)
) ;
COMMENT ON TABLE nex.authorresponse IS 'Replies from the Author Reponse System.';
COMMENT ON COLUMN nex.authorresponse.has_large_scale_data IS 'Whether there is large scale data in the paper.';
COMMENT ON COLUMN nex.authorresponse.created_by IS 'Username of the person who entered the record into the database.';
COMMENT ON COLUMN nex.authorresponse.no_action_required IS 'Whether any further action is needed.';
COMMENT ON COLUMN nex.authorresponse.gene_list IS 'List of gene names contained in the paper submitted by the author.';
COMMENT ON COLUMN nex.authorresponse.date_created IS 'Date the record was entered into the database.';
COMMENT ON COLUMN nex.authorresponse.has_novel_research IS 'Whether there is novel research in the paper.';
COMMENT ON COLUMN nex.authorresponse.has_fast_track_tag IS 'Whether a fast track tag has been attached to this paper.';
COMMENT ON COLUMN nex.authorresponse.curation_id IS 'Unique identifier (serial number).';
COMMENT ON COLUMN nex.authorresponse.author_email IS 'Email address of the author.';
COMMENT ON COLUMN nex.authorresponse.research_results IS 'Research results submitted by the author.';
COMMENT ON COLUMN nex.authorresponse.dataset_description IS 'Description of the dataset submitted by the author.';
COMMENT ON COLUMN nex.authorresponse.source_id IS 'FK to SOURCE.SOURCE_ID.';
COMMENT ON COLUMN nex.authorresponse.curator_checked_datasets IS 'Whether a curator has checked the datasets in the paper.';
COMMENT ON COLUMN nex.authorresponse.colleague_id IS 'FK to COLLEAGUE.COLLEAGUE_ID.';
COMMENT ON COLUMN nex.authorresponse.other_description IS 'Any other description submitted by the author.';
COMMENT ON COLUMN nex.authorresponse.reference_id IS 'FK to REFERENCEDBENTITY.DBENTITY_ID.';
COMMENT ON COLUMN nex.authorresponse.curator_checked_genelist IS 'Whether a curator has checked the submitted gene list.';
ALTER TABLE nex.authorresponse ADD CONSTRAINT authorresponse_uk UNIQUE (reference_id);
CREATE INDEX authorresponse_coll_fk_index ON nex.authorresponse (colleague_id);
CREATE INDEX authorresponse_source_fk_index ON nex.authorresponse (source_id);

DROP TABLE IF EXISTS nex.referencetriage CASCADE;
CREATE TABLE nex.referencetriage (
	curation_id bigint NOT NULL DEFAULT nextval('curation_seq'),
	pmid bigint NOT NULL,
	citation varchar(500) NOT NULL,
	fulltext_url varchar(500),
	abstract text,
	date_created timestamp NOT NULL DEFAULT LOCALTIMESTAMP,
	created_by varchar(12) NOT NULL,
	CONSTRAINT referencetriage_pk PRIMARY KEY (curation_id)
) ;
COMMENT ON TABLE nex.referencetriage IS 'Papers obtained via the reference triage system.';
COMMENT ON COLUMN nex.referencetriage.abstract IS 'Paper abstract.';
COMMENT ON COLUMN nex.referencetriage.created_by IS 'Username of the person who entered the record into the database.';
COMMENT ON COLUMN nex.referencetriage.fulltext_url IS 'URL to the fulltext of the paper.';
COMMENT ON COLUMN nex.referencetriage.date_created IS 'Date the record was entered into the database.';
COMMENT ON COLUMN nex.referencetriage.citation IS 'Full citation of the paper.';
COMMENT ON COLUMN nex.referencetriage.curation_id IS 'Unique identifier (serial number).';
COMMENT ON COLUMN nex.referencetriage.pmid IS 'Pubmed identifier for the paper.';
ALTER TABLE nex.referencetriage ADD CONSTRAINT referencetriage_uk UNIQUE (pmid);

DROP TABLE IF EXISTS nex.colleaguetriage CASCADE;
CREATE TABLE nex.colleaguetriage (
	curation_id bigint NOT NULL DEFAULT nextval('curation_seq'),
	triage_type varchar(10) NOT NULL,
    colleague_id bigint,
    colleague_data text NOT NULL,
    curator_comment varchar(500),
    date_created timestamp NOT NULL DEFAULT LOCALTIMESTAMP,
	created_by varchar(12) NOT NULL,
	CONSTRAINT colleaguetriage_pk PRIMARY KEY (curation_id)
) ;
COMMENT ON TABLE nex.colleaguetriage IS 'New and update colleague submissions.';
COMMENT ON COLUMN nex.colleaguetriage.colleague_id IS 'FK to COLLEAGUE.COLLEAGUE_ID.';
COMMENT ON COLUMN nex.colleaguetriage.triage_type IS 'Type of colleague submission (New, Update, Stalled).';
COMMENT ON COLUMN nex.colleaguetriage.created_by IS 'Username of the person who entered the record into the database.';
COMMENT ON COLUMN nex.colleaguetriage.colleague_data IS 'JSON object of the submitted colleague information.';
COMMENT ON COLUMN nex.colleaguetriage.date_created IS 'Date the record was entered into the database.';
COMMENT ON COLUMN nex.colleaguetriage.curation_id IS 'Unique identifier (serial number).';
COMMENT ON COLUMN nex.colleaguetriage.curator_comment IS 'Notes or comments about this colleague entry by the curators.';
ALTER TABLE nex.colleaguetriage ADD CONSTRAINT colleagetriage_type_ck CHECK (TRIAGE_TYPE IN ('New', 'Update', 'Stalled'));
