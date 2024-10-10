---
title: Kubernetes vs Docker
weight: 4
description: >
 Options for installing CHT applications
---

Since the release of CHT Core 4.0.0 in late 2022, Medic has been perfecting the hosting for the toolkit to balance the need for high uptimes so CHWs can always deliver care while having an easy and approachable technical back end hosting solution.  While initially [Docker Compose](https://docs.docker.com/compose/) with an [overlay network](https://docs.docker.com/compose/networking/#multi-host-networking) was thought to be our goto solution, field testing this overlay networks in production has shown them to unreliable.  

As such, on this site you will find documentation for both Docker Compose (known as "Medic OS" in CHT 3.x) and Kubernetes. Medic is in the process of phasing out Docker Compose and will ultimately deprecate it in favor of Kubernetes, including simplified versions like k3s and cloud based solutions like Amazon's [Elastic Kubernetes Service](https://aws.amazon.com/eks/) (EKS).

Given all this, we currently recommend:
* Application development for both [CHT 3.x]({{< relref "hosting/3.x/app-developer" >}}) and [CHT 4.x]({{< relref "hosting/4.x/app-developer" >}}) should use Docker Compose.
* Production 3.x CHT deployments should use [Docker Compose]({{< relref "hosting/3.x" >}})  - Note that 3.x is [end of life]({{< relref "core/releases#supported-versions" >}})  and should only be used to support existing 3.x deployments.
* All new production 4.x CHT deployments should use [Kubernetes]({{< relref "hosting/4.x/production/kubernetes/" >}})

## Kubernetes

Kubernetes provides advantages in managing CHT Deployments:

* Resilient network across either physical or VM nodes in the cluster. This allows strong distribution of the heavy CPU and RAM loads that CouchDB can incur under heave use.
* Orchestration of multiple deployments ensuring to allow easy hosting of multi-tenants. For example you may opt to have a user acceptance testing (UAT), staging and production instances all in one cluster.  
* Service discovery which  enables to route public requests to deployments within the cluster 
* Integration with hypervisors such as VMWare and ESX. This is possible due to CRD support in Kubernetes that allows 3rd parties to create integrations
* Helm support and integration that makes it easy to easily deploy applications on to the cluster
* Highly efficient snapshot backups when used with a storage area network [SAN](https://en.wikipedia.org/wiki/Storage_area_network) or Amazon's [Elastic Block Storage](https://aws.amazon.com/ebs/) (EBS).

The main components of a Kubernetes deployment include:

* A pod for each CouchDB instance.
* A CHT API pod.
* A CHT HAProxy Healthcheck pod.
* A CHT HAProxy pod.
* Upgrade Service pod.
* CHT-Sentinel pod.

## Docker Compose

The Docker Compose based CHT Core deployment  was Medic's first attempt to make CHT 4.x cloud native.  The Compose files work quite well for application developer setups on laptops and the like (check out the [Docker Helper]({{< relref "hosting/4.x/app-developer#cht-docker-helper-for-4x" >}})!). Additionally, we have existing published guides on how to deploy single and multi-node Compose based solutions.  For small, low use instances, likely the single node Compose deployments will be fine.  We do not recommend setting up a multi-node deployment on Compose with an overlay network.  Please use Kubernetes instead for a more stable and [horizontally scalable]({{< relref "hosting/vertical-vs-horizontal" >}}) solution.

The Compose documentation here is only for reference until Medic is ready to fully deprecate this content.

Like Kubernetes above, Docker Compose deploys the same services but adds an additional 7th to allow for ingress/egress via a reverse proxy:

* A service for each CouchDB instance.
* A CHT API service.
* HAProxy Healthcheck service.
* HAProxy service.
* Upgrade Service service.
* A CHT Sentinel service.
* An nginx service to act as a reverse proxy and terminate TLS connections