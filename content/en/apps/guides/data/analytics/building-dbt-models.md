---
title: "dbt models for CHT Applications"
linkTitle: "dbt Models"
weight: 2
description: >
  Guide for building dbt models for CHT applications
relatedContent: >
  core/overview/db-schema
  apps/reference/app-settings/hierarchy
---

## Overview

[CHT Sync]({{< relref "core/overview/cht-sync" >}}) copies data from CouchDB to a relational database. It initially stores the document data from CouchDB in a `jsonb` column in a single table. This is not possible to query for analytics, so it uses [dbt](https://www.getdbt.com/) to convert the document data to a relational database format.

[cht-pipeline repository](https://github.com/medic/cht-pipeline) defines a dbt project, which contains model files for the data schema described in the [Database schema conventions]({{< ref "core/overview/db-schema" >}}).
Forms may be specific to each CHT application; additional models will need to be developed to analyze data from responses to these custom forms.
One additional model will be needed for each form, and for any aggregations, dashboards, or reusable views that use those form responses as input.
If using the [configurable contact hierarchy]({{< ref "apps/reference/app-settings/hierarchy#app_settingsjson-contact_types" >}}), it may also be useful to add models for other contact types.

## Setup

To create application specific models, create a  [new dbt project](https://docs.getdbt.com/reference/commands/init). Edit the `packages.yml` in your new dbt project to add [cht-pipeline](https://docs.getdbt.com/docs/build/packages) as a dependency. So that you can track changes in your models, put your dbt new project in a GitHub repository (it may be public or private).
```yml
packages:
  - git: "https://github.com/medic/cht-pipeline"
    revision: "v1.0.0"
```
To avoid breaking changes in downstream models, include a version tag in the dependency.

In CHT Sync config, set the URL of dbt GitHub repository to the `CHT_PIPELINE_BRANCH_URL` [environment variable]({{< relref "apps/guides/data/analytics/environment-variables" >}}), either in `.env` if using `docker compose`, or in `values.yaml` if using Kubernetes.

### Deploying models

CHT Sync automatically checks for updates to the dbt project at `CHT_PIPELINE_BRANCH_URL`
Use the `main` branch for changes that should be released; they will be applied as soon as they are pushed to the repository.
For models that are in development, any other branch can be used.

Rebuilding tables can take some time (a rough estimate is several hours for tables between 1M and 10M rows, up to 24H for tables between 10M and 100M rows), so plan for affected dashboards to be out of date when releasing new changes to models; only changed tables and their dependencies will be rebuilt.

New releases of the base models are rare, but schema changes to the CHT or new features may require changes.
Generally, these changes will be backwards compatible so that a new release of the CHT, or to the base models, does not break application specific models.

When it is necessary to update the base models, update the version tag in the dependency that refers to cht-pipeline, make any changes to application specific models that are necessary, rerun any unit tests, and push to the main branch to release. 


### Testing models and dashboards

It is highly encouraged to write [dbt tests]({{< ref "apps/guides/data/analytics/testing-dbt-models" >}}) for application-specific models to ensure that they are accurate and to avoid releasing broken models. Examples can be found in the [cht-pipeline repository](https://github.com/medic/cht-pipeline/tree/main/test).


## Base Models

All tables contain a `uuid` which is the primary key for the table; it is also the `_id` from the source CouchDB document.

{{< figure src="cht-pipeline-er.png" link="cht-pipeline-er.png" class=" center col-16 col-lg-12" >}}

### `couchdb`
All documents are stored in the `couchdb` table; downstream models move fields from the document into fields and index them.
Deleted documents will still be present in this table with the `_deleted` flag set to `true`.
This table can be used to get any field from a CouchDB document; however, it is recommended that the columns from downstream models be used instead for performance reasons.
The name is configurable using the `POSTGRES_TABLE` environment variable.
|Field|Description|
|--|--|
|`_id`|CouchDB's unique identifier of the record|
|`saved_timestamp`| timestamp when this row was inserted|
|`_deleted`| `true` if the document was deleted, `false` otherwise. |
|`doc`| JSON of the source document|

### `document_metadata`
This table contains the metadata about all documents and is the root for all other models.
It contains a `type` column describing the type of the document.
Deleted documents do not appear as rows in this table and deletes from this table cascade to all other models.
The document itself is not copied to this table; to use it requires joining to the `couchdb` table.
|Field|Description|
|--|--|
|`uuid`|CouchDB's unique identifier of the record|
|`saved_timestamp`|timestamp when this row was inserted|
|`type`|The general type of the document, see below|

### `data_record`
All form responses are stored in the `data_record` table; see more details [in the database schema conventions]({{< ref "core/overview/db-schema#reports" >}}).
This table contains columns for the contact who made the report, the parent of that contact, and the date it was reported.

|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the `couchdb` table.|
|`saved_timestamp`| timestamp when this row was inserted|
|`reported`| the reported timestamp from the couchdb document, stored as a date|
|`form`| the name of the form|
|`from_phone`| phone number of the reporter, if available|
|`patient_id`| subject of the form; if it has a field for `patient_id`, it will be copied to this column|
|`place_id`| subject of the form; if it has a field for `place_id`, it will be copied to this column|
|`contact_uuid`| uuid of the `contact` who made the report|
|`parent_uuid`| uuid of the parent of `contact` who submitted the form (at the date `reported`; contacts parent may have changed since then, this column will not)|
|`grandparent_uuid`| uuid of the parent of `contact` who submitted the form (at the date `reported`; contacts parent may have changed since then, this column will not)|

The `contact_uuid` column contains a foreign key to the `contact` table.

### `contact`
See a description of contact documents in CouchDB [in the database schema conventions]({{< ref "core/overview/db-schema#contacts-persons-and-places" >}}).
Every person and place is stored in the `contact` table. Persons and places are stored in their own tables, but because contact types are configurable, other contact types do not have their own tables by default.
The contact hierarchy defines "is a" relationships between contact types; e.g., a patient is a person is a contact. This is modeled as one table per type, where the `uuid` is both the primary key for the child table and a foreign key to the parent table.

|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the `couchdb` table.|
|`saved_timestamp`| timestamp when this row was inserted|
|`parent_uuid`| uuid of the parent contact. |
|`name`| name |
|`contact_type`| for data created <= 3.7, the same as type of the CouchDB document, when using the configurable hierarchy, `contact_type`. |
|`reported`| the reported timestamp from the CouchDB document, stored as a date|
|`notes`| |
|`active`| |
|`muted`| `true` if this contact has been muted|

### `contact_type`
This table stores metadata about contact types. It uses the configurable contact types from [app settings]({{< ref "apps/reference/app-settings/hierarchy#app_settingsjson-contact_types" >}}), combined with all distinct values of `contact_type` from the `contact` table.
The `person` column defines which contact types are persons and which are places. It uses the `person` field from the settings, or if the contact type is not in settings, it is assumed to be a place unless `id` is `person`

|Field|Description|
|--|--|
|`id`| the id of the contact type, either from the `id` field in app settings, or from the `contact_type` field from contacts|
|`person`| `true` if this contact type represents a person. if `false`, this contact type is a place|
|`configured`| `true` if this contact type is in settings, `false` if not |

### `person`
This table stores all contacts where the `contact_type` is person, and has additional fields that are relevant only for person contacts.

|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the `contact` and `couchdb` tables.|
|`saved_timestamp`| timestamp when this row was inserted|
|`date_of_birth`|  |
|`sex`| |
|`phone`| contacts primary phone number |
|`phone2`| alternate phone number, if available|
|`place_id`|  | if a secondary patient id is generated, it will be stored in this column |

### `place`
This table stores all contacts where the `contact_type` is place, and has additional columns that are relevant only for place contacts.
The `contact_id` column contains a foreign key to a person contact who is the primary contact for the place.

|Field|Description|
|--|--|
|`uuid`|Unique identifier of the record. Note this is both the primary key for this table, and a foreign key to the `contact` and `couchdb` tables.|
|`saved_timestamp`| timestamp when this row was inserted|
|`place_id`|  | if a secondary place id is generated, it will be stored in this column |
|`contact_id`| places have another contact that represents the person who is the primary contact for the place; for example a facility administrator|

## Building App models

An overview of building dbt models can be found [in the dbt documentation](https://docs.getdbt.com/docs/build/models).
The additional models that need to be developed for a CHT application are:

 - One model for each form
 - Models for contacts that are defined by the configurable hierarchy
 - Models to contain aggregates that may be useful for dashboards or analysis.

### Form models
For each form in the CHT application that is relevant for analysis, create a model using the `cht_form_model` macro. This macro creates a model that selects from `data_record where form = 'theformyouwant'`, joins to the `couchdb` table to get the `jsonb` fields, moves the fields into columns, applies any convenient transformations, and, if necessary, adds indexes to them.

To use this macro, select the fields to move into columns and any indexes as in the example below.

#### `cht_form_model`
|Argument|Description|
|--|--|
|`form_name`| The name of the form to be selected |
|`form_columns`| The columns to be selected, as a SQL string to be inserted into the SELECT clause, using `couchdb.doc->fields` |
|`form_indexes`| Any additional indexes for the above columns, as a dbt index list |

This example extracts `Last Menstrual Period`, `Expected Delivery Date` and `ANC visit number` from a typical pregnancy registration form.
```sql
-- add any indexes specific to this form
{%- set form_indexes = [
  {'columns': ['edd']},
  {'columns': ['danger_signs']}]
  {'columns': ['risk_factors']}]
-%}
-- add columns specific to this form
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

This creates the following model:

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

The base models have tables for `person` and `place`, but it's often useful for other contact types to have their own specialized tables, which can have additional columns specific to that type, and can have foreign keys to parents in the hierarchy.
For example, households, patients, chws and supervisors are all common objects in data analysis, but do not have any definition common to all applications and so need to be built in application-specific models.

To do this, use the `cht_contact_model` macro, specifying the `contact_type` id, any custom fields and indexes, and a list of parent models.

#### `cht_contact_model`
|Argument|Description|
|--|--|
|`contact_type`| the id of the `contact_type` to be selected |
|`parents`| a list of parent contacts to join to this table, in this format: `[{'id': '', 'table': ''}, {'id': '', 'table':''}]` |
|`custom_contact_columns`| The columns to be selected, as a SQL string to be inserted into the SELECT clause, using `couchdb.doc` |
|`custom_indexes`| Any additional indexes for the above columns, as a dbt index list |

This example shows how this macro can be used to build a household model which has some custom columns, a foreign key to its parent, and a community health area.

```sql
{% set custom_fields %}
  contact.name AS household_name,
  contact.contact_id AS household_contact_id,
  community_health_unit.uuid as chu_area_id,
  NULLIF(couchdb.doc ->> 'uses_treated_water', '')::boolean AS uses_treated_water,
  NULLIF(couchdb.doc ->> 'has_functional_latrine', '')::boolean AS has_functional_latrine
{% endset %}
{{ cht_contact_model('household', custom_fields, [{'id': 'community_health_unit', 'table': 'community_health_units'}]) }}

```

### Aggregates

To aggregate on contacts and report data, join to the `data_record` and `contact` tables as in the example below.

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
INNER JOIN contact chw ON chw.uuid = data_record.contact_uuid
LEFT JOIN contact area ON area.uuid = data_record.parent_contact_uuid
GROUP BY
  chw.uuid,
  chw.name,
  area.uuid,
  area.name,
  report_month;
```

### Aggregations
It may be useful to save some common queries as views, so that they can be reused in dashboards or downstream aggregations.
With the pregnancy form model above, if there was also a postnatal care form, they could be joined to view outcomes together with registrations.

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

There are two options for building models using dbt: _views_ and _incremental tables_; see a full description [in the dbt documentation](https://docs.getdbt.com/docs/build/materializations).
In short, views are normal SQL views, and incremental tables are actual tables, which are periodically updated as new data is created, updated or deleted.

For CHT dbt models, it is generally preferred to start with materialized views. Materialized views are refreshed on every `dbt run`, columns can still be indexed, and they don't require much extra configuration. Non-materialized or non-incremental tables are possible but not recommended because they are unavailable during `dbt run` and anything that depends on them (including dashboards) will also be unavailable. Some base models use incremental tables to ensure good performance for `dbt run`.

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
  {{ ref("data_record") }} data_record
WHERE
  form = 'pregnancy'

{% if is_incremental() %}
  AND "data_record.saved_timestamp" >= {{ max_existing_timestamp('"saved_timestamp"') }}
{% endif %}
```

To be performant, the table from this model is reading form needs to have the `saved_timestamp` column indexed.