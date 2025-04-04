---
title: Migration
weight: 200
description: >
     Migrating from one couch2pg instance to another, including Postgres data
---

{{% pageinfo %}}
CHT couch2pg is deprecated. For data synchronization, refer to [CHT Sync](https://docs.communityhealthtoolkit.org/core/overview/cht-sync/).
{{% /pageinfo %}}

## Assumptions & Prerequisites

This guide assumes:
* Your CHT instance set up.
* Your Postgres server is set up. We'll be using `10.195.130.93` in this documentation, but be sure to use your production Postgres address. The server needs to have `pg_dump` command available.
* Your CHT couch2pg (aka couch2pg) instance is set up. In this guide, we'll assume it's on the same server as the Postgres instance.
* You want to move both couch2pg instance and the Postgres data to a new server

Further, be sure you meet the following prerequisites:
* Have provisioned a new Postgres server. The server needs to have `pg_restore` command available.
* Have access to existing Postgres server to be able to dump the data
* Have access to couch2pg instance, including the CHT Core credentials it's using
* Have 3x the disk space as your data on both the old and new server - see below

**Note:** If you don't mind waiting and don't want to deal with the trouble of copying large data files around as documented on this page, it will be easier to set up a clean [install of couch2pg]({{< ref "hosting/couch2pg/setup-and-devlopment" >}})

### Time to copy

Copying and loading large amounts of Postgres data can take a long time. If you make a mistake, going back to the first step can take more time.  Don't plan a production migration without doing at least one dry run!  Do more dry runs until your confident that everything works as expected.

Consider keeping your old couch2pg system running alongside your new one.  This will allow you to fail over to the old one easily and it will be up to date with data from your CHT instance.  It is safe to run multiple couch2pg instances against the same CHT instance.

When you're confident the new system is up and running, is stable and performant, go ahead and decommission the old system.

### Disk space prerequisites

You need 3 times the database size of free disk space on both the old and new Postgres servers.  The 3x number comes from 3 sources of data:

* Existing Postgres database 
* Dump of this same data via `pg_dump`
* making a compressed copy with `gzip`

While you may not fully need all of 3x the disk space, having the extra space will be important to ensure you don't accidentally fill up the disk on a production instance.

For example, on a Postgres server with `400GB` disk with millions of documents in Postgres:

* `175GB` - Existing Postgres database
* `175GB` - Dump of this same data via `pg_dump`
* ~`60GB` - making a compressed copy with `gzip`

The server is healthy woth just over 40% of the disk used day to day.  However, if you make a copy of the data (`175GB` + `175GB` = `350GB`), you now have the disk over 85% full with only 50GB free.  You very likely will not have room to compress the data (`175GB` + `175GB` + `60GB` = `410GB`).

The best work around is to increase the size of your Postgres server assuming you're on a cloud provider that offers this. Another work around can be to run `pg_dump` from another computer with more disk space, but note that this will send the uncompressed data over the network which may take a long time.  The same is true doing the restore over the network - it will be much slower than if you did it locally.

To show disk use of all databases, run this command, being sure to replace `couch2pg` with your user:

```shell
psql -U couch2pg -c '\l+'
```

## Instructions

### Current Postgres data and couch2pg config

1. SSH to your postgres server
2. Connect to the `cht` database and run this query:
   ```sql
   select count(*) from couchdb;
   ```
   We'll use this in the next server to validate data was imported.  On large datasets this may take a long while to run.
3. Create a tarball of your database.  This assumes you're using the default `cht` name for your database with a username of `couch2pg`.  Replace with your database and username if they're different:
    ```shell
    pg_dump -U couch2pg -d cht -F tar  -f couch2pg.tar
    gzip couch2pg.tar
    ```
   **Note** - If you get errors like `query failed: ERROR:  permission denied` - run this command as the `postgres` user.
4. Check the size of the gzip - we'll use this in the next section: `ls -al couch2pg.tar.gz`
5. Copy the resulting `couch2pg.tar.gz` file to your computer - `scp` is good for this!
6. Check the values for all the environment variables for couch2pg. For example, here's what our current couch2pg has for it's config. In our case the `POSTGRESQL_URL` is `localhost` because we're on the same server as the Postgres server. Be sure to use `POSTGRESQL_URL` and `COUCHDB_URL` that match your deployment:
    ```shell
    POSTGRESQL_URL=postgres://couch2pg:passwordHere1@localhost:5432/cht
    COUCHDB_URL=https://medic:passwordHere2@192-168-68-23.local-ip.medicmobile.org:10443/medic
    COUCH2PG_SLEEP_MINS=360
    COUCH2PG_DOC_LIMIT=100
    COUCH2PG_CHANGES_LIMIT=5000
    COUCH2PG_RETRY_COUNT=5
    COUCH2PG_USERS_META_DOC_LIMIT=50
    ```

### New Postgres server and couch2pg instance

1. Copy the `couch2pg.tar.gz` file to the new Postgres server
2. SSH to the new Postgres server 
3. Make sure the gzip's bytes on disk exactly match the one from step 4 in the prior section: `ls -al couch2pg.tar.gz`
4. Uncompress the file: `gunzip couch2pg.tar.gz` 
5. Ensure your have a `cht` database already created on your new Postgres instance: `CREATE DATABASE cht;`
6. Stop `couch2pg` if it is running
7. Load the data from the dump file, again be sure to use the current user if `couch2pg` is the same for you:
   ```shell
   pg_restore -U couch2pg -d cht couch2pg.tar
   ```
8. Connect to the `cht` database and run this query:
   ```sql
   select count(*) from couchdb;
   ```
   This should match the same number as on step 2 above.  On large datasets this may take a long while to run.
9. Start couch2pg, being sure to use the exact same environment variables as step 6 above, but possibly with different `POSTGRES_*` values if they've changed for the new Postgres server
10. Check the logs of couch2pg and ensure there's no errors.

### Dashboards

Check the logs of couch2pg.  Be sure there's no errors and that materialized views are updating as expected. Complex materialized views can take hours to update.  Don't hesitate to let multiple periods of `COUCH2PG_SLEEP_MINS` (how frequently couch2pg runs) pass to ensure no errors occur.

Double check data is synchronizing by running a SQL query one of your dashboards uses.  Make sure the data is both accurate and up to date.  When you are confident the data is valid and working correctly, change any downstream sources, like Superset or Klipfolio, to use the new Postgres server IP and credentials

If at a later date you find there's substantial errors, you can always change your downstream sources back to using the old Postgres server and attempt the migration again, fixing errors where needed.

### Cleanup

When you're 100% sure the migration was successful - don't rush this part! - be sure to clean up file, servers and services that may still be running:
* Delete any `*.tar` and `*.tar.gz` files on the old Postgres server, on your computer and on the new Postgres server
* Stop couch2pg running on the old service
* If the data is truly not needed, drop the `cht` database on the old Postgres server
* Delete any backups of the old server and service