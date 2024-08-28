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

We organize our models by grouping them into folders based on their relationships. Each model folder contains a YAML file that holds that folder models properties.

### Data Tests

The first test to implement when creating or modifying our models are **generic data tests**. This are included in the YAML file under the `data-tests` tag. We aim to include all necessary basic validation tests to ensure data integrity within the model. For example, the following image contains an extract of the properties of the models under the `contacts` directory and includes several tests, such as `relationships`, `not_null`, and `unique`. In this case for the `contact` model.
{{< figure src="contacts-yml.png" link="contacts-yml.png" class=" center col-16 col-lg-12" >}}

The **singular data tests** can be found in the `/test/sqltest/` folder.
This singular test aims to ensure that data between the source and the final tables is synchronized correctly. By running this test, you can quickly identify any discrepancies or errors in data synchronization and take appropriate action to resolve them, maintaining the overall consistency and reliability of your data systems. For example, the following image shows the test to ensure that data between the `source` table and `contact` tables is synchronized correctly.
Records that should be deleted are properly removed from both tables.
All relevant fields between the two tables match, preserving data accuracy and integrity.
{{< figure src="contact-sql.png" link="contact-sql.png" class=" center col-16 col-lg-12" >}}


## Test execution
## Test failure and debugging
## Integration with CI/CD Pipeline
## Documentation and Maintenance
## Additional Resources
