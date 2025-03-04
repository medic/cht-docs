---
title: "Production Hosting CHT 4.x - Google Cloud Platform"
linkTitle: "Google Cloud Platform"
weight: 10
aliases:
   - /hosting/4.x/production/docker/google-cloud/
description: >
   Production Hosting CHT 4.x - Google Cloud Platform
---
This for a step by step to migrate or deploy CHT 4.x instance and is the recommended solution  on Google Cloud Platform.

## Prerequisites

Before you can start using  **Google Cloud Platform (GCP)** , you need to meet certain requirements

1. **Google Account:** a valid Google account (Gmail or Google Workspace)
2. **Enable Billing & Free Trial ($300 Credit)**: a valid **credit card** (identity verification)
3. **Create a GCP Project**: each resource in GCP must belong to a **project**

## Template resources, changes required and some considerations

Let's start writing out the detail as to what and why, and gathering those links on info so the cht-docs PR will be easier.
For example, what is the main docker image constraint (base image selection)? Why don't we want to use google-optimized container images, or Amazon-optimized container images? Why do we need to modify u-limit (and link to the relevant couchdb performance doc)

## **Recommendations and considerations**

### Why not to use optimized container images and why modify Ulimit ?

On a system with many databases or many views, CouchDB can very rapidly hit the Ulimit, and this is not possible with either Google-optimized container images or Amazon-optimized container images. [More details for couchDB performance](https://docs.couchdb.org/en/stable/maintenance/performance.html)

This is why we use Ubuntu with containerd (ubuntu_containerd)

### Cluster creation

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

#### Private subnets

Private subnets are used so we do not expose CouchDB nodes to internet an not be accessible to anyone. They should only communicate through their internal IP over the private subnet.

#### Public subnets

Public subnet in a Kubernetes node pool is used to allowing direct access to and from the internet. And this is for CHT API and Sentinel.

#### How is the Kubernetes Engine, persistent data storage, compute engine, base images are related?

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

1. GCP UI: if you decide to use the UI, follow the steps [here](https://console.cloud.google.com/projectcreate)
2. GCP CLI: use below command after you have authenticated to your GCP account

   ```
   gcloud projects create my-new-project --set-as-default
   ```

### Create a cluster in GCP project

To create a cluster we can do it either through the UI or CLI

1. Create kubernetes cluster
   Follow the steps [here](https://console.cloud.google.com/kubernetes/list/overview)
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
