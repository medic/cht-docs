---
title: "Backup and Restore a CHT instance"
linkTitle: "Backup & Restore"
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

{{< callout  type="warning"  >}}
A backup is not function until the restore is tested.  Be sure to [test the restore](/hosting/cht/docker/backups/#restore) regularly!
{{< /callout >}}


## Manual backup

When a backup is needed in the short term, an ad hoc backup can suffice:

{{% steps %}}

### Create Directory

Create a backup directory called `backup` in the `cht` directory: 

```shell
mkdir /home/ubuntu/cht/backup
```

### Backup `.env` and CouchDB 

Copy the `.env` and CouchDB files to the newly created directory:  

```shell
cp --archive /home/ubuntu/cht/upgrade-service/.env /home/ubuntu/cht/backup/
cp --archive /home/ubuntu/cht/couchdb /home/ubuntu/cht/backup/
```

### Verify `.env`

A critical part of a backup is verifying both that the backup was made to the destination, but also that a restore works.  See [below for restore](#restore), but to verify files were copied we can first check the `.env` files are identical with `md5sum`:

```shell
md5sum /home/ubuntu/cht/upgrade-service/.env /home/ubuntu/cht/backup/.env
```

Ensure the resulting IDs match as seen here:

```shell
d0f3db77002732fafded733e4b4f85f0  /home/ubuntu/cht/upgrade-service/.env
d0f3db77002732fafded733e4b4f85f0  /home/ubuntu/cht/backup/.env
```

### Verify CouchDB

Check that the file count and directory sizes of `couchdb` directories matches as well by running these 4 lines:

```shell
echo "CouchDB Prod";du -h -d1 /home/ubuntu/cht/couchdb
echo "CouchDB Backup";du -h -d1 /home/ubuntu/cht/backup/couchdb

echo "CouchDB Prod";ls -R /home/ubuntu/cht/backup/couchdb |wc -l
echo "CouchDB Backup";ls -R /home/ubuntu/cht/couchdb |wc -l
```

Running the lines should show a similar output to below. Be sure that `Prod` and `Backup` sections exactly match:

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

Manual backups are good a quick one off.  For ongoing backups, automation that runs regularly is key for success.  Humans often forget to run tasks like backup but computers will never forget. This guide uses `borg` [software](https://borgbackup.readthedocs.io/en/stable/quickstart.html), but administrators should use the backup software they're most familiar with.

This example assumes a server called `backup.server` exists with a `borg` user on it. Additionally, `borg` should be installed on both the CHT server and the backup server. 

Backing up to a remote server means that if your production server gets entirely deleted, your backups are safe.

{{% steps %}}

### Verify SSH connection

From your CHT Server, make sure your SSH [keys are shared](https://www.howtouselinux.com/post/ssh-authorized_keys-file) such that you can transparently SSH to your remote server and that `borg` executable is installed and available to your user:

```shell
ssh borg@backup.server "borg --version;whoami;date;hostname"
```

This should show similar output as below:

```shell
borg 1.2.8
borg
Mon Oct 20 09:31:11 PM UTC 2025
backup-server
```

### Create a new `borg` repository

On your CHT server, create a new repository `cht` on the `backup.server` server.  Be sure to replace `PASSWORD` with your real password here and all subsequent calls:

```shell
BORG_PASSPHRASE='PASSWORD' borg init --encryption \
  repokey-blake2 borg@backup.server:cht
```

### Manually run `borg`

To ensure our repository is working correctly, manually call `borg` from your CHT server:

```shell
BORG_PASSPHRASE='PASSWORD' borg create borg@backup.server:cht::$(date "+%y-%m-%d_%H:%M:%S") /home/ubuntu/cht/couchdb /home/ubuntu/cht/upgrade-service/.env
```

### Verify backup

On your backup server, verify the manually run backup was successful:

```shell
BORG_PASSPHRASE='PASSWORD' borg list /home/borg/cht
```                                                                           

This will show the backup you just ran:

```shell
25-10-20_15:21:04      Mon, 2025-10-20 22:21:05 [a7698bb7275e3e947234e3d25c3b2084c14b5fd4dd5313f6bc1fef38ecbbca41]
```

By passing in the name of the backup `25-10-20_15:21:04` to the `list` call, we can see all the files in the backup:

```shell
BORG_PASSPHRASE='PASSWORD' borg list /home/borg/cht::25-10-20_15:21:04
```

Here is a truncated version of the output

```shell
drwxr-xr-x   5984   5984        0 Mon, 2025-10-20 20:15:56 home/ubuntu/cht/couchdb      
drwxr-xr-x   5984   5984        0 Mon, 2025-10-20 20:15:57 home/ubuntu/cht/couchdb/.delete
-rw-r--r--   5984   5984     8389 Mon, 2025-10-20 20:15:50 home/ubuntu/cht/couchdb/_nodes.couch
-rw-r--r--   5984   5984    49361 Mon, 2025-10-20 20:21:56 home/ubuntu/cht/couchdb/_dbs.couch
drwxr-xr-x   5984   5984        0 Mon, 2025-10-20 20:15:54 home/ubuntu/cht/couchdb/shards
drwxr-xr-x   5984   5984        0 Mon, 2025-10-20 20:21:56 home/ubuntu/cht/couchdb/shards/15555555-2aaaaaa9
...
-rw-r--r-- ubuntu ubuntu      932 Mon, 2025-10-20 20:15:37 home/ubuntu/cht/upgrade-service/.env
```

### Create a cron job

Now it's time to automate the backup so it runs without human intervention. Open a cron editor on your CHT production server:

```shell
crontab -e
```

Enter in this at the bottom of the file:

```shell
# m h    dom mon dow   command
0   */4  *   *   *     BORG_PASSPHRASE='PASSWORD' borg create borg@backup.server:cht::$(date "+%y-%m-%d_%H:%M:%S") /home/ubuntu/cht/couchdb /home/ubuntu/cht/upgrade-service/.env
```

Listing your crontab should show the above command:

```shell
crontab -l
```

### Verify cron job

Wait 24 hours.  On the backup server, when you call `borg list...` you should see many entries.  Be sure to inspect them to verify that everything is as it should be.

### Optional 1: Prune backups

With the current set up, backups will grow forever in size eventually filling the disk of your backup server.  To avoid this, you can set up a cronjob on the backup server to run once per day. This call will keep the past 10 days, keep 4 end of weeks and 1 monthly:

```shell
BORG_PASSPHRASE='PASSWORD' borg prune  \
  --list --keep-within=10d --keep-weekly=4 \
  --keep-monthly=-1 /home/borg/cht
```

See the [prune docs](https://borgbackup.readthedocs.io/en/master/usage/prune.html) for more information

### Optional 2: Only allow append

As configured above, an attacker who gained access to your production CHT server, could delete your productoin data and then use `borg` to remotely delete all your backups.  

To prevent this, on your backup server, edit the `/home/borg/.ssh/authorized_keys` file to set a [forced command](https://stackoverflow.com/questions/12346769/ssh-forced-command-parameters).  Prepend this before the SSH Key for your `borg` user. Note that `ssh-ed25519 AAA...` is the truncated SSH key, be sure to leave the entire SSH key in place:

```shell
command="borg serve --append-only --restrict-to-path /home/borg/cht/",no-pty,no-agent-forwarding,no-port-forwarding,no-X11-forwarding,no-user-rc ssh-ed25519 AAA...
```

{{% /steps %}}

## Restore

The restore process involves setting up the CHT, restoring the files from backup, moving the files into position and restarting the CHT.


{{% steps %}}

### Find correct backup

{{< tabs items="Borg, Manual" >}}

{{< tab >}}
For users of `borg`, list your backups and find the one you want to use:

```shell
BORG_PASSPHRASE='PASSWORD' borg list /home/borg/cht
```

The left column is the backup name and right column is the date and hash of the backup.  In this case, we'll use `25-10-21_11:15:24`

```shell
25-10-20_15:21:04       Mon, 2025-10-20 22:21:05 [a7698bb7275e3e947234e3d25c3b2084c14b5fd4dd5313f6bc1fef38ecbbca41]
25-10-21_15:21:56       Tue, 2025-10-21 15:21:56 [26f1f9af11c11027f828f6eab30061e01fb7e69e1cafb3e2eee71f3260546b53]
25-10-22_01:15:04       Wed, 2025-10-22 01:15:04 [b9e083d0175ea0253644359508c3df1066d49c0e3ad44d97009aac0ce9808b37]
```
{{< /tab >}}
{{< tab >}}
Manually run backups will use `/home/ubuntu/cht/backup/` as the location of the backup.
{{< /tab >}}
{{< /tabs >}}

### Restore to staging

{{< tabs items="Borg, Manual" >}}

{{< tab >}}
For users of `borg`, restore with this command.  Be sure to replace the name of your repository as needed:

```shell
mkdir /home/ubuntu/cht/restore
cd /home/ubuntu/cht/restore
BORG_PASSPHRASE='PASSWORD' borg extract \
    --list \
    borg@backup.server:cht::25-10-21_11:15:24
mv home/ubuntu/cht/couchdb . 
mv home/ubuntu/cht/upgrade-service/.env 
rm -r home
```
{{< /tab >}}
{{< tab >}}
Manually run backups will use the copy command to copy the files from the `backup` to the `restore` directories:

```shell
mkdir /home/ubuntu/cht/restore
cd /home/ubuntu/cht/restore
cp --archive /home/ubuntu/cht/backup/couchdb /home/ubuntu/cht/backup/.env .
```
{{< /tab >}}
{{< /tabs >}}

Once the files are restored, manually inspect them to ensure they're correct and ready to be put into production

### Stop CHT, Restore and start

Stop all the containers:

```shell
cd /home/ubuntu/cht/compose
docker compose  -f cht-core.yml -f cht-couchdb.yml --env-file ../upgrade-service/.env -p cht stop
```

Copy the staged files into place:

```shell
cd /home/ubuntu/cht/restore
cp --archive .env /home/ubuntu/cht/upgrade-service/.env
sudo cp --archive couchdb/* /home/ubuntu/cht/couchdb/.
```

Start up the CHT:

```shell
cd /home/ubuntu/cht/upgrade-service
docker compose restart
```

{{% /steps %}}