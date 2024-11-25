---
title: "Migration from Docker Compose CHT 3.x to Single-Node CHT 4.x on K3s"
linkTitle: "Docker Compose to K3s Single-Node Migration"
weight: 1
description: >
  Guide to migrate existing data from CHT 3.x Docker Compose deployment to CHT 4.x single-node K3s deployment
relatedContent: >
---

The hosting architecture differs entirely between CHT-Core 3.x and CHT-Core 4.x. When migrating from Docker Compose to K3s, specific steps are required using the [couchdb-migration](https://github.com/medic/couchdb-migration) tool. This tool interfaces with CouchDB to update shard maps and database metadata.

{{% alert title="Note" %}}
If after upgrading you get an error, `Cannot convert undefined or null to object` - please see [issue #8040](https://github.com/medic/cht-core/issues/8040) for a work around. This only affects CHT 4.0.0, 4.0.1, 4.1.0 and 4.1.1. It was fixed in CHT 4.2.0.
{{% /alert %}}

## Migration Steps

1. Install Migration Tool
```shell
mkdir -p ~/couchdb-migration/
cd ~/couchdb-migration/
curl -s -o ./docker-compose.yml https://raw.githubusercontent.com/medic/couchdb-migration/main/docker-compose.yml
docker compose up
```

2. Set Up Environment Variables
```shell
# Replace with your actual CouchDB URL from the Docker Compose setup
export COUCH_URL=http://<admin>:<password>@<couchdb-host>:5984
```

3. Run Pre-Migration Commands
```shell
cd ~/couchdb-migration/
docker compose run couch-migration pre-index-views 4.10.0
```

{{% alert title="Note" %}} 
If pre-indexing is omitted, 4.x API will fail to respond to requests until all views are indexed. For large databases, this could take many hours or days.
{{% /alert %}}

4. Save CouchDB Configuration
```shell
cd ~/couchdb-migration/
docker compose run couch-migration get-env
```

Save the output containing:
- CouchDB secret (used for encrypting passwords and session tokens)
- CouchDB server UUID (used for replication checkpointing)
- CouchDB admin credentials

The next part of  the guide assumes your k3s cluster is already prepared. If not, please run the set of commands [here](https://docs.k3s.io/quick-start).

5. Prepare Node Storage

```shell
# Create directory on the node
sudo mkdir -p /srv/couchdb1/data

# Copy data from Docker Compose installation
sudo rsync -avz --progress --partial --partial-dir=/tmp/rsync-partial \
    /srv/storage/medic-core/couchdb/data/ \
    /srv/couchdb1/data/
```

6. Create values.yaml for K3s Deployment
```yaml
project_name: "your-namespace-name"
namespace: "your-namespace-name"
chtversion: 4.10.0

upstream_servers:
  docker_registry: "public.ecr.aws/medic"
  builds_url: "https://staging.dev.medicmobile.org/_couch/builds_4"
upgrade_service:
  tag: 0.32

couchdb:
  password: "<your-saved-password>"
  secret: "<your-saved-secret>"
  user: "<your-admin-user>"
  uuid: "<your-saved-uuid>"
  clusteredCouch_enabled: false
  couchdb_node_storage_size: 100Gi

ingress:
  host: "your-url.org"

environment: "remote"
cluster_type: "k3s-k3d"
cert_source: "specify-file-path"
certificate_crt_file_path: "/home/henok/certs/fullchain.crt"
certificate_key_file_path: "/home/henok/certs/privkey.key"

nodes:
  node-1: "couch01"

couchdb_data:
  preExistingDataAvailable: "true"
  dataPathOnDiskForCouchDB: "data"
  partition: "0"

local_storage:
  preExistingDiskPath-1: "/srv/couchdb1"
```

7. Deploy to K3s
```shell
cd cht-core/scripts/deploy
./cht-deploy -f /path/to/your/values.yaml
```

8. Run Migration Commands

First verify CouchDB is running:
```shell
# Check pod status
kubectl get pods -n your-namespace-name

# Check CouchDB is up
kubectl exec -it -n your-namespace-name $(kubectl get pod -n your-namespace-name -l cht.service=couchdb -o name) -- \
  curl -s http://localhost:5984/_up
```

Access the CouchDB pod:
```shell
kubectl exec -it -n your-namespace-name $(kubectl get pod -n your-namespace-name -l cht.service=couchdb -o name) -- bash
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

export ADMIN_USER=<your-admin-user>
export ADMIN_PASSWORD=<your-admin-password>
export COUCH_URL="http://${ADMIN_USER}:${ADMIN_PASSWORD}@localhost:5984"

# Verify CouchDB is up and responding
check-couchdb-up

# Update node configuration
move-node

# Verify migration
verify
```
