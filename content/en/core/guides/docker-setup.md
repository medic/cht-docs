---
title: "Docker Image Setup"
linkTitle: "Docker Use"
weight: 
description: >
  Download and run the publicly available Docker image for CHT applications
relevantLinks: >
---

This document helps to download and run the public docker image for CHT applications.

## Install Docker

Please be sure `docker` and `docker-compose` are [installed]({{< relref "apps/guides/hosting/requirements#docker" >}}). 

## Use Docker-Compose:

In the location you would like to host your configuration files, create a file titled <project_name>-medic-os-compose.yml with the following contents. 

One way to do this is using the `curl` command line tool. In this example we're creating a file called `test-docs-medic-os-compose.yml`:

```
curl -o test-docs-medic-os-compose.yml https://raw.githubusercontent.com/medic/cht-core/master/docker-compose.yml
```

Alternately, if you do not have  `curl`, you can [right click this link](https://raw.githubusercontent.com/medic/cht-core/master/docker-compose.yml) and choose "Save link as..." and specify the correct location to save.

Export a password for admin user named `medic`:
```
export DOCKER_COUCHDB_ADMIN_PASSWORD=<random_pw>
```

### Launch docker-compose containers

Inside the directory that you saved the above <project_name>-medic-os-compose.yml, run:
```
$ docker-compose -f <project_name>-medic-os-compose.yml up
```
{{% alert title="Note" %}}
In certain shells, docker-compose may not interpolate the admin password that was exported above. In that case, your admin user had a password automatically generated. Note the `New CouchDB Administrative User` and `New CouchDB Administrative Password` in the output terminal. You can retrieve these via running `docker logs medic-os` and searching the terminal.
{{% /alert %}}



Once containers are setup, please run the following command from your host terminal:
```
$ docker exec -it medic-os /bin/bash -c "sed -i 's/--install=3.9.0/--complete-install/g' /srv/scripts/horticulturalist/postrun/horticulturalist"
$ docker exec -it medic-os /bin/bash -c "/boot/svc-stop medic-core openssh && /boot/svc-stop medic-rdbms && /boot/svc-stop medic-couch2pg"
```

The first command fixes a postrun script for horticulturalist to prevent unique scenarios of re-install.
The second command stops extra services that you will not need.

### Visit your project

Open a browser to: [https://localhost](https://localhost)

You will have to click to through the SSL Security warning. Click Advanced -> Continue to site.

### Delete & Re-Install

Stop containers:
* `docker-compose down` or `docker stop medic-os && docker stop haproxy`

Remove containers:
* `docker-compose rm` or `docker rm medic-os && docker rm haproxy`

Clean data volume:
* `docker volume rm medic-data`

After following the above three commands, you can re-run `docker-compose up` and create a fresh install (no previous data present)

## Port Conflicts

In case you are already running services on HTTP(80) and HTTPS(443), you will have to map new ports to the medic-os container.

Turn down and remove all existing containers that were started: 
* `docker-compose down && docker-compose rm`

To find out which service is using a conflicting port:
On Linux:
```
sudo netstat -plnt | grep ':<port>'
```
On Mac (10.10 and above):
```
sudo lsof -iTCP -sTCP:LISTEN -n -P | grep ':<port>'
```
You can either kill the service which is occupying HTTP/HTTPS ports, or run the container with forwarded ports that are free.
In your compose file, change the ports under medic-os:
```
services:
  medic-os:
    container_name: medic-os
    image: medicmobile/medic-os:latest
    volumes:
      - medic-data:/srv
    ports:
     - 8080:80
     - 444:443
```
{{% alert title="Note" %}}
You can substitute 8080, 444 with whichever ports are free on your host. You would now visit https://localhost:444 to visit your project.
{{% /alert %}}



## Helpful Docker commands

### Restart services
`/boot/svc-<start/stop/restart> <service-name/medic-api/medic-sentinel/medic-core couchdb/medic-core nginx>`

See [medic-os docs](https://github.com/medic/medic-os#user-content-service-management-scripts) for more.

### Viewing logs inside `medic-os`

To view logs, first run this to access a shell in the `medic-os` container: 
 
* `docker exec -it medic-os /bin/bash`

View CouchDB logs:
* `less /srv/storage/medic-core/couchdb/logs/startup.log`

View `medic-api` logs: 
* `less /srv/storage/medic-api/logs/medic-api.log`

View `medic-sentinel` logs: 
* `less /srv/storage/medic-sentinel/logs/medic-sentinel.log`

### Viewing default stderr/stdout logs

* `sudo docker logs medic-os`
* `sudo docker logs haproxy`


### Clean Up

List running containers: 
* `sudo docker ps`

List all available docker containers with their status
* `sudo docker ps -a

Stop container
* `sudo docker stop <container_id>/<container_name>`

Start container
* `sudo docker start <container_id>`

List all stopped containers 
* `sudo docker ps -f "status=exited"`


### Prune entire Docker system
Use this `prune` command when unable to launch the containers and need to restart from a clean slate. **WARNING:** This will delete all your unused images, containers, networks and volumes **including those not related to CHT**.

```docker system prune -a --volumes```
