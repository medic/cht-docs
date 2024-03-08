---
title: "Local CHT Sync Setup"
weight: 100
linkTitle: "Local CHT Sync Setup"
description: >
  Setting up a local deployment of CHT Sync with the CHT
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
| `COUCHDB_SECURE`          | `false`                                            | Is connection to CouchDB instance secure?                                                                                                      |

{{% alert title="Note" %}}
If `CHT_PIPELINE_BRANCH_URL` is pointing to a private GitHub repository, you'll need an access token in the URL. Assuming your repository is `medic/cht-pipeline`, you would replace  `<PAT>`  with an access token: `https://<PAT>@github.com/medic/cht-pipeline.git#main`. Please see [GitHub's instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) on how to generate a token.
{{% /alert %}}

## Setup
The following configurations facilitate data synchronization, transformation, and storage for local development and testing.

Copy the values in `env.template` file to the `.env` file and update them accordingly to the local configuration for the different scenarios below.

Install the dependencies:
```sh
npm install
```

### Sample CouchDB data
This setup involves starting Logstash, PostgreSQL, PostgREST, DBT, and CouchDB. Sample fake data is generated for CouchDB.

Run the Docker containers and wait for every container to be up and running:
```sh
# starts logstash, postgres, postgrest, generator (for fake data), couchdb and dbt
npm run local
```

This is equivalent to running:
```sh
# starts logstash, postgres, postgrest, generator (for fake data), couchdb and dbt
docker-compose -f docker-compose.couchdb.yml -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

#### With a separate CouchDB instance 
This setup involves starting Logstash, PostgreSQL, PostgREST, and DBT. It assumes you have a CouchDB instance running, and you updated the `.env` CouchDB variables accordingly.

Run the Docker containers locally and wait for every container to be up and running:
```sh
# starts logstash, postgres, postgrest, and dbt
docker-compose -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

#### With separate CouchDB and PostgreSQL instances
This local setup involves starting Logstash, PostgREST, and DBT. It assumes that CouchDB and PostgreSQL instances are run separately from the Docker Compose provided with CHT Sync, and the `.env` variables were updated to match those instances details.

Run the Docker containers locally and wait for every container to be up and running:
```sh
# starts logstash, postgrest, and dbt
docker-compose -f docker-compose.postgrest.yml -f docker-compose.yml up -d logstash postgrest dbt
```
### Setup Superset
To build data visualization dashboards, follow the [Superset instructions](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose/) to run Superset and connect it to the PostgreSQL database.
