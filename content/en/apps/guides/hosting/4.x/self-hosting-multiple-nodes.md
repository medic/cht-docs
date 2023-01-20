---
title: "Self Hosting in CHT 4.x - Multiple CouchDB Nodes"
linkTitle: "Self Hosting - Multiple Nodes"
weight: 2
description: >
  Hosting the CHT on self run infrastructure with horizontally scaled CouchDB nodes```
---

{{% alert title="Note" %}}
The clustered multi-node hosting described below is only recommended for deployments that need extreme performance gains.  These gains will greatly increase the complexity of troubleshooting and decrease the ease ongoing maintenance.

[//]: # (TODO - Fix this link once we merge self-hosting-single-node https://github.com/medic/cht-docs/pull/915)
Instead, we recommended most deployment go with the [single node hosting]({{< ref "apps/guides/hosting/4.x/self-hosting-single-node" >}}).

As well, there's the [self hosted guide for 3.x]({{< relref "apps/guides/hosting/3.x/self-hosting" >}}).
{{% /alert %}}

### About clustered deployments

In a clustered CHT setup, there are multiple CouchDB nodes responding to users. The ability to [horizontally scale](https://en.wikipedia.org/wiki/Horizontal_scaling#Horizontal_(scale_out)_and_vertical_scaling_(scale_up)) a CHT instance was added in version CHT 4.0.0. In this document we set up a three node CouchDB cluster.  We require all three CouchDB nodes to be running and healthy before installing the CHT. Our healthcheck service determines the health of the CouchDB nodes and turns off the CHT if any single node is not functional.

### Node uses

* Node 1 - CHT-core - runs the core functionality of the CHT like API, sentinel
* Node 2, 3 & 4 - CouchDB Nodes (A 3 node CouchDB cluster)

## Prerequisites

### Servers

Provision four Ubuntu servers (22.04 as of this writing) that meet our [hosting requirements]({{< relref "apps/guides/hosting/requirements" >}}) including installing Docker and Docker on all of them.  This guide assumes you're using the `ubuntu` user and that it [has `sudo-less` access to Docker](https://askubuntu.com/a/477554).

### Network

Make sure the following ports are open for all nodes:

* `7946 TCP` - For Docker communication amongst nodes
* `7946 UDP` - For Docker communication amongst nodes
* `2377 TCP` - Docker cluster management communication
* `4789 UDP` - Docker overlay network traffic
* `ICMP` - For ping

As a security measure, be sure to restrict the IP addresses of the four nodes only to be able to connect to these ports.

## Create an Overlay Network

To set up a private network that only the four nodes can use, we'll use `docker swarm`'s overlay network feature.  You'll first need to initialize the swarm on the CHT Core node and then join the swarm on each of the three CouchDB nodes.

### CHT Core node

1. Initialize swarm mode.

    ```
    docker swarm init
    ```


    You should get the output:

    ```
    Swarm initialized: current node (ca7z1v4tm9q4kf9uimreqoauj) is now a manager.
    To add a worker to this swarm, run the following command:
    
        docker swarm join --token <very-long-token-value> <main-server-private-ip>:2377
    
    To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
    
    ```

2. Create overlay network

    ```
    docker network create --driver=overlay --attachable cht-overlay
    ```


### CouchDB nodes

On each of these three CouchDB nodes run the join command given to you in step 1 above:

    docker swarm join --token <very-long-token-value> <main-server-private-ip>:2377`

## CHT Core installation

{{< read-content file="_partial_docker_directories.md" >}}

### Prepare Environment Variables file

{{< read-content file="_partial_env_file.env" >}}

Keep a copy of your CouchDB Password as you'll need it later when configuring each CouchDB Node. This command shows you the randomly generated password:

```shell
grep COUCHDB_PASSWORD /home/ubuntu/cht/upgrade-service/.env | cut -d'=' -f2
```

### Download required docker-compose files

The following 2 `curl` commands download CHT version `4.0.1` compose files, which you can change as needed. Otherwise, call:

```shell
cd /home/ubuntu/cht/
curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-core.yml
curl -s -o ./upgrade-service/docker-compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
```

#### Docker-compose modifications

1. At the end of each compose file, ensure the 2 `networks:` sections (1 in `cht-core.yml` and 1 in `docker-compose.yml`) look like this by adding three lines:


        networks:
            cht-net:
               name: ${CHT_NETWORK:-cht-net}
            cht-overlay:
               driver: overlay
               external: true


2. For all 6 services in the compose files (5 in `cht-core.yml` and 1 in `docker-compose.yml`), update the `networks:` section to look like this:

        networks:
          - cht-overlay
          - cht-net

### TLS Certificates

See the [TLS Certificates page]({{< relref "apps/guides/hosting/4.x/adding-tls-certificates" >}}) for how to import your certificates.

## CouchDB installation on 3 nodes

Now that CHT Core is installed, we need to install CouchDB on the three nodes.  Be sure all 3 nodes [meet the prerequisites](#prerequisites) before proceeding.

### Download compose file

On each of the 3 nodes, download the `cht-couchdb-clustered.yml` file:

```shell
cd /home/ubuntu/cht/
curl -s -o ./docker-compose.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-couchdb-clustered.yml
```

### Prepare Environment Variables file

On all 3 nodes, create an `.env` file by running this code. You'll need to replace `PASSWORD-FROM-ABOVE` with the [password you saved](#prepare-environment-variables-file) when creating the CHT Core `.env` file so it is the same on all three nodes::

```
uuid=$(uuidgen)
couchdb_secret=$(shuf -n7 /usr/share/dict/words --random-source=/dev/random | tr '\n' '-' | tr -d "'" | cut -d'-' -f1,2,3,4,5,6,7)
cat > /home/ubuntu/cht/upgrade-service/.env << EOF
CHT_COMPOSE_PROJECT_NAME=cht
COUCHDB_SECRET=${couchdb_secret}
COUCHDB_DATA=/home/ubuntu/cht/couchdb
COUCHDB_USER=medic
COUCHDB_PASSWORD=PASSWORD-FROM-ABOVE
COUCHDB_UUID=${uuid}
EOF
```

Note that secure passwords and UUIDs were generated on the first two calls and saved in the resulting `.env` file.

### Compose file modifications

#### Shared 

On all three nodes, each needs to have the `networks:` section at the end of the compose file changed to look like this:

```
 networks:
     cht-net:
        name: ${CHT_NETWORK:-cht-net}
     cht-overlay:
        driver: overlay
        external: true
```

As well, they all need to have the following added at the end:

```
    networks:
      - cht-net:
      - cht-overlay:
```

#### CouchDB Node 1

On CouchDB node 1, delete `couchdb.2:` and `couchdb.3:` services from the yml, 40 lines in total.

#### CouchDB Node 2

On CouchDB node 2, delete `couchdb.1:` and `couchdb.3:` services from the yml, 41 lines in total.

#### CouchDB Node 3

On CouchDB node 3, delete `couchdb.1:` and `couchdb.2:` services from the yml, 41 lines in total.

## Starting Services

### CouchDB Nodes


1. On each of the three CouchDB nodes starting with node 3, then 2 then 1, run:
   
   ```shell
   cd /home/ubuntu/cht
   docker-compose up -d
   ```
   
4. Watch the logs and wait for everything to be up and running. You can run this on each node to watch the logs:
   ```shell
   cd /home/ubuntu/cht
   docker-compose logs --tail=0 --follow
   ```

### CHT Core

Now that CouchDB is running on all the nodes, start the CHT Core:

```shell
cd /home/ubuntu/upgrade-service
docker-compose up -d
```

To follow the progress tail the log of the upgrade service container by running this:

```shell
docker logs -f upgrade-service_cht-upgrade-service_1
```

To make sure everything is running correctly, call docker ps --format '{{.Names}}' and make sure that 6 CHT containers show:

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

Take note of the STATUS column and make sure no errors are displayed there. If any container is restarting or mentioning any other error, check the logs using the sudo docker logs <container-name> command.

If all has gone well, `nginx` should now be listening at both port 80 and port 443. Port 80 has a permanent redirect to port 443, so you can only access the CHT using https.

To login as the medic user in the web app, you can find your password with this command:

```shell
grep COUCHDB_PASSWORD /home/ubuntu/cht/upgrade-service/.env | cut -d'=' -f2
```

## Upgrades

Upgrades are completely manual for the clustered setup right now. You have to go into each of the docker-compose files and modify the image tag and take containers down and restart them.
