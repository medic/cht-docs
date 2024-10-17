---
title: "Local CHT Sync Setup"
weight: 4
linkTitle: "Local CHT Sync Setup"
description: >
  Setting up a local deployment of CHT Sync with the CHT
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
aliases:
   - /apps/guides/data/analytics/setup
---

Before setting up CHT Sync in production, it's very handy to be able to run it locally. This will allow you to experiment with the data flow and easily query development data quickly and locally. 

These instructions assume you're running CHT Sync, CHT Core and PostgreSQL either locally on your workstation or on a local server. They are not meant to be used to deploy a secure, always on production instance.

## CHT Sync Prerequisites

- [Current version](https://docs.docker.com/engine/install/) of `docker` or current version of [Docker Desktop](https://www.docker.com/products/docker-desktop/) both of which include `docker compose`. Note that the older `docker-compose` is [no longer supported](https://www.docker.com/blog/announcing-compose-v2-general-availability/).
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  (Node 20 LTS or newer)
- [CHT Sync](https://github.com/medic/cht-sync) GitHub repository (can be cloned via `git clone https://github.com/medic/cht-sync`).

## Setup

Copy the values in `env.template` file to the `.env` file. For more information, see the references on the [Environment variables page]({{< relref "hosting/analytics/environment-variables" >}}).

{{% alert title="Note" %}}
The first time you run the commands from any of the sections below it will need to download many Docker images and will take a while. You'll know it's done when you see `#8 DONE 0.0s` and you are returned to the command line. Be patient!
{{% /alert %}}

### Separate CouchDB instance 
This setup involves starting couch2pg, PostgreSQL, pgAdmin and dbt. It assumes you have a CouchDB instance running, and you updated the `.env` CouchDB variables accordingly.

Run the Docker containers locally and wait for every container to be up and running:
```sh
docker compose -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 4 containers running including couch2pg, dbt, PostgreSQL, and pgAdmin.

### Separate CouchDB and PostgreSQL instances
This local setup involves starting couch2pg and dbt. It assumes that CouchDB and PostgreSQL instances are run separately from the Docker Compose provided with CHT Sync, and the `.env` variables were updated to match those instances details.

Run the Docker containers locally and wait for every container to be up and running:
```sh
docker compose -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 2 containers running: couch2pg and dbt.

### Cleanup
When you are done using the services, you can clean everything by running `down`.

For example, in the scenario of [separate couchdb instance]({{< relref "#separate-couchdb-instance" >}}), the command should look like:

```sh
docker compose -f docker-compose.postgres.yml -f docker-compose.yml down
```

To remove all the data volumes, add `-v` at the end of this command.

## Setup Superset
To build data visualization dashboards, follow the [Superset instructions](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose/) to run Superset and connect it to the PostgreSQL database. It is recommended that a way to track Superset changes be added via a git repository or any other version control system to make it easier to track changes over time and potentially catch and remediate bugs and regressions. Instruction on how to do this using a Github action can be found [here](https://github.com/medic/cht-sync/blob/main/.github/actions/superset-backup/README.md).