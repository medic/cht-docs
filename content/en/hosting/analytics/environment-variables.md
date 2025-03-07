---
title: "Environment Variables"
weight: 8
linkTitle: "Environment Variables"
description: >
  Environment variables for running CHT Sync 
aliases:
   - /apps/guides/data/analytics/environment-variables
   - /building/guides/data/analytics/environment-variables
---

There are three groups of environment variables. One for Postgres, one for CouchDB and one for DBT. These are found in the `.env` [file](https://github.com/medic/cht-sync/blob/main/env.template) and the `values.yaml` [file](https://github.com/medic/cht-sync/blob/main/deploy/cht_sync/values.yaml.template) for docker and Kubernetes respectively.
1. `POSTGRES_`: Used by PostgreSQL to establish the PostgreSQL database to synchronize CouchDB data to. They define the schema and table names to store the CouchDB data, as well as where the tables and views for the models defined in `CHT_PIPELINE_BRANCH_URL` will be created. 
2. `COUCHDB_`: Used by CouchDB to define the CouchDB instance to sync with. With `COUCHDB_DBS`, we can specify a list of databases to sync.
3. `DBT_`: Used by dbt to pull from the remote `git` repository, declare sync frequency and concurrency. 

| Name                      | Default                                               | Description                                                                                                                                |
|---------------------------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `COMPOSE_PROJECT_NAME`    | `pipeline`                                            | (Optional) Docker Compose name                                                                                                             |
| `POSTGRES_USER`           | `postgres`                                            | Username of the PostgreSQL database                                                                                                        |
| `POSTGRES_PASSWORD`       | `postgres`                                            | Password of the PostgreSQL database                                                                                                        |
| `POSTGRES_DB`             | `cht_sync`                                            | PostgreSQL database                                                                                                                        |
| `POSTGRES_SCHEMA`         | `v1`                                                  | PostgreSQL schema                                                                                                                          |
| `POSTGRES_TABLE`          | `couchdb`                                             | PostgreSQL table where the CouchDB data is copied                                                                                          |
| `POSTGRES_HOST`           | `postgres`                                            | PostgreSQL instance                                                                                                                        |
| `POSTGRES_PORT`           | `5432`                                                | PostgreSQL port  |
| `CHT_PIPELINE_BRANCH_URL` | `"https://github.com/medic/cht-pipeline.git#main"`    | cht-pipeline branch containing the dbt models                                                                                            |
| `DATAEMON_INTERVAL`       | `5`                                                   | Interval (in seconds) for looking for new changes in the CouchDB data                                                                      |
| `COUCHDB_USER`            | `medic`                                               | Username of the CouchDB instance                                                                                             |
| `COUCHDB_PASSWORD`        | `password`                                            | Password of the CouchDB instance                                                                                              |
| `COUCHDB_DBS`             | `"medic"`                                             | Comma separated list of databases to sync e.g `"medic, medic_sentinel"`                                                                     |
| `COUCHDB_HOST`            | `couchdb`                                             | Host of the CouchDB instance                                                                                                 |
| `COUCHDB_PORT`            | `5984`                                                | Port of the CouchDB instance                                                                                                 |
| `COUCHDB_SECURE`          | `false`                                               | Does the connection to CouchDB use HTTPS? |
| `DBT_THREAD_COUNT`          | 1                                               | Number of threads per DBT process |
| `DBT_BATCH_SIZE`          | 0                                               | Batch size for batched incremental runs |
| `DBT_LOCAL_PATH`          |                                                | When running DBT locally for development, the path to the models directory on the host |
| `DBT_SELECTOR`          | ''                                               | If using separate DBT processes, the select condition to select a subset of the models for a single dbt process. |

