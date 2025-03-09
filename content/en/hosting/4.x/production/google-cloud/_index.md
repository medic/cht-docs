---
title: "Production Hosting CHT 4.x - Google Cloud Platform"
linkTitle: "GCP Multi Node CouchDB"
weight: 10
aliases:
   - /hosting/4.x/production/docker/google-cloud/
description: >
   Production Hosting CHT 4.x - Google Cloud Platform
---
How to deploy the CHT 4.x on Google Cloud Platform

## Audience

This document is intended for system administrators who are setting up a Cht-Core system that has millions of documents, 400+ users and requires high performance. If you are interested in setting up a smaller scale cht-core, please see our guide [here for setting up a simpler installation](../docker). 

## Prerequisites

Before you can start using  Google Cloud Platform (GCP) to host the CHT, you need to meet certain requirements:

1. Google Account:  valid [free Gmail](https://workspace.google.com/intl/en-US/gmail/) or [paid Google Workspace](https://workspace.google.com/pricing.html) account
2. Enable Billing: In GCP, enable [billing](https://console.cloud.google.com/billing), including a valid credit card
3. GCP Project: Each resource in GCP must belong to it's [own project](https://console.cloud.google.com/projectcreate)
  - Create and manage Google Cloud Platform project
  - There are two ways to create a project in GCP

    - a. GCP UI: if you decide to use the UI, [follow these steps](https://console.cloud.google.com/projectcreate)
    - b. GCP CLI: use below command after you have authenticated to your GCP account
   ```
   gcloud projects create my-new-project --set-as-default
   ```

## Setting up access for other users to your GCP Project

Once we have a GCP project, let's make sure everyone else on our team can help out!

At the welcome screen after creating a GCP project, we want to note the * Project ID:, marked by a * in the screenshot below. Clicking on `Dashboard` we arrive at a detailed screen of our GCP project. 

![Welcome to dashboard](./images/welcome_project_id_dashboard.png)

At the Dashboard page, looking at the `Project Info` section, clicking on `ADD PEOPLE TO THIS PROJECT`![ADD PEOPLE TO THIS PROJECT](./images/add_people_to_project.png) opens up a dialog where we can add users by their gmail address. To simplify this process until further narrow/specific permissions are determined, we are going to use basic Owner and Editor roles for users we create. If you have a Cht-Core GKE setup with narrow permissions for users and systems, please update these docs - we would greatly appreciate it!

![Add User Details](./images/add_user_details.png)

## GKE (Google Kubernetes Engine) Cluster creation

### Create a cluster in GCP project

To create a cluster and easily setup necessary options, we will navigate through the console UI 

UI: Follow the [create cluster steps](https://console.cloud.google.com/kubernetes/list/overview)

You will have to click enable Kubernetes API in the prompt that comes up.

#### Zonal cluster

* Pros: Less costly
* Cons: Single control plane in single zone
* Considerations: A single control plane becoming unavailable (going down) would result in no access for the administrator to modify any resources in the cluster. The workloads, such as containers and the application remain working for the end-user.

#### Regional cluster

* Pros: Multiple control plane replicas across multiple compute zones
* Cons: High cost
* Considerations: Multiple administrators accessing the cluster may benefit from ensuring the control plane servers are redundant. Recommended for national-scale implementations

#### Why not to use optimized container images and why modify ulimit?

In the case of a cht-core project with millions of docs in CouchDB, we have ran into issues with open file descriptors. In order to modify this parameter [(ulimit)]((https://www.geeksforgeeks.org/ulimit-soft-limits-and-hard-limits-in-linux/)), we are required to select a modifiable base image (Ubuntu). [More details for CouchDB performance](https://docs.couchdb.org/en/stable/maintenance/performance.html)

Cloud-vendor optimized container images such as Google-optimized container images **and** Amazon-optimized container images do not allow custom bootstrap scripts that modify parameters to the necessary levels to run CouchDB with large document numbers.

### VPC Network and Subnets

We are going to create an isolated private network with one public subnet that will contain the Load Balancer, managed and automated by Google. The Load Balancer will have access to the private subnet which contains all of virtual machines or enabled private nodes that run the containers which make up the application. This separation ensures underlying system files and database files are not accessible or modifiable outside of application-level access. 

For troubleshooting underlying VM issues, we will need to [launch a bastion](https://cloud.google.com/kubernetes-engine/docs/tutorials/private-cluster-bastion) server or ssh-jumpbox in the same public subnet as the load balancer that after accessing allows us to jump into the private subnet virtual machines. 

VPC CIDR: `10.128.0.0/20` (default network)

Make sure the 3 option boxes are checked: `Enable Private Nodes`, `Access using the control plane's external IP address`, `Access using the control plane's internal IP address from any region`

![Cluster Networking Options](./images/cluster_networking_options.png)

### **Template resources, Recommendations and Considerations**

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


### Create a Storage Disk

Creating a separate storage disk is essential for persisting CouchDB data across VM restarts or replacements in your CHT deployment. This dedicated disk ensures your database information remains intact regardless of VM lifecycle events.

Below are the methods and steps to create a storage disk in GCP

* UI: Follow persistent disk creation [here](https://console.cloud.google.com/compute/disksAdd?inv=1&invt=AbrSOA&authuser=1&project=profound-hydra-451517-p5)
* CLI:  run below command to create volume

```
gcloud compute disks create  [DISK_NAME]\
  --size [DISK_SIZE]\
  --type [DISK_TYPE]
```

### Storage Class Configuration

- To bind and apply the created storage disk to a cluster, use the following YAML script for configuring the storage class:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: <STORAGE_CLASS_NAME>
provisioner: pd.csi.storage.gke.io
parameters:
  type: pd-balanced
  csi.storage.k8s.io/fstype: xfs
volumeBindingMode: Immediate
reclaimPolicy: Retain
allowVolumeExpansion: true
```

- Apply the configuration using kubectl apply

```bash
kubectl apply -f <STORAGE_CLASS_FILE_NAME>.yaml
```

* Verify the StorageClass was successfully created and registered in the cluster:

`Kubernetes Engine > Cluster > Storage`

#### Key Configurations Explained

* **`volumeBindingMode: Immediate`** :
  * Creates and binds Persistent Volume (PV) immediately
  * Triggers PV creation when Persistent Volume Claim (PVC) is created
* **`reclaimPolicy: Retain`** :
  * Preserves volume and data after PVC deletion
  * Prevents accidental data loss
* **`allowVolumeExpansion: true`** :
  * Enables PVC size expansion without recreation
  * Provides storage flexibility

### Persistent Volume Configuration

- After setting up the Storage Class, you need to create a Persistent Volume (PV) to represent the physical disk in your Kubernetes cluster:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: <PV_NAME>
spec:
  storageClassName: <STORAGE_CLASS_NAME>
  capacity:
    storage: <STORAGE_SIZE>
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  csi:   
    driver: pd.csi.storage.gke.io
    volumeHandle: projects/<PROJECT_ID>/zones/<ZONE>/disks/<DISK_NAME>
    fsType: xfs
```

- Apply the configuration using kubectl:

```bash
kubectl apply -f <PERSISTENT_VOLUME_FILE_NAME>.yaml
```

- Verify the Persistent Volume was successfully created:

```bash
kubectl get pv
```

#### Key Configurations Explained

* **`storageClassName: <STORAGE_CLASS_NAME>`**:
    * References the Storage Class created in the previous step
    * Ensures consistent storage provisioning policies

* **`capacity: storage: <STORAGE_SIZE>`**:
    * Defines the size of the persistent volume (e.g., 100Gi)
    * Should match or be less than the actual GCP disk size

* **`accessModes: - ReadWriteOnce`**:
    * Allows the volume to be mounted as read-write by a single node
    * Appropriate for CouchDB which typically runs on a single node

* **`volumeHandle`**:
    * References the specific GCP disk created earlier
    * Format: projects/<PROJECT_ID>/zones/<ZONE>/disks/<DISK_NAME>

### Persistent Volume Claim Configuration

- After creating the Persistent Volume, you need to create a Persistent Volume Claim (PVC) that will be used by your CouchDB pod to mount the storage:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  labels:
    cht.service: <SERVICE_LABEL>
  name: <PVC_NAME>
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: <STORAGE_SIZE>
  volumeName: <PV_NAME>
  storageClassName: <STORAGE_CLASS_NAME>
```

- Apply the configuration using kubectl:

```bash
kubectl apply -f <PVC_FILE_NAME>.yaml
```

- Verify the Persistent Volume Claim was successfully created and bound:

```bash
kubectl get pvc
```

#### Key Configurations Explained

* **`labels: cht.service: <SERVICE_LABEL>`**:
    * Identifies the PVC as part of your CHT deployment
    * Used for service discovery and organization

* **`accessModes: - ReadWriteOnce`**:
    * Corresponds to the same access mode defined in the PV
    * Ensures compatibility between PV and PVC

* **`resources: requests: storage: <STORAGE_SIZE>`**:
    * Must be less than or equal to the size specified in the PV
    * Defines how much storage will be claimed from the PV

* **`volumeName: <PV_NAME>`**:
    * Directly references the specific PV created earlier
    * Creates a static binding between this PVC and the specific PV

* **`storageClassName: <STORAGE_CLASS_NAME>`**:
    * Must match the storage class name specified in the PV
    * Ensures consistent storage policies

### CouchDB Deployment Configuration

After configuring the storage components, you need to create a deployment for CouchDB that will use the persistent storage. This deployment defines how your CouchDB instance will run within Kubernetes.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: couchdb-1
  name: <DEPLOYMENT_NAME>
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: couchdb-1
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        cht.service: couchdb-1
    spec:
      containers:
      - name: <CONTAINER_NAME>
        image: public.ecr.aws/medic/cht-couchdb:4.15.0
        ports:
        - containerPort: 5984
        env:
        - name: COUCHDB_LOG_LEVEL
          value: "debug"
        - name: COUCHDB_PASSWORD
          value: "<COUCHDB_PASSWORD>"
        - name: COUCHDB_SECRET
          value: "<COUCHDB_SECRET>"
        - name: COUCHDB_USER
          value: "admin"
        - name: COUCHDB_UUID
          value: "<COUCHDB_UUID>"
        - name: SVC_NAME
          value: "<SERVICE_NAME>.svc.cluster.local"
        volumeMounts:
        - mountPath: /opt/couchdb/data
          name: <PVC_NAME>
          subPath: data
        - mountPath: /opt/couchdb/etc/local.d
          name: <PVC_NAME>
          subPath: local.d
        securityContext:
          capabilities:
            add: ["SYS_RESOURCE"]
      restartPolicy: Always
      volumes:
      - name: <PVC_NAME>
        persistentVolumeClaim:
          claimName: <PVC_CLAIM_NAME>
```

- Apply the deployment configuration:

```bash
kubectl apply -f <COUCHDB_DEPLOYMENT_FILE>.yaml
```

- Verify that the deployment was created successfully:

```bash
kubectl get deployments
kubectl get pods
```

#### Key Configurations Explained

* **`replicas: 1`**:
    * Specifies that only one instance of CouchDB should run
    * CouchDB in the CHT typically runs as a single instance per node

* **`strategy: type: Recreate`**:
    * Ensures the existing pod is terminated before a new one is created
    * Prevents data conflicts since CouchDB uses disk storage that can't be simultaneously accessed

* **`volumeMounts`**:
    * Maps two specific directories from the container to the persistent storage:
        * `/opt/couchdb/data`: Where CouchDB stores all database files
        * `/opt/couchdb/etc/local.d`: Where configuration files are stored
    * Uses `subPath` to organize different types of data within the same PVC

* **`securityContext: capabilities: add: ["SYS_RESOURCE"]`**:
    * This is a critical configuration for CouchDB performance and stability
    * Grants the container the Linux capability to exceed system resource limits
    * Specifically allows to increase the number of open file descriptors (ulimit)
    * Without this capability, CouchDB may encounter "too many open files" errors under heavy load
    * This is particularly important for production CHT instances that handle substantial traffic
    * The `SYS_RESOURCE` capability enables CouchDB to set its own resource limits beyond the defaults

* **`env`**:
    * Contains essential environment variables for CouchDB configuration
    * `COUCHDB_PASSWORD` & `COUCHDB_USER`: Authentication credentials
    * `COUCHDB_SECRET`: Used for cookie authentication between nodes
    * `COUCHDB_UUID`: Unique identifier for this CouchDB instance
    * `SVC_NAME`: The service name that will be used for network discovery

* **`volumes`**:
    * References the Persistent Volume Claim created earlier
    * Creates the link between the deployment and the persistent storage
