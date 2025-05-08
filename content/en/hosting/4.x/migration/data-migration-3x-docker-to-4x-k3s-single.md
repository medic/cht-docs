---
title: "Migration from 3.x Docker Compose to 4.x K3s (Single Node)"
linkTitle: "To K3s Single-Node"
weight: 2
aliases:
  - /hosting/4.x/migration/_partial_migration_3x_docker_to_4x_k3s
---

{{< hextra/hero-subtitle >}}
  Guide on how to migrate existing data from CHT 3.x Docker Compose deployment to CHT 4.x single-node K3s deployment
{{< /hextra/hero-subtitle >}}

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

## Create values.yaml for K3s Deployment
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
  clusteredCouch_enabled: false
  couchdb_node_storage_size: 100Gi

ingress:
  host: "<url>"

environment: "remote"
cluster_type: "k3s-k3d"
cert_source: "specify-file-path"
certificate_crt_file_path: "<path-to-tls>/fullchain.crt"
certificate_key_file_path: "<path-to-tls>/privkey.key"

nodes:
  node-1: "couch01"

couchdb_data:
  preExistingDataAvailable: "true"
  dataPathOnDiskForCouchDB: "data"
  partition: "0"

local_storage:
  preExistingDiskPath-1: "/srv/couchdb1"
```

## Deploy to K3s

We are going to use cht-deploy from the [cht-core](https://github.com/medic/cht-core) repo.

```shell
cd cht-core/scripts/deploy
./cht-deploy -f /path/to/your/values.yaml
```

## Run Migration Commands

First verify CouchDB is running by getting the pod status and running `curl` inside the couchdb service to see if `localhost` is accessible. Be sure to replace `<your-namespace>` with your actual namespace:

```shell
kubectl get pods -n <your-namespace>

kubectl exec -it -n <your-namespace> $(kubectl get pod -n <your-namespace> -l cht.service=couchdb -o name) -- \
  curl -s http://localhost:5984/_up
```

Access the CouchDB pod:
```shell
kubectl exec -it -n <your-namespace> $(kubectl get pod -n <your-namespace> -l cht.service=couchdb -o name) -- bash
```

Set up migration tool in pod:
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

# Verify CouchDB is up and responding
check-couchdb-up

# Update node configuration
move-node

# Verify migration
verify
```
