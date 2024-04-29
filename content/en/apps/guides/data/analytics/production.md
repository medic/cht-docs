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


##  Services & Security

### Main Services

Running [CHT Sync]({{< relref "core/overview/cht-sync" >}}) in production includes DBT, PostgREST and Logstash services. Details about deploying these services can be found [below](#create-and-configure-a-cht-sync-aws-ec2-instance).   

### External Services

While CHT Sync can run against a stand alone CouchDB instance, it's assumed you are configuring CHT Sync against an existing [production CHT Core instance]({{< relref "apps/guides/hosting" >}}), which includes CouchDB. 

Along with CouchDB, these docs assume you have PostgreSQL deployed with an optional Data Visualization Tool, like [Apache Superset](https://superset.apache.org/).

### Security

Production deployments require extra precautions around security and backup. These include, but are not limited to always:
* Use SSH to access the server, requiring SSH keys, not allowing SSH passwords.
* Encrypt all web-server connections with a valid TLS cert - this may involve using a load balancer or reverse proxy.
* Ensure software is kept up to date to defend against security vulnerabilities.
* Keeping good backups that are regularly tested.

 Also, see the general CHT Core [production hosting considerations]({{< relref "apps/guides/hosting/requirements#considerations" >}}), all of which apply to CHT Sync production hosting as well.

## Create and configure a CHT Sync AWS EC2 Instance 

After meeting the [prerequisites]({{< relref "apps/guides/data/analytics/introduction#cht-sync-prerequisites" >}}), install CHT Sync:

1. Deploy a `t2.medium` EC2 instance with the Ubuntu 22 AMI and allow SSH in network permissions. Assign it `60 GiB` of storage ensuring it can grow past the default `8 GiB`.
2. Now that you have the static IP, in Route 53, set up DNS `A` record using your real domain and IPs instead of these examples: `cht-sync.example.com` -> `1.2.3.4`.
3. Add SSH keys for users who should have access to the server in the `/home/ubuntu/.ssh/authorized_keys` so that they can SSH in with `ubuntu@cht-sync.example.com`.
4. Install Docker: `curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh`.
5. Install updates: `apt update&&apt dist-upgrade&&apt autoremove`.
6. Create 2 Docker compose files, one for Postgrest and  one for DBT and Logstash: 
    ```bash
    curl -o /root/compose-files/posgtrest.yml https://raw.githubusercontent.com/medic/cht-sync/main/docker-compose.postgrest.yml
    curl -o /root/compose-files/dbt-logstash.yml https://raw.githubusercontent.com/medic/cht-sync/main/docker-compose.yml
    ```
7. Download and edit the file with Docker environment variables by running this `curl` command and referencing the [Environment Variables page]({{< relref "apps/guides/data/analytics/environment-variables" >}}):
    ```bash
    curl -o  /root/compose-files/.env https://raw.githubusercontent.com/medic/cht-sync/main/env.template
    ```
8. Create a  `/root/compose-files/down.up.sh` script for keeping tabs which Docker files to include on stop and start:
    ```bash
    #!/bin/bash
    docker compose \
            -f postgrest.yml \
            -f dbt-logstash.yml \
            down

    docker compose \
            -f postgrest.yml \
            -f dbt-logstash.yml \
            up --remove-orphans -d
    ```       
9. Set the script as executable and start CHT Sync:
    ```bash
    chmod +x /root/compose-files/down.up.sh
    /root/compose-files/down.up.sh
    ```
10. Confirm the services are running with `docker ps`. The command should show the DBT, Postgrest and Logstash services running. 
