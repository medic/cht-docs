---
title: "Local Docker Setup"
toc_hide: true
hide_summary: true
---
{{< tabpane text=true >}}
{{% tab header="Linux (Ubuntu)" %}}
```shell
curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh
# OPTIONAL: Allow user to run Docker without sudo
dockerd-rootless-setuptool.sh install
echo "export PATH=/usr/bin:$PATH" >> ~/.$(basename $SHELL)rc
echo "export DOCKER_HOST=unix:///run/user/1000/docker.sock" >> ~/.$(basename $SHELL)rc
. ~/.$(basename $SHELL)rc
```
{{% /tab %}}
{{% tab header="macOS" %}}
Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop).
{{% /tab %}}
{{% tab header="Windows (WSL2)" %}}
Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop).
{{% /tab %}}
{{< /tabpane >}}

Restart your entire machine to finish initializing Docker.

After restarting, verify Docker is running as expected. Run the simple `hello-world` Docker container. This should output "Hello from Docker!" as well as some other intro text:

```shell
docker run hello-world
```
