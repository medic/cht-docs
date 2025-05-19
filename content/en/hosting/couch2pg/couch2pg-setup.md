---
title: "Local couch2pg Setup"
linkTitle: Local Setup
weight: 3
description: >
  Setting up a Couch2pg service to download data from CouchDB to Postgres database
relatedContent: >
  building/local-setup
aliases:
   - /apps/tutorials/couch2pg-setup
   - /building/tutorials/couch2pg-setup
---

{{< callout type="warning" >}}
  CHT couch2pg is deprecated. For data synchronization, refer to [CHT Sync]({{< ref "hosting/analytics" >}}).
{{< /callout >}}

This tutorial will take you through setting up a couch2pg service.

By the end of the tutorial you should be able to:

- Set up a couch2pg service
- Run the couch2pg service

[CHT Couch2pg](https://github.com/medic/cht-couch2pg) is a background process that moves data from Couchdb to Postgres through one way replication. It therefore, needs to have full read and write access to both the Postgres Database and Couchdb upstream.  It is built in nodejs and can be set up as a background process using systemd. Review this [architecture diagram]({{< relref "technical-overview/architecture#overview" >}}) to get a conceptual understanding of how couch2pg works.

## Brief Overview of key environmental variables

*COUCHDB_URL* is the CouchDB instance URL with no trailing slash after `/medic`, format: `https://[user]:[password]@localhost:[port]/medic`

*POSTGRESQL_URL* is the PostgreSQL instance URL, format: `postgres://[user]:[password]@localhost:[port]/[database name]`

*COUCH2PG_SLEEP_MINS* is the interval size in minutes Couch2pg will use to poll Couchdb.

*COUCH2PG_DOC_LIMIT* is the number of documents Couch2pg will fetch in each query.

*COUCH2PG_RETRY_COUNT* is the amount of times couch2pg should retry a failed connection before it fails.

*COUCH2PG_CHANGES_LIMIT* is the number of changes to query since the last sync operation.

To read more about environmental variables, see the [CHT Couch2pg readme](https://github.com/medic/cht-couch2pg#readme).

## Required Resources

Before you begin, you need to have some useful software and tools that are required for things to work:

* [nodejs](https://nodejs.org/en/) 8 up to 12. 
* [npm](https://www.npmjs.com/get-npm)
* [PostgreSQL](https://www.postgresql.org/) 9.4 or later

## Prerequisites
You should have a functioning [CHT instance installed locally]({{< ref "building/local-setup" >}})

You should have a working database with a user that has full creation rights on the database. A database `POSTGRES_DB_NAME` and `couch2pg` user can be created and access granted using the following query:
```
CREATE DATABASE POSTGRES_DB_NAME;
CREATE USER couch2pg WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE POSTGRES_DB_NAME TO couch2pg;
```

All steps below require you to have a local clone of the repo.
```shell
git clone https://github.com/medic/cht-couch2pg.git
```

## Setting up with environment variables

1. Change directory into the repo's directory where you cloned it: `cd /path/to/cht-couch2pg`

2. Install dependencies: `npm ci`

3. Export the four variables with the correct values:
```shell
export POSTGRESQL_URL=postgres://[user]:[password]@localhost:[port]/[database name]
export COUCHDB_URL=https://[user]:[password]@localhost:[port]/medic
export COUCH2PG_DOC_LIMIT=1000
export COUCH2PG_RETRY_COUNT=5
export COUCH2PG_SLEEP_MINS=120
export COUCH2PG_CHANGES_LIMIT=1000
```

4. Run: `node .`

If you want to set and save all possible variables:

5. Copy `sample.env` to `couch2pg.env`: `cp sample.env couch2pg.env`

6. Edit `couch2pg.env` to have all the variables you need.

{{< callout type="warning" >}}
  `POSTGRESQL_URL` shouldn't be edited as it is defined by the variables above it.
{{< /callout >}}

7. Run: `. ./couch2pg.env && node .`

{{< callout type="info" >}}
  To run cht-couch2pg in interactive mode, use `node . -i`. You will be prompted to answer questions to capture the same the environmental variables. For each question, you will be given suggestions for an answer. 
{{< /callout >}}

## Using docker compose

The simplest way to run couch2pg is with `docker compose` which only needs configuration of the CouchDB instance URL. The compose file will then create a PostgreSQL container, connect to the CouchDB server and proceed to download couchDB documents to the PostgreSQL container:

1. Change directory into the repo's directory where you cloned it: `cd /path/to/cht-couch2pg`

2. Set the URL for CouchDB in the `COUCHDB_URL` env variable. e.g.
```shell
export COUCHDB_URL=https://medic:password@192-168-68-26.local-ip.medicmobile.org:8442/medic
```

> [!NOTE]
> The CouchDB URL needs to be reachable from the docker container (i.e. not localhost).

3. Run: `docker compose up`

4. Connect to the PostgreSQL instance with login `cht_couch2pg`, password `cht_couch2pg_password` and database `cht`.

> [!NOTE]
> To set all possible variables or store the variables in configuration file, follow steps 5 and 6 above. To connect to the PostgreSQL instance, use the server from `POSTGRES_SERVER_NAME`, use login from `COUCH2PG_USER`, password from `COUCH2PG_USER_PASSWORD` and the database from `POSTGRES_DB_NAME`.

## Known issues

1. Node version compatibility
  - Version 14 and 16 have been known to fail silently, and you can conveniently switch between node versions using [nvm](https://github.com/nvm-sh/nvm).

2. Postgres authentication
  - If the error `Error: Unknown authenticationOk message typeMessage { name: 'authenticationOk', length: 23 }` is observed, it is because Postgres is setup to use a different password encryption algorithm compared to what Couch2pg uses. Couch2pg was made to work with `md5` which is the default method in Postgres v10-13. However, on postgres v14 the default method is `scram-sha-256` detailed in the [notes](https://postgresqlco.nf/doc/en/param/password_encryption/14/).

  - The setting can be updated in the Postgres configuration file which is in `/etc/postgresql/14/main/postgres.conf` in Ubuntu 20.04. The key `password_encryption` should be set to md5. After updating the setting, restart the Postgres service.

  - To confirm that the role used with couch2pg has an md5 encrypted password use the query `SELECT rolname, rolpassword FROM pg_authid`. The role password should start with md5.
  