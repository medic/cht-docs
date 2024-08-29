---
title: "Testing DBT models in CHT Pipeline"
linkTitle: "Testing DBT Models in CHT Pipeline"
weight: 6
description: >
  Guide for testing DBT models in CHT Pipeline
---

## Overview

Adding dbt tests to your workflows will check code accuracy and data integrity. It aims to prevent data quality regressions when dbt models are written or modified. And also very important, it will help the team stay engaged with the data and adapt more quickly. By including testing during the development process, teams ensure their data changes are solid.

## Types of tests in DBT Core

In DBT Core, there are two main types of tests: [data tests](https://docs.getdbt.com/docs/build/data-tests) and [unit tests](https://docs.getdbt.com/docs/build/unit-tests). The main difference is that data tests are meant to be executed with every pipeline run to validate data integrity, and unit tests are meant to be executed with every CI run to validate transformation logic integrity.

Data tests ensure your warehouse data meets specific criteria and are run at every data refresh; unit tests allow you to validate your SQL modeling logic on a small set of static inputs (typically defined using seeds or fixtures) before you materialize your full model in production.

### Data Tests

Can be further divided into two types:
- Generic tests: These are foundational tests provided by DBT core, focusing on basic schema validation and source freshness. DBT core provides [four built-in generic tests](https://docs.getdbt.com/docs/build/data-tests#generic-data-tests) that are essential for data modeling and ensuring data integrity. Generic tests can accept [additional test configurations](https://docs.getdbt.com/reference/data-test-configs).
It is also possible to define your own [custom generic tests](https://docs.getdbt.com/best-practices/writing-custom-generic-tests).
Using a generic test is done by adding it to the model's property (yml) file.

- [Singular tests](https://docs.getdbt.com/docs/build/data-tests#singular-data-tests): These are written in a SQL file with a query that returns records that fail the test. This type of test is straightforward and focuses on specific conditions or rules that data must meet.

Regardless of the type of data test, the process is the same: dbt will compile the code to a SQL SELECT statement and execute it against your database. If the query returns any rows, this indicates a failure.

### Unit Tests

From dbt official documentation ([When to add a unit test to your model | dbt Developer Hub](https://docs.getdbt.com/docs/build/unit-tests#when-to-add-a-unit-test-to-your-model) ):

> You should unit test a model:
> - When your SQL contains complex logic:
>   - Regex
>   - Date math
>   - Window functions
>   - `case when` statements when there are many `when`s
>   - Truncation
> - When you're writing custom logic to process input data, similar to creating a function.
> - We don't recommend conducting unit testing for functions like `min()` since these functions are tested extensively by the warehouse. If an unexpected issue arises, it's more likely a result of issues in the underlying data rather than the function itself. Therefore, fixture data in the unit test won't provide valuable information.
> - Logic for which you had bugs reported before.
> - Edge cases not yet seen in your actual data that you want to handle.
> - Prior to refactoring the transformation logic (especially if the refactor is significant).
> - Models with high "criticality" (public, contracted models or models directly upstream of an exposure).

Unit tests must be defined in a YML file in your `models/` directory.

Read the [reference doc](https://docs.getdbt.com/reference/resource-properties/unit-tests) for more details about formatting unit tests.

## Test implementation in CHT pipeline

This is an extract of our folder and file structure necessary to understand the followings sections:

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
        /fixtures                                     --> input data for unit tests
            data_record/
                data_record_initial_expected.csv
                data_record_source_table_initial.csv
                data_record_document_metadata_initial.csv
        /sqltest                                       --> singular data tests
            contact.sql
            data_record.sql
            patient.sql
```

### Data Tests

The first test to implement when creating or modifying our models are **generic data tests**. This are included in the YAML file under the `data-tests` tag. We aim to include all necessary basic validation tests to ensure data integrity within the model. The following image contains an extract of the properties of the  `contacts.yml` file and includes several tests, such as `relationships`, `not_null`, and `unique`. In this case for the `contact` model.
{{< figure src="contacts-yml.png" link="contacts-yml.png" class=" center col-16 col-lg-12" >}}

The **singular data tests** can be found in the `/test/sqltest/` folder.
This singular test aims to ensure that data between the source and the final tables is synchronized correctly. By running this test, you can quickly identify any discrepancies or errors in data synchronization and take appropriate action to resolve them, maintaining the overall consistency and reliability of your data systems. For example, the following image shows the test to ensure that data between the `source` table and `contact` tables is synchronized correctly.
Records that should be deleted are properly removed from both tables.
All relevant fields between the two tables match, preserving data accuracy and integrity.
{{< figure src="contact-sql.png" link="contact-sql.png" class=" center col-16 col-lg-12" >}}

### Unit Tests

Unit tests are defined in a YML file inside a `tests` folder in each `model` group folder. The input format of choice is CSV using fixtures, defined in `/test/fixture` folder.

The following image shows the content in `/models/contacts/tests/contacts.yml` file showing the test to validate transformation and data integrity for `contact` model.
{{< figure src="contact-unit-test.png" link="contact-unit-test.png" class=" center col-16 col-lg-12" >}}

The following images shows the content of the input fixtures.
{{< figure src="contact-document-metadata-initial.png" link="contact-document-metadata-initial.png" class=" center col-16 col-lg-12" >}}{{< figure src="contact-source-table-initial.png" link="contact-source-table-initial.png" class=" center col-16 col-lg-12" >}}

And finally, the fixture representing the expected data:
{{< figure src="contact-initial-expected.png" link="contact-initial-expected.png" class=" center col-16 col-lg-12" >}}

## Test execution using Docker

By running dbt tests in a Dockerized environment, we isolate dependencies and configurations, making the testing process more reproducible and easier to manage. These scripts and configuration files work together to automate the process of setting up a testing environment, running dbt models and tests:

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

