---
title: "Testing dbt Models"
linkTitle: "dbt Testing"
weight: 6
description: >
  Guide for testing dbt models
aliases:
   - /apps/guides/data/analytics/testing-dbt-models
   - /building/guides/data/analytics/testing-dbt-models
---

## Overview

To ensure code accuracy and data integrity, and also to prevent data quality regressions on dbt models, it is recommended to write dbt tests. dbt tests help validate the accuracy and reliability of data and data models and identify issues before they cause downstream impacts on analytics and decision-making. Additionally, they increase developer confidence in making changes to the data models.

## Types of dbt tests

There are two main types of dbt tests:

- [data tests](https://docs.getdbt.com/docs/build/data-tests) - meant to be executed with every pipeline run to validate data integrity. They ensure the warehouse data meets specific criteria and are run at every data refresh.
- [unit tests](https://docs.getdbt.com/docs/build/unit-tests) - meant to be executed with every CI run to validate transformation logic integrity. They allow you to validate your SQL modeling logic on a small set of static inputs (typically defined using seeds or fixtures) before you materialize your full model in production.


### Data tests

Data tests can be further divided into two types:
- [generic tests](https://docs.getdbt.com/docs/build/data-tests#generic-data-tests): These are foundational tests provided by dbt core, focusing on basic schema validation and source freshness. dbt core provides four built-in generic tests that are essential for data modeling and ensuring data integrity. Generic tests can accept [additional test configurations](https://docs.getdbt.com/reference/data-test-configs).
It is also possible to define your own [custom generic tests](https://docs.getdbt.com/best-practices/writing-custom-generic-tests).

- [singular tests](https://docs.getdbt.com/docs/build/data-tests#singular-data-tests): These are written in an SQL file with a query that returns records that fail the test. This type of test is straightforward and focuses on specific conditions or rules that data must meet.

### Unit tests

Unit tests are essential for validating complex SQL logic and transformations in dbt models. These tests are especially valuable when working with intricate SQL expressions. They help catch errors before deploying changes, ensuring the logic behaves as expected, particularly in critical models or when handling edge cases.

For more details on formatting unit tests, refer to the [official dbt documentation](https://docs.getdbt.com/reference/resource-properties/unit-tests).

## Guidelines for dbt tests
To ensure data integrity and the reliability of the dbt models in the [cht-pipeline](https://github.com/medic/cht-pipeline), it is essential to follow these testing guidelines:

- **Basic generic tests** for all models:
Every model should have generic tests to enforce critical constraints and relationships. Use the generic tests provided in dbt core.

- **Singular or custom generic data tests** for aggregation models:
For models that perform data aggregation, it is crucial to include singular data tests or custom generic data tests to ensure that the aggregated data meets the expected criteria. These tests help verify that:
  - Data is accurately aggregated according to the defined logic.
  - The results align with business expectations and requirements.
  - Custom data tests are particularly important for aggregation models, as errors in these models can lead to significant discrepancies in reports and analyses.

- **Unit tests** for complex logic:
Unit tests are not strictly required but are highly recommended, especially for models with complex transformation logic. Examples of when to use unit tests include:
  - Complex SQL Logic: Such as regex, date math, window functions, or extensive `CASE WHEN` statements.
  - Custom calculations: When creating functions or applying unique data processing logic.
  - Edge cases: To handle scenarios that are not typically found in actual data but may arise unexpectedly.

## Writing dbt tests


cht-pipeline contains a `/models` directory containing SQL files and YAML files for generic tests and a `/test` directory with folders for fixtures and singular tests.

```shell
./
    /models
        /contacts
            /tests
                contacts.yml  --> unit tests
                persons.yml
            contact.sql
            contacts.yml      --> generic data tests
            patient.sql
            person.sql
            place.sql
        /forms
        /meta
        /root
        /users
    /test
        /fixtures             --> input data for unit tests
            data_record/
                data_record_initial_expected.csv
                data_record_source_table_initial.csv
                data_record_document_metadata_initial.csv
        /sqltest              --> singular data tests
            contact.sql
            data_record.sql
            patient.sql
```

### Writing data tests

**Generic data tests** are included in the model's YAML file under the `data-tests` tag, ensuring basic validations like `relationships`, `not_null`, and `unique`. The following code block contains an extract of the properties of the  `contacts.yml` file.

```YAML
version: 1

models:
  - name: contact
    config:
      contract:
        enforced: true
    columns:
      - name: uuid
        data_type: string
        constraints:
          - type: foreign_key
            expression: "{{ env_var('POSTGRES_SCHEMA') }}.document_metadata (uuid) ON DELETE CASCADE"
          - type: unique
        data_tests:
          - not_null
          - unique
          - relationships:
              to: ref('document_metadata')
              field: uuid
      - name: saved_timestamp
        data_type: timestamp
        data_tests:
          - not_null
      - name: reported
        data_type: timestamp with time zone
        data_tests:
          - not_null
      - name: parent_uuid
        data_type: string
      - name: name
        data_type: string
        data_tests:
          - not_null
      - name: contact_type
        data_type: string
        data_tests:
          - not_null
      - name: phone
        data_type: string
      - name: phone2
        data_type: string
      - name: active
        data_type: string
      - name: notes
        data_type: string
      - name: contact_id
        data_type: string
      - name: muted
        data_type: string
```

**Singular data tests** are located in the `/test/sqltest/` folder and check data synchronization between source and final tables. The code block below contains a test to ensure that data between the `source` table and `contact` tables is synchronized correctly.
Records that should be deleted are properly removed from both tables.
All relevant fields between the two tables match, preserving data accuracy and integrity.

```SQL
SELECT
FROM {{ source('couchdb', env_var('POSTGRES_TABLE')) }} couchdb
LEFT JOIN {{ ref('contact') }} contact ON couchdb._id = contact.uuid
WHERE
  couchdb.doc->>'type' IN ('contact', 'clinic', 'district_hospital', 'health_center', 'person')
  -- TEST CONDITIONS
  AND (
    -- in couchdb, not deleted, but not in contact table
    (contact.uuid IS NULL AND couchdb._deleted = false)
    OR
    -- in couchdb, deleted, but still in contact table
    (contact.uuid IS NOT NULL AND couchdb._deleted = true)
    OR -- fields dont match
    contact.parent_uuid <> couchdb.doc->'parent'->>'_id' OR
    contact.contact_type <> COALESCE(couchdb.doc->>'contact_type', couchdb.doc->>'type') OR
    contact.phone <> couchdb.doc->>'phone'
  )
```

### Writing unit tests

Unit tests are defined in a YAML file inside a `tests` folder in each `model` group folder. The input format of choice is CSV using fixtures, defined in `/test/fixture` folder.

The code block below is an extract from the `/models/contacts/tests/contacts.yml` file containing the test to validate transformation and data integrity for the `contact` model.

```YAML
unit_tests:
  - name: test_contact_model_transformation_and_data_integrity
    description: |
      This unit test validates the transformation logic in the `contact` model and ensures data integrity.
      It uses fixture data for both `document_metadata` and `source_table` to test the complete logic.
    model: contact
    overrides:
      macros:
        is_incremental: false
    given:
      - input: ref('document_metadata')
        format: csv
        fixture: contact_document_metadata_initial
      - input: source('couchdb', "{{ env_var('POSTGRES_TABLE') }}")
        format: csv
        fixture: contact_source_table_initial
    expect:
      format: csv
      fixture: contact_initial_expected
```

The following code block shows the content of the input fixtures.

```cs
uuid,saved_timestamp,doc_type,_deleted
c1,2024-08-01 00:00:00,contact,false
c2,2024-08-01 00:00:00,clinic,false
c3,2024-08-02 00:00:00,person,false
c4,2024-08-02 00:00:00,district_hospital,false
```

```cs
_id,saved_timestamp,_deleted,doc
c1,2024-08-01 00:00:00,false,"{""reported_date"": ""1722412800000"", ""parent"": {""_id"": ""p1""}, ""name"": ""John Doe"", ""contact_type"": ""person"", ""phone"": ""12345"", ""alternative_phone"": ""54321"", ""is_active"": ""true"", ""notes"": ""Note 1"", ""contact_id"": ""C-123"", ""muted"": ""false""}"
c2,2024-08-01 00:00:00,false,"{""reported_date"": ""1722412800000"", ""parent"": {""_id"": ""p2""}, ""name"": ""Jane Doe"", ""contact_type"": ""clinic"", ""phone"": ""67890"", ""alternative_phone"": ""09876"", ""is_active"": ""true"", ""notes"": ""Note 2"", ""contact_id"": ""C-456"", ""muted"": ""true""}"
c3,2024-08-02 00:00:00,false,"{""reported_date"": ""1722412800000"", ""parent"": {""_id"": ""p3""}, ""name"": ""Mike Smith"", ""contact_type"": ""person"", ""phone"": ""11223"", ""alternative_phone"": ""33211"", ""is_active"": ""false"", ""notes"": ""Note 3"", ""contact_id"": ""C-789"", ""muted"": ""false""}"
c4,2024-08-02 00:00:00,false,"{""reported_date"": ""1722412800000"", ""parent"": {""_id"": ""p4""}, ""name"": ""Sara Smith"", ""contact_type"": ""district_hospital"", ""phone"": ""44556"", ""alternative_phone"": ""65544"", ""is_active"": ""true"", ""notes"": ""Note 4"", ""contact_id"": ""C-101"", ""muted"": ""true""}"

```

The fixture below represents the expected data:

```cs
uuid,saved_timestamp,reported,parent_uuid,name,contact_type,phone,phone2,active,notes,contact_id,muted
c1,2024-08-01 00:00:00,2024-07-31 08:00:00+00,p1,John Doe,person,12345,54321,true,Note 1,C-123,false
c2,2024-08-01 00:00:00,2024-07-31 08:00:00+00,p2,Jane Doe,clinic,67890,09876,true,Note 2,C-456,true
c3,2024-08-02 00:00:00,2024-07-31 08:00:00+00,p3,Mike Smith,person,11223,33211,false,Note 3,C-789,false
c4,2024-08-02 00:00:00,2024-07-31 08:00:00+00,p4,Sara Smith,district_hospital,44556,65544,true,Note 4,C-101,true
```

## Running tests with Docker

dbt tests are run with Docker, to isolate dependencies and configurations, making the testing process reproducible and easier to manage. The scripts and configuration files below work together to automate the process of setting up a testing environment, and running dbt models and tests:


- `docker-compose.yml`: Defines Docker services. It starts by running PostgreSQL with the initial setup using `init.sql` and then builds and runs a dbt Docker container configured to connect to PostgreSQL.



- `init.sql`: A SQL script that initializes the PostgreSQL database by creating the required schema and table.



- `dbt/Dockerfile`: Builds the dbt Docker image. It sets up the Python environment, installs dbt and its dependencies, and copies the necessary project files into the container.



- `run_dbt_tests.sh`: Orchestrates the process of running dbt tests using Docker. It starts PostgreSQL, waits for it to initialize, runs the dbt container to execute tests, and cleans up by stopping and removing all containers.



- `run_dbt_tests_docker.sh`: Runs inside the dbt container. It sets the profiles directory, installs dbt dependencies, runs the dbt models, and executes the tests.



- `profile.yml`: The dbt profile configuration file that defines the database connection settings, using environment variables to connect to the PostgreSQL database.


### Prerequisites
- `Docker`

### Run the tests

1. Navigate to `test` folder.
2. Run the test script:

```sh
./run_dbt_tests.sh
```
3. After running the shell script, you should see the Docker containers start, the tests run and pass, and finally, the Docker containers are stopped and removed. This ensures that the testing environment is clean and ready for future runs.

The example below is a snippet of what the output could look like:
```shell
✔ Network test_default
Created
✔ Container test-postgres-1
Started
Waiting for PostgreSQL to be ready...
FINISHED
run_dbt_tests_docker.sh
✔ Container test-dbt-1
Created
Attaching to dbt-1
dbt-1  | Install dbt dependencies ...
dbt-1  | Running dbt ...
dbt-1  | 13:39:49  Completed successfully
dbt-1  | 13:39:49  Done. PASS=8 WARN=0 ERROR=0 SKIP=0 TOTAL=8
dbt-1  | Running tests ...
dbt-1  | 13:39:56  Completed successfully
dbt-1  | 13:39:56  Done. PASS=34 WARN=0 ERROR=0 SKIP=0 TOTAL=34
dbt-1 exited with code 0
Aborting on container exit...
✔ Container test-dbt-1  Stopped
✔ Container test-dbt-1
Removed
✔ Container test-postgres-1
Removed
✔ Network test_default
Removed
DBT tests passed
```
> [!NOTE]
> This snippet shows the key steps of the process. The full output will contain more details, but the above highlights the main actions performed by the script.
