---
title: "Requirements"
linkTitle: "Requirements"
weight: 
description: >
  Requirements for hosting CHT
relatedContent: >
  apps/guides/hosting/self-hosting
---

Hosting a CHT instance in a cloud provider, like AWS, or on bare-metal requires you have sufficient hardware specifications, Docker and Docker Compose installed and other infrastructure requirements met.

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

Depending on which distro you run, install the docker packages from [here](https://docs.docker.com/engine/install/). 

We have however, historically run most of our containers in Ubuntu:

- [Docker CE](https://docs.docker.com/engine/install/ubuntu/)  

- [Docker-compose](https://docs.docker.com/compose/install/)

### Windows 

- [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

- [Docker for Windows here](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)  and [here](https://docs.docker.com/docker-for-windows/install/)

Note: If you have Hyper-V Capability, please ensure it is enabled in order to run Linux Containers on Windows. If you are running your Windows Server in cloud services, please ensure it is running on [bare-metal](https://en.wikipedia.org/wiki/Bare_machine). You will not be able to run Linux Containers in Windows if the previous comments are not adhered due to nested virtualization.

If you do not have Hyper-V capability, but your server still supports virtualization, ensure that is enabled in your BiOS, and install the following package: [Docker Toolbox using VirtualBox](https://github.com/docker/toolbox/releases)

### macOS:

See [Docker's page](https://docs.docker.com/docker-for-mac/install/) about how to install Docker Desktop for macOS.

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