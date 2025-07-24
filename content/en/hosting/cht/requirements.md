---
title: "CHT hosting requirements"
linkTitle: "Requirements"
weight: 2
description: >
  Requirements for hosting CHT applications
relatedContent: >
  hosting/cht
aliases:
  - /apps/guides/hosting/requirements
---

{{< callout  >}}
  For production CHT deployments, Linux is recommended, with [Ubuntu](https://ubuntu.com/server) the most commonly used. For App Developer Hosting, Linux or macOS may be used. Windows can be used for either, but without recommendation.
{{< /callout >}}

Per the [Kubernetes vs Docker]({{< relref "/hosting/cht/kubernetes-vs-docker" >}}) page, CHT Core can be deployed with either Docker or Kubernetes.

## App Developer Hosting

This leverages Docker and requires:

* 4 GB RAM  / 2 CPU / 8 GB SSD
* Root Access
* TLS certificates - if using  [Docker Helper]({{< relref "/hosting/cht/app-developer#cht-docker-helper-for-4x" >}}) these are provided for you.
* [Current version](https://docs.docker.com/engine/install/) of `docker` or current version of [Docker Desktop](https://www.docker.com/products/docker-desktop/) both of which include `docker compose`. Note that the older `docker-compose` is [no longer supported](https://www.docker.com/blog/announcing-compose-v2-general-availability/).

##  Production Hosting

### Docker

* 8 GB RAM / 4 CPU / 100 GB SSD
* Root Access
* Static IP with DNS entry -  will be used to provision a valid TLS certificate
* [Current version](https://docs.docker.com/engine/install/) of `docker` and `docker compose`

### Kubernetes

This guide refers to "Kubernetes", and a lightweight orchestrator called [K3s](https://docs.k3s.io/) can be used for bare-metal hosts. The requirements below refer to K3s deployments but can be translated to other Kubernetes hosting. For example, for cloud hosting, CHT is widely deployed with Amazon [Elastic Kubernetes Service](https://aws.amazon.com/eks/) (EKS). Additionally, the CHT is succesfully deployed in a [large K3s deployment based on VMWare]({{< relref "/hosting/cht/kubernetes/self-hosting-k3s-multinode" >}}).

Be sure to see the `cht-deploy` [script](https://github.com/medic/cht-core/tree/master/scripts/deploy) that leverage the `helm` [application](https://helm.sh/docs/intro/install/).

* 1 x HA control-plane nodes: 2 GB RAM / 2 CPU / 20 GB SSD
* 3 x worker servers: 16 GB RAM / 8 CPU / 50 GB SSD
* 500GB storage area network (SAN)* - Will host [Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
* Root Access
* Static IP with DNS entry - Kubernetes will use this to provision a valid TLS certificate
* `helm` [application](https://helm.sh/docs/intro/install/)
* [K3s](https://docs.k3s.io/)
* [Current version](https://docs.docker.com/engine/install/) of `docker` (used to bootstrap K3s)

{{< callout type="warning" >}}
  During some upgrades, up to 3x current space used by CouchDB can be needed.
{{< /callout >}}


## Required skills
In addition to the hosting requirements, system administrators should have a basic understanding of command line interface, Kubernetes, Docker, container orchestration, deployment, databases (CouchDB, Postgres), networking components (TLS, IP addresses, DNS).
