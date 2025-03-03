---
title: "CHT Sync Setup with Docker"
weight: 3
linkTitle: "Docker"
description: >
  Setting up CHT Sync with Docker and the CHT
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
aliases:
   - /apps/guides/data/analytics/setup
   - /building/guides/data/analytics/setup
---

This guide will walk you through setting up a deployment of CHT Sync with the CHT using Docker. This path is recommended if you host the [CHT with Docker]({{< relref "hosting/4.x/production/docker" >}}).

## Prerequisites

- [Current version](https://docs.docker.com/engine/install/) of `docker` or current version of [Docker Desktop](https://www.docker.com/products/docker-desktop/) both of which include `docker compose`. Note that the older `docker-compose` is [no longer supported](https://www.docker.com/blog/announcing-compose-v2-general-availability/).
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [cht-sync](https://github.com/medic/cht-sync) GitHub repository (can be cloned via `git clone https://github.com/medic/cht-sync`).

## Setup

In the `cht-sync` folder, copy the values from the `env.template` file to a `.env` file. For more information, see the references on the [Environment variables page]({{< relref "hosting/analytics/environment-variables" >}}).

Configure the `COUCHDB_*` environment variables to connect to your CouchDB instance. For production CHT Core deployments, the port will most likely need to be set to `443` like this: `COUCHDB_PORT=443`. This is because CHT Core uses an `nginx` [reverse proxy]({{< relref "core/overview/architecture#overview" >}}) on port `443`, instead of the default `5984` port used in a stand-alone CouchDB instance which the `env.template` [has]({{< relref "hosting/analytics/environment-variables" >}}).

{{% alert title="Note" %}}
The first time you run the commands from any of the sections below it will need to download many Docker images and will take a while. You'll know it's done when you see `#8 DONE 0.0s` and you are returned to the command line. Be patient!
{{% /alert %}}

### Profiles

Running CHT Sync uses docker compose profiles to organize different sets of services. 

The following profiles are available:
- `local` - for local model development
- `production` - recommended setup for production
- `test` - for automated tests

#### Local

This setup involves starting couch2pg, PostgreSQL, pgAdmin and dbt. It assumes you have a CouchDB instance running, and you updated the `.env` CouchDB variables accordingly.

Run the Docker containers locally and wait for every container to be up and running:
```sh
docker compose --profile local up -d
```

You can verify this command worked by running `docker ps`. It should show four containers running including couch2pg, dbt, PostgreSQL, and pgAdmin.

When developing DBT models, it is helpful to test changes locally before committing them to a remote repository.

Set the path to the project to the `DBT_LOCAL_PATH` [environment variable]({{< relref "hosting/analytics/environment-variables" >}}) in `.env`.

The dbt container will run the models in the path specified in `DBT_LOCAL_PATH`.

#### Production

This setup involves starting couch2pg and one dbt container. It assumes you have an external CouchDB instance and Postgres DB. The credentials and settings for these databases are configured in [.env]({{< relref "hosting/analytics/environment-variables" >}}).

Run the Docker containers with profile `production` and wait for every container to be up and running:
```sh
docker compose --profile production up -d
```

You can verify this command worked by running `docker ps`. It should show three containers running; dbt, couch2pg and bastion.

### Controlling DBT performance

In production setups with large tables, it can be helpful to control how DBT runs.

#### Threads

the `DBT_THREADS` variable can be used to allow dbt to run independent models concurrently in the same process using threads.

#### Batching

For large tables, it may take a long time for all rows to be copied from the source table into the base models if the base models are very out of date or the first time CHT Sync is run. The `DBT_BATCH_SIZE` variable can be used to limit the number of records inserted in a single dbt run, which allows models to catch up to real-time gradually and progressively.

#### DBT tags
You can use [dbt tags](https://docs.getdbt.com/reference/resource-configs/tags) to run different sets of models independently. This can be useful if any custom models take a long time to update; by running some models independently from others, faster models can be allowed to complete before the slower models are finished.
To do this, add dbt containers with different values set for the `DBT_SELECTOR` environment variable. This variable will be passed to each dbt container as a `--select` argument. If it is set, the dbt container will only run models matching the [select condition](https://docs.getdbt.com/reference/node-selection/syntax#how-does-selection-work). Although its possible to include any condition, using tags is the simplest way to separate models. Ensure that models match only one condition, and include a selector `package:cht_pipeline_base` so that base models are run.

To do this, add an additional docker-compose file with different dbt containers and use profiles to control which services run.

```yaml
name: ${COMPOSE_PROJECT_NAME:-cht-sync}

x-dbt-base: &dbt-common
  build: ./dbt/
  working_dir: /dbt/
  environment: &dbt-env
    POSTGRES_HOST: ${POSTGRES_HOST}
    POSTGRES_PORT: ${POSTGRES_PORT:-5432}
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    POSTGRES_DB: ${POSTGRES_DB}
    POSTGRES_TABLE: ${POSTGRES_TABLE}
    POSTGRES_SCHEMA: ${POSTGRES_SCHEMA}
    ROOT_POSTGRES_SCHEMA: ${POSTGRES_SCHEMA}
    DATAEMON_INTERVAL: ${DATAEMON_INTERVAL}
    DBT_THREAD_COUNT: ${DBT_THREAD_COUNT}
    DBT_BATCH_SIZE: ${DBT_BATCH_SIZE}

services:
  dbt-tag-one:
    <<: *dbt-common
    profiles:
      - tags
    environment:
      <<: *dbt-env
      DBT_SELECTOR: package:cht_pipeline_base
      CHT_PIPELINE_BRANCH_URL: ${CHT_PIPELINE_BRANCH_URL}

  dbt-tag-one:
    <<: *dbt-common
    profiles:
      - tags
    environment:
      <<: *dbt-env
      DBT_SELECTOR: tag:tag-one
      CHT_PIPELINE_BRANCH_URL: ${CHT_PIPELINE_BRANCH_URL}

  dbt-tag-two:
    <<: *dbt-common
    profiles:
      - tags
    environment:
      <<: *dbt-env
      DBT_SELECTOR: tag:tag-two
      CHT_PIPELINE_BRANCH_URL: ${CHT_PIPELINE_BRANCH_URL}
```

```sh
docker compose --profile tags --profile production -f docker-compose.yml -f docker-compose.dbt-tags.yml up -d
```

### Cleanup

When you are done using the services, you can clean everything by running `down`.

For example, using the local profile, the command should look like:

```sh
docker compose -f docker-compose.yml down
```

To remove all the data volumes, add `-v` at the end of this command.
