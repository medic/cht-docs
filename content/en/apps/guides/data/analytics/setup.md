---
title: "CHT Sync Setup"
weight: 100
linkTitle: "Setup"
description: >
  Setting up CHT Sync with the CHT
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
---

{{% pageinfo %}}
These instructions apply to both CHT 3.x (beyond 3.12) and CHT 4.x.  
{{% /pageinfo %}}

Medic maintains CHT Sync which is an integrated solution designed to enable data synchronization between CouchDB and PostgreSQL for the purpose of analytics. It can easily be deployed using Docker. It is supported on CHT 3.12 and later, including CHT 4.x. By using CHT Sync a CHT deployment can easily get analytics by using a data visualization tool. All tools are open source and have no licensing fees.

CHT Sync has been designed to work in both local development environments for testing models or workflows, and in production environments. The setup can accommodate the needs of different stages or environments.

### Prerequisites

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- An `.env` file containing the environment variable. Placeholders can be found in the `env.template` file. The `.env` file should be located in the root directory of the project or set by the operating system. The variables should be customized accordingly for the specific deployment needs.

{{% alert title="Note" %}}
In order for CHT Sync to transform CouchDB data from the CHT in an easier to query format, it needs to be linked to [CHT Pipeline](https://github.com/medic/cht-pipeline), which contains transformation models for DBT. The schema differs from `couch2pg`. See [`./postgres/init-dbt-resources.sh`](https://github.com/medic/cht-sync/blob/main/postgres/init-dbt-resources.sh).
{{% /alert %}}

#### Environment variables

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
| `CHT_PIPELINE_BRANCH_URL` | `"https://github.com/medic/cht-pipeline.git#main"` |                                                                                                                                                |
| `COUCHDB_USER`            | `medic`                                            | Username of the CouchDB instance to sync with                                                                                                  |
| `COUCHDB_PASSWORD`        | `password`                                         | Password of the CouchDB instance to sync with                                                                                                  |
| `COUCHDB_DBS`             | `"medic"`                                          | Space separated list of databases to sync e.g `"medic medic_sentinel"`                                                                         |
| `COUCHDB_HOST`            | `couchdb`                                          | Host of the CouchDB instance to sync with                                                                                                      |
| `COUCHDB_PORT`            | `5984`                                             | Port of the CouchDB instance to sync with                                                                                                      |
| `COUCHDB_SECURE`          | `false`                                            |                                                                                                                                                |

{{% alert title="Note" %}}
If `CHT_PIPELINE_BRANCH_URL` is pointing to a private repo then you need to provide an access token in the url i.e. `https://<PAT>@github.com/medic/cht-pipeline.git#main`. In this example you will replace `<PAT>`  with an access token from Github. Instruction on how to generate one can be found [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
{{% /alert %}}

### Local Set up

TODO
just Postgres:     "docker-compose -f docker-compose.postgres.yml -f docker-compose.yml up -d",
just Postgrest (local PostgreSQL):     "docker-compose -f docker-compose.postgrest.yml -f docker-compose.yml up -d logstash postgrest dbt",


The local environment setup involves starting Logstash, PostgreSQL, PostgREST, DBT, and CouchDB. This configuration facilitates data synchronization, transformation, and storage for local development and testing. Fake data is generated for CouchDB.

1. Provide the databases you want to sync in the `.env` file:

```
COUCHDB_DBS=<dbs-to-sync> # space separated list of databases you want to sync e.g "medic medic_sentinel"
```


```
# project wide: optional
COMPOSE_PROJECT_NAME=pipeline

# postgrest and pogresql: required environment variables for 'gamma', prod and 'local'
POSTGRES_USER=<your-postgres-user>
POSTGRES_PASSWORD=<your-postgres-password>
POSTGRES_DB=<your-database>
POSTGRES_TABLE=<your-postgres-table>
POSTGRES_SCHEMA=<your-base-postgres-schema>

# dbt: required environment variables for 'gamma', 'prod' and 'local'
DBT_POSTGRES_USER=<your-postgres-dbt-user>
DBT_POSTGRES_PASSWORD=<your-postgres-password>
DBT_POSTGRES_SCHEMA=<your-dbt-postgres-schema>
DBT_POSTGRES_HOST=<your-postgres-host> # IP address
CHT_PIPELINE_BRANCH_URL="https://github.com/medic/cht-pipeline.git#main"

# couchdb and logstash: required environment variables for 'gamma', 'prod' and 'local'
COUCHDB_USER=<your-couchdb-user>
COUCHDB_PASSWORD=<your-couchdb-password>
COUCHDB_DBS=<dbs-to-sync> # space separated list of databases you want to sync e.g "medic medic_sentinel"
COUCHDB_HOST=<your-couchdb-host>
COUCHDB_PORT=<your-couchdb-port>
COUCHDB_SECURE=false
```

2. Install the dependencies and run the Docker containers locally:

```sh
# starts: logstash, postgres, postgrest,  data-generator, couchdb and dbt
npm install
npm run local
```

3. Wait for every container to be up and running.

### Production Setup

The production environment setup involves starting Logstash, PostgREST, and DBT. This configuration facilitates data synchronization, transformation, and storage for CHT production hosting.

1. Update the following environment variables in your `.env` file:

```
# project wide: optional
COMPOSE_PROJECT_NAME=pipeline

COUCHDB_DBS=<dbs-to-sync> # space separated list of databases you want to sync e.g "medic medic_sentinel"

# postgrest and pogresql: required environment variables for 'gamma', prod and 'local'
POSTGRES_USER=<your-postgres-user>
POSTGRES_PASSWORD=<your-postgres-password>
POSTGRES_DB=<your-database>
POSTGRES_TABLE=<your-postgres-table>
POSTGRES_SCHEMA=<your-base-postgres-schema>

# dbt: required environment variables for 'gamma', 'prod' and 'local'
DBT_POSTGRES_USER=<your-postgres-dbt-user>
DBT_POSTGRES_PASSWORD=<your-postgres-password>
DBT_POSTGRES_SCHEMA=<your-dbt-postgres-schema>
DBT_POSTGRES_HOST=<your-postgres-host> # IP address

# couchdb and logstash: required environment variables for 'gamma', 'prod' and 'local'
COUCHDB_PASSWORD=<your-couchdb-password>
COUCHDB_HOST=<your-couchdb-host>
COUCHDB_PORT=<your-couchdb-port>
COUCHDB_SECURE=false
```

2. (Optional) Start local version of PostgreSQL:
```
docker-compose -f docker-compose.postgres.yml -f docker-compose.yml up postgres
```

3. Install the dependencies and start the Docker containers:
```sh
# starts: logstash, postgrest and dbt
npm install
npm run prod
```
