---
title: Setup and Development
weight: 1
description: >
     How to run and do development of CHT couch2pg
---

> [!WARNING]
> CHT couch2pg is deprecated. For data synchronization, refer to [CHT Sync]({{< ref "hosting/analytics" >}}).


Create read-only replicas of CouchDB data inside PostgresSQL.

The focus is specifically on [CHT](https://github.com/medic/cht-core) application data currently stored in CouchDB. If you are looking to have a read-only replica of CouchDB data for your application that isn't the CHT, consider [couch2pg](https://www.npmjs.com/package/couch2pg).

This version is built for medic/cht-core#3.0.0 and above. For replicating data from earlier versions, see the 2.0.x branch and associated tags.

## Prerequisites

### Clone

All steps below require you to have a local clone of the repo.

```shell
git clone https://github.com/medic/cht-couch2pg.git
```

### Node and npm

You will need to install the following to run locally, but not for docker:

- [Node.js](https://nodejs.org) 8.11.x up to  12.x.x. Must be an LTS release. LTS is designated with an even major version number.
- [npm](https://npmjs.com/) 6.x.x above

*NOTE:* Currently, cht-couch2pg only runs in node versions 8, 10 and 12. Later versions of node have been known to fail.


### Database setup

`cht-couch2pg` supports PostgreSQL 9.4 and greater. The user passed in `POSTGRESQL_URL` needs to have full creation rights on the database in  `POSTGRES_DB_NAME`.

## Running

### Locally with environment variables

1. `cd` into it this repo's directory where you cloned it.
2. Install dependencies:
   ```shell
   npm ci
   ```
6. Export these four variables with the values you need.:
   ```shell
   export POSTGRESQL_URL=postgres://postgres:postgres@localhost:15432/postgres
   export COUCHDB_URL=https://admin:pass@localhost:5984/medic
   export COUCH2PG_DOC_LIMIT=1000
   export COUCH2PG_RETRY_COUNT=5
   ```
7. Run: `node .`

If you want to set and save all possible variables:

1. `cd` into it this repo's directory where you cloned it.
2. Copy `sample.env` to `couch2pg.env`
3. Edit `couch2pg.env` to have all the variables you need.  Note that `POSTGRESQL_URL` shouldn't be edited as it's defined by the variables above it. Be sure to change `POSTGRES_SERVER_NAME` to where ever your postgress server is running.  If it's local, then use `localost`. The default value of `postgres` won't work.
4. Run: `. ./couch2pg.env&&node .`

### In docker-compose

The simplest way to run with `docker-compose` is to specify the CouchDB instance that your CHT is using.  The compose file will then create a dockerized PostgresSQL instance, connect to the CouchDB server and proceed to download all the data to the PostgresSQL instance:

1. `cd` into it this repo's directory where you cloned it.
3. When starting the docker compose services, you need to set the URL for CouchDB in the `COUCHDB_URL` env variable. This URL needs to be reachable the docker container (ie not `localhost`). Ensuring you're in the same directory where you ran the `curl` call in the prior step, run:
   ```shell
   export COUCHDB_URL=https://medic:password@192-168-68-26.my.local-ip.co:8442/medic 
   docker-compose up
   ```
4. Connect to the PostgresSQL instance with login `cht_couch2pg`, password `cht_couch2pg_password` and database `cht`. As these are insecure, do not use with production data. See below for how to harden these.

If you want to set all possible variables, or be able to store the variables in configuration file:

1. `cd` into it this repo's directory where you cloned it.
1. Copy `sample.env` to `couch2pg.env`
2. Edit `couch2pg.env` to have all the variables you need.  Note that `POSTGRESQL_URL` shouldn't be edited as it's defined by the variables above it. If you're using the built-in PostgresSQL server, be sure to keep the `POSTGRES_SERVER_NAME` set to `postgres` as this is the correct internal service name in docker.  Be sure to also set secure passwords for all PostgresSQL accounts.
3. Run docker and specify the environment file you just edited:
   ```shell
   docker-compose --env-file couch2pg.env up
   ```
3. To connect to the PostgresSQL instance, use the server from `POSTGRES_SERVER_NAME`, use login from `COUCH2PG_USER`, password from `COUCH2PG_USER_PASSWORD` and the database from `POSTGRES_DB_NAME`.

### Interactive

Run it locally in interactive mode with `node . -i` and you will see the ASCII art:

```shell
   ____   _   _   _____            ____                          _       ____    ____          
  / ___| | | | | |_   _|          / ___|   ___    _   _    ___  | |__   |___ \  |  _ \    __ _ 
 | |     | |_| |   | |    _____  | |      / _ \  | | | |  / __| | '_ \    __) | | |_) |  / _` |
 | |___  |  _  |   | |   |_____| | |___  | (_) | | |_| | | (__  | | | |  / __/  |  __/  | (_| |
  \____| |_| |_|   |_|            \____|  \___/   \__,_|  \___| |_| |_| |_____| |_|      \__, |
                                                                                         |___/ 
```

Instead of environment variables, you will be prompted to answer the following questions. For each question, you will be given suggestions for an answer:

* Enter CHT's couch url
* Enter cht-couch2pg postgres url
* Select the number of minutes interval between checking for updates
* Select the number of documents to grab concurrently. Increasing this number will cut down on HTTP GETs and may improve performance, decreasing this number will cut down on node memory usage, and may increase stability.
* Select the number of document ids to grab per change limit request. Increasing this number will cut down on HTTP GETs and may improve performance, decreasing this number will cut down on node memory usage slightly, and may increase stability.
* Select whether or not to have verbose logging.
* Select how many times to internally retry continued unsuccessful runs before exiting. If unset cht-couch2pg will retry indefinitely. If set it will retry N times, and then exit with status code 1 indefinitely
* Select the number of documents to grab concurrently from the users-meta database. Increasing this number will cut down on HTTP GETs and may improve performance, decreasing this number will cut down on node memory usage, and may increase stability. These documents are larger so set a limit lower than the docLimit


### Supported environment variables

All three methods of running cht-couch2pg listed above use these variables:

* `COUCHDB_URL` - CouchDB instance URL with no trailing slash after `/medic`, format: `https://[user]:[password]@localhost:[port]/medic`
* `COUCH2PG_SLEEP_MINS` - Number of minutes between synchronization. It defaults to `60`.
* `COUCH2PG_DOC_LIMIT` - Number of documents cht-couch2pg fetches from CouchDB everytime. Suggested: `1000`
* `COUCH2PG_RETRY_COUNT` - Number of times cht-couch2pg will retry synchronizing documents from CouchDB after experiencing an error
* `COUCH2PG_USERS_META_DOC_LIMIT` - Number of documents to grab concurrently from the users-meta database. These documents are larger so set a limit lower than the docLimit. It defaults to `50`.
* `COUCH2PG_CHANGES_LIMIT` - The number of document ids to fetch per change limit request. Suggested: `100`
* `COUCH2PG_USER` - The user that couch2pg will use to login in to the CouchDB server. Suggested `cht_couch2pg`
* `COUCH2PG_USER_PASSWORD` - The password that couch2pg will use to login in to the CouchDB server.
* `POSTGRES_SERVER_NAME` - The server or IP where the postgres server is. This should be set to `postgres` when using docker.
* `POSTGRES_USER_NAME` - The admin user for postgres in docker. Suggested: `postgres_root`
* `POSTGRES_PASSWORD` - The admin password for postgres in docker.
* `POSTGRES_DB_NAME` - The name of the PostgreSQL database to sync to.. Suggested: `cht`
* `POSTGRES_PORT` - Port where PostgresSQL can be found. Suggested: `5432`
* `POSTGRESQL_URL` - PostgresSQL instance URL, format: `postgres://[user]:[password]@localhost:[port]/[database name]`
* `SYNC_DB_MEDIC` - Whether to sync the content of the `medic` database. Suggested: `true`
* `SYNC_DB_SENTINEL` - Whether to sync the content of the `medic-sentinel` database. Suggested: `true`
* `SYNC_DB_USER_META` - Whether to sync the content of the `medic-users-meta` database. Suggested: `true`
* `SYNC_DB_LOGS` - Whether to sync the content of `medic-logs` database. Suggested: `true`
* `SYNC_DB_USERS` - Whether to sync the CouchDB `_users` database without security information. Suggested: `true`

## Known issues

### Error "Checksum failed for migration ..." when upgrading from 3.2.0 to latest

An SQL migration file was changed in version 3.2.0. This made upgrades from 3.1.x impossible, with the process crashing upon startup after the upgrade. See more [details about the error](https://github.com/medic/cht-couch2pg/issues/78).

This was fixed in version 3.2.1, by reverting the changes made to the migration file.
Fresh installations of 3.2.0 should execute this SQL before upgrading:

```sql
UPDATE xmlforms_migrations
  SET md5 = 'e0535c9fe3faef6e66a31691deebf1a8'
  WHERE version = '201606200952' AND
        md5 = '40187aa5ee95eda0e154ecefd7512cda';
```

See more details about the error in [#78](https://github.com/medic/cht-couch2pg/issues/78).

### Error installing deps `ERR! ... node-pre-gyp install --fallback-to-build`

When installing Node.js dependencies locally or building the docker image, you might get an error like:

```shell
...
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! node-libcurl@1.3.3 install: `node-pre-gyp install --fallback-to-build`
```

It is probably related to a gcc library that is failing with some versions of Node and npm, try with Node 10 without updating the `npm` version that comes with it.

## Tests

Run tests with docker-compose:

```bash
docker-compose  -f docker-compose.test.yml build cht-couch2pg
docker-compose  -f docker-compose.test.yml run cht-couch2pg grunt test
```

Run tests in interactive watch mode with: `docker-compose -f docker-compose.test.yml run cht-couch2pg npm run watch`

Run entrypoint script tests with

```bash
docker-compose -f docker-compose.test.yml run cht-couch2pg ./tests/bash/bats/bin/bats  /app/tests/bash/test.bats
```

## Releasing
1. Create a pull request with prep for the new release.
1. Get the pull request reviewed and approved.
1. When doing the squash and merge, make sure that your commit message is clear and readable and follows the strict format described in the commit format section below. If the commit message does not comply, automatic release will fail.
1. In case you are planning to merge the pull request with a merge commit, make sure that every commit in your branch respects the format.

### Commit format
The commit format should follow this [conventional-changelog angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular). Examples are provided below.

Type | Example commit message | Release type
-- | -- | --
Bug fixes | fix(#123): infinite loop when materialized views doesn't exist | patch
Performance | perf(#789): Refresh materialized views faster | patch
Features | feat(#456): Support real-time sync | minor
Non-code | chore(#123): update README | none
Breaking| perf(#2): remove support for pg 7 <br/> BREAKING CHANGE: postgres 7 no longer supported | major
