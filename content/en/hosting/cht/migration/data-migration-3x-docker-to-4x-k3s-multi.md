---
title: "Migration from Docker Compose CHT 3.x to 3-Node Clustered CHT 4.x on K3s"
linkTitle: "To K3s Multi-node"
weight: 1
description: >
  Guide to migrate existing data from CHT 3.x Docker Compose deployment to CHT 4.x clustered K3s deployment with 3 CouchDB nodes
aliases:
  - /hosting/cht/migration/_partial_migration_3x_docker_to_4x_k3s
---

The hosting architecture differs entirely between CHT Core 3.x and CHT Core 4.x. When migrating from Docker Compose to K3s, specific steps are required using the [couchdb-migration](https://github.com/medic/couchdb-migration) tool. This tool interfaces with CouchDB to update shard maps and database metadata.

> [!TIP] 
> If after upgrading you get an error, `Cannot convert undefined or null to object` - see [issue #8040](https://github.com/medic/cht-core/issues/8040) for a work around. This only affects CHT 4.0.0, 4.0.1, 4.1.0 and 4.1.1. It was fixed in CHT 4.2.0.


## Install Migration Tool
```shell
mkdir -p ~/couchdb-migration/
cd ~/couchdb-migration/
curl -s -o ./docker-compose.yml https://raw.githubusercontent.com/medic/couchdb-migration/main/docker-compose.yml
docker compose up
```

## Set Up Environment Variables

Be sure to replace both `<admin-user>` and `<password>` with your actual username and password.  As well, update `<couchdb-host>` to the CouchDB URL from the Docker Compose setup:

```shell
export COUCH_URL=http://<admin-user>:<password>@<couchdb-host>:5984
```

## Run Pre-Migration Commands
```shell
cd ~/couchdb-migration/
docker compose run couch-migration pre-index-views <put-your-intended-cht-version>
```

> [!IMPORTANT] 
> If pre-indexing is omitted, 4.x API will fail to respond to requests until all views are indexed. For large databases, this could take many hours or days.

## Save CouchDB Configuration
```shell
cd ~/couchdb-migration/
docker compose run couch-migration get-env
```

Save the output containing:
- CouchDB secret (used for encrypting passwords and session tokens)
- CouchDB server UUID (used for replication checkpointing)
- CouchDB admin credentials

The next part of  the guide assumes your K3s cluster is already prepared. If not, run the set of commands [here](https://docs.k3s.io/quick-start).

We are also going to utilize the `cht-deploy` script from the [cht-core](https://github.com/medic/cht-core) repo. If you don't already have that, clone it.

## Prepare Node Storage

```shell
# Create directory on the node
sudo mkdir -p /srv/couchdb1/data

# Copy data from Docker Compose installation to the k3s node
sudo rsync -avz --progress --partial --partial-dir=/tmp/rsync-partial \
    /srv/storage/medic-core/couchdb/data/ \
    <user>@<node1-hostname>:/srv/couchdb1/data/
```

## Create directories on secondary nodes

```shell
ssh <user>@<node2-hostname> "sudo mkdir -p /srv/couchdb2/data/shards /srv/couchdb2/data/.shards"
ssh <user>@<node3-hostname> "sudo mkdir -p /srv/couchdb3/data/shards /srv/couchdb3/data/.shards"
```

### Create values.yaml for K3s Deployment
Be sure to update the following values in your YAML file:

* `<your-namespace>` (_two occurrences_)
* `<version>` - 4.x version you're upgrading to
* `<password>` - retrieved from `get-env` call above
* `<secret>` - retrieved from `get-env` call above
* `<admin-user>` - needs to be the same as used in 3.x - likely `medic`
* `<uuid>` - retrieved from `get-env` call above
* `<url>` - the URL of your production instance goes here (eg `example.org`)
* `<path-to-tls>` - path to TLS files on disk

Storage Configuration Notes:

The storage related values don't need to be changed but here's an explanation:

* `preExistingDataAvailable: "true"` - If this is false, the CHT gets launched with empty data.
* `dataPathOnDiskForCouchDB: "data"` - Leave as `data` because that's the directory we created above when moving the existing data.
* `partition: "0"` - Leave as `0` to use the whole disk. If you have moved data to a separate partition in a partitioned hard disk, then you'd put the partition number here.

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

### Deploy to K3s

We are going to use cht-deploy from the [cht-core](https://github.com/medic/cht-core) repo.

```shell
cd cht-core/scripts/deploy
./cht-deploy -f /path/to/your/values.yaml
```

### Get Shard Distribution Instructions

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
```shell
Move <mainNode-Path>/shards/00000000-1fffffff to <couchdb@couchdb-1.local-path>/shards/00000000-1fffffff
Move <mainNode-Path>/.shards/00000000-1fffffff to <couchdb@couchdb-1.local-path>/.shards/00000000-1fffffff
Move <mainNode-Path>/shards/20000000-3fffffff to <couchdb@couchdb-2.local-path>/shards/20000000-3fffffff
...
```

> [!NOTE] 
> The actual shard ranges in your output may differ. Adjust the following rsync commands to match your specific shard distribution instructions.

### Distribute Shards

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

### Update Cluster Configuration

In the primary CouchDB pod:
```shell
# Apply shard distribution
move-shards $shard_matrix

# Remove old node configuration
remove-node couchdb@127.0.0.1

# Verify migration
verify
```
