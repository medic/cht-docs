---
title: "Backups in CHT 4.x"
linkTitle: "Backups"
weight: 4
description: >
    Which data to backup when hosting the CHT 4.x
aliases:
  - /apps/guides/hosting/4.x/backups
  - /hosting/4.x/backups
  - /hosting/4.x/production/docker/backups/
---

{{< callout >}}
  This guide is about backups in CHT 4.x - there's the [self hosted guide for 3.x]({{< relref "hosting/3.x/self-hosting#backup" >}}) which includes backups for 3.x.
{{< /callout >}}

## Introduction 

As CHT 4.x uses a container per service, the only data that needs to be backed up is:

* CouchDB database
* Docker Compose and `.env` files 
* TLS certificates

This is because Docker containers are inherently stateless so all the important binaries are already stored in [CHT's Docker images](https://gallery.ecr.aws/s5s3h4s7/).  Docker Compose files, including the `.env` file, store all of your deployment's configuration. Finally, the TLS certificates should be backed up to reduce recovery time.

How to backup each of these three pieces of data is covered below.

Therefore, you do **not** need to back up the docker images for:

* nginx
* sentinel
* api
* haproxy
* couchdb
* healthcheck
* upgrade-service

## Assumptions

This guide assumes you have an Ubuntu server running CHT 4.x in Docker as described in our [Self Hosting in CHT 4.x - Single CouchDB Node]({{< relref "hosting/4.x/docker" >}}) guide. If you run `docker ps --format '{{.Names}}'` you should see something like this:

```
cht_nginx_1
cht_sentinel_1
cht_api_1
cht_haproxy_1
cht_healthcheck_1
cht_couchdb_1
upgrade-service-cht-upgrade-service-1
```

If you run `docker volume ls` you should see something like this:

```
DRIVER    VOLUME NAME
local     cht_cht-credentials
local     cht_cht-ssl
```

**Note** - In the volumes listed above, there is no volume for CouchDB data.  This is because the compose file declares this as a [bind mount](https://docs.docker.com/storage/bind-mounts/). Bind mounts use the host file system directly and do not show up in `docker volume ls` calls.  It's therefore assumed your CouchDB data location is declared in `/home/ubuntu/cht/upgrade-service/.env` which sets it with `COUCHDB_DATA=/home/ubuntu/cht/couchdb`.

You should have SSH access to the server with `root` access.

### Backup software

It's assumed you are using which ever tool you're familiar with which might include [rsync](https://rsync.samba.org/examples.html), [borg](https://borgbackup.readthedocs.io/en/stable/), [duplicity](https://duplicity.gitlab.io/) or other solution. The locations of the backups should follow the 3-2-1 rule:

> There should be at least 3 copies of the data, stored on 2 different types of storage media, and one copy should be kept offsite, in a remote location. _- [Wikipedia](https://en.wikipedia.org/wiki/Backup)_

Duplicity has the handy benefit of offering built in encryption using [GPG](https://gnupg.org/). Consider using this if you don't have an existing solution for encrypted backups. 

## CouchDB

> [!CAUTION]
> CouchDB backups, by necessity, will have PII and PHI.  They should be safely stored to prevent unauthorized access including encrypting backups. 

Assuming your CouchDB is stored in `/home/ubuntu/cht/couchdb`, you should use these steps to back it up:

1. While you don't need to stop CouchDB to back it up, ensure you follow best practices to back it up. See the [CouchDB site](https://docs.couchdb.org/en/stable/maintenance/backups.html) for more info. Note that Medic recommends NOT using replication for backup.
2. It is strongly recommended you encrypt your backups given the sensitivity of the contents. Do this now before copying the backup files to their long term location.
3. Backup the CouchDB files using the [software specified above]({{< relref "#backup-software" >}})


## Docker Compose files

> [!CAUTION]
> The `.env` file contains cleartext passwords.  It should be safely stored to prevent unauthorized access.

All compose files, and the corresponding `.env` file, are in these three locations:

* /home/ubuntu/cht/compose/*.yml
* /home/ubuntu/cht/upgrade-service/*.yml
* /home/ubuntu/cht/upgrade-service/.env

While all three of these are trivial to recreate by downloading them again, they may change over time so should be archived with your CouchDB data.  Further, when there's been a critical failure of a production CHT instance, you want to be sure to make the restore process as speedy as possible.

As all of these files are only read when Docker first loads a service, you can simply copy them whenever you want without stopping any of the CHT services.  They should be copied with the same frequency and put in the same location as the CouchDB data using the [backup software specified above]({{< relref "#backup-software" >}}).


## TLS certificates

> [!CAUTION]
> The `.key` file is the private key for TLS certificate.  It should be safely stored to prevent unauthorized access.

Like the compose files, the TLS certificate files can easily be regenerated or re-downloaded from your Certificate Authority, like Let's Encrypt for example. However, you want to have a backup of the at the ready to ease the restore process.

1. Copy the cert and key files from the nginx container:

   ```shell
   docker cp cht_nginx_1:/etc/nginx/private/key.pem .
   docker cp cht_nginx_1:/etc/nginx/private/cert.pem .
   ```
2. Back the up to the same location and frequency as the CouchDB data using the [backup software specified above]({{< relref "#backup-software" >}}).


## Testing backups

A backup that isn't tested, is effectively not a backup.  For a backup to be successful, a complete restore from all locations in the 3-2-1 plan need to be fully tested and documented as to how a restore works.  The more practiced and better documented the restore process, the less downtime a production CHT instance will have after data loss.
