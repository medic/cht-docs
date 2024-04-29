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

Install the dependencies:
```sh
npm install
```

{{% alert title="Note" %}}
The first time you run the commands from any of the sections below it will need to download many Docker images and will take a while. You'll know it's done when you see `#8 DONE 0.0s` and you are returned to the command line. Be patient!
{{% /alert %}}

### Sample CouchDB data
This setup involves starting Logstash, PostgreSQL, PostgREST, DBT, and CouchDB. Sample fake data is generated for CouchDB.

Run the Docker containers and wait for every container to be up and running:
```sh
docker-compose -f docker-compose.couchdb.yml -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 6 containers running including Logstash, DBT, data generator, PostgreSQL, CouchDB and PostgREST (note the `t` at the end!).

Now that all services are running, use a PostgreSQL client like [pgAdmin](https://www.pgadmin.org/) or [Beekeeper](https://www.beekeeperstudio.io/) to connect to server `localhost:5432` with user `postgres` and password `postgres`. You should be able to see sample data being inserted into the `v1.medic` table.

### Separate CouchDB instance 
This setup involves starting Logstash, PostgreSQL, PostgREST, and DBT. It assumes you have a CouchDB instance running, and you updated the `.env` CouchDB variables accordingly.

Run the Docker containers locally and wait for every container to be up and running:
```sh
docker-compose -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 4 containers running including Logstash, DBT, PostgreSQL, and PostgREST.

### Separate CouchDB and PostgreSQL instances
This local setup involves starting Logstash, PostgREST, and DBT. It assumes that CouchDB and PostgreSQL instances are run separately from the Docker Compose provided with CHT Sync, and the `.env` variables were updated to match those instances details.

Run the Docker containers locally and wait for every container to be up and running:
```sh
docker-compose -f docker-compose.postgrest.yml -f docker-compose.yml up -d logstash postgrest dbt
```

You can verify this command worked by running `docker ps`. It should show 3 containers running including Logstash, DBT, and PostgREST.

### Cleanup
When you are done using the services, you can clean everything by running `down`.

For example, in the scenario of the [Sample CouchDB data]({{< relref "#sample-couchdb-data" >}}), the command should look like:

```sh
docker compose -f docker-compose.couchdb.yml -f docker-compose.postgres.yml -f docker-compose.yml down
```

To remove all the data volumes, add `-v` at the end of this command.

## Setup Superset
To build data visualization dashboards, follow the [Superset instructions](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose/) to run Superset and connect it to the PostgreSQL database.
