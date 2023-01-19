---
title: "Self Hosting in CHT 4.x - Multiple CouchDB Nodes"
linkTitle: "Self Hosting - Multiple Nodes"
weight: 2
description: >
  Hosting the CHT on self run infrastructure with horizontally scaled CouchDB nodes```
---

{{% alert title="Note" %}}
This for a multi-node 4.x CHT instance.  If you want a simpler setup,  check out [the 4.x single node install docs]({{< relref "apps/guides/hosting/4.x/self-hosting-single-node" >}}).  As well, there's the [self hosted guide for 3.x]({{< relref "apps/guides/hosting/3.x/self-hosting" >}}).
{{% /alert %}}
{{% alert title="Note" %}}
The clustered multi-node hosting described below is only recommended for deployments that need extreme performance gains.  These gains will greatly increase the complexity of troubleshooting and decrease the ease ongoing maintenance.

[//]: # (TODO - Fix this link once we merge self-hosting-single-node https://github.com/medic/cht-docs/pull/915)
Instead, we recommended most deployment go with the [clustered single node hosting]({{< ref "#core/overview/self-hosting-single-node" >}}).
{{% /alert %}}

### What is a clustered setup?

In a clustered CHT setup, there are multiple CouchDB nodes responding to users. The ability to [horizontally scale](https://en.wikipedia.org/wiki/Horizontal_scaling#Horizontal_(scale_out)_and_vertical_scaling_(scale_up)) a CHT instance was added in version CHT 4.0.0. In this document we set up a three node CouchDB cluster.  We require all three CouchDB nodes to be running and healthy before installing the CHT. Our healthcheck service determines the health of the CouchDB nodes and turns off the CHT if any single node is not functional.

### What are the four nodes used for?
* Node 1 - CHT-core - runs the core functionality of the CHT like API, sentinel
* Node 2, 3 & 4 - Couchdb Nodes (A 3 node couchdb cluster)

## Setup

## Servers

Provision four Ubuntu servers (22.04 as of this writing) that meet our [hosting requirements]({{< relref "apps/guides/hosting/requirements" >}}) including installing Docker and Docker on all of them. 

### Network

Make sure the following ports are open for the nodes:
* `7946 TCP` - For Docker communication amongst nodes
* `7946 UDP` - For Docker communication amongst nodes
* `2377 TCP` - Docker cluster management communication
* `4789 UDP` - Docker overlay network traffic
* `ICMP` - For ping

**Security Note**: As a security measure, be sure to restrict the IP addresses of the four nodes only to be able to connect to these ports.

## Setup Docker Swarm and Create an Overlay Network

### CHT Core node

1. Initialize swarm mode.

`sudo docker swarm init`

You should get the output:

```
Swarm initialized: current node (some-long-id) is now a manager.
To add a worker to this swarm, run the following command:

    docker swarm join --token <very-long-token-value> <main-server-private-ip>:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

```

2. Create overlay network

`sudo docker network create --driver=overlay --attachable cht-overlay`

### CouchDB nodes

On each of these nodes run the join command given to you above.

`docker swarm join --token <very-long-token-value> <main-server-private-ip>:2377`


## Configuration - CHT Core node

### Setup Docker

1. `sudo apt update`
2. `sudo apt install docker.io`
3. `sudo apt install docker-compose`

### Directory Structure

Create the following directory structure. This is important.

```
|--CHT
    |__ compose/
    |__ certs/
    |__ upgrade-service/
```

Explanations:

* compose - contains the docker-compose files for cht-core and couchdb.
* certs - the path that you'll put SSL certificates.
* upgrade-service - the path for the docker-compose file of the upgrade-service.

### Download required docker-compose files

The following commands download the 4.0.1 version. If you want a different version, you would have to change `medic:4.0.1` to the version you'd like to install.

1. Download the cht-core docker-compose file. Run the following command from the `CHT` directory above.
`curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-core.yml`
2. Download the upgrade service docker-compose file.
`curl -s -o ./upgrade-service/docker-compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml`

### Docker-compose modifications

1. Go to the networks section and add the following:

```
  cht-overlay:
    driver: overlay
    external: true
```

2. Go to each of the containers and add the following:

```
    networks:
      - cht-overlay
```

### Prepare Environment Variables file

Prepare a `.env` file that contains the following variables and save it in the upgrade-service directory. Note that some of the values are not necessary in this node, but for the purpose of making things simple here, we'll create one `.env` file and use it on all nodes.  

We are assuming that your home directory is `/home/ubuntu/`. If that's not accurate, please change that in the values below. 

Be sure to replace these values with real ones:
* `<some-super-long-combination-of-alphanumeric-characters>` 
* `<another-super-long-alphanumeric-characters>`
* `<put-in-a-guid-value>`

```
CHT_COMPOSE_PROJECT_NAME=cht
COUCHDB_SECRET=<some-super-long-combination-of-alphanumeric-characters>
DOCKER_CONFIG_PATH=/home/ubuntu/cht/upgrade-service
COUCHDB_DATA=/home/ubuntu/cht/couchdb
CHT_COMPOSE_PATH=/home/ubuntu/cht/compose
COUCHDB_USER=medic
COUCHDB_PASSWORD=<another-super-long-alphanumeric-characters>
CERTIFICATE_MODE=OWN_CERT
COUCHDB_UUID=<put-in-a-guid-value>
SSL_VOLUME_MOUNT_PATH=/etc/nginx/private/
SSL_CERT_FILE_PATH=/etc/nginx/private/cert.pem
SSL_KEY_FILE_PATH=/etc/nginx/private/key.pem
```

**Note:**
* Make sure that all the directory paths are absolute paths and not relative paths.
* COUCHDB_UUID can be generated [here](https://www.uuidgenerator.net/)
* Make sure certificate is named `cert.pem` and key is named `key.pem` - this is right now a requirement because of a known [bug](https://github.com/medic/cht-core/issues/7949)

### Get the certificate loaded into a cht volume

Follow the set of steps outlined [here](https://github.com/medic/cht-core/pull/7834#issuecomment-1268710481).


## Configuration - Node 2 - couchdb.1

### Setup Docker

1. `sudo apt update`
2. `sudo apt install docker.io`
3. `sudo apt install docker-compose`

Create a `cht` directory under your home directory and download files on there.

1. Download the clustered cht-couchdb docker-compose file.

`curl -s -o ./cht/cht-couchdb-clustered.couchdb1.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-couchdb-clustered.yml`

2. Create a `.env` file and populate it with the same content above as node 1.

### Docker-compose modifications

1. Since we want to run only one couchdb node per instance, delete couchdb.2 and couchdb.3 containers from the yml.
2. Add this property under the `image` section: `container_name: couchdb.1`
3. Go to the networks section and add the following:

```
  cht-overlay:
    driver: overlay
    external: true
```

4. Go to each of the containers and add the following:

```
    networks:
      - cht-overlay
```

## Configuration - Node 3 - couchdb.2

### Setup Docker

1. `sudo apt update`
2. `sudo apt install docker.io`
3. `sudo apt install docker-compose`


Create a `cht` directory under your home directory and download files on there.

1. Download the clustered cht-couchdb docker-compose file.

`curl -s -o ./cht/cht-couchdb-clustered.couchdb2.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-couchdb-clustered.yml`

2. Create a `.env` file and populate it with the same content above as node 1.

### Docker-compose modifications

1. Since we want to run only one couchdb node per instance, delete couchdb.1 and couchdb.3 containers from the yml.
2. Add this property under the `image` section: `container_name: couchdb.2`
3. Go to the networks section and add the following:

```
  cht-overlay:
    driver: overlay
    external: true
```

4. Go to each of the containers and add the following:

```
    networks:
      - cht-overlay
```

## Configuration - Node 4 - couchdb.3

### Setup Docker

1. `sudo apt update`
2. `sudo apt install docker.io`
3. `sudo apt install docker-compose`

Create a `cht` directory under your home directory and download files on there.

1. Download the clustered cht-couchdb docker-compose file.

`curl -s -o ./cht/cht-couchdb-clustered.couchdb3.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-couchdb-clustered.yml`

2. Create a `.env` file and populate it with the same content above as node 1.

### Docker-compose modifications

1. Since we want to run only one couchdb node per instance, delete couchdb.1 and couchdb.2 containers from the yml.
2. Add this property under the `image` section: `container_name: couchdb.3`
3. Go to the networks section and add the following:

```
  cht-overlay:
    driver: overlay
    external: true
```

4. Go to each of the containers and add the following:

```
    networks:
      - cht-overlay
```

## Launch containers in the different nodes

Please start the containers in the same order as they have been specified here.

### Launch CouchDB node 2

Go to the `cht` directory and run:

`sudo docker-compose -f cht-couchdb-clustered.couchdb2.yml --env-file ./.env up -d`

### Launch `couchdb.3`

Go to the `cht` directory and run:

`sudo docker-compose -f cht-couchdb-clustered.couchdb3.yml --env-file ./.env up -d`

### Launch `couchdb.1`

Go to the `cht` directory and run:

`sudo docker-compose -f cht-couchdb-clustered.couchdb1.yml --env-file ./.env up -d`

Follow the logs and wait for everything to be up and running.

### Launch the CHT

`cd` to the `upgrade-service` directory and run the following:

`sudo docker-compose --env-file ./.env up -d`

Docker will then pull the required images and start running in the background. The upgrade service will then pull what's configured. To follow the progress tail the log of the upgrade service container by running this:

`sudo docker logs -f upgrade-service_cht-upgrade-service_1`

To make sure everything is running as it should, run `sudo docker ps` and make sure that 6 containers related to the CHT core are running. These are: cht_nginx, cht_api, cht_sentinel, cht_healthcheck, cht_haproxy, and cht-upgrade-service. Take note of the `STATUS` column and make sure no errors are displayed there. If any container is restarting or mentioning any other error, check the logs using the `sudo docker logs <container-name>` command.

If all has gone well, nginx should now be listening at both port 80 and port 443 on node 1. Port 80 has a permanent redirect to port 443 so you can only access the CHT using https.

### Upgrades

Upgrades are completely manual for the clustered setup right now. You have to go into each of the docker-compose files and modify the image tag and take containers down and restart them.
