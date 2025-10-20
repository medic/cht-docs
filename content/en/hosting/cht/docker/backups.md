---
title: "Backups in CHT"
linkTitle: "Backups"
weight: 4
description: >
    Which data to backup when hosting the CHT
aliases:
  - /apps/guides/hosting/cht/backups
  - /hosting/cht/backups
  - /hosting/cht/production/docker/backups/
  - /hosting/4.x/docker/backups/
---

Assuming you have a CHT server based off the [Docker Hosting](/hosting/cht/docker) guide, the two main sets of files that need backing up are:

* CouchDB directory: `/home/ubuntu/cht/couchdb`
* `.env` file: `/home/ubuntu/cht/upgrade-service/.env`

If you changed these paths during install, please be sure to update the paths accordingly below.

Backups should be sure to follow the 3-2-1 rule:

> There should be at least 3 copies of the data, stored on 2 different types of storage media, and one copy should be kept offsite, in a remote location. _- [Wikipedia](https://en.wikipedia.org/wiki/Backup)_

## Manual backup

When a backup is needed in the short term, an ad hoc backup can suffice:

{{% steps %}}

### Create Directory

Create a backup directory called `backup` in the `cht` directory: 

```shell
mkdir /home/ubuntu/cht/backup
```

### Backup `.env`

Copy the `.env` to the newly created directory:  

```shell
cp /home/ubuntu/cht/upgrade-service/.env /home/ubuntu/cht/backup/
```

###  Backup all CouchDB files

Copy the `couchdb` directory, and all sub-directories:  

```shell
cp -r /home/ubuntu/cht/couchdb /home/ubuntu/cht/backup/
```

### Verify `.env`

A critical part of a backup is verifying both that the backup was made to the destination, but also that a restore works.  See below for restore, but to verify files were copied we can first check the `.env` files are identical with `md5sum`:

```shell
md5sum /home/ubuntu/cht/upgrade-service/.env /home/ubuntu/cht/backup/.env
```

Ensure the resulting IDs match as seen here:

```shell
d0f3db77002732fafded733e4b4f85f0  /home/ubuntu/cht/upgrade-service/.env
d0f3db77002732fafded733e4b4f85f0  /home/ubuntu/cht/backup/.env
```

### Verify CouchDB

Check that the file count and directory sizes of `couchdb` directories matches as well:

```shell
echo "CouchDB Prod";du -h -d1 /home/ubuntu/cht/couchdb
echo "CouchDB Backup";du -h -d1 /home/ubuntu/cht/backup/couchdb

echo "CouchDB Prod";ls -R /home/ubuntu/cht/backup/couchdb |wc -l
echo "CouchDB Backup";ls -R /home/ubuntu/cht/couchdb |wc -l
```

Running this should show a similar output to below:

```shell
CouchDB Prod
0       /home/ubuntu/cht/couchdb/.delete
4.7M    /home/ubuntu/cht/couchdb/shards
1.2M    /home/ubuntu/cht/couchdb/.shards
5.9M    /home/ubuntu/cht/couchdb
CouchDB Backup
0       /home/ubuntu/cht/backup/couchdb/.delete
4.7M    /home/ubuntu/cht/backup/couchdb/shards
1.2M    /home/ubuntu/cht/backup/couchdb/.shards
5.9M    /home/ubuntu/cht/backup/couchdb

CouchDB Prod
174
CouchDB Backup
174
```

{{% /steps %}}


## Automated backup

The above manual process is good for a one off backup done by hand.  For ongoing backups, automation that runs regularly is key for success.  Humans often forget to run tasks like backup, where as computers will never forget. This guide will be using `borg` [software](https://borgbackup.readthedocs.io/en/stable/quickstart.html), but administrators should use the software they're most familiar with.

This example assumes a server called `backup.server` exists with a `borg` user on it. Backing up to a remote server means that if your production server gets entirely deleted, your backups are safe.

{{% steps %}}

### Verify SSH connection

From your CHT Server, make sure your SSH [keys are shared](https://www.howtouselinux.com/post/ssh-authorized_keys-file) such that you can transparently SSH to your remote server and that `borg` executable is installed and available to your user:

```shell
ssh backup.server "borg --version;whoami;date;hostname"
```

This should show similar output as below:

```shell
borg 1.2.8
borg
Mon Oct 20 09:31:11 PM UTC 2025
backup-server
```

### Create an append only repository

As `borg` uses a push backup process, ensure that backups can only be appended.  This will prevent a malicious actor from deleting all proir backups, allowing only new backups to be appended. Replace `PASSWORD` with your real password.

```shell
BORG_PASSPHRASE='PASSWORD' borg init --encryption repokey-blake2 --append-only backup.server:cht
```

{{% /steps %}}

## Restore

TK


{{% steps %}}

### Step 1

TK

{{% /steps %}}