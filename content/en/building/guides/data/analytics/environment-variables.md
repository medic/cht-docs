---
title: "Environment Variables"
weight: 4
linkTitle: "Environment Variables"
description: >
  Environment variables for running CHT Sync 
aliases:
   - /apps/guides/data/analytics/environment-variables
---

There are three environment variable groups in the `.env` file. To successfully set up CHT Sync, it is important to understand the difference between them.
1. `POSTGRES_`: Used by PostgreSQL to establish the PostgreSQL database to synchronize CouchDB data to. They define the schema and table names to store the CouchDB data, as well as where the tables and views for the models defined in `CHT_PIPELINE_BRANCH_URL` will be created. 
2. `COUCHDB_`: Used by CouchDB to define the CouchDB instance to sync with. With `COUCHDB_DBS`, we can specify a list of databases to sync.

All the variables in the `.env` file:

| Name                      | Default                                               | Description                                                                                                                                |
|---------------------------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `COMPOSE_PROJECT_NAME`    | `pipeline`                                            | (Optional) Docker Compose name                                                                                                             |
| `POSTGRES_USER`           | `postgres`                                            | Username of the PostgreSQL database                                                                                                        |
| `POSTGRES_PASSWORD`       | `postgres`                                            | Password of the PostgreSQL database                                                                                                        |
| `POSTGRES_DB`             | `data`                                                | PostgreSQL database                                                                                                                        |
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

{{% alert title="Note" %}}
If `CHT_PIPELINE_BRANCH_URL` is pointing to a private GitHub repository, you'll need an access token in the URL. Assuming your repository is `medic/cht-pipeline`, you would replace  `<PAT>`  with an access token: `https://<PAT>@github.com/medic/cht-pipeline.git#main`. Please see [GitHub's instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) on how to generate a token. If you create a fine-grained access token you need to provide read and write access to the [contents](https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28#repository-permissions-for-contents) of the repository.
{{% /alert %}}
