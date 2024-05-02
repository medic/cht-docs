---
title: "Self Hosting in CHT 4.x - Multiple CouchDB Nodes on Docker Swarm"
linkTitle: "Multiple Nodes - Docker"
weight: 20
aliases:
  - /apps/guides/hosting/4.x/self-hosting/multiple-nodes
  - ../self-hosting-multiple-nodes
description: >
  Hosting the CHT on self run infrastructure with horizontally scaled CouchDB nodes
---

{{% pageinfo %}}
The clustered multi-node hosting described below is recommended for deployments that need increased performance gains. These gains will increase the complexity of troubleshooting and decrease the ease ongoing maintenance.

If you are unsure which deployment to use check out [Self-hosting recommendations]({{< ref "hosting/4.x/self-hosting#recommendations-and-considerations" >}}).

{{% /pageinfo %}}

### About clustered deployments

In a clustered CHT setup, there are multiple CouchDB nodes responding to users. The ability to [horizontally scale](https://en.wikipedia.org/wiki/Horizontal_scaling#Horizontal_(scale_out)_and_vertical_scaling_(scale_up)) a CHT instance was added in version CHT 4.0.0. In this document we set up a three node CouchDB cluster.  We require all three CouchDB nodes to be running and healthy before installing the CHT. Our healthcheck service determines the health of the CouchDB nodes and turns off the CHT if any single node is not functional.

### Nodes

* CHT Core (1x) - Core functionality of the CHT including API and sentinel
* CouchDB (3x) - 3 node CouchDB cluster

## Prerequisites

### Servers

Provision four Ubuntu servers (22.04 as of this writing) that meet our [hosting requirements]({{< relref "hosting/requirements" >}}) including installing Docker and Docker Compose on all of them.  This guide assumes you're using the `ubuntu` user, with a home directory of `/home/ubuntu` and that it [has `sudo-less` access to Docker](https://askubuntu.com/a/477554).

### Network

Make sure the following ports are open for all nodes:

* `7946 TCP/UDP` - For Docker communication amongst nodes
* `2377 TCP` - Docker cluster management communication
* `4789 UDP` - Docker overlay network traffic
* `ICMP` - For ping

As a security measure, be sure to restrict the IP addresses of the four nodes only to be able to connect to these ports.

## Create an Overlay Network

To set up a private network that only the four nodes can use, we'll use `docker swarm`'s overlay network feature.  You'll first need to initialize the swarm on the CHT Core node and then join the swarm on each of the three CouchDB nodes.

### CHT Core node

Initialize swarm mode by running:

 ```
 docker swarm init
 ```

This will output:

{{< highlight shell "linenos=table" >}}
Swarm initialized: current node (ca7z1v4tm9q4kf9uimreqoauj) is now a manager.
To add a worker to this swarm, run the following command:

   docker swarm join --token <very-long-token-value> <main-server-private-ip>:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions. {{< /highlight >}}

Then create overlay network by calling:

 ```
 docker network create --driver=overlay --attachable cht-net
 ```

### CouchDB nodes

On each of these three CouchDB nodes run the `docker swarm join` command given to you in [line 4 above in "CHT Core node"](#cht-core-node):

    docker swarm join --token <very-long-token-value> <main-server-private-ip>:2377`

### Confirm swarm

Back on the CHT Core node, run `docker node ls` and ensure you see 4 nodes listed as `STATUS` of `Ready` and `AVAILABILITY` of `Active`

```shell
ID                            HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
zolpxb5jpej8yiq9gcyv2nrdj *   cht-core   Ready     Active         Leader           20.10.23
y9giir8c3ydifxvwozs3sn8vw     couchdb1   Ready     Active                          20.10.23
mi3vj0prd76djbvxms43urqiv     couchdb2   Ready     Active                          20.10.23
kcpxlci3jjjtm6xjz7v50ef7k     couchdb3   Ready     Active                          20.10.23
```

## CHT Core installation

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

The following 2 `curl` commands download CHT version `4.0.1` compose files, which you can change as needed. Otherwise, call:

```shell
cd /home/ubuntu/cht/
curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.3.1/docker-compose/cht-core.yml
curl -s -o ./upgrade-service/docker-compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
```

#### Compose file overrides

We need to override the `networks:` in the two compose files we just created.  Create the override file with this code:

```shell
cat > /home/ubuntu/cht/compose/cluster-overrides.yml << EOF
version: '3.9'
networks:
  cht-net:
     driver: overlay
     external: true
EOF
```

### TLS Certificates

{{% alert title="Note" %}}
This section has the first use of `docker compose`.  This should work, but you may need to use the older style `docker-compose` if you get an error `docker: 'compose' is not a docker command`.
{{% /alert %}}

To ensure the needed docker volume is created, start the CHT Core services, which will intentionally all fail as the CouchDB nodes don't exist.  We'll then ensure they're all stopped with the `docker kill` at the end. Note that this command has will `sleep 120` (wait for 2 minutes) in hopes of 

```shell
cd /home/ubuntu/cht/upgrade-service/
docker compose up -d
sleep 120
docker kill $(docker ps --quiet)
```

With docker volume having been created, see the [TLS Certificates page]({{< relref "hosting/4.x/adding-tls-certificates" >}}) for how to import your certificates on the CHT Core node.

## CouchDB installation on 3 nodes

Now that CHT Core is installed, we need to install CouchDB on the three nodes.  Be sure all 3 nodes [meet the prerequisites](#prerequisites) before proceeding.

### Prepare Environment Variables file


First, **on the CHT Core node**,  get your CouchDB password with this command:

```shell
grep COUCHDB_PASSWORD /home/ubuntu/cht/upgrade-service/.env | cut -d'=' -f2
```

Now, **on all 3 CouchDB nodes**, create an `.env` file by running this code. You'll need to replace `PASSWORD-FROM-ABOVE` so it is the same on all three nodes:

```sh
sudo apt install wamerican
mkdir -p /home/ubuntu/cht/srv
uuid=$(uuidgen)
couchdb_secret=$(shuf -n7 /usr/share/dict/words --random-source=/dev/random | tr '\n' '-' | tr -d "'" | cut -d'-' -f1,2,3,4,5,6,7)
cat > /home/ubuntu/cht/.env << EOF
CHT_COMPOSE_PROJECT_NAME=cht
COUCHDB_SECRET=${couchdb_secret}
COUCHDB_DATA=/home/ubuntu/cht/couchdb
COUCHDB_USER=medic
COUCHDB_PASSWORD=PASSWORD-FROM-ABOVE
COUCHDB_UUID=${uuid}
EOF
```

Note that secure passwords and UUIDs were generated and saved in the resulting `.env` file.

#### CouchDB Node 1

Create `/home/ubuntu/cht/docker-compose.yml` on Node 1 by running this code:

```shell
cd /home/ubuntu/cht/
curl -s -o ./docker-compose.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.3.1/docker-compose/cht-couchdb.yml
```

Now create the override file to have Node 1 join the `cht-net` overlay network we created above. As well, we'll set some `services:` specific overrides:

```shell
cat > /home/ubuntu/cht/cluster-overrides.yml << EOF
version: '3.9'
services:
  couchdb:
    container_name: couchdb-1.local
    environment:
      - "SVC_NAME=${SVC1_NAME:-couchdb-1.local}"
      - "CLUSTER_PEER_IPS=couchdb-2.local,couchdb-3.local"
networks:
  cht-net:
     driver: overlay
     external: true
EOF
```

#### CouchDB Node 2 

Like we did for Node 1, create `/home/ubuntu/cht/docker-compose.yml` and the `cluster-overrides.yml` file on Node 2 by running this code:

```shell
cd /home/ubuntu/cht/
curl -s -o ./docker-compose.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.3.1/docker-compose/cht-couchdb.yml
cat > /home/ubuntu/cht/cluster-overrides.yml << EOF
version: '3.9'
services:
  couchdb:
    container_name: couchdb-2.local
    environment:
      - "SVC_NAME=couchdb-2.local"
      - "COUCHDB_SYNC_ADMINS_NODE=${COUCHDB_SYNC_ADMINS_NODE:-couchdb-1.local}"
networks:
  cht-net:
     driver: overlay
     external: true
EOF
```

#### CouchDB Node 3

Finally, we'll match Node 3  up with the others by running this code:

```shell
cd /home/ubuntu/cht/
curl -s -o ./docker-compose.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.3.1/docker-compose/cht-couchdb.yml
cat > /home/ubuntu/cht/cluster-overrides.yml << EOF
version: '3.9'
services:
  couchdb:
    container_name: couchdb-3.local
    environment:
      - "SVC_NAME=couchdb-3.local"
      - "COUCHDB_SYNC_ADMINS_NODE=${COUCHDB_SYNC_ADMINS_NODE:-couchdb-1.local}"
networks:
  cht-net:
     driver: overlay
     external: true
EOF
```

## Starting Services

### CouchDB Nodes

1. On each of the three CouchDB nodes starting with node 3, then 2 then 1. Be sure to wait until `docker-compose` is finished running and has returned you to the command prompt before continuing to the next node:
   
   ```shell
   cd /home/ubuntu/cht
   docker compose  -f docker-compose.yml -f cluster-overrides.yml  up -d
   ```
   
2. Watch the logs and wait for everything to be up and running. You can run this on each node to watch the logs:

   ```shell
   cd /home/ubuntu/cht
   docker compose logs --follow
   ```
   
   Nodes 2 and 3 should show output like `couchdb is ready` after node 1 has started. 

   Node 1 will show this when it has added all nodes:

   ```shell
   cht-couchdb-1.local-1  | {"ok":true}
   cht-couchdb-1.local-1  | {"all_nodes":["couchdb@couchdb-1.local","couchdb@couchdb-2.local","couchdb@couchdb-3.local"],"cluster_nodes":["couchdb@couchdb-1.local","couchdb@couchdb-2.local","couchdb@couchdb-3.local"]}
   ```

### CHT Core

Now that CouchDB is running on all the nodes, start the CHT Core:

```shell
cd /home/ubuntu/cht/upgrade-service/
docker compose  -f docker-compose.yml -f ../compose/cluster-overrides.yml  up -d
```

To follow the progress tail the log of the upgrade service container by running:

```shell
cd /home/ubuntu/cht/upgrade-service/
docker compose logs --follow
```

To make sure everything is running correctly, call `docker ps` and make sure that 6 CHT containers show:

```shell
CONTAINER ID   IMAGE                                                         COMMAND                   CREATED          STATUS         PORTS                                                                      NAMES
8c1c22d526f3   public.ecr.aws/s5s3h4s7/cht-nginx:4.0.1-4.0.1                 "/docker-entrypoint.…"    17 minutes ago   Up 8 minutes   0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   cht_nginx_1
f7b596be2721   public.ecr.aws/s5s3h4s7/cht-api:4.0.1-4.0.1                   "/bin/bash /api/dock…"    17 minutes ago   Up 8 minutes   5988/tcp                                                                   cht_api_1
029cd86ac721   public.ecr.aws/s5s3h4s7/cht-sentinel:4.0.1-4.0.1              "/bin/bash /sentinel…"    17 minutes ago   Up 8 minutes                                                                              cht_sentinel_1
61ee1e0b377b   public.ecr.aws/s5s3h4s7/cht-haproxy-healthcheck:4.0.1-4.0.1   "/bin/sh -c \"/app/ch…"   17 minutes ago   Up 8 minutes                                                                              cht_healthcheck_1
87415a2d91ea   public.ecr.aws/s5s3h4s7/cht-haproxy:4.0.1-4.0.1               "/entrypoint.sh -f /…"    17 minutes ago   Up 8 minutes   5984/tcp                                                                   cht_haproxy_1 cht_couchdb_1
d01343658f3f   public.ecr.aws/s5s3h4s7/cht-upgrade-service:latest            "node /app/src/index…"    17 minutes ago   Up 8 minutes                                                                              upgrade-service-cht-upgrade-service-1
```

This should show related to the CHT core are running

* cht_nginx
* cht_api
* cht_sentinel
* cht_healthcheck
* cht_haproxy
* cht-upgrade-service

Take note of the `STATUS` column and make sure no errors are displayed. If any container is restarting or mentioning any other error, check the logs using the `docker logs <container-name>` command.

If all has gone well, `nginx` should now be listening at both port 80 and port 443. Port 80 has a permanent redirect to port 443, so you can only access the CHT using https.

To login as the medic user in the web app, you can find your password with this command:

```shell
grep COUCHDB_PASSWORD /home/ubuntu/cht/upgrade-service/.env | cut -d'=' -f2
```

## Upgrades

Upgrades are completely manual for the clustered setup right now. You have to go into each of the docker compose files and modify the image tag and take containers down and restart them.

{{< read-content file="_partial_upgrade_service.md" >}}
