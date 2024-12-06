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

For production CHT Core deployments, the port will most likely need to be set to `443` like this: `COUCHDB_PORT=443`. This is because CHT Core uses an `nginx` [reverse proxy]({{< relref "core/overview/architecture#overview" >}}) on port `443`, instead of the default `5984` port used in a stand-alone CouchDB instance which the `env.template` [has]({{< relref "hosting/analytics/environment-variables" >}}).

{{% alert title="Note" %}}
The first time you run the commands from any of the sections below it will need to download many Docker images and will take a while. You'll know it's done when you see `#8 DONE 0.0s` and you are returned to the command line. Be patient!
{{% /alert %}}

### Separate CouchDB instance 

This setup involves starting couch2pg, PostgreSQL and dbt. It assumes you have a CouchDB instance running, and you updated the `.env` CouchDB variables accordingly.

Run the Docker containers locally and wait for every container to be up and running:
```sh
docker compose -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 3 containers running including couch2pg, dbt and PostgreSQL:

```shell
docker ps --format "table {{.Image}}\t{{.Status}}\t{{.Names}}" --filter "name=cht-sync*" 
IMAGE               STATUS              NAMES
cht-sync-couch2pg   Up 59 seconds       cht-sync-couch2pg-1
cht-sync-dbt        Up About a minute   cht-sync-dbt-1
postgres:16         Up About a minute   cht-sync-postgres-1
```

### Separate CouchDB and PostgreSQL instances

This local setup involves starting couch2pg and dbt. It assumes that CouchDB and PostgreSQL instances are run separately from the Docker Compose provided with CHT Sync, and the `.env` variables were updated to match those instances details.

Run the Docker containers locally and wait for every container to be up and running:

```sh
docker compose -f docker-compose.yml up -d
```

You can verify this command worked by running `docker ps`. It should show 2 containers running: couch2pg and dbt.

```shell
docker ps --format "table {{.Image}}\t{{.Status}}\t{{.Names}}" --filter "name=cht-sync*" 
IMAGE               STATUS              NAMES
cht-sync-couch2pg   Up 59 seconds       cht-sync-couch2pg-1
cht-sync-dbt        Up About a minute   cht-sync-dbt-1
```

### PostgreSQL access

By default, the PostgreSQL server is only accessible to `dbt` and `couch2pg` via the Docker network. This is an intentional secure by default design. If you need to have remote access to PostgreSQL, you have two options:

1. Development: Run [pgAdmin](https://www.pgadmin.org/) and also expose PostgreSQL ports 
2. Production: Run a bastion host and use SSH tunnels 

#### PGAdmin + PostgreSQL ports

pgAdmin is a web GUI client for PostgreSQL. Run it with the following compose call:

```sh
docker compose -f docker-compose.pgadmin.yml -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

Be aware that this exposes an the pgAdmin app with no password. Always secure this immediately after deploying by logging in and it will request you to set a password. The pgadmin app will be accessible at `http://your-server.com:5050`.

Additionally, `docker-compose.pgadmin.yml` file extends the PostgreSQL Docker service to expose it on the standard `5432` port.  Using any PostgreSQL client, you can connect using the IP of your server.

#### Bastion host

The more secure and production ready option is to run a bastion host.  First start by copying the `./bastion/authorized_keys.example` file to `./bastion/authorized_keys`.  Add the SSH keys of users who need access, one per line, in the `authorized_keys` you just created.

Start the bastion host, along with other services, with the following compose call:

```sh
docker compose -f docker-compose.bastion.yml -f docker-compose.postgres.yml -f docker-compose.yml up -d
```

You can then set up an SSH tunnel with the following shell command, being sure to replace `YOUR-SERVER-ADDRESS` with your real server address:

```sh
ssh -N -L 5432:cht-sync-postgres-1:5432 bastion@YOUR-SERVER-ADDRESS -p 22222
```

Then point your PostgreSQL client of choice to `YOUR-SERVER-ADDRESS:5432` to access the database, again being sure to replace `YOUR-SERVER-ADDRESS` with your real server address.

### Cleanup

When you are done using the services, you can clean everything by running `down`.

For example, in the scenario of [separate couchdb instance]({{< relref "#separate-couchdb-instance" >}}), the command should look like:

```sh
docker compose -f docker-compose.postgres.yml -f docker-compose.yml down
```

To remove all the data volumes, add `-v` at the end of this command.
