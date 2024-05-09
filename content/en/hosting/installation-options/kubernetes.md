---
title: "Kubernetes"
linkTitle: "Kubernetes"
weight: 2
description: >
  Installing CHT applications using k3d and k3s
---

## Kubernetes/k3s

### K3d CHT Architecture

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

{{< figure src="k3d_architecture.png" link="k3d_architecture.png" class=" right col-16 col-lg-9" >}}

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