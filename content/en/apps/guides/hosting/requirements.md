---
title: "Requirements"
linkTitle: "Requirements"
weight: 5
description: >
  Requirements for hosting CHT
relatedContent: >
  apps/guides/hosting/self-hosting
  core/guides/docker-setup
---

Hosting a CHT instance in a cloud provider like AWS or on bare-metal requires you have sufficient hardware specifications, Docker and Docker Compose installed and other infrastructure requirements met.

## Hardware Requirements

- 4 GiB RAM
- 2 CPU/vCPU
- 50 GB Hard Disk (SSD prefered)
- SSL certificates ( To be able to use the CHT app on mobile)
- Root Access 

Depending on the scale of your operation these may need to be adjusted.

##  Docker

Install both `docker` and `docker-compose` to run the two `medic-os` and `haproxy` containers.

### Linux

Depending on which distro you run, install the Docker packages from [Docker's Linux options](https://docs.docker.com/engine/install/#server).  Historically, Medic runs Ubuntu: see [Docker CE](https://docs.docker.com/engine/install/ubuntu/) and [Docker-compose](https://docs.docker.com/compose/install/) install pages.

### Windows 

Docker Desktop for Windows needs either Hyper-V support or Windows Subsystem for Linux 2 (WSL 2).  [Docker's Windows Docker Desktop install page](https://docs.docker.com/docker-for-windows/install/) covers both scenarios. 

### macOS:

See [Docker's macOS Docker Desktop install page](https://docs.docker.com/docker-for-mac/install/).

### Verify install

Test that `docker` and `docker-compose` installed correctly by showing their versions with `sudo docker-compose --version` and `sudo docker --version`. Note, your version may be different:

```bash

sudo docker-compose --version
docker-compose version 1.27.1, build 509cfb99

sudo docker --version
Docker version 19.03.12, build 48a66213fe
```

Finally, confirm you can run the "hello world" docker container: `sudo docker run hello-world`

## Considerations

There are serious implications to consider when deploying a CHT instance beyond the above requirements.  Be sure to account for:

* Alerting - How will alerts be sent in the case of downtime or degraded service? 
* Power failures and unplanned restarts - Will the server cleanly restart such that the CHT resumes service correctly?
* Backups - What happens to the CHT data if there's a hard drive failure?  
* Disaster Recovery - What happens if there is a flood at the facility and on-site active and backup data are destroyed?
* Scale - What happens when the hardware deployed needs to be upgraded to increase capacity?
* Updates - By definition TLS certificates expire and software needs to be updated - how will the deployment get these updates on a regular basis?
* Security - While the TLS certificate will protect data on the LAN, is the server hard drive encrypted in the event of property theft? 
* Privacy - The CHT inherently carries sensitive patient medical information in the database. Are there sufficient measures in place to protect this sensitive data?  