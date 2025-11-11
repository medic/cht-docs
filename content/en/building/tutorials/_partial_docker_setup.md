---
title: "Local Docker Setup"
sidebar:
  exclude: true
aliases:
   - /apps/tutorials/_partial_docker_setup
---

{{< tabs items="Linux (Ubuntu),macOS,Windows (WSL2)" >}}

  {{< tab >}}
    Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop).  
    
    Alternatively, on Linux you can use the following commands to install [Docker Engine](https://docs.docker.com/engine/). (This will reduce the layers of technical abstraction for running containers, but will not include a GUI application for managing your Docker resources.) 
    
    ```shell
    curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh
    # OPTIONAL: Allow user to run Docker without sudo
    dockerd-rootless-setuptool.sh install
    echo "export PATH=/usr/bin:$PATH" >> ~/.$(basename $SHELL)rc
    echo "export DOCKER_HOST=unix:///run/user/1000/docker.sock" >> ~/.$(basename $SHELL)rc
    . ~/.$(basename $SHELL)rc
    ```
    
    Restart your entire machine to finish initializing Docker.
  {{< /tab >}}
  {{< tab >}}
    Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop) or [Colima](https://github.com/abiosoft/colima#readme).
    
    Restart your entire machine to finish initializing Docker.
  {{< /tab >}}
  {{< tab >}}
    Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop).
    
    Restart your entire machine to finish initializing Docker.
    
    After you have restarted, ensure that "Enable integration with my default WSL distro" is checked in Docker Desktop along with intgration to other distros:
    
    ![windows.docker.desktop.png](/building/tutorials/_partial_docker_setup/windows.docker.desktop.png)
  {{< /tab >}}

{{< /tabs >}}

After restarting, verify Docker is running as expected. Run the simple `hello-world` Docker container. This should output "Hello from Docker!" as well as some other intro text:

```shell
docker run hello-world
```
