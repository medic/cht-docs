---
title: "Testing dbt models"
linkTitle: "Testing DBT Models in CHT Pipeline"
weight: 6
description: >
  Guide for testing dbt models in CHT Pipeline
---

## Overview

To ensure code accuracy and data integrity, and also to prevent data quality regressions on dbt models, it is recommended to write dbt tests. dbt tests help validate the accuracy and reliability of data and data models and identify issues before they cause downstream impacts on analytics and decision-making. Additionally, they increase developer confidence in making changes to the data models. 

## Types of dbt tests 

There are two main types of dbt tests: 

- [**data tests**](https://docs.getdbt.com/docs/build/data-tests) - meant to be executed with every pipeline run to validate data integrity. They ensure your warehouse data meets specific criteria and are run at every data refresh.
- [**unit tests**](https://docs.getdbt.com/docs/build/unit-tests) - meant to be executed with every CI run to validate transformation logic integrity. They allow you to validate your SQL modeling logic on a small set of static inputs (typically defined using seeds or fixtures) before you materialize your full model in production.


### Data tests

Data tests can be further divided into two types:
- [Generic tests](https://docs.getdbt.com/docs/build/data-tests#generic-data-tests): These are foundational tests provided by dbt core, focusing on basic schema validation and source freshness. dbt core provides four built-in generic tests that are essential for data modeling and ensuring data integrity. Generic tests can accept [additional test configurations](https://docs.getdbt.com/reference/data-test-configs).
It is also possible to define your own [custom generic tests](https://docs.getdbt.com/best-practices/writing-custom-generic-tests).

- [Singular tests](https://docs.getdbt.com/docs/build/data-tests#singular-data-tests): These are written in a SQL file with a query that returns records that fail the test. This type of test is straightforward and focuses on specific conditions or rules that data must meet.

### Unit tests

Unit tests are essential for validating complex SQL logic and transformations in dbt models. These tests are especially valuable when working with intricate SQL expressions. They help catch errors before deploying changes, ensuring the logic behaves as expected, particularly in critical models or when handling edge cases.

For more details on formatting unit tests, refer to the [official dbt documentation](https://docs.getdbt.com/reference/resource-properties/unit-tests).

## Guidelines for CHT Pipeline tests
To ensure data integrity and the reliability of the dbt models in the CHT Pipeline, it is essential to follow these testing guidelines:

- Basic generic tests for all models:
Every model should have generic tests to enforce critical constraints and relationships. Use dbt core build in generic tests.

- Singular or custom generic data tests for aggregation models:
For models that perform data aggregation, it is crucial to include singular data tests or custom generic data tests to ensure that the aggregated data meets the expected criteria. These tests help verify that:
  - Data is accurately aggregated according to the defined logic.
  - The results align with business expectations and requirements.
  - Custom data tests are particularly important for aggregation models, as errors in these models can lead to significant discrepancies in reports and analyses.

- Unit tests for complex logic:
Unit tests are not strictly required but are highly recommended, especially for models with complex transformation logic. Examples of when to use unit tests include:
  - Complex SQL Logic: Such as regex, date math, window functions, or extensive `CASE WHEN` statements.
  - Custom calculations: When creating functions or applying unique data processing logic.
  - Edge cases: To handle scenarios that are not typically found in actual data but may arise unexpectedly.

## Writing CHT Pipeline tests


- All models should have **schema tests**, specifically enforcing `unique`, `not_null`, and `relationships` where relevant.


- Custom data tests for aggregation models should be added to ensure the data is as expected. Only specific models need these tests.


- Add unit tests for complex logic, such as data math or window functions. These are not required but are good to have, especially if the model is covered by data tests. 


[CHT Pipeline](https://github.com/medic/cht-pipeline) contains a `/models` directory containing SQL files and YAML files for generic tests and a `/test` directory with folders for fixtures and singular tests.

```
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
{{< figure src="contacts-yml.png" link="contacts-yml.png" class=" center col-16 col-lg-12" >}}

**Singular data tests** are located in the `/test/sqltest/` folder and check data synchronization between source and final tables. The code block below contains a test to ensure that data between the `source` table and `contact` tables is synchronized correctly.
Records that should be deleted are properly removed from both tables.
All relevant fields between the two tables match, preserving data accuracy and integrity.
{{< figure src="contact-sql.png" link="contact-sql.png" class=" center col-16 col-lg-12" >}}

### Writing unit tests

Unit tests are defined in a YAML file inside a `tests` folder in each `model` group folder. The input format of choice is CSV using fixtures, defined in `/test/fixture` folder.

The code block below is an extract from the `/models/contacts/tests/contacts.yml` file containing the test to validate transformation and data integrity for the `contact` model.
{{< figure src="contact-unit-test.png" link="contact-unit-test.png" class=" center col-16 col-lg-12" >}}

The following images shows the content of the input fixtures.
{{< figure src="contact-document-metadata-initial.png" link="contact-document-metadata-initial.png" class=" center col-16 col-lg-12" >}}{{< figure src="contact-source-table-initial.png" link="contact-source-table-initial.png" class=" center col-16 col-lg-12" >}}

The fixture below represents the expected data:
{{< figure src="contact-initial-expected.png" link="contact-initial-expected.png" class=" center col-16 col-lg-12" >}}

## Running tests with Docker

dbt tests are run with Docker, to isolate dependencies and configurations, making the testing process reproducible and easier to manage. The scripts and configuration files below work together to automate the process of setting up a testing environment, and running dbt models and tests:

`docker-compose.yml`: Defines Docker services. It starts by running PostgreSQL with the initial setup using init.sql and then builds and runs a dbt Docker container configured to connect to PostgreSQL.

`init.sql`: A SQL script that initializes the PostgreSQL database by creating the required schema and table.

`dbt/Dockerfile`: Builds the dbt Docker image. It sets up the Python environment, installs dbt and its dependencies, and copies the necessary project files into the container.

`run_dbt_tests.sh`: This script orchestrates the process of running dbt tests using Docker. It starts PostgreSQL, waits for it to initialize, runs the dbt container to execute tests, and then cleans up by stopping and removing all containers.

`run_dbt_tests_docker.sh`: This script runs inside the dbt container. It sets the profiles directory, installs dbt dependencies, runs the dbt models, and ***executes the tests***.

`profile.yml`: The dbt profile configuration file that defines the database connection settings, using environment variables to connect to the PostgreSQL database.

### Prerequisites
- `Docker`

### Run the tests

1. Navigate to `test` folder.
2. Run the test script

```sh
./run_dbt_tests.sh
```

