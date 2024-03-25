---
title: "Production CHT Sync Setup"
weight: 3
linkTitle: "Production CHT Sync Setup"
description: >
  Setting up a production deployment of CHT Sync with the CHT
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
---

## What it means to run in production

Running CHT Sync in Production means running several components:

* **DBT**, **PostgREST**, **Logstash**. These are the main components of [cht-sync]({{< relref "core/overview/cht-sync" >}}). Details about deploying them can be found in the [Deploy CHT Sync](#deploy-cht-sync) section.   
* **CouchDB**. In the context of this documentation, CouchDB will be more often run as part of the CHT Core, but it doesn't have to. This guide doesn't cover the deployment of CouchDB and it assumes a CouchDB instance exists. The [Hosting section]({{< relref "apps/guides/hosting" >}}) provides detailed instructions on how to deploy CHT Core. 
* **PostgreSQL**. This documentation assumes an instance of PostgreSQL exists. 
* (*Optional*) **Data Visualization Tool**. In order to build data analytics dashboards and better leverage CHT Sync, a data visualization tool such as [Apache Superset](https://superset.apache.org/) can be used. Refer to your preferred data visualization tool's documentation in order to connect it to the PostgreSQL instance.

Additionally, you should take extra precautions around security and backup, such as [setting up TLS]({{< relref "apps/guides/hosting/4.x/adding-tls-certificates" >}}) on your CHT instance.

## Create and configure a CHT Sync AWS EC2 Instance 

After meeting the [prerequisites]({{< relref "apps/guides/data/analytics/introduction#cht-sync-prerequisites" >}}), install CHT Sync:

1. Deploy a `t2.medium` EC2 instance with Ubuntu 22 AMI. Allow SSH, HTTP and HTTPS in network permissions, add tags, and assign it `60 GiB gp2` storage so it has room to store more than the default `8 GiB` of data.
2. Now that you have the static IP, in Route 53, set up DNS `A` record `instance-url` -> `ip.of.the.instance`.
3. Add SSH keys for users who should have access to the server in the `/home/ubuntu/.ssh/authorized_keys` so that they can SSH in with `ubuntu@instance-url`.
4. Install Docker: `curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh`.
5. Install updates: `apt update&&apt dist-upgrade&&apt autoremove`.
6. In `/root/compose-files` create:
   * Docker compose files (from the [CHT Sync GitHub repository](https://github.com/medic/cht-sync)): 
      * `posgtrest.yml` - for Postgrest service
      * `dbt.yml` - for DBT service
      * `logstash.yml` - for Losgtash service
   * `.env` - for declaring all Docker environment variables. Instructions can be found in the [Environment Variables page](({{< relref "apps/guides/data/analytics/environment-variables" >}})).
   * `down.up.sh` - script for keeping tabs on Docker files to include on stop and start. Sample content:
    ```bash
    #!/bin/bash
    docker compose \
            -f postgrest.yml \
            -f logstash.yml \
            -f dbt.yml \
            down

    docker compose \
            -f postgrest.yml \
            -f logstash.yml \
            -f dbt.yml \
            up --remove-orphans -d
    ```       
7. Restart all services with:
    ```bash
    /root/compose-files/down.up.sh
    ```
8. Confirm the services are running with `docker ps`. The command should display the 3 running services. 
