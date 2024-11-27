---
title: "Migration from 3.x Docker Compose to 4.x K3s (Single Node)"
linkTitle: "Migration: 3.x Docker Compose to 4.x K3s (Single-Node)"
weight: 1
description: >
  Guide on how to migrate existing data from CHT 3.x Docker Compose deployment to CHT 4.x single-node K3s deployment
relatedContent: >
---
{{ < read-content file="hosting/4.x/_partial_migration_3x_docker_to_4x_k3s.md"  }}

## Create values.yaml for K3s Deployment
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
  password: "<your-admin-password>"
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
```shell
cd cht-core/scripts/deploy
./cht-deploy -f /path/to/your/values.yaml
```

## Run Migration Commands

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
