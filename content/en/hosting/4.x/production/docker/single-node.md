---
title: "Production Hosting in CHT 4.x - Single CouchDB Node"
linkTitle: "Single Node"
weight: 10
aliases:
   - /apps/guides/hosting/4.x/self-hosting/single-node/
   - /hosting/4.x/self-hosting/single-node/
   - ../self-hosting-single-node
description: >
   Production Hosting in CHT 4.x - Single CouchDB Node on Docker
---

{{% pageinfo %}}
This for a single node CHT 4.x instance and is the recommended solution for small deployments. If you want a more powerful setup, check out [the 4.x multi-node install docs]({{< relref "hosting/4.x/production/docker/multiple-nodes" >}}).
{{% /pageinfo %}}

## Prerequisites 

Be sure you have followed [the requirements document]({{< relref "hosting/requirements" >}}) including installing Docker and Docker Compose. This guide assumes you're using the `ubuntu` user and that it [has `sudo-less` access to Docker](https://askubuntu.com/a/477554). 

## Directory Structure

{{< read-content file="_partial_docker_directories.md" >}}

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

{{% alert title="Note" %}}
This section has the first use of `docker compose`.  This should work, but you may need to use the older style `docker-compose` if you get an error `docker: 'compose' is not a docker command.`.
{{% /alert %}}

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

See the [TLS Certificates page]({{< relref "hosting/4.x/production/docker/adding-tls-certificates" >}}) for how to import your certificates.

## Upgrades

During upgrades, the CHT upgrade service updates the docker-compose files located in `/home/ubuntu/cht/compose/`. This means that any and all changes made to the docker-compose files will be overwritten. If there is ever a need to make any changes to the docker-compose files, be sure to re-do them post upgrades or should consider implementing them outside of those docker-compose files. 

{{< read-content file="_partial_upgrade_service.md" >}}
