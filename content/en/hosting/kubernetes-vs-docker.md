---
title: Kubernetes vs Docker
weight: 3
description: >
 Options for installing CHT applications
---
There are various options for hosting CHT applications depending on the need and phase of your CHT application. Phases of the CHT application include development, testing, training and deployment. CHT Applications can be deployed on different platforms including: 
* Local installation on a desktop, laptop or server
* Self-Hosting/Data center set up
* Cloud Hosting using a cloud provider (e.g. AWS)

CHT installation can be done using various workflows:

* Docker Compose - This has been available for CHT < 4.x and can been implemented using a docker-compose file. 
* Kubernetes/k3s installation - CHT installation using k3s k8s distribution is the recommended method for CHT >= 4.x installations.

## Kubernetes/k3s

### K3d CHT Architecture

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

The typical k8s CHT installation uses a number of API Resources as shown below. 
* Ingress: api-ingress
* Services/deployments:
    * Upgrade-service svc maps to upgrade-service deployment.
    * Couchdb-n maps to cht-couchdb-n deployment.
    * Healthcheck maps to cht-haproxy-healthcheck deployment.
    * Haproxy maps to cht-haproxy deployment.
    * api maps to cht-api deployment.
* PVC:
    * couchdb-2-claimn

### K3d installation
To install a CHT instance,K3d can be used to install it locally, or remotely like on EKS. This can be done following these steps:

* Ensure you have the latest [cht-core code](https://github.com/medic/cht-core).
* Ensure a python environment has been created and activated.
* [Configure](https://github.com/medic/cht-core/tree/master/scripts/deploy) the `values.yaml` file to fit the usecase.
    * Helm is used as a package manager and hosts the `values.yaml` file
    * The comments on the `values.yaml` file provide guidance on what should be changed for specific use cases.
    * [Kubectl commands](https://kubernetes.io/docs/reference/kubectl/quick-reference/) can be used to troubleshoot and list available resources
* Run the `cht-deploy` script.
    ```shell
    cd scripts/deploy;./cht-deploy -f PATH_TO/values.yaml
    ```
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
