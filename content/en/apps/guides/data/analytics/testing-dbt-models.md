---
title: "Testing DBT models in CHT Pipeline"
linkTitle: "Testing DBT Models"
weight: 6
description: >
  Guide for testing DBT models in CHT Pipeline
---

## Overview

Adding dbt tests to your workflows will check code accuracy and data integrity. It aims to prevent data quality regressions when dbt models are written or modified. And also very important, it will help the team stay engaged with your data and adapt more quickly. By including testing during the development process, teams ensure their data changes are solid.

## Types of tests in DBT Core

In DBT Core, there are two main types of tests: [data tests](https://docs.getdbt.com/docs/build/data-tests) and [unit tests](https://docs.getdbt.com/docs/build/unit-tests). The main difference is that data tests are meant to be executed with every pipeline run to validate data integrity, and unit tests are meant to be executed with every CI run to validate transformation logic integrity.

Data tests ensure your warehouse data meets specific criteria and are run at every data refresh; unit tests allow you to validate your SQL modeling logic on a small set of static inputs (typically defined using seeds or fixtures) before you materialize your full model in production.

### Data Tests

### Unit Tests

## Test implementation examples
## Test execution
## Test failure and debugging
## Integration with CI/CD Pipeline
## Documentation and Maintenance
## Additional Resources
