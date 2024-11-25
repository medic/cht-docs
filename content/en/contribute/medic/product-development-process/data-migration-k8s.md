---
title: "Migration from CHT 3.x to CHT 4.x in Kubernetes"
linkTitle: "K8s Data Migration to 4.x"
weight: 1
description: >
  Guide to migrate existing data from CHT 3.x to CHT 4.x in Kubernetes environments
relatedContent: >
---

The hosting architecture differs entirely between CHT-Core 3.x and CHT-Core 4.x. When both versions are running in Kubernetes, migrating data requires specific steps using the [couchdb-migration](https://github.com/medic/couchdb-migration) tool. This tool interfaces with CouchDB to update shard maps and database metadata.

{{% alert title="Note" %}}
If after upgrading you get an error, `Cannot convert undefined or null to object` - please see [issue #8040](https://github.com/medic/cht-core/issues/8040) for a work around. This only affects CHT 4.0.0, 4.0.1, 4.1.0 and 4.1.1. It was fixed in CHT 4.2.0.
{{% /alert %}}

## Migration Steps

1. Initial Setup
```shell
# Set your namespace
NAMESPACE=<your-namespace>
```

2. Access the Source CouchDB (3.x)
```shell
# List all pods to find medic-os pod
kubectl get pods -n $NAMESPACE

# Access the medic-os pod
kubectl exec -it -n $NAMESPACE <medic-os-pod-name> -- bash
```

3. Set Up Migration Tool Inside 3.x Pod

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

4. Run Pre-Migration Commands on 3.x

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

{{% alert title="Note" %}} 
If pre-indexing is omitted, 4.x API will fail to respond to requests until all views are indexed. For large databases, this could take many hours or days.
{{% /alert %}}

Save CouchDB configuration:
```shell
get-env
```

Save the output containing:
- CouchDB secret (used for encrypting passwords and session tokens)
- CouchDB server UUID (used for replication checkpointing)
- CouchDB admin credentials

You can now exit the medic-os container by running `exit`.

5. Clone the 3.x Data Volume

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

6. Deploy CHT 4.x with Existing Data

Create a `values.yaml` file using the volume ID from the previous step:

For single node deployment:

```yaml
project_name: <your-namespace-defined-in-NAMESPACE>
namespace: <your-namespace-defined-in-NAMESPACE>
chtversion: 4.10.0  # Can be 4.10.0 or latest version

upstream_servers:
  docker_registry: "public.ecr.aws/medic"
  builds_url: "https://staging.dev.medicmobile.org/_couch/builds_4"

couchdb:
  password: <from_get-env_command>  # Avoid using non-url-safe characters
  secret: <from_get-env_command>
  user: <admin_user>
  uuid: <from_get-env_command>
  clusteredCouch_enabled: false
  couchdb_node_storage_size: 100Mi

toleration:  # For production, change key to "prod-couchdb-only"
  key: "dev-couchdb-only"
  operator: "Equal"
  value: "true"
  effect: "NoSchedule"

ingress:
  annotations:  # For production, update groupname to "prod-cht-alb" and Environment to "prod"
    groupname: "dev-cht-alb"
    tags: "Environment=dev,Team=QA"
    certificate: "arn:aws:iam::<account-id>:server-certificate/2024-wildcard-dev-medicmobile-org-chain"
  host: <your-url>  # eg. yyyy.app.medicmobile.org
  hosted_zone_id: <your-hosted-zone-id>
  # For production, use the production load balancer address
  load_balancer: "dualstack.k8s-devchtalb-3eb0781cbb-694321496.eu-west-2.elb.amazonaws.com"

environment: "remote"
cluster_type: "eks"
cert_source: "eks-medic"

couchdb_data:
  preExistingDataAvailable: "true"
  dataPathOnDiskForCouchDB: "storage/medic-core/couchdb/data"  # Use subPath from 3.x instance
  partition: "0"

ebs:
  preExistingEBSVolumeID-1: <NEW_VOLUME_ID-from-previous-step>  # Volume containing 3.x data
  preExistingEBSVolumeSize: "100Gi"

```

For a clustered deployment.

```yaml
project_name: <your-namespace-defined-in-NAMESPACE>
namespace: <your-namespace-defined-in-NAMESPACE>
chtversion: 4.10.0  # Can be 4.10.0 or latest version

upstream_servers:
  docker_registry: "public.ecr.aws/medic"
  builds_url: "https://staging.dev.medicmobile.org/_couch/builds_4"
upgrade_service:
  tag: 0.32

couchdb:
  password: <from_get-env_command>  # Avoid using non-url-safe characters
  secret: <from_get-env_command>
  user: <admin_user>
  uuid: <from_get-env_command>
  clusteredCouch_enabled: true  # Set to true if you want clustered CouchDB in 4.x
  couchdb_node_storage_size: 100Mi #Set equal to the migrated disk

clusteredCouch:  # Only relevant if clusteredCouch_enabled is true
  noOfCouchDBNodes: 3

toleration:  # For production, change key to "prod-couchdb-only"
  key: "dev-couchdb-only"
  operator: "Equal"
  value: "true"
  effect: "NoSchedule"

ingress:
  annotations:  # For production, update groupname to "prod-cht-alb" and Environment to "prod"
    groupname: "dev-cht-alb"
    tags: "Environment=dev,Team=QA"
    certificate: "arn:aws:iam::<account-id>:server-certificate/2024-wildcard-dev-medicmobile-org-chain"
  host: <your-url>  # eg. yyyy.app.medicmobile.org
  hosted_zone_id: <your-hosted-zone-id>
  # For production, use the production load balancer address
  load_balancer: "dualstack.k8s-devchtalb-3eb0781cbb-694321496.eu-west-2.elb.amazonaws.com"

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
  preExistingEBSVolumeID-1: <NEW_VOLUME_ID-from-previous-step>  # Volume containing 3.x data
  preExistingEBSVolumeID-2: ""  # Leave empty for secondary nodes
  preExistingEBSVolumeID-3: ""  # Leave empty for tertiary nodes
  preExistingEBSVolumeSize: "100Gi" #Set equal to the migrated disk
```

Deploy using cht-deploy script from cht-core repository:
```shell
cd cht-core/scripts/deploy
./cht-deploy -f PATH_TO/values.yaml
```

7. Verify Deployment and Run Migration Commands

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
```shell
# Generate distribution matrix
shard_matrix=$(generate-shard-distribution-matrix)

# Get movement instructions
shard-move-instructions $shard_matrix

{{% alert title="Note" %}}
For clustered setups, shards must be moved both in software (using the migration commands) and physically (the actual data must be moved between EBS volumes). Follow the instructions from shard-move-instructions carefully.
{{% /alert %}}

# After moving shards according to instructions
move-shards $shard_matrix

# Remove old node from cluster
remove-node couchdb@127.0.0.1

# Verify the migration
verify
```
