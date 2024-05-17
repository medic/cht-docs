---
title: "DBT models for CHT Applications"
linkTitle: "DBT Models"
weight: 2
description: >
  Guide for building DBT models for CHT Applications
relatedContent: >
  core/overview/db-schema
  apps/reference/app-settings/hierarchy
---

## Overview

CHT Sync copies data from CouchDB to a relational database; it inititally stores the document data from CouchDB in a jsonb column in a single table. This is not possible to query for analytics, so it uses DBT to take the document data and convert it to a relational database format.

The CHT Pipeline repository defines a DBT project, which contains model files for the data schema described [here]({{< ref "core/overview/db-schema" >}}).
Forms may be specific to each CHT application; to analyze data from form responses to these custom forms, additional models will need to be developed.
One additional model will be needed for each form, and for any aggreagations, dashboards, or reuseable views which use those form responses as input.
If using the [configurable contact hierarchy]({{< ref "apps/reference/app-settings/hierarchy#app_settingsjson-contact_types" >}}), it may also be useful to add models for other contact types.

## Setup

CHT Sync uses a [DBT package](https://docs.getdbt.com/docs/build/packages) to run models, which is configured by providing a URL to a github repository.
If it is necessary for application specific models to be private, the [cht-pipeline repository](https://github.com/medic/cht-pipeline/) can be forked into a private repository.
If they can be public, a branch of the public repository can be created.

The url is set in the `CHT_PIPELINE_BRANCH_URL` environment variable, either in .env if using docker compose, or in values.yaml if useing kubernetes.

When models are changed, CHT Sync needs to be restarted for the change to take effect; when it restarts, it automatically downloads the latest version of cht pipeline and applies than changes; for models materialized as views, they are are updated instantly, for models materialized as incmrenetal tables, the table is dropped and will be unavailable until it is rebuilt from scratch.

## Base Models

The base models define the data which is common to all CHT applications.
All tables contain a uuid which is the primary key for the table; it is also the `_id` from the source couchdb document.

{{< figure src="cht-pipeline-er.png" link="cht-pipeline-er.png" class=" center col-16 col-lg-12" >}}

### `couchdb`
All documents are stored in the couchdb db table; downstream models move fields from the document into fields and index them.
It is possible to get any field from a couchdb document using this table; it is recommended for performance reasons to instead use the columns from downstream models.
|Field|Description|
|--|--|
|`uuid`|CouchDB's unique identifier of the record|
|`type`|The general type of the document, see below|
|`doc`| JSON of the source document|

### `data_record`
All form responses are stored in the `data_record` table, see more details [here]({{< ref "core/overview/db-schema#reports" >}}).
This table contains columns for the contact who made the report, the parent of that contact, the report data, and a copy of fields in jsonb format.
It is not recommended to use the fields column directly, but instead to add one new model for each form, moving the relevant fields for that form into columns

|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the couchdb table.|
|`contact_uuid`| uuid of the `contact` who made the report|
|`parent_contact_uuid`| uuid of the parent of `contact` who made the report (usually a place)|
|`fields`| JSON of the `fields` property from the couchdb document|
|`reported`| the reported timestamp from the couchdb document, stored as a date|

For SMS forms, there is also an `sms_form` table which contains the raw message and sender phone number (for sms form response, `contact_uuid` may be NULL)
The `contact_uuid` column contains a foreign key to the contacts table.

### `contacts`
See a description of contact documents in couchdb [here]({{< ref "core/overview/db-schema#contacts-persons-and-places" >}}).
Every person and place is stored in the contacts table. Persons and patients are stored in their own tables, but because contact types are configurable, other contact types do not have their own tables by default.
The contact hierarchy defines "is a" relationships between contact types; e.g. a patient is a person is a contact. This is modelled as one table per type, where the uuid is both the primary key for the child table and a foreign key to the parent table.

|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the couchdb table.|
|`parent_uuid`| uuid of the parent contact. For people, will be a place contact.|
|`name`| name |
|`type`| for data created <= 3.7, the same as type of the couchdb document, when using the configurable hierarchy, `contact_type` |
|`reported`| the reported timestamp from the couchdb document, stored as a date|
|`phone`| contacts primary phone number |
|`phone_number`| alternate phone number, if available|

### `person`
|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the couchdb table.|
|`date_of_birth`|  |
|`sex`| |

### `patient`
Patients have also a `patient_id` which is useful to link to `data_record`
|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the couchdb table.|
|`patient_id`|  | patient id |

## Building App models

An overview of building dbt models can be found [here]
The additional models that need to be developed for a CHT application are:

 - One model for each form
 - Any additional contact models
 - Models to contain aggregates that may be useful for dashboards or analysis

### Form models
for each form in the CHT app, create one model which selects from `data_record where form = 'theformyouwant'`, moves the fields from the `fields` json into columns, applies any transformations that would be convenient, and if necessary, indexes them.

This example extracts Last Menstrual Period, Expected Delivery Date and ANC visit number from a typical pregnancy registration form

```sql
{{
    config(materialized = 'view')
}}


SELECT
  uuid,

  NULLIF(fields ->> 'lmp_date','')::date as lmp, -- CAST lmp string to date or NULL if empty
  NULLIF(fields ->> 'edd','')::date as edd, -- CAST edd string to date or NULL if empty

  fields ->> 'lmp_method' as lmp_method,
  fields ->> 'danger_signs' AS danger_signs,
  fields ->> 'risk_factors' AS risk_factors,

  -- extract the ANC visit number
  CASE
    WHEN fields ->>'anc_visit_identifier' <> ''
      THEN (fields ->>'anc_visit_identifier')::int
    WHEN fields #>>'{group_repeat,anc_visit_repeat,anc_visit_identifier}' <> ''
      THEN RIGHT(fields #>>'{group_repeat,anc_visit_repeat,anc_visit_identifier}'::text[], 1)::int
    ELSE 0 -- if not included default to 0
  END AS anc_visit

FROM
  {{ ref("data_record") }} couchdb
WHERE
  form = 'pregnancy'

```

To aggregate on contacts and report data, join to the `data_record` and `contacts` tables e.g.
It is not recommended to redefine columns from `data_record` or `contacts` in these form models, but instead to join to `data_record` in queries.

```sql
SELECT
  COUNT(*),
  chw.uuid as chw_uuid,
  chw.name as chw_name,
  area.uuid as area_uuid,
  area.name as area_name,
  date_trunc('month', data_record.reported) as report_month
FROM
  pregnancy
INNER JOIN  data_record ON data_record.uuid = pregnancy.uuid
INNER JOIN contacts chw ON chw.uuid = data_record.contact_uuid
LEFT JOIN contacts area ON area.uuid = data_record.parent_contact_uuid
GROUP BY
  chw.uuid,
  chw.name,
  area.uuid,
  area.name,
  report_month;
```

### Aggregations
It may be useful to save some common queries as views, so that they can be reused in dashboards or downstream aggregations.
With the pregnancy form model above, if there was also a postnatal care form they could be joined to view outcomes together with registrations.

```sql
{{
    config(materialized = 'view')
}}

SELECT
  pnc.uuid AS pnc_uuid,
  pregnancy.uuid AS pregnancy_uuid,

  pnc.patient_id AS patient_id,

  pnc_contact.uuid AS pnc_reported_by,
  pregnancy_contact.uuid AS pregnancy_reported_by,
  pnc.reported AS reported,
  pregnancy.reported AS pregnancy_reported,

  pregnancy.edd as edd,
  pnc.delivery_date AS delivery_date,
  pnc.pregnancy_outcome,
FROM
  {{ ref('postnatal_care') }} AS pnc
LEFT JOIN {{ ref('pregnancy') }} ON
  (pnc.reported > pregnancy.reported AND
   pnc.reported < (pregnancy.reported + '1 year'::INTERVAL) AND
   pnc.patient_id = pregnancy.patient_id)
WHERE
  (pnc.pregnancy_outcome IN (VALUES ('healthy'), ('still_birth')))
  AND pnc.patient_id IS NOT NULL AND pnc.patient_id <> ''
```

## Views vs. Incremental Tables

There are two options for how to build models using dbt; views and 'incremental tables'; see a full description in the dbt documentation [here](https://docs.getdbt.com/docs/build/materializations).
In short, views are normal SQL views, and incremental tables are actual tables, which are periodically udpated as new data is created.

For cht dbt models, it is generally preferred to start with views; views are always up to date and do not require a full refresh when changed.
However, it is not possible to index the columns of views, and views built on top of other views can cause performance issues.

To convert a view to an incremental table, change the materialization to 'incremental' and add a condition to the WHERE clause:

```sql
{{
    config(materialized = 'incremental')
    unique_key='uuid',
    indexes=[
      {'columns': ['"uuid"'], 'type': 'hash'},
      {'columns': ['"@timestamp"'], 'type': 'btree'}
    ]
}}


SELECT
  uuid,
  "@timestamp",

  ...

FROM
  {{ ref("data_record") }} couchdb
WHERE
  form = 'pregnancy'

{% if is_incremental() %}
  AND "@timestamp" >= {{ max_existing_timestamp('"@timestamp"') }}
{% endif %}
```

To be performant, the table this model is reading from needs to have the @timestamp column indexed.
