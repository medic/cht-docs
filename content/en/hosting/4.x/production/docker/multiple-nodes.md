---
title: "Production Hosting in CHT 4.x - Multiple CouchDB Nodes on Docker Swarm"
linkTitle: "Multiple Node"
weight: 20
aliases:
  - /apps/guides/hosting/4.x/self-hosting/multiple-nodes
  - /hosting/4.x/self-hosting/multiple-nodes
  - ../self-hosting-multiple-nodes
description: >
  Production Hosting in CHT 4.x - Multi-Node CouchDB Node on Docker
---

{{% pageinfo %}}
The clustered multi-node hosting described below is recommended for deployments that need increased performance gains but keep the ease of Docker. This guide assumes you want better performance than a [single node deployment]({{< relref "hosting/4.x/production/docker/single-node" >}}) and have a host which has been [vertically scaled]({{< relref "hosting/vertical-vs-horizontal" >}}) with a large amount of CPUs (>16) and has a decent amount of RAM (>64GB).  If the host is not sufficiently scaled, there's no benefit over single node deployments.

For the most performant deployment, but with the most complexity, see [Kubernetes documentation]({{< relref "hosting/4.x/production/kubernetes" >}}).

If you are unsure which deployment to use check out [Production recommendations]({{< ref "hosting/4.x/production#recommendations-and-considerations" >}}).

{{% /pageinfo %}}


{{% alert title="Note" %}}
This guide no longer recommends Docker Swarm. For multinode CouchDB deployments utilizing multiple VMs, see [Kubernetes instructions]({{< relref "hosting/4.x/production/kubernetes" >}}).
{{% /alert %}}

### About clustered deployments

In a clustered CHT setup, there are multiple CouchDB nodes responding to users. The ability to [horizontally scale](https://en.wikipedia.org/wiki/Horizontal_scaling#Horizontal_(scale_out)_and_vertical_scaling_(scale_up)) a CHT instance was added in version CHT 4.0.0. In this document we set up a three node CouchDB cluster on a single VM.

## Prerequisites

### Servers

Provision an Ubuntu servers (24.04 as of this writing) that meet our [hosting requirements]({{< relref "hosting/requirements" >}}) including installing Docker and Docker Compose.  This guide assumes you're using the `ubuntu` user, with a home directory of `/home/ubuntu` and that it [has `sudo-less` access to Docker](https://askubuntu.com/a/477554).

### Network

Make sure the following ports are open to enable public access of the instance:

* `22 TCP` - SSH access
* `80 TCP` - Web requests over `HTTP` that will get redirected to `HTTPS`  
* `443 TCP` - Web requests over `HTTPS` - where all production traffic is served
* `ICMP` - For ping



## CHT Core and CouchDB installation

{{< read-content file="_partial_docker_directories.md" >}}

### Prepare Environment Variables file

Prepare an `.env` file by running this code:

```sh
sudo apt install wamerican
uuid=$(uuidgen)
couchdb_secret=$(shuf -n7 /usr/share/dict/words --random-source=/dev/random | tr '\n' '-' | tr -d "'" | cut -d'-' -f1,2,3,4,5,6,7)
couchdb_password=$(shuf -n7 /usr/share/dict/words --random-source=/dev/random | tr '\n' '-' | tr -d "'" | cut -d'-' -f1,2,3,4,5,6,7)
cat > /home/ubuntu/cht/upgrade-service/.env << EOF
CHT_COMPOSE_PROJECT_NAME=cht
DOCKER_CONFIG_PATH=/home/ubuntu/cht/upgrade-service
CHT_COMPOSE_PATH=/home/ubuntu/cht/compose
COUCHDB_USER=medic
COUCHDB_PASSWORD=${couchdb_password}
COUCHDB_SERVERS=couchdb-1.local,couchdb-2.local,couchdb-3.local
# <ADD_SERVERNAME_TO_HTTP_AGENT>: (optional, default: false, configures: api) Adds 'servername' to HTTP agent for certificate issues in receiving traffic when proxying HTTPS->HTTP in SNI environments with external TLS termination. 
# See 'tls.connect(options[, callback])' (https://nodejs.org/api/tls.html). May resolve 'ERR_TLS_CERT_ALTNAME_INVALID' error.
# ADD_SERVERNAME_TO_HTTP_AGENT=true
# <PROXY_CHANGE_ORIGIN>: (optional, default: false, configures: api) See http-proxy (https://www.npmjs.com/package/http-proxy#options). Sets 'changeOrigin' to 'true' for HTTP clients. For certificate issues in proxying HTTP->HTTPS
# PROXY_CHANGE_ORIGIN=true
EOF
```

Note that secure passwords and UUIDs were generated on the first four calls and saved in the resulting `.env` file. Uncomment optional items if required.

### Download compose files

The following 3 `curl` commands download CHT version `4.11.0` compose files, which you can change as needed. Otherwise, call:

```shell
cd /home/ubuntu/cht/
curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.11.0/docker-compose/cht-core.yml
curl -s -o ./compose/cht-couchdb-clustered.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.11.0/docker-compose/cht-couchdb-clustered.yml
curl -s -o ./upgrade-service/compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
```

### TLS Certificates

{{% alert title="Note" %}}
This section has the first use of `docker compose`.  If you get an error `docker: 'compose' is not a docker command` please see [the docs on how to upgrade](https://docs.docker.com/compose/releases/migrate/).
{{% /alert %}}

To ensure the needed docker volume is created, start the CHT Core services, which will intentionally all fail as the CouchDB nodes don't exist.  We'll then ensure they're all stopped with the `docker kill` at the end. Note that this command has will `sleep 120` (wait for 2 minutes) in hopes of all images getting downloaded 

```shell
cd /home/ubuntu/cht/upgrade-service/
docker compose up -d
sleep 120
docker kill $(docker ps --quiet)
```

With docker volume having been created, see the [TLS Certificates page]({{< relref "hosting/4.x/production/docker/adding-tls-certificates" >}}) for how to import your certificates on the CHT Core node.

## Starting Services

To start CHT Core and the 3 CouchDB nodes, run these two commands:

```shell
cd /home/ubuntu/cht/upgrade-service/
docker compose up -d
```

To follow the progress tail the log of the upgrade service container by running:

```shell
cd /home/ubuntu/cht/upgrade-service/
docker compose logs --follow
```

To make sure everything is running correctly, call `docker ps --format  "table {{.Names}}\t{{.Status}}"` and make sure that 9 CHT containers show:

```shell
NAMES                                   STATUS
cht-nginx-1                             Up 4 minutes
cht-api-1                               Up 4 minutes
cht-sentinel-1                          Up 4 minutes
cht-healthcheck-1                       Up 4 minutes
cht-couchdb-1.local-1                   Up 4 minutes
cht-couchdb-3.local-1                   Up 4 minutes
cht-haproxy-1                           Up 4 minutes
cht-couchdb-2.local-1                   Up 4 minutes
upgrade-service-cht-upgrade-service-1   Up 4 minutes
```

This should show the 6 CHT Core services plus 3 CouchDB services are running:

* cht-nginx-1
* cht-api-1
* cht-sentinel-1
* cht-healthcheck-1
* cht-haproxy-1
* cht-upgrade-service-1
* cht-couchdb-1 through cht-couchdb-3

Take note of the `STATUS` column and make sure no errors are displayed. If any container is restarting or mentioning any other error, check the logs using the `docker logs <container-name>` command.

If all has gone well, `nginx` should now be listening at both port 80 and port 443. Port 80 has a permanent redirect to port 443, so you can only access the CHT using https. You can confirm this with `docker ps --format  "table {{.Names}}\t{{.Ports}}"`:

```
NAMES                                   PORTS
cht-nginx-1                             0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp
cht-api-1                               5988/tcp
cht-sentinel-1                          
cht-healthcheck-1                       
cht-couchdb-1.local-1                   4369/tcp, 5984/tcp, 9100/tcp
cht-couchdb-3.local-1                   4369/tcp, 5984/tcp, 9100/tcp
cht-haproxy-1                           5984/tcp
cht-couchdb-2.local-1                   4369/tcp, 5984/tcp, 9100/tcp
upgrade-service-cht-upgrade-service-1   

```

To login as the medic user in the web app, you can find your password with this command:

```shell
grep COUCHDB_PASSWORD /home/ubuntu/cht/upgrade-service/.env | cut -d'=' -f2
```

## Upgrades

Upgrades are completely manual for the clustered setup right now. You have to go into each of the docker compose files and modify the image tag and take containers down and restart them.

{{< read-content file="_partial_upgrade_service.md" >}}
