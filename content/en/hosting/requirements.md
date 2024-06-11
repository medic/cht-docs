---
title: "Requirements"
linkTitle: "Requirements"
weight: 1
aliases:  
  - /apps/guides/hosting/requirements
description: >
  Requirements for hosting CHT applications
relatedContent: >
  hosting/3.x/self-hosting
  hosting/3.x/ec2-setup-guide
---

{{% pageinfo %}}
For production CHT deployments, Linux is recommended, with [Ubuntu](https://ubuntu.com/server) the most commonly used. For App Developer Hosting, Linux or macOS may be used. Windows can be used for either, but without recommendation.
{{% /pageinfo %}}

Per the [Kubernetes vs Docker]({{< relref "hosting/kubernetes-vs-docker" >}}) page, CHT Core can be deployed with either Docker or Kubernetes.

**Docker Compose**: 
   * 4.x and 3.x Application developer
   * 3.x Production.  Note: 3.x is [End-of-Life]({{< relref "core/releases#supported-versions" >}})

**Kubernetes**: 
   * 4.x Production
## 3.x and 4.x Docker Compose App Developer Hosting


* 4 GB RAM  / 2 CPU / 8 GB SSD
* Root Access
* TLS certificates -  Docker Helper for [3.x]({{< relref "hosting/3.x/app-developer#cht-docker-helper" >}}) or [4.x]({{< relref "hosting/4.x/app-developer#cht-docker-helper-for-4x" >}}) provides these  for you.
* [Current version](https://docs.docker.com/engine/install/) of `docker` or current version of [Docker Desktop](https://www.docker.com/products/docker-desktop/) both of which include `docker compose`. Note that the older `docker-compose` has been [deprecated in favor of Compose V2](https://www.docker.com/blog/announcing-compose-v2-general-availability/). 

Software requirements
* A static IP
* A DNS Entry pointing to the IP
* TLS certificates
* Helm version 3.
* k3d/k3s with at least 1 control node and 1 worker node - for kubernetes installation

### Self-hosting/Data center setup

Minimum Hardware requirements
* 8 cores and > 8GB RAMs

Software requirements and dependencies
* Helm version 3.
* k3d/k3s with at least 3 control nodes and 1 worker node.

### Cloud hosting

Supported Cloud providers
* AWS

Compute instances required
* m7g.xlarge (4 vCPUs, 16GB)

ALB installation
* Required to support k8s ingress.

Depending on the scale of your operation these may need to be increased. Be sure to monitor disk usage so that the resources can be increased as needed.

## Installation using Docker
{{% alert title="Note" %}}
For production CHT deployments, Linux is recommended, with [Ubuntu](https://ubuntu.com/server) being the most commonly used. For CHT development, Linux or macOS may be used. Windows can be used for either, but without recommendation.
{{% /alert %}}

Install both `docker` and `docker-compose` to run CHT and related containers. Skip this step if you're following the [EC2 guide 3.x]({{< relref "hosting/3.x/ec2-setup-guide#create-and-configure-ec2-instance" >}}) as `docker` and `docker-compose` are automatically installed when following the setup scripts.


### Linux

Depending on which distro you run, install the Docker packages from [Docker's Linux options](https://docs.docker.com/engine/install/#server). Historically, Medic runs Ubuntu: see [Docker CE](https://docs.docker.com/engine/install/ubuntu/) and [Docker-compose](https://docs.docker.com/compose/install/) install pages.

### Windows

Docker Desktop for Windows needs either Hyper-V support or Windows Subsystem for Linux 2 (WSL 2). [Docker's Windows Docker Desktop install page](https://docs.docker.com/docker-for-windows/install/) covers both scenarios.

### macOS

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

## Required skills
In addition to the hosting requirements, system administrators should have a basic understanding of command line interface, Kubernetes, docker, container orchestration, deployment, database commands(CouchDB, Postgres), networking components(SSL, IP addresses, DNS).
