---
title: "Migration from Docker Compose CHT 3.x to 3-Node Clustered CHT 4.x on K3s"
linkTitle: "Migration: 3.x Docker Compose to 4.x K3s (Multi-node)"
weight: 1
description: >
  Guide to migrate existing data from CHT 3.x Docker Compose deployment to CHT 4.x clustered K3s deployment with 3 CouchDB nodes
relatedContent: >
---
{{< read-content file="hosting/4.x/migration/_partial_migration_3x_docker_to_4x_k3s.md"  >}}

# Create directories on secondary nodes

```shell
ssh <user>@<node2-hostname> "sudo mkdir -p /srv/couchdb2/data/shards /srv/couchdb2/data/.shards"
ssh <user>@<node3-hostname> "sudo mkdir -p /srv/couchdb3/data/shards /srv/couchdb3/data/.shards"
```

## Create values.yaml for K3s Deployment
{{< read-content file="hosting/4.x/migration/_partial_values_explanation.md"  >}}

```yaml
project_name: "<your-namespace>"
namespace: "<your-namespace>"
chtversion: <version>

upstream_servers:
  docker_registry: "public.ecr.aws/medic"
  builds_url: "https://staging.dev.medicmobile.org/_couch/builds_4"
upgrade_service:
  tag: 0.32

couchdb:
  password: "<password>"
  secret: "<secret>"
  user: "<admin-user>"
  uuid: "<uuid>"
  clusteredCouch_enabled: true
  couchdb_node_storage_size: 100Gi

clusteredCouch:
  noOfCouchDBNodes: 3

ingress:
  host: "<url>"

environment: "remote"
cluster_type: "k3s-k3d"
cert_source: "specify-file-path"
certificate_crt_file_path: "<path-to-tls>/fullchain.crt"
certificate_key_file_path: "<path-to-tls>/privkey.key"

nodes:
  node-1: "couch01"
  node-2: "couch02"
  node-3: "couch03"

couchdb_data:
  preExistingDataAvailable: "true"
  dataPathOnDiskForCouchDB: "data"
  partition: "0"

local_storage:
  preExistingDiskPath-1: "/srv/couchdb1"
  preExistingDiskPath-2: "/srv/couchdb2"
  preExistingDiskPath-3: "/srv/couchdb3"
```

## Deploy to K3s

We are going to use cht-deploy from the [cht-core](https://github.com/medic/cht-core) repo.

```shell
cd cht-core/scripts/deploy
./cht-deploy -f /path/to/your/values.yaml
```

## Get Shard Distribution Instructions

Access the primary CouchDB pod, being sure to replace `<your-namespace>` with the name of your actual namespace: 

```shell
kubectl exec -it -n <your-namespace> $(kubectl get pod -n <your-namespace> -l cht.service=couchdb-1 -o name) -- bash
```

Set up the migration tool:
```shell
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs npm git
git clone https://github.com/medic/couchdb-migration.git
cd couchdb-migration
npm ci --omit=dev

# Create a global symlink to enable running commands directly
# Note: This may require sudo if npm's global directories aren't writable
npm link

export ADMIN_USER=<admin-user>
export ADMIN_PASSWORD=<password>
export COUCH_URL="http://${ADMIN_USER}:${ADMIN_PASSWORD}@localhost:5984"

# Get shard distribution instructions
shard_matrix=$(generate-shard-distribution-matrix)
shard-move-instructions $shard_matrix
```

Example output:
```
Move <mainNode-Path>/shards/00000000-1fffffff to <couchdb@couchdb-1.local-path>/shards/00000000-1fffffff
Move <mainNode-Path>/.shards/00000000-1fffffff to <couchdb@couchdb-1.local-path>/.shards/00000000-1fffffff
Move <mainNode-Path>/shards/20000000-3fffffff to <couchdb@couchdb-2.local-path>/shards/20000000-3fffffff
...
```

{{% alert title="Note" %}}
The actual shard ranges in your output may differ. Adjust the following rsync commands to match your specific shard distribution instructions.
{{% /alert %}}

## Distribute Shards

Move shards to Node 2:
```shell
# Copy main shards first
sudo rsync -avz --progress --partial --partial-dir=/tmp/rsync-partial \
    /srv/couchdb1/data/shards/20000000-3fffffff \
    /srv/couchdb1/data/shards/80000000-9fffffff \
    /srv/couchdb1/data/shards/e0000000-ffffffff \
    user@node2-hostname:/srv/couchdb2/data/shards/

# Then copy hidden shards
sudo rsync -avz --progress --partial --partial-dir=/tmp/rsync-partial \
    /srv/couchdb1/data/.shards/20000000-3fffffff \
    /srv/couchdb1/data/.shards/80000000-9fffffff \
    /srv/couchdb1/data/.shards/e0000000-ffffffff \
    user@node2-hostname:/srv/couchdb2/data/.shards/

# Touch the .shards to ensure they're newer
ssh user@node2-hostname "sudo find /srv/couchdb2/data/.shards -type f -exec touch {} +"
```

Move shards to Node 3:
```shell
# Copy main shards first
sudo rsync -avz --progress --partial --partial-dir=/tmp/rsync-partial \
    /srv/couchdb1/data/shards/40000000-5fffffff \
    /srv/couchdb1/data/shards/a0000000-bfffffff \
    user@node3-hostname:/srv/couchdb3/data/shards/

# Then copy hidden shards
sudo rsync -avz --progress --partial --partial-dir=/tmp/rsync-partial \
    /srv/couchdb1/data/.shards/40000000-5fffffff \
    /srv/couchdb1/data/.shards/a0000000-bfffffff \
    user@node3-hostname:/srv/couchdb3/data/.shards/

# Touch the .shards to ensure they're newer
ssh user@node3-hostname "sudo find /srv/couchdb3/data/.shards -type f -exec touch {} +"
```

## Update Cluster Configuration

In the primary CouchDB pod:
```shell
# Apply shard distribution
move-shards $shard_matrix

# Remove old node configuration
remove-node couchdb@127.0.0.1

# Verify migration
verify
```
