---
title: "Tuning dbt runs for performance"
weight: 6
linkTitle: "dbt Tuning"
description: >
  Tuning DBT variables for performance
relatedContent: >
  technical-overview/architecture/cht-sync
  hosting/analytics/environment-variables
  hosting/analytics/setup-docker-compose
  hosting/analytics/setup-kubernetes
---

In production setups with large tables, it can be helpful to control how DBT runs.

## Threads

The `DBT_THREADS` variable can be used to allow dbt to run independent models concurrently in the same process using threads.

This can allow models to update more quickly by reducing the total duration of a dbt run.

More threads means more database processes running concurrently which can create performance issues; this value is per process, so if running separate processes, the total number of concurrent processes in the db will be `DBT_THREADS x the number of processes`.
For a single process, models can only be run concurrently if they are independent; if model A depends on model B, model A will never be run before model B finishes.

A sensible default is `DBT_THREADS=3`.

## Batching

For large tables, it may take a long time for all rows to be copied from the source table into the base models the first time CHT Sync is run, or if the base models are very out of date. The `DBT_BATCH_SIZE` variable can be used to limit the number of records inserted in a single dbt run, which allows models to catch up to real-time gradually and progressively.
Batch size can be tuned to reduce the duration of a single dbt run, but setting it too small will not have a significant effect, and models will not be able to catch up to real-time if the batch size is smaller than the number of records added to the `couchdb` table during a single dbt run.

A sensible default is `DBT_BATCH_SIZE=100000`.

## Multiple dbt containers
Instead of a single dbt container that runs all models, CHT Sync supports having multiple dbt containers that each run a different set of models independently.
This can be useful if any custom models take a long time to update; by running some models independently from others, faster models can complete before the slower models are finished.

Each dbt container is passed an environment variable `DBT_SELECTOR` that is used as a `--select` [argument](https://docs.getdbt.com/reference/node-selection/methods) to the dbt command.

One dbt container should be set up to run the base models. This can be done by using the selector `package:cht_pipeline_base` or, to separate telemetry models from base models, use `tag:base` and `tag:users`.

To run custom models in separate containers, either use a package select with your dbt package name (`package:[YOUR_PACKAGE_NAME]`), or for more fine-grained control, add [tags]({{< relref "hosting/analytics/tuning-dbt#dbt-tags" >}}) to your models and use tag selectors (`tag:[YOUR_TAG]`).
Although it is possible to use any condition, using tags is the simplest way to separate models.

How to configure the different dbt containers to use these selectors depends on whether CHT Sync is running in [docker-compose]({{< relref "hosting/analytics/setup-docker-compose#tuning-dbt" >}}) or [kubernetes]({{< relref "hosting/analytics/setup-kubernetes#tuning-dbt" >}}).

In Kubernetes, add the selectors to the `values.yaml` file as a list called `dbt_selectors`
```yaml
dbt_selectors:
  - "package:cht_pipeline_base"
  - "tag:tag-one"
  - "tag:tag-two"
```

This will create one pod per selector.

With docker compose, create a new docker compose file and include one dbt container per selector.
