---
title: "CHT hosting requirements"
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

CHT 3.x is [End-of-Life]({{< relref "core/releases#supported-versions" >}}) and us no longer supported. All requirements below apply to CHT 4.x.

## App Developer Hosting

This leverages Docker and requires:

* 4 GB RAM  / 2 CPU / 8 GB SSD
* Root Access
* TLS certificates -  Docker Helper for [3.x]({{< relref "hosting/3.x/app-developer#cht-docker-helper" >}}) or [4.x]({{< relref "hosting/4.x/app-developer#cht-docker-helper-for-4x" >}}) provides these  for you.
* [Current version](https://docs.docker.com/engine/install/) of `docker` or current version of [Docker Desktop](https://www.docker.com/products/docker-desktop/) both of which include `docker compose`. Note that the older `docker-compose` is [no longer supported](https://www.docker.com/blog/announcing-compose-v2-general-availability/).

##  Production Hosting

### Docker

* 8 GB RAM / 4 CPU / 100 GB SSD
* Root Access
* Static IP with DNS entry -  will be used to provision a valid TLS certificate
* [Current version](https://docs.docker.com/engine/install/) of `docker` and `docker compose`

### Kubernetes

This guide refers to "Kubernetes", but Medic recommends a lightweight orchestrator called [K3s](https://docs.k3s.io/) for bare-metal hosts.  The requirements below refer to K3s deployments but can be translated to other Kubernetes hosting.  For example, for cloud hosting, we recommend Amazon [Elastic Kubernetes Service](https://aws.amazon.com/eks/) (EKS) and we've also assisted in a [large K3s deployment based on VMWare]({{< relref "4.x/production/kubernetes/self-hosting-k3s-multinode" >}}).

Be sure to see the `cht-deploy` [script](https://github.com/medic/cht-core/tree/master/scripts/deploy) that leverage the `helm` [application](https://helm.sh/docs/intro/install/).

* 1 x HA control-plane nodes: 2 GB RAM / 2 CPU / 20 GB SSD
* 3 x worker servers: 16 GB RAM / 8 CPU / 50 GB SSD
* 500GB storage area network (SAN)* - Will host [Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
* Root Access
* Static IP with DNS entry - Kubernetes will use this to provision a valid TLS certificate
* `helm` [application](https://helm.sh/docs/intro/install/)
* [K3s](https://docs.k3s.io/)
* [Current version](https://docs.docker.com/engine/install/) of `docker` (used to bootstrap K3s)

_\* During some upgrades, up to 3x current space used by CouchDB can be needed_

## Required skills

In addition to the hosting requirements, system administrators should have a basic understanding of command line interface, Kubernetes, docker, container orchestration, deployment, databases (CouchDB, Postgres), networking components (TLS, IP addresses, DNS).
