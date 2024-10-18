---
title: "Environment Variables"
weight: 7
linkTitle: "Environment Variables"
description: >
  Environment variables for running CHT Sync 
aliases:
   - /apps/guides/data/analytics/environment-variables
---

There are two environment variable groups in the `.env` file (if using Docker Compose), or in the `values.yaml` file (if using Kubernetes). To successfully set up CHT Sync, it is important to understand the difference between them.
1. `POSTGRES_`: Used by PostgreSQL to establish the PostgreSQL database to synchronize CouchDB data to. They define the schema and table names to store the CouchDB data, as well as where the tables and views for the models defined in `CHT_PIPELINE_BRANCH_URL` will be created. 
2. `COUCHDB_`: Used by CouchDB to define the CouchDB instance to sync with. With `COUCHDB_DBS`, we can specify a list of databases to sync.

All the variables in the `.env` file:

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
| `DATAEMON_INTERVAL`       | `5`                                                   | Interval (in minutes) for looking for new changes in the CouchDB data                                                                      |
| `COUCHDB_USER`            | `medic`                                               | Username of the CouchDB instance                                                                                             |
| `COUCHDB_PASSWORD`        | `password`                                            | Password of the CouchDB instance                                                                                              |
| `COUCHDB_DBS`             | `"medic"`                                             | Space separated list of databases to sync e.g `"medic medic_sentinel"`                                                                     |
| `COUCHDB_HOST`            | `couchdb`                                             | Host of the CouchDB instance                                                                                                 |
| `COUCHDB_PORT`            | `5984`                                                | Port of the CouchDB instance                                                                                                 |
| `COUCHDB_SECURE`          | `false`                                               | Is connection to CouchDB instance secure?                                                                                                  |

