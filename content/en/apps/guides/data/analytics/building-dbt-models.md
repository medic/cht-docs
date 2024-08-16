---
title: "DBT models for CHT Applications"
linkTitle: "DBT Models"
weight: 2
description: >
  Guide for building DBT models for CHT applications
relatedContent: >
  core/overview/db-schema
  apps/reference/app-settings/hierarchy
---

## Overview

[CHT Sync]({{< relref "core/overview/cht-sync" >}}) copies data from CouchDB to a relational database. It initially stores the document data from CouchDB in a `jsonb` column in a single table. This is not possible to query for analytics, so it uses [DBT](https://www.getdbt.com/) to convert the document data to a relational database format.

[CHT Pipeline](https://github.com/medic/cht-pipeline) defines a DBT project, which contains model files for the data schema described [in the Database schema conventions]({{< ref "core/overview/db-schema" >}}).
Forms may be specific to each CHT application; additional models will need to be developed to analyze data from responses to these custom forms.
One additional model will be needed for each form, and for any aggregations, dashboards, or reusable views that use those form responses as input.
If using the [configurable contact hierarchy]({{< ref "apps/reference/app-settings/hierarchy#app_settingsjson-contact_types" >}}), it may also be useful to add models for other contact types.

## Setup

To create application specifc models, create a new dbt project as described [here](https://docs.getdbt.com/reference/commands/init)  and a Github repository (it may be public or private).
The [CHT Pipeline](https://docs.getdbt.com/docs/build/packages) dbt project, should be included as a dependency in `packages.yml`
```yml
packages:
  - git: "https://github.com/medic/cht-pipeline"
    revision: "1.0.0"
```
To avoid breaking changes in downstream models, include a version tag in the dependency.

In CHT Sync config, set the URL of this repository to the `CHT_PIPELINE_BRANCH_URL` [environment variable]({{< relref "apps/guides/data/analytics/environment-variables" >}}), either in ´.env´ if using ´docker compose´, or in ´values.yaml´ if using Kubernetes.

### Deploying models

CHT Sync automatically checks for updates to the DBT project at `CHT_PIPELINE_BRANCH_URL`
Use the main branch for changes that should be released; they will applied as soon as they are pushed to the repository.
For models that are in development, any other branch can be used.

Rebuilding tables can take some time (a rough estimate is several hours for tables between 1M and 10M rows, upt to 24H for tables between 10M and 100M rows) so plan for affected dashboards to be out of date when releasing new changes to models; only changed tables and their dependencies will be rebuilt.

New releases of the base models are rare, but schema changes to the CHT or new features may require changes.
Generally, these changes will be backwards compatible so that a new release of the CHT, or to the base models, does not break application specific models.

When it is necessary to update the base models, update the version tag in the dependency that refers to cht-pipeline, make any changes to application specific models that are necessary, rerun any unit tests, and push to the main branch to release. 


### Testing models and dashboards

It is highly encouraged to write dbt [tests](https://docs.getdbt.com/docs/build/data-tests) for application specific models to ensure that they are accurate and to avoid releasing broken models. Examples can be found in [CHT Pipeline](https://github.com/medic/cht-pipeline/tree/main/test).


## Base Models

All tables contain a `uuid` which is the primary key for the table; it is also the `_id` from the source CouchDB document.

{{< figure src="cht-pipeline-er.png" link="cht-pipeline-er.png" class=" center col-16 col-lg-12" >}}

### `couchdb`
All documents are stored in the `couchdb` table; downstream models move fields from the document into fields and index them.
This table can be used to get any field from a CouchDB document; however, it is recommended that the columns from downstream models be used instead for performance reasons.
|Field|Description|
|--|--|
|`uuid`|CouchDB's unique identifier of the record|
|`type`|The general type of the document, see below|
|`doc`| JSON of the source document|

### `data_record`
All form responses are stored in the `data_record` table; see more details [in the database schema conventions]({{< ref "core/overview/db-schema#reports" >}}).
This table contains columns for the contact who made the report, the parent of that contact, the report data, and a copy of fields in `jsonb` format.
It is not recommended to use the fields column directly, but instead to add one new model for each form, moving the relevant fields for that form into columns

|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the `couchdb` table.|
|`contact_uuid`| uuid of the `contact` who made the report|
|`contact_parent_uuid`| uuid of the parent of `contact` who submitted the form (at the date `reported`; contacts parent may have changed since then, this column will not)|
|`reported`| the reported timestamp from the couchdb document, stored as a date|

For SMS forms, there is also an `sms_form` table which contains the raw message and sender phone number (for SMS form response, `contact_uuid` may be `NULL`)
The `contact_uuid` column contains a foreign key to the `contacts` table.

### `contacts`
See a description of contact documents in CouchDB [in the database schema conventions]({{< ref "core/overview/db-schema#contacts-persons-and-places" >}}).
Every person and place is stored in the `contacts` table. Persons and patients are stored in their own tables, but because contact types are configurable, other contact types do not have their own tables by default.
The contact hierarchy defines "is a" relationships between contact types; e.g., a patient is a person is a contact. This is modeled as one table per type, where the `uuid` is both the primary key for the child table and a foreign key to the parent table.

|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the `couchdb` table.|
|`parent_uuid`| uuid of the parent contact. For people, will be a place contact.|
|`name`| name |
|`type`| for data created <= 3.7, the same as type of the CouchDB document, when using the configurable hierarchy, `contact_type` |
|`reported`| the reported timestamp from the CouchDB document, stored as a date|
|`phone`| contacts primary phone number |
|`phone_number`| alternate phone number, if available|

### `person`
|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the `couchdb` table.|
|`date_of_birth`|  |
|`sex`| |

### `patient`
Patients also have a `patient_id`, which is useful to link to `data_record`.
|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the `couchdb` table.|
|`patient_id`|  | patient id |

## Building App models

An overview of building DBT models can be found [here](https://docs.getdbt.com/docs/build/models)
The additional models that need to be developed for a CHT application are:

 - One model for each form
 - Models for contacts that are defined by the configurable hierarchy
 - Models to contain aggregates that may be useful for dashboards or analysis

### Form models
For each form in the CHT application, create one model that selects from `data_record where form = 'theformyouwant'`, moves the fields from the `fields` JSON into columns, applies any convenient transformations, and, if necessary, add indexes to them.

CHT Pipeline provides a macro for these models, `cht_form_model` to add boilerplate and commonly used columns.

#### `cht_form_model`
|Argument|Description|
|--|--|
|`form_name`| The name of the form to be selected |
|`form_columns`| The columns to be selected |
|`form_indexes`| Any additional indexes for the above columns |

This example extracts `Last Menstrual Period`, `Expected Delivery Date` and `ANC visit number` from a typical pregnancy registration form.
```sql
-- add any indexes specific to this form
{%- set form_indexes = [
  {'columns': ['edd']},
  {'columns': ['danger_signs']}]
  {'columns': ['risk_factors']}]
-%}
-- add columns specific to this form
{%- set form_indexes = [
{% set form_columns %}
  NULLIF(couchdb.doc->'fields'->>'lmp_date','')::date as lmp, -- CAST lmp string to date or NULL if empty
  NULLIF(couchdb.doc->'fields' ->> 'edd','')::date as edd, -- CAST edd string to date or NULL if empty

  couchdb.doc->'fields' ->> 'lmp_method' as lmp_method,
  couchdb.doc->'fields' ->> 'danger_signs' AS danger_signs,
  couchdb.doc->'fields' ->> 'risk_factors' AS risk_factors,

  -- extract the ANC visit number
  CASE
    WHEN couchdb.doc->'fields' ->>'anc_visit_identifier' <> ''
      THEN (couchdb.doc->'fields' ->>'anc_visit_identifier')::int
    WHEN couchdb.doc->'fields' #>>'{group_repeat,anc_visit_repeat,anc_visit_identifier}' <> ''
      THEN RIGHT(couchdb.doc->'fields' #>>'{group_repeat,anc_visit_repeat,anc_visit_identifier}'::text[], 1)::int
    ELSE 0 -- if not included default to 0
  END AS anc_visit
{% endset %}

-- call the macro with the form name, the columns and indexes to create the actual model
{{ cht_form_model('pregnancy', form_columns, form_indexes) }}
```

this creates the following model:

```sql
  {{
    config(
      materialized='incremental',
      unique_key='uuid',
      on_schema_change='append_new_columns',
      indexes=[
        {'columns': ['uuid'], 'type': 'hash'}, 
        {'columns': ['saved_timestamp']},
        {'columns': ['reported_by']},
        {'columns': ['reported_by_parent']},
        {'columns': ['reported']}
      ]
    )
  }}

  SELECT
  data_record.uuid as uuid,
  data_record.saved_timestamp,
  data_record.contact_uuid as reported_by,
  data_record.parent_uuid as reported_by_parent,
  data_record.reported

  NULLIF(couchdb.doc->'fields'->>'lmp_date','')::date as lmp, -- CAST lmp string to date or NULL if empty
  NULLIF(couchdb.doc->'fields' ->> 'edd','')::date as edd, -- CAST edd string to date or NULL if empty

  couchdb.doc->'fields' ->> 'lmp_method' as lmp_method,
  couchdb.doc->'fields' ->> 'danger_signs' AS danger_signs,
  couchdb.doc->'fields' ->> 'risk_factors' AS risk_factors,

  -- extract the ANC visit number
  CASE
    WHEN couchdb.doc->'fields' ->>'anc_visit_identifier' <> ''
      THEN (couchdb.doc->'fields' ->>'anc_visit_identifier')::int
    WHEN couchdb.doc->'fields' #>>'{group_repeat,anc_visit_repeat,anc_visit_identifier}' <> ''
      THEN RIGHT(couchdb.doc->'fields' #>>'{group_repeat,anc_visit_repeat,anc_visit_identifier}'::text[], 1)::int
    ELSE 0 -- if not included default to 0
  END AS anc_visit

  FROM {{ ref('data_record') }} data_record
  INNER JOIN {{ env_var('POSTGRES_SCHEMA') }}.{{ env_var('POSTGRES_TABLE') }} couchdb ON couchdb._id = data_record.uuid
  WHERE
    data_record.form = 'pregnancy'
  {% if is_incremental() %}
    AND data_record.saved_timestamp >= {{ max_existing_timestamp('saved_timestamp') }}
  {% endif %}
```

### Contacts hierarchy

It is often useful for aggregates to have a table for CHWs which contains the entire hierarchy.

```sql
{{
  config(
    materialized = 'materialized_view',
    indexes=[
      {'columns': ['chw_uuid']},
      {'columns': ['clinic_uuid']},
      {'columns': ['health_center_uuid']},
      {'columns': ['district_hospital_uuid']},
    ]
  )
}}

SELECT
  chw.uuid as chw_uuid,
  clinic.uuid as clinic_uuid,
  health_center.uuid as health_center_uuid,
  district_hospital.uuid as district_hospital_uuid
FROM
  {{ref('contact')}} chw
  INNER JOIN {{ref('contact')}} clinic ON chw.parent_uuid = clinic.uuid
  LEFT JOIN {{ref('contact')}} health_center ON clinic.parent_uuid = health_center.uuid
  LEFT JOIN {{ref('contact')}} district_hospital ON health_center.parent_uuid = district_hospital.uuid
WHERE chw.contact_type = 'person' AND clinic.contact_type = 'clinic';
```

### Aggregates

To aggregate on contacts and report data, join to the `data_record` and `contacts` tables as in the example below.

```sql
SELECT
  COUNT(*),
  chw.uuid as chw_uuid,
  chw.name as chw_name,
  area.uuid as area_uuid,
  area.name as area_name,
  date_trunc('month', pregnancy.reported) as report_month
FROM
  pregnancy
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
    config(materialized = 'materialized_view')
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

There are two options for building models using DBT: _views_ and _incremental tables_; see a full description [in the DBT documentation](https://docs.getdbt.com/docs/build/materializations).
In short, views are normal SQL views, and incremental tables are actual tables, which are periodically updated as new data is created.

For CHT DBT models, it is generally preferred to start with views. Views are always up to date and do not require a full refresh when changed.
However, indexing the columns of views is impossible, and views built on top of other views can cause performance issues.

To convert a view to an incremental table, change the materialization to `incremental` and add a condition to the `WHERE` clause:

```sql
{{
    config(materialized = 'incremental')
    unique_key='uuid',
    indexes=[
      {'columns': ['"uuid"'], 'type': 'hash'},
      {'columns': ['"saved_timestamp"'], 'type': 'btree'}
    ]
}}


SELECT
  uuid,
  "saved_timestamp",

  ...

FROM
  {{ ref("data_record") }} couchdb
WHERE
  form = 'pregnancy'

{% if is_incremental() %}
  AND "data_record.saved_timestamp" >= {{ max_existing_timestamp('"saved_timestamp"') }}
{% endif %}
```

To be performant, the table this model is reading from needs to have the saved_timestamp column indexed.
