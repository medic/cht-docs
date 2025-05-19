---
title: Kubernetes vs Docker
linkTitle: Kubernetes vs Docker
weight: 5
description: >
  Options for installing CHT applications
aliases:
  -  /hosting/vertical-vs-horizontal
---

To deploy the CHT, you should use the technology you are most familiar and comfortable with. It is possible to deploy 20 CHT instances without using Kubernetes. Conversely, if a hosting organisation uses Kubernetes and intends to deploy a single instance of the CHT, that's also fine.

> [!TIP]
> Application development for both [CHT 3.x]({{< relref "hosting/3.x/app-developer" >}}) and [CHT 4.x]({{< relref "hosting/4.x/app-developer" >}}) is more straightforward to setup with Docker.

## Docker 

Docker has stood the test of time and has many benefits:

* Easy to deploy by just downloading a compose file.
* Trivially scales down to a 4-core laptop and [way up to a 48-core server](https://forum.communityhealthtoolkit.org/t/investigate-adding-more-shards-as-a-potential-avenue-for-improved-performance/4831). 
* Easily integrates with existing Docker based solutions like [Watchdog](/hosting/monitoring/) or other services running in Docker.
* Backup and restore can be achieved via simple file management via [bind mounted volumes](https://docs.docker.com/engine/storage/bind-mounts/).
* Just enough complexity to securely and soundly run the CHT without extra complexities of Kubernetes 
* Natively supports one-click CHT upgrades in the admin GUI

Docker Compose deployment has the following services when running the CHT:

* A service for each CouchDB instance.
* A CHT API service.
* HAProxy Healthcheck service.
* HAProxy service.
* Upgrade Service service.
* A CHT Sentinel service.
* An nginx service to act as a reverse proxy and terminate TLS connections

## Kubernetes (k8s)

Running CHT on k8s requires additional knowledge and can be more complex to deploy.

k8s offers:

* Resilient network across either physical or VM nodes in the cluster. This allows strong distribution of the heavy CPU and RAM loads that CouchDB can incur under heavy use.
* Orchestration of multiple deployments ensuring easy hosting of multi-tenants. For example you may opt to have a user acceptance testing (UAT), staging, and production instances all in one cluster.
* Service discovery which  enables routing of public requests to deployments within the cluster
* Integration with hypervisors such as VMware and ESX. This is possible due to CRD support in Kubernetes that allows third parties to create integrations
* Helm support and integration that makes it easy to deploy applications onto the cluster
* Highly efficient snapshot backups when used with a storage area network ([SAN](https://en.wikipedia.org/wiki/Storage_area_network)) or Amazon's [Elastic Block Storage](https://aws.amazon.com/ebs/) (EBS).

The main components of a Kubernetes CHT deployment include one less service than a Compose-based deployment as ingress via `nginx` isn't needed as it's handled externally:

* A pod for each CouchDB instance.
* A CHT API pod.
* A CHT HAProxy Healthcheck pod.
* A CHT HAProxy pod.
* Upgrade Service pod.
* CHT-Sentinel pod.

## Example deployments

Below are examples from real world large-scale CHT deployments which have been anonymized. User counts represent the number of active users within a 30 days interval. 

### CHT Deployment Example 1

This deployment hosts 47 production instances in a data center running [K3s](https://k3s.io/). It runs a simplified k3s setup with 47 isolated installations of k3s to manage complexity easily.  Thus each CHT instance is bound to the VM's local storage.  If a VM fails, there is no automatic failover, and a restore from backup is needed.

|                   |                             |
|------------------:|:----------------------------|
|    CHT Instances: | 47                          |
|          Hosting: | k3s                         |
|            Cores: | 376 (47 VMs x 8 Cores/ea)    |
|              RAM: | 752 GB (47 VMs x 16 GB/ea)     |
|             Disk: | 4,700 GB (Max 700, Min 21) |
| Multi-Node Couch: | No                          |
|            Users: | 50.6k                       |



### CHT Deployment Example 2

This deployment hosts 1 CHT production instance in a data center running [K3s](https://k3s.io/).

|                   |                             |
|------------------:|:----------------------------|
|    CHT Instances: | 1                           |
|          Hosting: | K3s on VMware)              |
|            Cores: | 32 (4 VMs x 8 cores/ea)     |
|              RAM: | 64 GB (4 VMs x 16 GB/ea)     |
|             Disk: | 2,400 GB (4 VMs x 600 GB/ea) |
| Multi-Node Couch: | Yes                         |
|            Users: | 9.5k                        |


### CHT Deployment Example 3

This deployment hosts 46 production instances on Amazon [Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) (EKS).

|                   |                                                 |
|------------------:|:------------------------------------------------|
|    CHT Instances: | 46                                              |
|          Hosting: | k8s on EKS                                      |
|            Cores: | 64 (8 VMs x 8 Cores/ea)                         |
|              RAM: | 256 GB (8 VMs x 32 GB/ea)                        |
|             Disk: | 8.6 TB (8 VMs x 500 GB/ea + 46 CHTs x ~100 GB/ea) |
| Multi-Node Couch: | 44 No, 2 Yes                                    |
|            Users: | 25.7k                                           |


To give more specific examples of what's running in the 46 instances, here's details on two including their [Apdex](https://docs.communityhealthtoolkit.org/building/guides/database/querying_apdex_telemetry/):
* One large instance has 2.4k active users, 8.9M documents in the Medic database in CouchDB and a mean replication Apdex of 80.0.
* Another medium instance has 232 active users, 279k documents in the Medic database in CouchDB and a mean replication Apdex of 56.4.

## Which one to choose?

[Docker](/hosting/4.x/docker/) is suited for most CHT deployments use cases. Use [Kubernetes](/hosting/4.x/kubernetes/) for multi-tenant or specific hardware constrained deployments, such as bare-metal servers with a low core-count.

For more details on the research behind why Docker and single-node CouchDB are preferrable for CHT deployment, see [this forum post](https://forum.communityhealthtoolkit.org/t/investigate-adding-more-shards-as-a-potential-avenue-for-improved-performance/4831?u=mrjones).
