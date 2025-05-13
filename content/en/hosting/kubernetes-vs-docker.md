---
title: Kubernetes vs Docker
linkTitle: Kubernetes vs Docker
weight: 5
aliases:
  -  /hosting/vertical-vs-horizontal
---

{{< hextra/hero-subtitle >}}
  Options for installing CHT applications
{{< /hextra/hero-subtitle >}}

{{< callout >}}
For older versions of the CHT, Medic recommended Kubernetes for all production deployments. This is no longer the recommendation for newer versions of the CHT. Further, multi-node CouchDB is no longer recommended.
{{< /callout >}}

Medic now recommends [Docker](/hosting/4.x/docker/) for most deployments. Use [Kubernetes](/hosting/4.x/kubernetes/) for multi-tenant or specific hardware constrained deployments. For more details on the research behind suggesting Docker and single-node CouchDB, please see [this forum post](https://forum.communityhealthtoolkit.org/t/investigate-adding-more-shards-as-a-potential-avenue-for-improved-performance/4831?u=mrjones).

However, deployments should use the technology they are most familiar and comfortable with. If they plan for 20 CHT instances but don't want to use Kubernetes, that's fine. Conversely, if a hosting organisation uses Kubernetes and intends to deploy a single instance of the CHT, that's also fine.

Application development for both [CHT 3.x]({{< relref "hosting/3.x/app-developer" >}}) and [CHT 4.x]({{< relref "hosting/4.x/app-developer" >}}) should use Docker.

## Docker 

Docker's has stood the test of time and has many benefits:

* Easy to deploy by just downloading a compose file.
* Trivially scales down to a 4 core laptop and [way up to a 48 core server](https://forum.communityhealthtoolkit.org/t/investigate-adding-more-shards-as-a-potential-avenue-for-improved-performance/4831). 
* Easily integrates with existing Docker based solutions like [Watchdog](/hosting/monitoring/) or other services running in Docker.
* Backup and restore can be achieved via simple file management via [bind mounted volumes](https://docs.docker.com/engine/storage/bind-mounts/).
* Just enough complexity to securely and soundly run the CHT with out extra complexities of Kubernetes 
* Natively supports one click CHT upgrades in the admin GUI

Docker Compose deployment has the following services when running the CHT:

* A service for each CouchDB instance.
* A CHT API service.
* HAProxy Healthcheck service.
* HAProxy service.
* Upgrade Service service.
* A CHT Sentinel service.
* An nginx service to act as a reverse proxy and terminate TLS connections


## Kubernetes (k8s)

{{< callout type="warning" >}}
Medic recommends Kubernetes for bare-metal servers with a low core count or for multi-tenant deployments.
{{< /callout >}}

Running CHT on k8s requires additional knowledge and can be more complex to deploy. Docker is the preferred solution for most production deployments.

k8s offers:

* Resilient network across either physical or VM nodes in the cluster. This allows strong distribution of the heavy CPU and RAM loads that CouchDB can incur under heavy use.
* Orchestration of multiple deployments ensuring to allow easy hosting of multi-tenants. For example you may opt to have a user acceptance testing (UAT), staging and production instances all in one cluster.
* Service discovery which  enables to route public requests to deployments within the cluster
* Integration with hypervisors such as VMWare and ESX. This is possible due to CRD support in Kubernetes that allows 3rd parties to create integrations
* Helm support and integration that makes it easy to easily deploy applications on to the cluster
* Highly efficient snapshot backups when used with a storage area network [SAN](https://en.wikipedia.org/wiki/Storage_area_network) or Amazon's [Elastic Block Storage](https://aws.amazon.com/ebs/) (EBS).

The main components of a Kubernetes CHT deployment include one less service than a Compose based deployment as ingress via `nginx` isn't needed as it's handled externally:

* A pod for each CouchDB instance.
* A CHT API pod.
* A CHT HAProxy Healthcheck pod.
* A CHT HAProxy pod.
* Upgrade Service pod.
* CHT-Sentinel pod.

## Example deployments

Below are examples from 2 real world Ministries of Health (MoH) which have been anonymized and Medic hosted instances.  Users are total provisioned users, fewer users may be active in a given month.

### MoH Example 1

This MoH hosts 47 production instances in a national data center running [K3s](https://k3s.io/). They run a simplified k3s set up with 47 isolated installations of k3s to easy management complexity.  Thus each CHT instance is bound to the VM's local storage.  If a VM fails, there is no automatic fail-over and a restore from backup is needed.

|                   |                             |
|------------------:|:----------------------------|
|    CHT Instances: | 47                          |
|          Hosting: | k3s                         |
|            Cores: | 376 (47VMs x 8 Cores/ea)    |
|              RAM: | 752 GB (47VMx 16 GB/ea)     |
|             Disk: | 4,700 GB  (Max 700, Min 21) |
| Multi-Node Couch: | No                          |
|            Users: | 123.3k                      |



### MoH Example 2

This MoH hosts 1 of production instance in a national data center running [K3s](https://k3s.io/).

|                   |                           |
|------------------:|:--------------------------|
|    CHT Instances: | 1                         |
|          Hosting: | K3s on VMware)            |
|            Cores: | 32 (4 VMs x 8 cores/ea)   |
|              RAM: | 64 GB (4 VMs x 16GB/ea)   |
|             Disk: | 600 GB (4 VMs x 150GB/ea) |
| Multi-Node Couch: | Yes                       |
|            Users: | 18k                       |


### Medic

Medic hosts 46 production instances on Amazon [Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) (EKS).

|                   |                                                 |
|------------------:|:------------------------------------------------|
|    CHT Instances: | 46                                              |
|          Hosting: | k8s on EKS                                      |
|            Cores: | 64 (8 VMs x 8 Cores/ea)                         |
|              RAM: | 256 GB (8 VMs x 32GB/ea)                        |
|             Disk: | 8.6 TB (8 VMS x 500GB/ea + 46 CHTs x ~100GB/ea) |
| Multi-Node Couch: | 44 No, 2 Yes                                    |
|            Users: | 25.7k                                           |

