---
title: "Production Hosting CHT 4.x - Google Cloud Platform"
linkTitle: "GCP Single Node"
weight: 10
aliases:
   - /hosting/4.x/production/docker/google-cloud/
description: >
   Production Hosting CHT 4.x - Google Cloud Platform
---
How to deploy the CHT 4.x on Google Cloud Platform

## Prerequisites

Before you can start using  Google Cloud Platform (GCP) to host the CHT, you need to meet certain requirements:

1. Google Account:  valid [free Gmail](https://workspace.google.com/intl/en-US/gmail/) or [paid Google Workspace](https://workspace.google.com/pricing.html) account
2. Enable Billing: In GCP, enable [billing](https://console.cloud.google.com/billing), including a valid credit card
3. GCP Project: Each resource in GCP must belong to it's [own project](https://console.cloud.google.com/projectcreate)

## **Template resources, Recommendations and Considerations**

### Why not to use optimized container images and why modify ulimit ?

In the case of a cht-core project with millions of docs in CouchDB, we have ran into issues with open file descriptors. In order to modify this parameter [(ulimit)]((https://www.geeksforgeeks.org/ulimit-soft-limits-and-hard-limits-in-linux/)), we are required to select a modifiable base image (Ubuntu). [More details for couchDB performance](https://docs.couchdb.org/en/stable/maintenance/performance.html)

Cloud-vendor optimized container images such as Google-optimized container images **and** Amazon-optimized container images do not allow custom bootstrap scripts that modify parameters to the necessary levels to run CouchDB with large document numbers.

### Cluster creation

As a system support administrator, the impacts of a Zonal cluster mean there is only 1 control plane server. If that control plane server goes down, I am unable to modify, or create any resources inside the Cluster. The workloads are still running and available to the end-users but the administrator should be aware of the constraint. Easing this burden requires an increase in costs (more control plane server redudancy).

#### Zonal cluster

* Pros: Less costly
* Cons: Single control plane in single zone

#### Regional cluster

* Pros: Multiple control plane replicas across multiple compute zones
* Cons: High cost

### VPC Network

Each public subnet contains a NAT and a load balancer node.
The servers run in the private subnets and receive traffic from the load balancer .
The servers can connect to the internet by using the NAT.

* Add our CIDR
* Small description to why VMs that run containers are in the private subnet
* Add a section for bastion/ssh-jumpbox setup. That's how we will troubleshoot underlying VM issues. We will want to add a VM to the public subnet that includes routes to the private servers. After tomorrow' session, we can fill that out with exact config details or photos showing how to deploy bastion. There's already existing work in cht-core we can perhaps utilize and link to.

#### Private subnets

Private subnets are used so we do not expose CouchDB nodes to internet an not be accessible to anyone. They should only communicate through their internal IP over the private subnet.

#### Public subnets

Public subnet in a Kubernetes node pool is used to allowing direct access to and from the internet. And this is for CHT API and Sentinel.

#### How are the Kubernetes Engine, persistent data storage, compute engine and base images related?

**Compute Engine** (Virtual Machines, Bare Metal, Cloud Instances) is the physical or virtual infrastructure that runs Kubernetes clusters, whereas **Kubernetes** is a container orchestration platform that manages containerized workloads across a cluster of machines and It automates deployment, scaling, networking, and management of applications.

**Containers** are built from  base images(`ubuntu`, `debian`) , which define the OS and runtime environment and applications are packaged into container images and deployed on Kubernetes.

**Containers** are **stateless** by design, but some applications need to persist data (`databases`, `application logs`) and  Kubernetes provides **Persistent Volumes (PVs)** and **Persistent Volume Claims (PVCs)** to manage storage separately from compute.

So we are using PVs for CouchDB and application logs in this case.

## Install google cloud SDK

**Google Cloud SDK (gcloud CLI)** helps manage GCP resources via command line.

Follow instruction from [here](https://cloud.google.com/sdk/docs/install) to install Google Cloud SDK

Below are some basic Commands

```
# Authenticate CLI with your Google account
gcloud auth login

#install kubectl for cluster management
gcloud components install kubectl

# Set an active project
gcloud config set project [PROJECT_ID]

# List VM instances
gcloud compute instances list 

 # List namespaces
kubectl get namespaces
```

## Create and manage Google Cloud Platform project

There are two ways to create a project in GCP

1. GCP UI: if you decide to use the UI, [follow these steps](https://console.cloud.google.com/projectcreate)
2. GCP CLI: use below command after you have authenticated to your GCP account

   ```
   gcloud projects create my-new-project --set-as-default
   ```

### Create a cluster in GCP project

To create a cluster we can do it either through the UI or CLI

1. UI**:** Follow the [create cluster steps](https://console.cloud.google.com/kubernetes/list/overview)
2. Using CLI
   1. Enable Google Kubernetes Engine API

      ```
      gcloud services enable container.googleapis.com
      ```
   2. Create the Cluster

      ```
      gcloud container clusters create my-cluster
      --zone us-central1-a
      --num-nodes 3
      --machine-type e2-medium
      ```


### Persistent Disk Creation

Below are the methods and steps to create a persitent disk in GCP

* UI: Follow persistent disk creation [here](https://console.cloud.google.com/compute/disksAdd?inv=1&invt=AbrSOA&authuser=1&project=profound-hydra-451517-p5)
* CLI:  run below command to create volume

```
gcloud compute disks create  [DISK_NAME]\
  --size [DISK_SIZE]\
  --type [DISK_TYPE]
```

### Storage Class Configuration

In order to bind and apply the created storage class to a cluster use below  the yamel  script for configuring  storage class

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: xfs-class
provisioner: pd.csi.storage.gke.io
parameters:
  type: pd-balanced
  csi.storage.k8s.io/fstype: xfs
volumeBindingMode: Immediate
reclaimPolicy: Retain
allowVolumeExpansion: true
```

#### Configuration Process

* Created the StorageClass configuration
* Applied the configuration using kubectl apply
* Verified the StorageClass was successfully created and registered in the cluster

#### Key Configurations meaning

* **`volumeBindingMode: Immediate`** :
  * Creates and binds Persistent Volume (PV) immediately
  * Triggers PV creation when Persistent Volume Claim (PVC) is created
* **`reclaimPolicy: Retain`** :
  * Preserves volume and data after PVC deletion
  * Prevents accidental data loss
* **`allowVolumeExpansion: true`** :
  * Enables PVC size expansion without recreation
  * Provides storage flexibility
