---
title: "Local CHT Sync Setup"
weight: 2
linkTitle: "Local CHT Sync Setup"
description: >
  Setting up a local deployment of CHT Sync with the CHT
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
---

Before setting up CHT Sync in production, it's very handy to be able to run it locally. This will allow you to experiment with the data flow and easily query development data quickly and locally. 

These instructions assume you're running CHT Sync, CHT Core and PostgreSQL either locally on your workstation or on a local server. They are not meant to be used to deploy a secure, always on production instance.

## Setup

Copy the values in `env.template` file to the `.env` file. For more information, see the references on the [Environment variables page]({{< relref "apps/guides/data/analytics/environment-variables" >}}).

{{% alert title="Note" %}}
The first time you run the commands from any of the sections below it will need to download many Docker images and will take a while. You'll know it's done when you see `#8 DONE 0.0s` and you are returned to the command line. Be patient!
{{% /alert %}}

### Run all CHT Sync services locally
This setup involves starting couch2pg, PostgreSQL, pgAdmin, DBT, and CouchDB.

Run the Docker containers and wait for every container to be up and running:
```sh
docker-compose -f docker-compose.couchdb.yml -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 5 containers running including couch2pg, DBT, PostgreSQL, CouchDB and pgAdmin.

Now that all services are running, use pgAdmin to connect to server `postgres:5432` with user `postgres` and password `postgres`. You should be able to see data being inserted into the `v1.medic` table when inserting sample data into the CouchDB instance.

### Separate CouchDB instance 
This setup involves starting couch2pg, PostgreSQL, pgAdmin and DBT. It assumes you have a CouchDB instance running, and you updated the `.env` CouchDB variables accordingly.

Run the Docker containers locally and wait for every container to be up and running:
```sh
docker-compose -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 4 containers running including couch2pg, DBT, PostgreSQL, and pgAdmin.

### Separate CouchDB and PostgreSQL instances
This local setup involves starting couch2pg and DBT. It assumes that CouchDB and PostgreSQL instances are run separately from the Docker Compose provided with CHT Sync, and the `.env` variables were updated to match those instances details.

Run the Docker containers locally and wait for every container to be up and running:
```sh
docker-compose -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 2 containers running: couch2pg and DBT.

### Cleanup
When you are done using the services, you can clean everything by running `down`.

For example, in the scenario of [running all CHT Sync services]({{< relref "#run-all-cht-sync-services-locally" >}}), the command should look like:

```sh
docker compose -f docker-compose.couchdb.yml -f docker-compose.postgres.yml -f docker-compose.yml down
```

To remove all the data volumes, add `-v` at the end of this command.

## Setup Superset
To build data visualization dashboards, follow the [Superset instructions](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose/) to run Superset and connect it to the PostgreSQL database. Medic recommends adding a way to track Superset changes via a git repository to make it easier to track changes over time and potentially catch and remediate bugs and regressions. This [guide](https://www.restack.io/docs/superset-knowledge-apache-superset-dashboard-code) provides instructions on how to manage Superset dashboards with as code.
