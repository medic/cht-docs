---
title: "Production Hosting CHT 4.x - Google Cloud Platform"
linkTitle: "GCP + GKS Multi Node"
weight: 10
aliases:
   - /hosting/4.x/docker/google-cloud/
   - /hosting/4.x/production/kubernetes/gcp-multinode/
---

{{< hextra/hero-subtitle >}}
  How to deploy the CHT 4.x on Google Cloud Platform
{{< /hextra/hero-subtitle >}}

## Audience

This page is intended for system administrators who are setting up a CHT Core system that has millions of documents, 400+ users and requires high performance. If you are interested in setting up a smaller scale CHT Core, see our guide [here for setting up a simpler installation](../../docker).

## Prerequisites

Before you can start using  Google Cloud Platform (GCP) to host the CHT, you need to meet certain requirements:

1. Google Account:  valid [free Gmail](https://workspace.google.com/intl/en-US/gmail/) or [paid Google Workspace](https://workspace.google.com/pricing.html) account
2. Enable Billing: In GCP, enable [billing](https://console.cloud.google.com/billing), including a valid credit card
3. GCP Project: Each resource in GCP must belong to it's [own project](https://console.cloud.google.com/projectcreate)

- Create and manage Google Cloud Platform project
- There are two ways to create a project in GCP

  - a. GCP UI: if you decide to use the UI, [follow these steps](https://console.cloud.google.com/projectcreate)
  - b. GCP CLI: use below command after you have authenticated to your GCP account

  ```shell
  gcloud projects create my-new-project --set-as-default
  ```

## Setting up access for other users to your GCP Project

Once we have a GCP project, let's make sure everyone else on our team can help out!

At the welcome screen after creating a GCP project, we want to note the * Project ID:, marked by a * in the screenshot below. Clicking on `Dashboard` we arrive at a detailed screen of our GCP project.

{{< figure src="welcome_project_id_dashboard.png" link="welcome_project_id_dashboard.png" caption="Welcome to dashboard" >}}

At the Dashboard page, looking at the "Project Info" section, clicking on "ADD PEOPLE TO THIS PROJECT" (see [related image](add_people_to_project.png)) opens up a dialog where we can add users by their Gmail address. To simplify this process until further specific permissions are determined,  use basic Owner and Editor roles for users we create. If you have a Google Kubernetes Engine ([GKE](https://cloud.google.com/kubernetes-engine?hl=en)) setup with narrow permissions for users and systems, update these docs - we would greatly appreciate it!

{{< figure src="add_user_details.png" link="add_user_details.png" caption="Add User Details" >}}

## GKE (Google Kubernetes Engine) Cluster creation

### Create a cluster in GCP project

Using the console UI, follow the [create cluster steps](https://console.cloud.google.com/kubernetes/list/overview). Be sure to click "enable Kubernetes API" when prompted.

A sane default is to use the less costly option below unless required by scale. [Google Cloud Blog: Regional vs zonal GKE clusters](https://cloud.google.com/blog/products/containers-kubernetes/choosing-a-regional-vs-zonal-gke-cluster)

#### Zonal cluster

* Pros: Less costly
* Cons: Single control plane in single zone
* Considerations: A single control plane becoming unavailable (going down) would result in no access for the administrator to modify any resources in the cluster. The workloads, such as containers and the application remain working for the end-user.

#### Regional cluster

* Pros: Multiple control plane replicas across multiple compute zones
* Cons: High cost
* Considerations: Multiple administrators accessing the cluster may benefit from ensuring the control plane servers are redundant. Recommended for national-scale implementations

### VPC Network and Subnets

We are going to create an isolated private network with one public subnet that will contain the Load Balancer, managed and automated by Google. The Load Balancer will have access to the private subnet which contains all of virtual machines or enabled private nodes that run the containers which make up the application. This separation ensures underlying system files and database files are not accessible or modifiable outside of application-level access.

VPC CIDR: `10.128.0.0/20` (default network)

When creating the cluster, make sure the 3 option boxes are checked:

* Enable Private Nodes
* Access using the control plane's external IP address
* Access using the control plane's internal IP address from any region

{{< figure src="cluster_networking_options.png" link="cluster_networking_options.png" caption="Cluster Networking Options" >}}

### NodePool Configuration

NodePools allow you to configure VM quanity,  database cluster VMs, CPU and RAM. In our example, create 2 NodePools, one for the CouchDB cluster and one for CHT Core services (api, sentinel, haproxy, healthcheck, upgrade-service).

##### Base Image Consideration

In the case of a cht-core project with millions of docs in CouchDB, we have ran into issues with open file descriptors. In order to modify this parameter [(ulimit)](https://www.geeksforgeeks.org/ulimit-soft-limits-and-hard-limits-in-linux/)), we are required to select a modifiable base image (Ubuntu). [More details for CouchDB performance](https://docs.couchdb.org/en/stable/maintenance/performance.html)

Cloud-vendor optimized container images such as Google-optimized container images **and** Amazon-optimized container images do not allow custom bootstrap scripts that modify parameters to the necessary levels to run CouchDB with large document numbers.

Creating a 3 nodepool configuration for CouchDB:
{{< figure src="nodepool_couchdb_3_nodes.png" link="nodepool_couchdb_3_nodes.png" caption="CouchDB nodepool" >}}

As noted in the previous paragraph, be sure to select Nodes under your new CouchDB nodepool in the left-side navigation bar. In the node details menu, select `Ubuntu with containerd` for image type, and `n2-standard-8`for machine type.

{{< figure src="nodepool_base_image_machine_size.png" link="nodepool_base_image_machine_size.png" caption="CouchDB base image and machine types" >}}

In order for our CouchDB containers to be placed onto these specific virtual machines we designated for this nodepool, we need to add kubernetes labels to the nodepool, which we will correspond with nodeSelector parameters in our CouchDB deployment templates.

Clicking on `Metadata` on the left-side navigation bar underneath the nodepool name, we can add Kubernetes Labels.

{{< figure src="nodepool_labels.png" link="nodepool_labels.png" caption="CouchDB nodepool kubernetes labels" >}}

A separate nodepool configuration created for cht-core services.
For the cht-core nodepool, select a 4 core, 16gb RAM machine, 20gb persistent disk, and there is no need to create specific kubernetes labels.

{{< figure src="nodepool_chtcore_add.png" link="nodepool_chtcore_add.png" caption="CHT-Core nodepool" >}}

Click on Create Cluster and wait a few minutes for everything to come up!

## Accessing your GKE Cluster

#### Install google cloud SDK

**Google Cloud SDK (gcloud CLI)** helps manage GCP resources via command line.

Follow [instruction](https://cloud.google.com/sdk/docs/install) to install Google Cloud SDK

Below are some basic Commands

```shell
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

#### Connect to GKE cluster

You can connect to your cluster via command-line or using a dashboard.

* Commandline
  {{< figure src="gke_connect_command.png" link="gke_connect_command.png" caption="Connect to cluster" >}}

  In above UI select your cluster and in click on connect, then copy the command and run it in your terminal and you can access any ressource in the cluster.

  ```shell
  gcloud container clusters get-credentials [cluster-name] --zone [Zone where the cluster is hosted] --project [Project ID]
  ```
* Dashboard
  {{< figure src="gke_dashboard.png" link="gke_dashboard.png" caption="GKE cluster dashboard" >}}

## Create a Storage Disk for CouchDB

Creating separate storage disks are essential for persisting CouchDB data across VM restarts or replacements in your CHT deployment. This dedicated disk ensures your database information remains intact regardless of VM lifecycle events.

Below are the methods and steps to create a storage disk in GCP.
We will need 3 storage disks, 1 for each CouchDB node.

* UI: Follow persistent disk creation [here](https://console.cloud.google.com/compute/disksAdd?inv=1&invt=AbrSOA&authuser=1&project=profound-hydra-451517-p5)
* CLI:  run below command to create volume

```shell
gcloud compute disks create [DISK_NAME]\
  --size [DISK_SIZE]\
  --type [DISK_TYPE]
  --zone [ZONE]
```

### Migrate existing data to newly created Storage Disk

Skip this step if you do not have pre-existing CouchDB data that you need to migrate into your GKE cluster.

We will launch a virtual machine in the same public subnet as the load balancer, with access via SSH. Attach and mount our created storage disk from the previous steps to this virtual machine.

Once mounted, log into your old server, create a session, and run the following rsync command to send data to your new disk. You may have to format the disk in xfs before being able to complete the mount.

Before running `rsync`,  run the `screen` command first which allows the `rsync` command to when you disconnect
```shell 
screen
``` 
`rsync -avhWt --no-compress --info=progress2 -e "ssh -i /tmp/identity.pem" /opt/couchdb/data ubuntu@<server_ip>:/<mounted_directory>/`

Run this command from each CouchDB node to a separate storage disk 

### Create namespace

```shell
kubectl create namespace <NAMESPACE_NAME>
```

### Deploy a StorageClass config to GKE cluster

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

- After setting up the StorageClass, you need to create a Persistent Volume (PV) that ties the storage disk to your GKE cluster.
- Create 1 PV for each Storage Disk, using naming conventions: `cht-couchdb-1-<project_name_or_namespace>`

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
  * Format: projects/<PROJECT_ID>/zones/`<ZONE>`/disks/<DISK_NAME>

### Persistent Volume Claim Configuration

- After creating the Persistent Volume, you need to create a Persistent Volume Claim (PVC) that ties the PV to your CouchDB container.

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

### Setup CouchDB Cluster Resources in GKE

For CouchDB nodes in a cluster to communicate, they have to be able to resolve each other's location. We utilize kubernetes service resources for this DNS service discovery for cluster databases.

Deploying a service resource allows you to interact with the process that service forwards traffic to over a DNS route simplified to <service_name>.`<namespace>`.svc.cluster.local.

Let's configure some components before deploying service

#### Configmap configuration

Fill out the configmap resource below with the namespace your cht-core project will run in

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: <CONFIGMAP_NAME>
data:
  COUCHDB_SYNC_ADMINS_NODE: couchdb-1.
```

- Apply the secrets configuration:

```shell
kubectl apply -f <COUCHDB_CONFIGMAP_FILE>.yaml
```

- Verify that the  configmap was created successfully:

```shell
kubectl -n <namespace> get configmap
```

#### Secrets resources configuration

For the secrets resource, fill out the necessary environment variable values.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: <SECRET_NAME>
type: Opaque
stringData:
  COUCHDB_PASSWORD: <COUCHDB PASSWORD>
  COUCHDB_SECRET: <COUCHDB SECRET> 
  COUCHDB_USER: <COUCHDB USER>
```

- Apply the secrets configuration:

```shell
kubectl apply -f <COUCHDB_SECRETS_FILE>.yaml
```

- Verify that the secrets were created successfully:

```shell
kubectl -n <namespace> get secret
```

#### CouchDB services deployment

Deploy the services first, to ensure the cluster can discover all its members and bootstrap accordingly.

```yaml
---
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: couchdb-1
  name: couchdb-1
spec:
  ports:
    - name: couchdb1-service
      port: 5984
      protocol: TCP
      targetPort: 5984
    - name: cluster-api
      port: 5986
      protocol: TCP
      targetPort: 5986
    - name: epmd
      port: 4369
      protocol: TCP
      targetPort: 4369
    - name: erlang
      port: 9100
      protocol: TCP
      targetPort: 9100
  selector:
    cht.service: couchdb-1
---
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: couchdb-2
  name: couchdb-2
spec:
  ports:
    - name: couchdb2-service
      port: 5984
      protocol: TCP
      targetPort: 5984
    - name: cluster-api
      port: 5986
      protocol: TCP
      targetPort: 5986
    - name: epmd
      port: 4369
      protocol: TCP
      targetPort: 4369
    - name: erlang
      port: 9100
      protocol: TCP
      targetPort: 9100
  selector:
    cht.service: couchdb-2
---
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: couchdb-3
  name: couchdb-3
spec:
  ports:
    - name: couchdb3-service
      port: 5984
      protocol: TCP
      targetPort: 5984
    - name: cluster-api
      port: 5986
      protocol: TCP
      targetPort: 5986
    - name: epmd
      port: 4369
      protocol: TCP
      targetPort: 4369
    - name: erlang
      port: 9100
      protocol: TCP
      targetPort: 9100
  selector:
    cht.service: couchdb-3
---
```

After configuring the storage components, you need to create a deployment for CouchDB that will use the persistent storage. This deployment defines how your CouchDB instance will run within Kubernetes. We will also create configmap and secrets resource to hold our credentials in one location for all templates.

- Apply the secrets configuration:

```shell
kubectl apply -f <COUCHDB_SERVICES_FILE>.yaml
```

- Verify that the  configmap was created successfully:

```shell
kubectl -n <namespace> get services
```

#### CouchDB Cluster deployment

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
          value: "info"
        - name: COUCHDB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_PASSWORD
        - name: COUCHDB_SECRET
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_SECRET
        - name: COUCHDB_USER
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_USER
        - name: COUCHDB_UUID
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_UUID
        - name: SVC_NAME
          value: "<SERVICE_NAME>.<NAMESPACE>.svc.cluster.local"
        - name: NODE_COUNT
          value: "3"
        - name: CLUSTER_PEER_IPS
          valueFrom:
            configMapKeyRef:
              name: <CONFIGMAP_NAME>
              key: CLUSTER_PEER_IPS
        nodeSelector:
          env: <NAME_GIVEN_IN_CLUSTER_METADATA>
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
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: couchdb-2
  name: cht-couchdb-2
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: couchdb-2
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        cht.service: couchdb-2
    spec:
      containers:
      - name: cht-couchdb-2
        image: public.ecr.aws/medic/cht-couchdb:4.15.0
        ports:
        - containerPort: 5984
        env:
        - name: COUCHDB_SYNC_ADMINS_NODE
          valueFrom:
            configMapKeyRef:
              name: <CONFIGMAP_NAME>
              key: COUCHDB_SYNC_ADMINS_NODE   
        - name: COUCHDB_LOG_LEVEL
          value: "info"
        - name: COUCHDB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_PASSWORD
        - name: COUCHDB_SECRET
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_SECRET
        - name: COUCHDB_USER
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_USER
        - name: COUCHDB_UUID
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_UUID
        - name: SVC_NAME
          value: couchdb-2.<namespace>.svc.cluster.local
        - name: NODE_COUNT
          value: "3"
        nodeSelector:
          env: <NAME_GIVEN_IN_CLUSTER_METADATA>
        volumeMounts:
        - mountPath: /opt/couchdb/data
          name: couchdb2-<namespace>-claim
        - mountPath: /opt/couchdb/etc/local.d
          name: couchdb2-<namespace>-claim
          subPath: local.d
      restartPolicy: Always
      volumes:
      - name: couchdb2-<namespace>-claim
        persistentVolumeClaim:
          claimName: couchdb2-<namespace>-claim
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: couchdb-3
  name: cht-couchdb-3
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: couchdb-3
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        cht.service: couchdb-3
    spec:
      containers:
      - name: cht-couchdb-3
        image: public.ecr.aws/medic/cht-couchdb:4.15.0
        ports:
        - containerPort: 5984
        env:
        - name: COUCHDB_SYNC_ADMINS_NODE
          valueFrom:
            configMapKeyRef:
              name: <CONFIGMAP_NAME>
              key: COUCHDB_SYNC_ADMINS_NODE   
        - name: COUCHDB_LOG_LEVEL
          value: "info"
        - name: COUCHDB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_PASSWORD
        - name: COUCHDB_SECRET
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_SECRET
        - name: COUCHDB_USER
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_USER
        - name: COUCHDB_UUID
          valueFrom:
            secretKeyRef:
              name: <SECRET_NAME>
              key: COUCHDB_UUID
        - name: SVC_NAME
          value: couchdb-3.<namespace>.svc.cluster.local
        - name: NODE_COUNT
          value: "3"
        nodeSelector:
          env: <NAME_GIVEN_IN_CLUSTER_METADATA>
        volumeMounts:
        - mountPath: /opt/couchdb/data
          name: couchdb3-<namespace>-claim
        - mountPath: /opt/couchdb/etc/local.d
          name: couchdb3-<namespace>-claim
          subPath: local.d
      restartPolicy: Always
      volumes:
      - name: couchdb3-<namespace>-claim
        persistentVolumeClaim:
          claimName: couchdb3-<namespace>-claim
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

#### CHT-CORE Deployment

Before deploying CHT core components let's create service account for CHT upgrade component

##### Upgrade service roles:

These roles are required to upgrade to newer versions of cht-core

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: <SERVICE_ACCOUNT_NAME>
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployment-manager
rules:
- apiGroups:
  - apps
  - ""
  resources:
  - deployments
  - pods
  verbs:
  - get
  - update
  - watch
  - patch
  - list
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: <ROLE_BINDING_NAME>
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: deployment-manager
subjects:
- apiGroup: ""
  kind: ServiceAccount
  name: <SERVICE_ACCOUNT_NAME>
```

- Apply the deployment configuration:

```bash
kubectl apply -f <ROLE_FILE>.yaml
```

- Verify that the deployment was created successfully:

```bash
kubectl get sa
```

##### CHT Core Component deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: api
  name: api
  namespace: <NAMESPACE>
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 0
      maxUnavailable: 1
  template:
    metadata:
      labels:
        cht.service: api
    spec:
      containers:
        - env:
            - name: BUILDS_URL
              value: https://staging.dev.medicmobile.org/_couch/builds_4
            - name: COUCH_URL
              valueFrom:
                secretKeyRef:
                  name: <SECRET_NAME>
                  key: COUCH_URL
            - name: UPGRADE_SERVICE_URL
              value: http://upgrade-service.<NAMESPACE>.svc.cluster.local:5008
            - name: API_PORT
              value: '5988'
          image: public.ecr.aws/medic/cht-api:4.15.0
          name: api
          ports:
            - containerPort: 5988
          resources: {}
      restartPolicy: Always
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: haproxy
  name: cht-haproxy
  namespace: <NAMESPACE>
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: haproxy
  strategy: {}
  template:
    metadata:
      labels:
        cht.service: haproxy
    spec:
      containers:
        - env:
            - name: COUCHDB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: <SECRET_NAME>
                  key: COUCHDB_PASSWORD
            - name: COUCHDB_SERVERS
              valueFrom:
                configMapKeyRef:
                  name: <CONFIGMAP_NAME>
                  key: COUCHDB_SERVERS
            - name: COUCHDB_USER
              valueFrom:
                secretKeyRef:
                  name: <SECRET_NAME>
                  key: COUCHDB_USER
            - name: HAPROXY_IP
              value: 0.0.0.0
            - name: HAPROXY_PORT
              value: "5984"
            - name: HEALTHCHECK_ADDR
              value: healthcheck.<NAMESPACE>.svc.cluster.local
          image: public.ecr.aws/medic/cht-haproxy:4.15.0
          name: cht-haproxy
          ports:
            - containerPort: 5984
          resources: {}
      hostname: haproxy
      restartPolicy: Always
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: healthcheck
  name: haproxy-healthcheck
  namespace: <NAMESPACE>
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: healthcheck
  strategy: {}
  template:
    metadata:
      labels:
        cht.service: healthcheck
    spec:
      containers:
        - env:
            - name: COUCHDB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: <SECRET_NAME>
                  key: COUCHDB_PASSWORD
            - name: COUCHDB_SERVERS
              valueFrom:
                configMapKeyRef:
                  name: <CONFIGMAP_NAME>
                  key: COUCHDB_SERVERS
            - name: COUCHDB_USER
              valueFrom:
                secretKeyRef:
                  name: <SECRET_NAME>
                  key: COUCHDB_USER
          image: public.ecr.aws/medic/cht-haproxy-healthcheck:4.15.0
          name: cht-haproxy-healthcheck
          ports:
            - containerPort: 5555
      restartPolicy: Always
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: sentinel
  name: cht-sentinel
  namespace: <NAMESPACE>
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: sentinel
  strategy: {}
  template:
    metadata:
      labels:
        cht.service: sentinel
    spec:
      containers:
        - env:
            - name: API_HOST
              value: api.<NAMESPACE>.svc.cluster.local
            - name: COUCH_URL
              valueFrom:
                secretKeyRef:
                  name: <SECRET_NAME>
                  key: COUCH_URL
            - name: API_PORT
              value: '5988'
          image: public.ecr.aws/medic/cht-sentinel:4.15.0
          name: cht-sentinel
          resources: {}
      restartPolicy: Always
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: upgrade-service
  name: upgrade-service
  namespace: <NAMESPACE>
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: upgrade-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 0
      maxUnavailable: 1
  template:
    metadata:
      labels:
        cht.service: upgrade-service
    spec:
      restartPolicy: Always
      serviceAccountName: <SERVICE_ACCOUNT_NAME>
      containers:
      - image: medicmobile/upgrade-service:0.32
        name: upgrade-service
        resources: {}
        env:
          - name: CHT_NAMESPACE
            valueFrom:
              fieldRef:
                fieldPath: metadata.namespace
          - name: CHT_DEPLOYMENT_NAME
            valueFrom:
              fieldRef:
                fieldPath: metadata.labels['cht.service']
          - name: UPGRADE_SERVICE_PORT
            value: '5008'
        ports:
          - containerPort: 5008
```

- Apply the deployment configuration:

```shell
kubectl apply -f <CHT_CORE_DEPLOYMENT_FILE>.yaml
```

- Verify that the deployment was created successfully:

```shell
kubectl get deployments
kubectl get pods
```

#### Key Configurations

* **`replicas: 1`**:

  * Specifies that only one instance of ech deployment should run
* **`strategy: type: RollingUpdate`**:

  * To ensure minimal downtime by gradually replacing old pods with new ones while maintaining service availability.
  * Ensure that a specified number of healthy pods are always running during the update process, minimizing service interruption
* **`strategy: rollingUpdate: maxSurge: 0:`**

  * Ensure zero-downtime deployment.
* **`strategy: rollingUpdate: maxUnavailable: 1`**

  * Ensure one pod is updated at a time
* **`metadata: labels: cht.service`**

  * Thi assigns a label with the key in our case `cht.service` and the value `[any value]` and this value can be used to **identify**, **group** , or **select** this Pod
* **`selector: matchLabels: cht.service`**:

  * This ensures only the correct Pods receive traffic from the right service, even if multiple deployment running in the same cluster.
  * Ensure the Pods created by this Deployment are correctly matched
* **`valueFrom: fieldRef: fieldPath`**: Used to extract values from the Pod's metadata or environment
* **`containers: resources: {}`**: Used to define requests to resource and set limits for resources.If the resource is empty, the container does not request any specific CPU or memory and the scheduler will assign resources based on availability, and the container can use as much CPU/memory as allowed by the node
* **`env:name: API_HOST: value`**: API_HOST is variable that store the CHT API back-end URL and the attribute value containt the actual URL.
* **`api.muso-app.svc.cluster.local`** :

  * This is local URL used by Kubernetes and allows pods to communicate with one another. It is structured like:
    * `api`: The ame of the Kubernetes Service
    * `muso-app` : Name of the Namespace where the service is running
    * `svc`: Indicates that this is a Service in Kubernetes
    * `cluster.local`: The default domain for services inside the Kubernetes cluster.

#### CHT-CORE Services deployment

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: api
  name: api
  namespace: <NAMESPACE>
spec:
  ports:
    - port: 5988
      targetPort: 5988
  selector:
    cht.service: api
---
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: couchdb-1
  name: couchdb-1
  namespace: <NAMESPACE>
spec:
  ports:
    - name: couchdb1-service
      port: 5984
      protocol: TCP
      targetPort: 5984
    - name: cluster-api
      port: 5986
      protocol: TCP
      targetPort: 5986
    - name: epmd
      port: 4369
      protocol: TCP
      targetPort: 4369
    - name: erlang
      port: 9100
      protocol: TCP
      targetPort: 9100
  selector:
    cht.service: couchdb-1
---
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: couchdb-2
  name: couchdb-2
  namespace: <NAMESPACE>
spec:
  ports:
    - name: couchdb2-service
      port: 5984
      protocol: TCP
      targetPort: 5984
    - name: cluster-api
      port: 5986
      protocol: TCP
      targetPort: 5986
    - name: epmd
      port: 4369
      protocol: TCP
      targetPort: 4369
    - name: erlang
      port: 9100
      protocol: TCP
      targetPort: 9100
  selector:
    cht.service: couchdb-2
---

apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: couchdb-3
  name: couchdb-3
  namespace: <NAMESPACE>
spec:
  ports:
    - name: couchdb3-service
      port: 5984
      protocol: TCP
      targetPort: 5984
    - name: cluster-api
      port: 5986
      protocol: TCP
      targetPort: 5986
    - name: epmd
      port: 4369
      protocol: TCP
      targetPort: 4369
    - name: erlang
      port: 9100
      protocol: TCP
      targetPort: 9100
  selector:
    cht.service: couchdb-3
---
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: haproxy
  name: haproxy
  namespace: <NAMESPACE>
spec:
  ports:
    - name: "5984"
      port: 5984
      targetPort: 5984
  selector:
    cht.service: haproxy
---
apiVersion: v1
kind: Service
metadata:
  name: healthcheck
  namespace: <NAMESPACE>
spec:
  selector:
    cht.service: healthcheck
  ports:
    - protocol: TCP
      port: 5555
      targetPort: 5555
---
apiVersion: v1
kind: Service
metadata:
  name: upgrade-service
  namespace: <NAMESPACE>
spec:
  selector:
    cht.service: upgrade-service
  ports:
  - name: upgrade-service
    port: 5008
    protocol: TCP
    targetPort: 5008
  type: ClusterIP
```

* Apply the deployment configuration:

```shell
kubectl apply -f <CHT_SERVICE_FILE.yaml>
```

- Verify that the deployment was created successfully:

```shell
kubectl get deployments
kubectl get pods
```

#### Kubernetes concepts

* [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) - This is the main kubernetes resource that contains information regarding all the cht services that will be deployed.
* [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/) - This contains configuration files, or credentials that containers can retrieve. If you edit the configmap, you should delete containers, which will trigger a new container to download your new edits to any configurations for that service
* [ServiceAccounts](https://kubernetes.io/docs/concepts/security/service-accounts/) - This is used by the upgrade-service that is running inside the cht-core pods (as a container titled upgrade-service). This serviceAccount restricts the upgrade-service from interacting with any other cht-core projects outside of its namespace, and gives the upgrade-service permissions to talk to kubernetes API to upgrade container images when a CHT ADMIN clicks *upgrade* through the Admin interface.
* [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) - This is what forwards traffic to a particular project or pods. In most use-cases, there is an nginx deployed outside of the k3s cluster than contains DNS entries for existing projects, and contains a proxy_pass parameter to send traffic based on host header to any of the k3s server IPs. Inside the k3s cluster, the traefik container and servicelb-traefik containers in kube-system namespace will handle forwarding traffic to the correct cht-core containers based on url
* [Persistent Volume Claim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) - This is where our project data will be stored. Important to ensure you have configured this correctly, with retain policies intact so the data is not deleted if the project is removed. It’s also vital to ensure you have a backup policy either set-up in VMware vCenter GUI or you have configured the csi-snapshotter that comes with vSphere CSI.
* [Services](https://kubernetes.io/docs/concepts/services-networking/service/) - This is utilized for CouchDB nodes to discover each other through DNS rather than internal IPs, which can change. This is also used in the COUCH_URL so API containers can discover where CouchDB is running.

#### SSL Certificate Upload / Preparation

Using [Certbot](https://certbot.eff.org/instructions?ws=nginx&os=osx), ensure the dependencies of one of the challenges is met.

Once the certs are generated, create a [kubernetes secret tls](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret_tls/)

```bash
kubectl -n <namespace> create secret tls --cert=/etc/letsencrypt/live/<domain>/fullchain.pem --key=/etc/letsencrypt/live/<domain>/privkey.pem
```

Verify the secret was created by running:

```shell
kubectl -n <namespace> get secrets
```

#### Load Balancer and Ingress Configuration

Deploying an ingress with specific annotations, will create the GCP Load Balancer with internal routes to forward traffic to the API container.

Once we tie in an DNS entry to point to the GCP Load Balancer, we will have completed the ability for the end-user to navigate to the URL in their browser or app.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    kubernetes.io/ingress.class: "gce"
spec:
  #ingressClassName: alb
  rules:
    - host: <DOMAIN_NAME_SERVICE>
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 5988
  tls:
    - hosts:
        - <DOMAIN_NAME_SERVICE>
      secretName: <SSL_SECRETS_CREATED>

```

* Apply the deployment configuration:

```bash
  kubectl apply -f <CHT_INGRESS_FILE.yaml>
```

Remaining work: Map the rest of the following annotations to GCP Load Balancer

```yaml
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/tags: {{ .Values.ingress.annotations.tags }}
    alb.ingress.kubernetes.io/group.name: {{ .Values.ingress.annotations.groupname }}
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-port: traffic-port
    alb.ingress.kubernetes.io/certificate-arn: {{ .Values.ingress.annotations.certificate }}
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'

```
