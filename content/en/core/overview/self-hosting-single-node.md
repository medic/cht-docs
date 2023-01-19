---
title: "Self Hosting in CHT 4.x - Single CouchDB Node"
linkTitle: "Self Hosting - Single Node"
weight: 2
description: >
  Self Hosting in CHT 4.x - Single CouchDB Node
---

[//]: # (todo - fix this link to multi-node)
{{% alert title="Note" %}}
This for a single node 4.x CHT instance.  If you want a more powerful setup,  check out [the 4.x multi-node install docs]({{< relref "apps/guides/hosting/4.x#self-hosting-multiple-nodes" >}}).  As well, there's the [self hosted guide for 3.x]({{< relref "apps/guides/hosting/3.x/self-hosting" >}}).
{{% /alert %}}

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
1. compose - contains the docker-compose files for cht-core and couchdb.
2. certs - the path that you'll put SSL certificates.
3. upgrade-service - the path for the docker-compose file of the upgrade-service.

### Download required docker-compose files

The following commands download the 4.0.1 version. If you want a different version, you would have to change `medic:4.0.1` to the version you'd like to install.

1. Download the cht-core docker-compose file. Run the following command from the `CHT` directory above.
`curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-core.yml`
2. Download the cht-couchdb docker-compose file.
`curl -s -o ./compose/cht-couchdb.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-couchdb.yml`
3. Download the upgrade service docker-compose file.
`curl -s -o ./upgrade-service/docker-compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml`

### Prepare Environment Variables file

Prepare a `.env` file that contains the following variables and save it in the upgrade-service directory. We are assuming that your home directory is `/home/ubuntu/`. If that's not accurate, please change that in the values below:

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

*Note:*
* Make sure that all the directory paths are absolute paths and not relative paths.
* COUCHDB_UUID can be generated at [uuidgenerator.net](https://www.uuidgenerator.net/)
* Make sure certificate is named `cert.pem` and key is named `key.pem` - this is right now a requirement because of a known [bug](https://github.com/medic/cht-core/issues/7949)

### Get the certificate loaded into a cht volume

Follow the set of steps outlined [here](https://github.com/medic/cht-core/pull/7834#issuecomment-1268710481).

### Launch containers

`cd` to the `upgrade-service` directory and run the following:

`sudo docker-compose --env-file ./.env up -d`

Docker will then pull the required images and start running in the background. The upgrade service will then pull what's configured. To follow the progress tail the log of the upgrade service container by running this:

`sudo docker logs -f upgrade-service_cht-upgrade-service_1`

To make sure everything is running as it should, run `sudo docker ps` and make sure that 7 containers related to the CHT core are running. These are: cht_nginx, cht_api, cht_sentinel, cht_couchdb, cht_healthcheck, cht_haproxy, and cht-upgrade-service. Take note of the `STATUS` column and make sure no errors are displayed there. If any container is restarting or mentioning any other error, check the logs using the `sudo docker logs <container-name>` command.

If all has gone well, nginx should now be listening at both port 80 and port 443. Port 80 has a permanent redirect to port 443 so you can only access the CHT using https.

### Upgrades

During upgrades, the CHT upgrade service updates the docker-compose files in place. This means that any and all changes you may have made to the docker-compose files will be overwritten. If there is ever a need to make any changes to the docker-compose files, you will have to re-do them post upgrades or you should consider implementing them outside of those docker-compose files. 
