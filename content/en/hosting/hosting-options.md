---
title: "Hosting options for CHT applications"
linkTitle: "Hosting options"
weight : 1
---

There are various options for hosting CHT applications depending on the need and phase of your CHT application. Phases of the CHT application include development, testing, training and deployment. CHT Applications can be deployed on different platforms including: 
* Local installation on a desktop, laptop or server
* Self-Hosting/Data center set up
* Cloud Hosting using a cloud provider (e.g. AWS)

CHT installation can be done using various workflows:

* Docker Compose - This has been available for CHT < 4.x and can been implemented using a docker-compose file. 
* Kubernetes/k3s installation - CHT installation using k3s k8s distribution is the recommended method for CHT >= 4.x installations.


## Hosting CHT applications
### Local hosting

Minimum Hardware requirements
* 4 GiB RAM
* 2 CPU/vCPU
* 8 GB Hard Disk (SSD preferred)
* Root Access

Software requirements
* A static IP
* A DNS Entry pointing to the IP
* TLS certificates
* Helm version 3.
* k3d/k3s with at least 1 control node and 1 worker node - for kubernetes installation


### Self-hosting/Data center setup

Minimum Hardware requirements
* 8 cores and > 8GB RAMs

Software requirements and dependencies
* Helm version 3.
* k3d/k3s with at least 3 control nodes and 1 worker node.

Additional considerations - to be added

### Cloud hosting

Supported Cloud providers
* AWS

Compute instances required
* m7g.xlarge (4 vCPUs, 16GB)

ALB installation
* Required to support k8s ingress.

## Deploying CHT applications

### Docker compose

Docker can be used to manage orchestration of CHT applications through the instructions provided to [get started with CHT app development]({{< relref "apps/tutorials/local-setup" >}}).

### Kubernetes/k3s

#### K3d CHT Architecture

CHT components have been decomposed into various containers that are orchestrated via docker-compose. However, docker-compose does not provide production grade orchestration. Kubernetes provides various advantages in managing docker containers such as:

* Orchestration of multiple deployments. This ensures that services remain available and any nodes that fail are redeployed and queued.
* Service discovery: Being able to route public requests to deployments within the cluster 
* Integration with hypervisors such as VMWare. This is possible due to CRD support in Kubernetes that allows 3rd parties to create integration with k8s.
* Helm support and integration that makes it easy to easily deploy applications on to the cluster.

The main deployments (components) of a CHT deployment include CHT Sentinel, CHT API, CHT HAProxy Health-check, CHT HAProxy, Upgrade Service and CHT CouchDB Instances.

These components are deployed as k8s pods as:

* A single pod for each couchDB instance.
* A CHT api pod.
* A CHT HAProxy Healthcheck pod.
* A CHT HAProxy pod.
* Upgrade service pod.
* CHT-Sentinel pod.

The typical k8s CHT installation uses a number of API Resources as shown below. 

{{< figure src="k3d_architecture.png" link="muted_person.png" class=" right col-16 col-lg-9" >}}

* Ingress: api-ingress
* Services/deployments:
    * Upgrade-service svc maps to upgrade-service deployment.
    * Couchdb-n maps to cht-couchdb-n deployment.
    * Healthcheck maps to cht-haproxy-healthcheck deployment.
    * Haproxy maps to cht-haproxy deployment.
    * api maps to cht-api deployment.
* PVC:
    * couchdb-2-claimn

#### K3d installation
To install a CHT instance,K3d can be used to install it locally, or remotely like on [EKS]({{< relref "apps/tutorials/local-setup" >}}). This can be done following these steps:

* Ensure you have the latest [cht-core code](https://github.com/medic/cht-core).
* Ensure a python environment has been created and activated.
* [Configure](https://github.com/medic/cht-core/tree/master/scripts/deploy) the `values.yaml`file to fit the usecase.
* Run the `cht-deploy` script.
    ```shell
    cd scripts/deploy;./cht-deploy -f PATH_TO/values.yaml
    ```















