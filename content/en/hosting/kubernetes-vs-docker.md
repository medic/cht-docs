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

Medic recommends [Docker](/hosting/4.x/docker/) for most deployments. Use [Kubernetes](/hosting/4.x/kubernetes/) for large, multi-tenant or specific hardware constrained deployments.

Application development for both [CHT 3.x]({{< relref "hosting/3.x/app-developer" >}}) and [CHT 4.x]({{< relref "hosting/4.x/app-developer" >}}) should use Docker as well.

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

K8s deployments can not safely use the one click upgrade button in the admin GUI.

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
