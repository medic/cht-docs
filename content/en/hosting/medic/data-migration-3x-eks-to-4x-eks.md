---
title: "Migration from CHT 3.x to CHT 4.x in EKS - Kubernetes"
linkTitle: "Migration: 3.x EKS to 4.x EKS"
weight: 1
description: >
  Guide to migrate existing data from CHT 3.x on EKS to CHT 4.x on EKS (Kubernetes Environments)
aliases:
   - /contribute/medic/product-development-process/data-migration-3x-eks-to-4x-eks
   - /contribute/medic/data-migration-3x-eks-to-4x-eks
---

Like the [Deploy to EKS guide](//hosting/medic/deploy-on-eks), this guide is meant for Medic Teammates migrating Medic hosted CHT Core deployments.  However, given there may be other users who will benefit from understanding the process, this document is published for all to read.

CHT Core hosting architecture differs entirely between 3.x and 4.x. When both versions are running in Kubernetes, migrating data requires specific steps using the [couchdb-migration](https://github.com/medic/couchdb-migration) tool. This tool interfaces with CouchDB to update shard maps and database metadata.

> [!TIP]
> If after upgrading you get an error, `Cannot convert undefined or null to object` - see [issue #8040](https://github.com/medic/cht-core/issues/8040) for a work around. This only affects CHT 4.0.0, 4.0.1, 4.1.0 and 4.1.1. It was fixed in CHT 4.2.0.

## Initial Setup

```shell
# Set your namespace
NAMESPACE=<your-namespace>
```

##  Access the Source CouchDB (3.x)
```shell
# List all pods to find medic-os pod
kubectl get pods -n $NAMESPACE

# Access the medic-os pod
kubectl exec -it -n $NAMESPACE <medic-os-pod-name> -- bash
```

## Set Up Migration Tool Inside 3.x Pod

Once inside the pod, install required dependencies:
```shell
# Add node apt repository and update apt
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt update

# Ensure nodejs, npm and git are installed
apt install -y nodejs npm git

#  clone repository
git clone https://github.com/medic/couchdb-migration.git
cd couchdb-migration
npm ci --omit=dev

# Create a global symlink to enable running commands directly
# Note: This may require sudo if npm's global directories aren't writable
npm link
```

## Run Pre-Migration Commands on 3.x

While still `exec`ed in the `medic-os` container,  get credentials from 1Password and set them inside the pod:
```shell
export ADMIN_USER=<admin_username_from_1password>
export ADMIN_PASSWORD=<admin_password_from_1password>

# Set COUCH_URL
export COUCH_URL="http://${ADMIN_USER}:${ADMIN_PASSWORD}@localhost:5984"

# Verify connection
curl -s $COUCH_URL/_up
```

Pre-index views to minimize downtime:
```shell
pre-index-views <desired CHT version>
```

> [!WARNING]
> If pre-indexing is omitted, 4.x API will fail to respond to requests until all views are indexed. For large databases, this could take many hours or days.

Save CouchDB configuration:
```shell
get-env
```

Save the output containing:
- CouchDB secret (used for encrypting passwords and session tokens)
- CouchDB server UUID (used for replication checkpointing)
- CouchDB admin credentials

You can now exit the medic-os container by running `exit`.

## Clone the 3.x Data Volume

First, identify the volume ID from your 3.x data:
```shell
# Get the PVC name
kubectl get pvc -n $NAMESPACE

# Get the volume ID from the PVC
VOLUME_ID=$(kubectl get pvc <your-3x-pvc-name> -n $NAMESPACE -o jsonpath='{.spec.volumeName}')
EBS_VOLUME_ID=$(kubectl get pv $VOLUME_ID -o jsonpath='{.spec.awsElasticBlockStore.volumeID}' | cut -d'/' -f4)

echo "Your 3.x EBS Volume ID is: $EBS_VOLUME_ID"

# Create a snapshot of the 3.x volume
SNAPSHOT_ID=$(aws ec2 create-snapshot \
    --region eu-west-2 \
    --volume-id $EBS_VOLUME_ID \
    --description "CHT 3.x to 4.x migration snapshot" \
    --query 'SnapshotId' \
    --output text)

echo "Created snapshot: $SNAPSHOT_ID"

# Wait for the snapshot to complete
aws ec2 wait snapshot-completed --snapshot-ids $SNAPSHOT_ID

# Set cluster-specific variables
# For development:
AVAILABILITY_ZONE="eu-west-2b"
CLUSTER_NAME="dev-cht-eks"

# For production, comment out above and uncomment below:
# AVAILABILITY_ZONE="eu-west-2a"
# CLUSTER_NAME="prod-cht-eks"

# Create a new volume from the snapshot
NEW_VOLUME_ID=$(aws ec2 create-volume \
    --region eu-west-2 \
    --availability-zone $AVAILABILITY_ZONE \
    --snapshot-id $SNAPSHOT_ID \
    --volume-type gp2 \
    --query 'VolumeId' \
    --output text)

echo "Created new volume: $NEW_VOLUME_ID"

# Tag the new volume for Kubernetes use
aws ec2 create-tags \
    --resources $NEW_VOLUME_ID \
    --tags Key=kubernetes.io/cluster/$CLUSTER_NAME,Value=owned Key=KubernetesCluster,Value=$CLUSTER_NAME

# Verify your tags took effect
aws ec2 describe-volumes --region eu-west-2 --volume-id $NEW_VOLUME_ID | jq '.Volumes[0].Tags'
```

## Deploy CHT 4.x with Existing Data

Create a `values.yaml` file using the volume ID from the previous step:

For single node deployment, create a YAML file with this contents, being sure to update:

* `<your-namespace-defined-in-NAMESPACE>` (_two occurrences_)
* `<version>` - 4.x version you're upgrading to
* `<password>` - retrieved from `get-env` call above
* `<secret>` - retrieved from `get-env` call above
* `<admin-user>` - needs to be the same as used in 3.x - likely `medic`
* `<uuid>` - retrieved from `get-env` call above
* `<size>` - Size of original 3.x EBS volume, eg `100Mi` for 100 Megabytes or `100Gi` for 100 Gigabytes (_two occurrences_)
* `<toleration-value>` -  For production use `prod-couchdb-only`, for dev use `dev-couchdb-only`
* `<groupname>` - For production use `prod-cht-alb`, for dev use `dev-cht-alb`
* `<environment>` - For production use `prod`, for dev use `dev`
* `<maintainers>` - For production use `SRE`, for dev use `QA`
* `<url>` - For production use `your-url.app.medicmobile.org`, for dev use `your-url.dev.medicmobile.org`
* `load_balancer` - For dev, use: `dualstack.k8s-devchtalb-3eb0781cbb-694321496.eu-west-2.elb.amazonaws.com` For prod, use: `k8s-prodchtalb-dcc00345ac-1792311525.eu-west-2.elb.amazonaws.com`
* `certificate` - Inquire what the latest certificates are. For 2024 dev, use: `arn:aws:iam::720541322708:server-certificate/2024-wildcard-dev-medicmobile-org-chain`. For 2024 prod, use: `arn:aws:iam::720541322708:server-certificate/2024-wildcard-app-medicmobile-org-chain`.
* `<volume-ID>` - `NEW_VOLUME_ID` from previous step, is volume containing 3.x data

```yaml
project_name: "<your-namespace-defined-in-NAMESPACE>"
namespace: "<your-namespace-defined-in-NAMESPACE>"
chtversion: <version> 

upstream_servers:
  docker_registry: "public.ecr.aws/medic"
  builds_url: "https://staging.dev.medicmobile.org/_couch/builds_4"
upgrade_service:
  tag: 0.32

couchdb:
  password: "<password>"
  secret: "<secret>"
  user: "<admin_user>"
  uuid: "<uuid>"
  clusteredCouch_enabled: false
  couchdb_node_storage_size: "<size>"

toleration:  
  key: "<toleration-value>"
  operator: "Equal"
  value: "true"
  effect: "NoSchedule"

ingress:
  annotations:  
    groupname: "<groupname>"
    tags: "Environment=<environment>,Team=<maintainers>"
    certificate: "<certificate>"
  host: "<url>" 
  hosted_zone_id: "Z3304WUAJTCM7P"
  load_balancer: "<load_balancer>"

environment: "remote"
cluster_type: "eks"
cert_source: "eks-medic"

couchdb_data:
  preExistingDataAvailable: "true"
  dataPathOnDiskForCouchDB: "storage/medic-core/couchdb/data"  
  partition: "0"

ebs:
  preExistingEBSVolumeID-1: "<volume-ID>"  
  preExistingEBSVolumeSize: "<size>"

```

A Note about the following section:

```yaml
couchdb_data:
  preExistingDataAvailable: "true"
  dataPathOnDiskForCouchDB: "storage/medic-core/couchdb/data"  # Use subPath from 3.x instance
  partition: "0"

```
The value for partition is usually `"0"` - not partitioned. If you would like to change this, you can go to your 3.x pod and run `df -h` and observe if the existing data is on a specific partition. You then update this value to be the partition number.

For a clustered deployment, create a YAML file with this contents, being sure to update:

* `<your-namespace-defined-in-NAMESPACE>` (two occurrences)
* `<version>` - 4.x version you're upgrading too
* `<password>` - retrieved from `get-env` call above
* `<secret>` - retrieved from `get-env` call above
* `<admin_user>` - needs to be the same as used in 3.x - likely `medic`
* `<uuid>` - retrieved from `get-env` call above
* `<size>` - Size of original 3.x EBS volume, eg `100Mi` for 100 Megabytes or `100Gi` for 100 Gigabytes (_two occurrences_)
* `<toleration-value>` -  For production use `prod-couchdb-only`, for dev use `dev-couchdb-only`
* `<groupname>` - For production use `prod-cht-alb`, for dev use `dev-cht-alb`
* `<environment>` - For production use `prod`, for dev use `dev`
* `<maintainers>` - For production use `SRE`, for dev use `QA`
* `<url>` - For production use `your-url.app.medicmobile.org`, for dev use `your-url.dev.medicmobile.org`
* `<load_balancer>` - For dev, use: `dualstack.k8s-devchtalb-3eb0781cbb-694321496.eu-west-2.elb.amazonaws.com` For prod, use: `k8s-prodchtalb-dcc00345ac-1792311525.eu-west-2.elb.amazonaws.com`
* `<certificate>` - Inquire what the latest certificates are. For 2024 dev, use: `arn:aws:iam::720541322708:server-certificate/2024-wildcard-dev-medicmobile-org-chain`. For 2024 prod, use: `arn:aws:iam::720541322708:server-certificate/2024-wildcard-app-medicmobile-org-chain`.
* `<volume-ID>` - `NEW_VOLUME_ID` from previous step, is volume containing 3.x data

```yaml
project_name: "<your-namespace-defined-in-NAMESPACE>"
namespace: "<your-namespace-defined-in-NAMESPACE>"
chtversion: <version>

upstream_servers:
  docker_registry: "public.ecr.aws/medic"
  builds_url: "https://staging.dev.medicmobile.org/_couch/builds_4"
upgrade_service:
  tag: 0.32

couchdb:
  password: "<password>"
  secret: "<secret>"
  user: "<admin_user>"
  uuid: "<uuid>"
  clusteredCouch_enabled: true  
  couchdb_node_storage_size: "<size>"

clusteredCouch:  # Only relevant if clusteredCouch_enabled is true
  noOfCouchDBNodes: 3

toleration:
  key: "<toleration-value>"
  operator: "Equal"
  value: "true"
  effect: "NoSchedule"

ingress:
  annotations:
    groupname: "<groupname>"
    tags: "Environment=<environment>,Team=<maintainers>"
    certificate: "<certificate>"
  host: "<url>"
  hosted_zone_id: "Z3304WUAJTCM7P"
  load_balancer: "<load_balancer>"

environment: "remote"
cluster_type: "eks"
cert_source: "eks-medic"

# Only need to specify nodes if deploying on k3s and want to use specific nodes for CouchDB pods
#nodes:
#  node-1: <worker-node-1-name>  # Only for k3s deployments
#  node-2: <worker-node-2-name>  # Only for k3s deployments
#  node-3: <worker-node-3-name>  # Only for k3s deployments

couchdb_data:
  preExistingDataAvailable: "true"
  dataPathOnDiskForCouchDB: "storage/medic-core/couchdb/data"  # Use subPath from 3.x instance
  partition: "0"

ebs:
  preExistingEBSVolumeID-1: "<volume-ID>"
  preExistingEBSVolumeID-2: ""  # Leave empty for secondary nodes
  preExistingEBSVolumeID-3: ""  # Leave empty for tertiary nodes
  preExistingEBSVolumeSize: "<size>"
```

A Note about the following section:

```yaml
couchdb_data:
  preExistingDataAvailable: "true"
  dataPathOnDiskForCouchDB: "storage/medic-core/couchdb/data"  # Use subPath from 3.x instance
  partition: "0"

```
The value for partition is usually `"0"` - not partitioned. If you would like to change this, you can go to your 3.x pod and run `df -h` and observe if the existing data is on a specific partition. You then update this value to be the partition number.

Deploy using cht-deploy script from cht-core repository:
```shell
cd cht-core/scripts/deploy
./cht-deploy -f PATH_TO/values.yaml
```

## Verify Deployment and Run Migration Commands

First verify CouchDB is running properly:
```shell
# Check pod status
kubectl get pods -n $NAMESPACE

# For single node check CouchDB is up
kubectl exec -it -n $NAMESPACE $(kubectl get pod -n $NAMESPACE -l cht.service=couchdb -o name) -- \
  curl -s http://localhost:5984/_up

# For clustered setup (check all nodes)
kubectl exec -it -n $NAMESPACE $(kubectl get pod -n $NAMESPACE -l cht.service=couchdb-1 -o name) -- \
  curl -s http://localhost:5984/_up
```

Access the new CouchDB pod based on your deployment type.

For single node:
```shell
kubectl exec -it -n $NAMESPACE $(kubectl get pod -n $NAMESPACE -l cht.service=couchdb -o name) -- bash
```

For clustered setup (always use couchdb-1):
```shell
kubectl exec -it -n $NAMESPACE $(kubectl get pod -n $NAMESPACE -l cht.service=couchdb-1 -o name) -- bash
```

Once inside the pod, set up the migration tool again:
```shell
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs npm git
git clone https://github.com/medic/couchdb-migration.git
cd couchdb-migration
npm ci --omit=dev

# Create a global symlink to enable running commands directly
# Note: This may require sudo if npm's global directories aren't writable
npm link

# Set up CouchDB connection
export ADMIN_USER=<admin_username_from_1password>
export ADMIN_PASSWORD=<admin_password_from_1password>
export COUCH_URL="http://${ADMIN_USER}:${ADMIN_PASSWORD}@localhost:5984"

# Verify CouchDB is up and responding
check-couchdb-up
```

For single node deployment:
```shell
move-node
verify
```

For clustered deployment:

> [!CAUTION]
> For clustered setups, shards must be moved both in software (using the migration commands) and physically (the actual data must be moved between EBS volumes). Follow the instructions from shard-move-instructions carefully.


```shell
# Generate distribution matrix
shard_matrix=$(generate-shard-distribution-matrix)

# Get movement instructions
shard-move-instructions $shard_matrix

# After moving shards according to instructions
move-shards $shard_matrix

# Remove old node from cluster
remove-node couchdb@127.0.0.1

# Verify the migration
verify
```
