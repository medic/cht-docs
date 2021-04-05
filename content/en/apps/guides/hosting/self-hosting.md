---
title: "Self Hosting"
linkTitle: "Self Hosting"
weight: 
description: >
  How to access container, retrieve logs, isolate security groups
relatedContent: >
  apps/guides/hosting/ec2-setup-guide
---


The Community Health Toolkit (CHT) core framework has been packaged into a docker container to make it portable and easy to install. It is available from [dockerhub](https://hub.docker.com/r/medicmobile/medic-os). To learn more how to work with docker you could follow the tutorial [here](https://docker-curriculum.com/#getting-started) and the cheat sheet [here](https://www.docker.com/sites/default/files/d8/2019-09/docker-cheat-sheet.pdf).  

{{% alert title="Note" %}} Before continuing, ensure all [requirements]({{< relref "apps/guides/hosting/requirements" >}}) are met. {{% /alert %}}

## Installing with a compose file

The CHT containers are installed using [docker compose](https://docs.docker.com/compose/reference/overview/) so that you can run multiple containers  as a single service.

Start by choosing the location where you would like to save your compose configuration file.  Then create your docker compose file (docker-compose.yml) by cding into the correct directory and running:

```bash
curl -s -o docker-compose.yml https://raw.githubusercontent.com/medic/cht-infrastructure/master/self-hosting/main/docker-compose.yml

```


The install requires an admin password that it will configure in the database. You need to provide this externally as an environment variable. Before you run the compose file, you need to export this variable as shown below.

`export DOCKER_COUCHDB_ADMIN_PASSWORD=myAwesomeCHTAdminPassword`

You can then run docker-compose in the folder where you put your compose configuration yaml file as shown below.

```bash
## run compose inside the configuration folder as root 

sudo docker-compose -f docker-compose.yml up 

## In detached mode 
sudo docker-compose -f /path/to/docker-compose.yml up -d

```

Note In certain shells, docker-compose may not interpolate the admin password that was exported above. Check if this is the case by searching the logs in the medic-os dockers instance. If the `docker logs medic-os` command below returns a user and password, then the export above failed, and you should use this user and password to complete the installation:

```bash
docker logs medic-os  |grep 'New CouchDB Admin'
[2020/09/10 18:49:03] Info: New CouchDB Administrative User: medic
[2020/09/10 18:49:03] Info: New CouchDB Administrative Password: password

```
You can keep monitoring the logs untill you get the `Setting up software (100% complete)` message. At this stage all containers are fully set up. 


Once containers are setup, please run the following command from your host terminal:

```bash

sudo docker exec -it medic-os /bin/bash -c "sed -i 's/--install=3.9.0/--complete-install/g' /srv/scripts/horticulturalist/postrun/horticulturalist"
sudo docker exec -it medic-os /bin/bash -c "/boot/svc-disable medic-core openssh && /boot/svc-disable medic-rdbms && /boot/svc-disable medic-couch2pg"

```

The first command fixes a postrun script for horticulturalist to prevent unique scenarios of re-install. The second command removes extra services that you will not need.

### Visit your project

If you're running this on your local machine, then open a browser to https://localhost. Otherwise open a browser to the public IP of the host if it's running remotely.

You will have to click to through the SSL Security warning. Click Advanced -> Continue to site.


### Clean up and re-install

You could have missed some of the instructions above and end with a bricked setup.  You can use the commands below to clean up and start afresh.

Stop containers:

- `docker stop medic-os && docker stop haproxy`

Remove containers:

- `docker rm medic-os && docker rm haproxy`

Clean data volume:

- `docker volume rm medic-data`

Note: Running `docker-compose -f docker-compose.yml down -v`  would do all the above 3 steps

Prune system:

- `docker system prune`

After following the above commands, you can re-run docker-compose up and create a fresh install (no previous data present)

- `docker-compose -f docker-compose.yml up -d`

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

 `sudo docker-compose -f /path/to/docker-compose.yml down`

Bring Up the containers in detached mode with the new forwarded ports.

 `sudo docker-compose -f /path/to/docker-compose.yml up -d`

Note: You can  substitute 8080, 444 with whichever ports are free on your host. You would now visit https://localhost:444 to visit your project.

### Helpful Docker Commands

#### Get  into a container and view specific service logs 

`docker exec -it medic-os /bin/bash`

##### Once inside container

- view couchdb logs:
`less /srv/storage/medic-core/couchdb/logs/startup.log`
- view medic-api logs:
`less /srv/storage/medic-api/logs/medic-api.log`
- view medic-sentinel logs:
`less /srv/storage/medic-sentinel/logs/medic-sentinel.log`

#### View container stderr/stdout log

`docker logs medic-os`
`docker logs haproxy`

#### Other handy commands

- list running containers `docker ps`

- list all available docker containers with their status `docker ps -a`

- stop container `docker stop <container_id>`

- start container `docker start <container_id>`

- list all stoped containers `docker ps -f "status=exited"`

## SSL Certificate Installation

Once your application is up,  you can install your ssl certificates by following the steps below.

- First you need to have your ssl certificate files handy. Both the key file (`ssl.key`) that you used to generate the certificate and the certificate file (`ssl.crt`) issued by certification authority e.g. letsencrypt. 

Note: If your certification authority issued you `.pem` files, you can easily convert `.pem` files to `.crt` using the command below. 

```bash
openssl x509 -outform der -in your-cert.pem -out your-cert.crt

```

### Copy certificates into the medic-os container

```bash
sudo docker cp /path/to/ssl.crt medic-os:/srv/settings/medic-core/nginx/private/ssl.crt
sudo docker cp /path/to/ssl.key medic-os:/srv/settings/medic-core/nginx/private/ssl.key
```

### Edit the nginx configuration file and restart

```bash
# enter medic-os container:
sudo docker exec -it medic-os /bin/bash
sed -i "s|default.crt|ssl.crt|" /srv/settings/medic-core/nginx/nginx.conf
sed -i "s|default.key|ssl.key|" /srv/settings/medic-core/nginx/nginx.conf
# restart mginx
 /boot/svc-restart medic-core nginx

```

### View Nginx Logs

```bash
# enter medic-os container:
docker exec -it medic-os /bin/bash
cd /srv/storage/medic-core/nginx/logs/ 
ls
access.log error-ssl.log error.log startup.og
```

## Data storage & persistence

Docker containers are [stateless](https://www.redhat.com/en/topics/cloud-native-apps/stateful-vs-stateless) by design.  In order to persist your data when a container restarts you need to specify  the volumes that the container can use to store data. The CHT app stores all it's data in the `/srv` folder.  This is the folder that you need to map to your volume before you spin up your containers. 

Ideally you should map this folder to a volume that is backed up regulaly by your cloud hosting provider.

The exmaple below shows how to map this folder in Ubuntu

```bash
# create the /srv folder 
sudo mkdir  /srv 

## mount your volume to this folder 
sudo mount /dev/xvdg /srv # the attached volume number varries find your volume by running lsblk
```

Update your compose file  so that the containers store data to this folder

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

Alternatively  you can create the /srv folder on any drive with enough space that is regularly backed up. You then just map the path to the folder in the compose file like this.

```yaml
volumes:
      - /path/to/srv:/srv
```

Be sure to check the available storage space regularly and expand your volume when needed

It is good to note that if you have already set up your containers, you need to find a way to back up your data before you change the mount points to a backed up volume else you risk losing all your data. 






























### How to access container, retrieve logs, isolate security groups
* How to [restart services](https://github.com/medic/medic-os#user-content-service-management-scripts):
`/boot/svc-<start/stop/restart> <service-name/medic-api/medic-sentinel/medic-core couchdb/medic-core nginx>`

### AWS docs for increasing disk size:
* Stop medic: `sudo supervisorctl stop medic`
* Go to EBS in AWS and take a snapshot of the volume.
* Modify the volume size (Increase it by 2x preferably). Wait until the modification succeeds.
* Follow the following link to make the instance recognize the additional space: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html
* Turn medic back on: `sudo supervisorctl start medic`

### Links to medic documentation for horticulturalist for upgrades:
* log into container & run: `COUCH_NODE_NAME=couchdb@127.0.0.1 COUCH_URL=http://medic:<pw>@localhost:5984/medic /srv/software/horticulturalist/node_modules/.bin/horti --medic-os --install=<version>`

### Monitoring & Backup
* AWS CloudWatch and monitoring tab. Enable detailed monitoring (This costs more money)
* Set up Lifecycle Management for EBS snapshots:
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html#snapshot-lifecycle-console
* Steps to mounting a backup snapshot to the instance and restarting the application
* Please see the second-half of “Increasing disk size” reference above
* Setup a TLS cert & DNS registration