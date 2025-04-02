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
* Your CHT instance set up.  We'll be using `192-168-68-23.local-ip.medicmobile.org:10443` in this documentation, but be sure to use your production URL
* Your Postgres server is set up. We'll be using `10.195.130.93` in this documentation, but be sure to use your production Postgres address
* Your CHT couch2pg (aka couch2pg) instance is set up. In this guide, we'll assume it's on the same server as the Postgres instance.
* You want to move both couch2pg instance and the Postgres data to a new server

Further, be sure you meet the following prerequisites:
* Have provisioned a new Postgres server
* Have access to existing Postgres server to be able to dump the data
* Have access to couch2pg instance, including the CHT Core credentials it's using
* Have 3x the disk space as your data on both the old and new server - see below

### Disk space prerequisites

Be sure you have 3x the disk space on both the old and new postgres servers.  This is because the Postgres server needs to store the data natively, you need to create a dump of this and then you'll need to make a compressed copy.  While you may not fully need all of 3x the disk space, having the extra space will be important to ensure you don't accidentally fill up the disk on a production instance.

For example, If a project has millions of documents taking up 175GB of space on your current postgres server with a 400GB disk, this may be fine for day to day operation.  The server has just over 40% of the disk used.  However, if you make a copy of the data (175GB + 175GB = 350GB), you now have the disk over 85% full with only 50GB free.  You very likely will not have room to compress the data.

To work around this, you can run `pg_dump` from another computer with more disk space, but note that this will send the uncompressed data over the network which may take a long time.  The same is true doing the restore over the networ - it will be much slower than if you did it locally.

To show disk use of all databases, run this command, being sure to replace `couch2pg` with your user:

```shell
psql -U couch2pg -c '\l+'
```

## Instructions

### Current Postgres data and couch2pg config

1. SSH to your postgres server
2. Create a tarball of your database.  This assumes you're using the default `cht` name for your database with a username of `couch2pg`.  Replace with your database and username if they're different:
    ```shell
    pg_dump -U couch2pg -d cht -F tar  -f couch2pg.tar
    gzip couch2pg.tar
    ```
   **Note** - If you get errors like `query failed: ERROR:  permission denied` - run this command as the `postgres` user.
3. Copy the resulting `couch2pg.tar.gz` file to your computer - `scp` is good for this!
4. Check the values for all the environment variables for couch2pg. For example, here's what our current couch2pg has for it's config. In our case the `POSTGRESQL_URL` is `localhost` because we're on the same server as the Postgres server:
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

1. tk
