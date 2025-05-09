---
title: "Production Hosting in CHT 3.x"
linkTitle: "Production Hosting - Docker"
weight: 2
description: >
  Hosting the CHT on self run infrastructure
relatedContent: >
  hosting/3.x/ec2-setup-guide
aliases:
  - /apps/guides/hosting/3.x/self-hosting
  - /apps/guides/hosting/self-hosting
  - /technical-overview/docker-setup
---

{{< hextra/hero-subtitle >}}
  Hosting the CHT on self run infrastructure
{{< /hextra/hero-subtitle >}}

Whether run on bare-metal or in a cloud provider, the Community Health Toolkit (CHT) core framework has been packaged into a docker container to make it portable and easy to install. It is available from [dockerhub](https://hub.docker.com/r/medicmobile/medic-os). To learn more how to work with docker you could follow the tutorial [here](https://docker-curriculum.com/#getting-started) and the cheat sheet [here](https://docs.docker.com/get-started/docker_cheatsheet.pdf).  

{{< callout type="warning" >}}
  Before continuing, ensure all [requirements]({{< relref "hosting/requirements" >}}) are met.
{{< /callout >}}

## Installing with a compose file

The CHT containers are installed using [docker compose](https://docs.docker.com/compose/) so that you can run multiple containers  as a single service.

Start by choosing the location where you would like to save your compose configuration file.  Then create the `docker-compose.yml` file by `cd`ing into the correct directory and running:

```bash
curl -s -o docker-compose.yml https://raw.githubusercontent.com/medic/cht-core/master/scripts/docker-helper/docker-compose-developer-3.x-only.yml
```


The install requires an admin password that it will configure in the database. You need to provide this externally as an environment variable. Before you run the compose file, you need to export this variable as shown below.

`export DOCKER_COUCHDB_ADMIN_PASSWORD=myAwesomeCHTAdminPassword`

You can then run `docker compose` in the folder where you put your compose `docker-compose.yml` file. To start, run it interactively to see all the logs on screen and be able to stop the containers with `ctrl` + `c`:

```bash
sudo docker compose up 
```

If there are no errors, stop the containers with `ctrl` + `c` and then run it detached with `-d`:

```bash
sudo docker compose up -d
```

Note In certain shells, `docker compose` may not interpolate the admin password that was exported in `DOCKER_COUCHDB_ADMIN_PASSWORD`. Check if this is the case by searching the logs in the medic-os dockers instance. If the `docker logs medic-os` command below returns a user and password, then the export above failed, and you should use this user and password to complete the installation:

```bash
docker logs medic-os  |grep 'New CouchDB Admin'
Info: New CouchDB Administrative User: medic
Info: New CouchDB Administrative Password: password
```

Monitor the logs until you get the `Setting up software (100% complete)` message. At this stage all containers are fully set up. 

Once containers are setup, run the following command from your host terminal:

```bash
sudo docker exec -it medic-os /bin/bash -c "sed -i 's/--install=3.9.0/--complete-install/g' /srv/scripts/horticulturalist/postrun/horticulturalist"
sudo docker exec -it medic-os /bin/bash -c "/boot/svc-disable medic-core openssh && /boot/svc-disable medic-rdbms && /boot/svc-disable medic-couch2pg"
```

The first command fixes a postrun script for horticulturalist to prevent unique scenarios of re-install. The second command removes extra services that you will not need.

### Visit your project

If you're running this on your local machine, then open a browser to [https://localhost](https://localhost). Otherwise open a browser to the public IP of the host if it's running remotely.

You will have to click to through the SSL Security warning. Click "Advanced" -> "Continue to site".


### Clean up and re-install

If some  instructions were missed and there's a broken CHT deployment, use the commands below to start afresh:

1. Stop containers:  `docker stop medic-os && docker stop haproxy`
1. Remove containers: `docker rm medic-os && docker rm haproxy`
1. Clean data volume:`docker volume rm medic-data`

    Note: Running `docker compose down -v`  would do all the above 3 steps
1. Prune system: `docker system prune`

After following the above commands, you can re-run `docker compose` up and create a clean install:  `docker compose up -d`

### Port Conflicts

In case you are already running services on HTTP(80) and HTTPS(443),you will have to either remap ports to the medic-os container or stop the services using those ports.

To find out which service is using a conflicting port: On Linux:

`sudo netstat -plnt | grep ':<port>'`

On Mac (10.10 and above):

`sudo lsof -iTCP -sTCP:LISTEN -n -P | grep ':<port>'` 

You can either kill the service which is occupying HTTP/HTTPS ports, or run the container with forwarded ports that are free. In your compose file, change the ports under medic-os:

```yaml
services:
  medic-os:
    container_name: medic-os
    image: medicmobile/medic-os:cht-3.7.0-rc.1
    volumes:
      - medic-data:/srv
    ports:
     - 8080:80
     - 444:443
```

Turn off and remove all existing containers that were started:

 `sudo docker compose down`

Bring Up the containers in detached mode with the new forwarded ports.

 `sudo docker compose up -d`

Note: You can  substitute 8080, 444 with whichever ports are free on your host. You would now visit https://localhost:444 to visit your project.

## Data storage & persistence

{{< callout type="warning" >}}
  Containers that are already set up will lose all data when following the steps below to remap the `/srv` directory.
{{< /callout >}}

Docker containers are [stateless](https://www.redhat.com/en/topics/cloud-native-apps/stateful-vs-stateless) by design.  In order to persist your data when a container restarts you need to specify the volumes that the container can use to store data. The CHT app stores all its data in the `/srv` folder.  This is the folder that you need to map to your volume before you spin up your containers. 

Ideally you should map this folder to a volume that is backed up regularly by your cloud hosting provider.

The example below shows how to map this folder in Ubuntu:

1. Create the `/srv` folder: `sudo mkdir /srv` 
1. Mount your volume to this folder: `sudo mount /dev/xvdg /srv` . The attached volume number varies. Find your volume by running `lsblk`.
1. Update your compose file  so that the containers store data to this folder
    
    ```yaml
    services:
      medic-os:
        container_name: medic-os
        image: medicmobile/medic-os:cht-3.9.0-rc.2
        volumes:
          - /srv:/srv
   
     ----
     haproxy:
        container_name: haproxy
        image: medicmobile/haproxy:rc-1.17
        volumes:
          - /srv:/srv 
    ```

Alternatively, can create the `/srv` folder on any drive with enough space that is regularly backed up. Then map the path to the folder in the compose file like this.

```yaml
volumes:
      - /path/to/srv:/srv
```

Be sure to check the available storage space regularly and expand your volume when needed

## Backup

Regular backups should be made of the `/srv` directory to have holistic and easy to restore copies of all important data and the current CHT version installed.  To backup just the data and not the CHT, make copies of `/srv/storage/medic-core/`.  This directory includes 4 key sub-directies:

{{< filetree/container >}}
  {{< filetree/folder name="srv" >}}
    {{< filetree/folder name="couchdb" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="openssh" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="nginx" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="passwd" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

To make backups of just CouchDB data outside of the CHT docker infrastructure, see [CouchDB's Backup docs for 2.3.1](https://web.archive.org/web/20220527070753/https://docs.couchdb.org/en/2.3.1/maintenance/backups.html). Note:
* CouchDB data files are in `/srv/storage/medic-core/couchdb/data` in the `medic-os` container.
* Backing up via replication is discouraged as restored DBs can cause offline users to restart replication from zero. Use file backups instead. 
