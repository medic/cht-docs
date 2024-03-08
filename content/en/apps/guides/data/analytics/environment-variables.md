---
title: "Environment Variables"
weight: 3
linkTitle: "Environment Variables"
description: >
  Environment variables for running CHT Sync 
---

There are three environment variable groups in the `.env` file. To successfully set up CHT Sync, it is important to understand the difference between them.
1. `POSTGRES_`: Used by PostgREST and PostgreSQL to establish the PostgreSQL database to synchronize CouchDB data to. They also define the schema and table names to store the CouchDB data. The main objective is to define the environment where the raw CouchDB data will be copied.
2. `DBT_`: Exclusive to the DBT configuration. The main objective is to define the environment where the tables and views for the models defined in `CHT_PIPELINE_BRANCH_URL` will be created. It is important to separate this environment from the previous group. `DBT_POSTGRES_SCHEMA` must be different from `POSTGRES_SCHEMA`. `DBT_POSTGRES_HOST` has to be the Postgres instance created with the environment variables set in the first group.
3. `COUCHDB_`: Used by CouchDB and Logstash to define the CouchDB instance to sync with. With `COUCHDB_DBS`, we can specify a list of databases to sync.

All the variables in the `.env` file:

| Name                      | Default                                            | Description                                                                                                                                    |
|---------------------------|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `COMPOSE_PROJECT_NAME`    | `pipeline`                                         | (Optional) Docker Compose name                                                                                                                 |
| `POSTGRES_USER`           | `postgres`                                         | Username of the PostgreSQL database to copy CouchDB data to                                                                                    |
| `POSTGRES_PASSWORD`       | `postgres`                                         | Password of the PostgreSQL database to copy CouchDB data to                                                                                    |
| `POSTGRES_DB`             | `data`                                             | PostgreSQL database where the CouchDB data is copied                                                                                           |
| `POSTGRES_SCHEMA`         | `v1`                                               | PostgreSQL schema where the CouchDB data is copied                                                                                             |
| `POSTGRES_TABLE`          | `medic`                                            | PostgreSQL table where the CouchDB data is copied. For `DBT` use only.                                                                         |
| `POSTGRES_HOST`           | `localhost`                                        | PostgreSQL instance to copy CouchDB data to. To be set only if the PostgreSQL instance is different than the container provided with CHT Sync. |
| `DBT_POSTGRES_USER`       | `postgres`                                         | Username of the PostgreSQL database where `DBT` creates tables and views from the models in `CHT_PIPELINE_BRANCH_URL`                          |
| `DBT_POSTGRES_PASSWORD`   | `postgres`                                         | Password of the PostgreSQL database where `DBT` creates tables and views from the models in `CHT_PIPELINE_BRANCH_URL`                          |
| `DBT_POSTGRES_SCHEMA`     | `dbt`                                              | PostgreSQL schema where `DBT` creates tables and views from the models in `CHT_PIPELINE_BRANCH_URL`                                            |
| `DBT_POSTGRES_HOST`       | `postgres`                                         | PostgreSQL instance IP or endpoint                                                                                                             |
| `CHT_PIPELINE_BRANCH_URL` | `"https://github.com/medic/cht-pipeline.git#main"` | CHT Pipeline branch containing the `DBT` models                                                                                                                                   |
| `COUCHDB_USER`            | `medic`                                            | Username of the CouchDB instance to sync with                                                                                                  |
| `COUCHDB_PASSWORD`        | `password`                                         | Password of the CouchDB instance to sync with                                                                                                  |
| `COUCHDB_DBS`             | `"medic"`                                          | Space separated list of databases to sync e.g `"medic medic_sentinel"`                                                                         |
| `COUCHDB_HOST`            | `couchdb`                                          | Host of the CouchDB instance to sync with                                                                                                      |
| `COUCHDB_PORT`            | `5984`                                             | Port of the CouchDB instance to sync with                                                                                                      |
| `COUCHDB_SECURE`          | `false`                                            | Is connection to CouchDB instance secure?                                                                                                      |

{{% alert title="Note" %}}
If `CHT_PIPELINE_BRANCH_URL` is pointing to a private GitHub repository, you'll need an access token in the URL. Assuming your repository is `medic/cht-pipeline`, you would replace  `<PAT>`  with an access token: `https://<PAT>@github.com/medic/cht-pipeline.git#main`. Please see [GitHub's instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) on how to generate a token.
{{% /alert %}}
