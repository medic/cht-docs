---
title: "Docker"
linkTitle: "Docker"
weight: 1
description: >
  Installing CHT applications using docker and docker-compose
---

{{% pageinfo %}}
For production CHT deployments, Linux is recommended, with [Ubuntu](https://ubuntu.com/server) the most commonly used. For CHT development, Linux or macOS may be used. Windows can be used for either, but without recommendation.
{{% /pageinfo %}}

## Docker installation

Install both `docker` and `docker-compose` to run CHT and related containers.

{{% alert title="Note" %}}
Skip this step if you're following the [EC2 guide 3.x]({{< relref "hosting/3.x/ec2-setup-guide#create-and-configure-ec2-instance" >}}) as `docker` and `docker-compose` are automatically installed when following the setup scripts.
{{% /alert %}}

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
