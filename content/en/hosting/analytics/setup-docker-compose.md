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
