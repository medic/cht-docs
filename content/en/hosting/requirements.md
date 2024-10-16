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

## Docker Compose App Developer Hosting

* 4 GB RAM  / 2 CPU / 8 GB SSD
* Root Access
* TLS certificates -  Docker Helper for [3.x]({{< relref "hosting/3.x/app-developer#cht-docker-helper" >}}) or [4.x]({{< relref "hosting/4.x/app-developer#cht-docker-helper-for-4x" >}}) provides these  for you.
* [Current version](https://docs.docker.com/engine/install/) of `docker` or current version of [Docker Desktop](https://www.docker.com/products/docker-desktop/) both of which include `docker compose`. Note that the older `docker-compose` has been [deprecated in favor of Compose V2](https://www.docker.com/blog/announcing-compose-v2-general-availability/).

## Kubernetes Production Hosting

This guide refers to "Kubernetes", but Medic recommends a lightweight orchestrator called [K3s](https://docs.k3s.io/) for bare-metal hosts.  The requirements below refer to K3s deployments but can be translated to other Kubernetes hosting.  For example, for cloud hosting, we recommend Amazon [Elastic Kubernetes Service](https://aws.amazon.com/eks/) (EKS) and we've also assisted in a [large K3s deployment based on VMWare]({{< relref "4.x/production/kubernetes/self-hosting-k3s-multinode" >}}).

Be sure to see the `cht-deploy` [script](https://github.com/medic/cht-core/tree/master/scripts/deploy) that leverage the `helm` [application](https://helm.sh/docs/intro/install/).

* 1 x HA control-plane nodes: 2 GB RAM  / 2 CPU / 20 GB SSD
* 3 x worker servers: 16 GB RAM  / 8 CPU / 50 GB SSD
* 500GB storage area network (SAN)* - Will host [Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
* Root Access
* Static IP with DNS entry - Kubernetes will use this to provision a valid TLS certificate
* `helm` [application](https://helm.sh/docs/intro/install/)
* [K3s](https://docs.k3s.io/)
* [Current version](https://docs.docker.com/engine/install/) of `docker` (used to bootstrap K3s)

_\* During some upgrades, up to 3x current space used by CouchDB can be needed_

## K3s

K3s is lightweight, but requires some minimum requirements to run.
Whether you're installing K3s to run a native linux service or a container, each node should meet a minimum requirements.

### **Architecture**

* x86_64
* armhf
* arm64/aarch64
* s390x

### **Operating Systems**

* K3s is expected to work on most modern Linux systems

### **Hardware requirements**

| Spec | Minimum | Recommended |
| ---- | ------- | ----------- |
| CPU  | 1 Core  | 2 Cores     |
| RAM  | 512 MB  | 1 GB        |

##### Disks

K3s performance depends on the performance of the database. To ensure optimal speed, we recommend using an SSD when possible.
Disk performance will vary on ARM devices utilizing an SD card or eMMC

### **Networking**

The K3s server needs port 6443 to be accessible by all nodes.
The nodes need to be able to reach other nodes over UDP port 8472 when using the Flannel VXLAN backend, or over UDP port 51820 (and 51821 if IPv6 is used) when using the Flannel WireGuard backend.

## Required skills

In addition to the hosting requirements, system administrators should have a basic understanding of command line interface, Kubernetes, docker, container orchestration, deployment, databases (CouchDB, Postgres), networking components (TLS, IP addresses, DNS).
