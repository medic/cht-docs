---
title: "Sharing Logs"
linkTitle: "Sharing Logs"
weight:
description: >
  How to easily share logs from your CHT 4.x instance to get support
relatedContent: >
  hosting/cht/docker/logs
  community/contributing/code/troubleshooting/obtaining-logs
aliases:
   - /apps/guides/debugging/sharing-4x-logs
   - /building/guides/debugging/sharing-4x-logs
---

CHT 4.x moves from a monolithic container MedicOS to discrete containers, each service hosting one service of the CHT. When troubleshooting an issue with your CHT instance, it can be hard to list each container, see it's status, gather up logs for each container and then share all this information with Medic or other support staff.  To ease this pain, a script was written which automates the process.

## Prerequisites

This assumes you have access to the command line on the server where the CHT is running locally or via SSH.

This guide also assumes you have the [CHT Core repo checked out](https://github.com/medic/cht-core/) so that you have a copy of the `compress_and_archive_docker_logs.sh` script. If you do not have it checked out, you can manually create a local copy with this `curl` command:

```yaml
curl -o compress_and_archive_docker_logs.sh https://raw.githubusercontent.com/medic/cht-core/master/scripts/compress_and_archive_docker_logs.sh
chmod +x compress_and_archive_docker_logs.sh
```

## Calling the script

> [!IMPORTANT]
> Be aware of two important features of this script:
> * It will get logs for ALL docker containers running, even if they're not part of the CHT
> * Logs on production CHT instances will contain PII/PHI and should be handled with care


The script defaults to getting the past 24 hours of logs and can be called from anywhere on your system as long as you specify the full path to the script.  Here it's being called from with in the `cht-core/scripts` directory:

```
./compress_and_archive_docker_logs.sh
```

If you'd liked to get more logs than the most recent 24 hours, pass in an argument of hours.  Here we're asking for 2 days worth of logs by using `48` as the argument:

```
./compress_and_archive_docker_logs.sh 48
```

Depending on this volume of your logs, this may take a while. This is what the output of the script is when it's completed:

```
Wait while the script gathers stats and logs about the CHT containers.
    Be patient, this might take a moment... 

Done!

    /home/cht-user/.medic/support_logs/cht-docker-logs-2023-02-14T15.04.45-08.00.tar.gz

NOTE: Please remove the file when done as it may contain PII/PHI.
```

The files are saved in your home directory (`/home/cht-user/` in this case) and are timestamped with the creation date and timezone offset (`2023-02-14T15.04.45-08.00`). 

You can now share this `tar.gz` file with support staff as needed. Again, be careful with it as **it will contain PII/PHI if you ran this against a production instance**.

## Archive contents

First, let's look at the running containers when we called the script by calling `docker ps --format '{{.Names}}'`:

```bash
new_project_nginx_1
new_project_sentinel_1
new_project_api_1
new_project_haproxy_1
new_project_couchdb_1
new_project_healthcheck_1
new_project-dir-cht-upgrade-service-1
```

Now if we uncompress the tarball created above and list the contents, it should look very similar when we call `cd ~/.medic/support_logs&&tar xzvf cht-docker-logs-2023-02-14T15.04.45-08.00.tar.gz`:

```
docker_ps.log
docker_stats.log
new_project-dir-cht-upgrade-service-1.log
new_project_api_1.log
new_project_couchdb_1.log
new_project_haproxy_1.log
new_project_healthcheck_1.log
new_project_nginx_1.log
new_project_sentinel_1.log
```

There's one file per container, each with the logs from that container.  As well there's two other files:

* `docker_ps.log` - the output of `docker ps` 
* `docker_stats.log` - the output of `docker stats` 
