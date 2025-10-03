---
title: "Host CHT with Docker"
linkTitle: "Installation"
weight: 1
description: >
  Prerequisites for hosting CHT with Docker
aliases:
  - /apps/guides/hosting/cht/docker/
  - /hosting/cht/docker/prerequisites/
  - /apps/guides/hosting/cht/self-hosting/single-node/
  - /hosting/cht/self-hosting/single-node/
  - ../self-hosting-single-node
  - /hosting/cht/docker/single-node/
  - /hosting/cht/production/docker/
  - /hosting/4.x/docker/installation/
---

## Prerequisites

Be sure you have followed [the requirements document](//hosting/cht/requirements) including installing Docker. This guide assumes you're using the `ubuntu` user and that it [has `sudo-less` access to Docker](https://askubuntu.com/a/477554).

## Directory Structure

Create the following directory structure:

{{< filetree/container >}}
  {{< filetree/folder name="/home/ubuntu/cht/" >}}
    {{< filetree/folder name="compose/">}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="certs/">}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="couchdb/">}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="upgrade-service/">}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

By calling this `mkdir` commands:

```shell
mkdir -p /home/ubuntu/cht/{compose,certs,upgrade-service,couchdb}
```

1. `compose` - docker-compose files for cht-core and CouchDB
2. `certs` -  TLS certificates directory
3. `upgrade-service` - where docker-compose file for the upgrade-service
4. `couchdb` - the path for the docker-compose file of the upgrade-service (not used in multi-node)

## Download required docker-compose files

The following 3 `curl` commands download CHT version `4.11.0` compose files, which you can change as needed. Otherwise, call:

```shell
cd /home/ubuntu/cht/
curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.11.0/docker-compose/cht-core.yml
curl -s -o ./compose/cht-couchdb.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.11.0/docker-compose/cht-couchdb.yml
curl -s -o ./upgrade-service/docker-compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
```

## Prepare Environment Variables file

Prepare a `.env` file by running this code:

```sh
sudo apt install wamerican
uuid=$(uuidgen)
couchdb_secret=$(shuf -n7 /usr/share/dict/words --random-source=/dev/random | tr '\n' '-' | tr -d "'" | cut -d'-' -f1,2,3,4,5,6,7)
couchdb_password=$(shuf -n7 /usr/share/dict/words --random-source=/dev/random | tr '\n' '-' | tr -d "'" | cut -d'-' -f1,2,3,4,5,6,7)
cat > /home/ubuntu/cht/upgrade-service/.env << EOF
CHT_COMPOSE_PROJECT_NAME=cht
COUCHDB_SECRET=${couchdb_secret}
DOCKER_CONFIG_PATH=/home/ubuntu/cht/upgrade-service
COUCHDB_DATA=/home/ubuntu/cht/couchdb
CHT_COMPOSE_PATH=/home/ubuntu/cht/compose
COUCHDB_USER=medic
COUCHDB_PASSWORD=${couchdb_password}
COUCHDB_UUID=${uuid}
# <ADD_SERVERNAME_TO_HTTP_AGENT>: (optional, default: false, configures: api) Adds 'servername' to HTTP agent for certificate issues in receiving traffic when proxying HTTPS->HTTP in SNI environments with external TLS termination. 
# See 'tls.connect(options[, callback])' (https://nodejs.org/api/tls.html). May resolve 'ERR_TLS_CERT_ALTNAME_INVALID' error.
# ADD_SERVERNAME_TO_HTTP_AGENT=true
# <PROXY_CHANGE_ORIGIN>: (optional, default: false, configures: api) See http-proxy (https://www.npmjs.com/package/http-proxy#options). Sets 'changeOrigin' to 'true' for HTTP clients. For certificate issues in proxying HTTP->HTTPS
# PROXY_CHANGE_ORIGIN=true
EOF
```

Note that secure passwords and UUIDs were generated on the first four calls and saved in the resulting `.env` file. Uncomment optional items if required.

## Launch containers

> [!IMPORTANT]
> This section has the first use of `docker compose`.  If you get an error calling this, double check [hosting requirements](//hosting/cht/requirements). 

To start your CHT instance, run the following

```
cd /home/ubuntu/cht/upgrade-service
docker compose up --detach
```

Docker will start the upgrade service, which in turn pulls the required images and starts all the services as defined by the compose files in `/home/ubuntu/cht/compose`.

To follow the progress tail the log of the upgrade service container by running this:

`docker logs -f upgrade-service_cht-upgrade-service_1`

To make sure everything is running correctly, call `docker ps` and make sure that 7 CHT containers show:

```shell
CONTAINER ID   IMAGE                                                         COMMAND                   CREATED          STATUS         PORTS                                                                      NAMES
8c1c22d526f3   public.ecr.aws/s5s3h4s7/cht-nginx:4.0.1-4.0.1                 "/docker-entrypoint.…"    17 minutes ago   Up 8 minutes   0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   cht_nginx_1
f7b596be2721   public.ecr.aws/s5s3h4s7/cht-api:4.0.1-4.0.1                   "/bin/bash /api/dock…"    17 minutes ago   Up 8 minutes   5988/tcp                                                                   cht_api_1
029cd86ac721   public.ecr.aws/s5s3h4s7/cht-sentinel:4.0.1-4.0.1              "/bin/bash /sentinel…"    17 minutes ago   Up 8 minutes                                                                              cht_sentinel_1
61ee1e0b377b   public.ecr.aws/s5s3h4s7/cht-haproxy-healthcheck:4.0.1-4.0.1   "/bin/sh -c \"/app/ch…"   17 minutes ago   Up 8 minutes                                                                              cht_healthcheck_1
87415a2d91ea   public.ecr.aws/s5s3h4s7/cht-haproxy:4.0.1-4.0.1               "/entrypoint.sh -f /…"    17 minutes ago   Up 8 minutes   5984/tcp                                                                   cht_haproxy_1
58454457467a   public.ecr.aws/s5s3h4s7/cht-couchdb:4.0.1-4.0.1               "tini -- /docker-ent…"    17 minutes ago   Up 8 minutes   4369/tcp, 5984/tcp, 9100/tcp                                               cht_couchdb_1
d01343658f3f   public.ecr.aws/s5s3h4s7/cht-upgrade-service:latest            "node /app/src/index…"    17 minutes ago   Up 8 minutes                                                                              upgrade-service-cht-upgrade-service-1
```

This should show related to the CHT core are running
* cht_nginx
* cht_api
* cht_sentinel
* cht_couchdb
* cht_healthcheck
* cht_haproxy
* cht-upgrade-service

Take note of the `STATUS` column and make sure no errors are displayed there. If any container is restarting or mentioning any other error, check the logs using the `docker logs <container-name>` command.

If all has gone well, nginx should now be listening at both port 80 and port 443. Port 80 has a permanent redirect to port 443, so you can only access the CHT using https.

To login as the `medic` user in the web app, you can find your password with this command:

```shell
grep COUCHDB_PASSWORD /home/ubuntu/cht/upgrade-service/.env | cut -d'=' -f2
```

## TLS Certificates

See the [TLS Certificates page](//hosting/cht/docker/adding-tls-certificates) for how to import your certificates.

## Upgrades

During upgrades, the CHT upgrade service updates the docker-compose files located in `/home/ubuntu/cht/compose/`. This means that any and all changes made to the docker-compose files will be overwritten. If there is ever a need to make any changes to the docker-compose files, be sure to re-do them post upgrades or should consider implementing them outside of those docker-compose files.

### Upgrading the cht-upgrade-service

The [CHT Upgrade Service](https://github.com/medic/cht-upgrade-service) provides an interface between the CHT Core API and Docker to allow easy startup and one-click upgrades from the CHT Admin UI. Occasionally, the CHT Upgrade Service, itself, will need to be upgraded. If an upgrade is available, it is highly recommended that you install the upgrade for the CHT Upgrade Service before performing further upgrades on your CHT instance. This is done via the following steps:

1. Verify that the _version_ of the `cht-upgrade-service` image in your `./upgrade-service/docker-compose.yml` files is set to `latest`.
1. Pull the latest `cht-upgrade-service` image from Docker Hub and replace the current container by running the following command:
    ```shell
    cd /home/ubuntu/cht/upgrade-service
    docker compose pull
    docker compose up --detach
    ``` 

> [!IMPORTANT]
> Upgrading the CHT Upgrade Service will not cause a new CHT version to be installed.  The CHT Core and CouchDB containers are not affected.

Follow the [Product Releases channel](https://forum.communityhealthtoolkit.org/c/product/releases/26) on the CHT forum to stay informed about new releases and upgrades.
