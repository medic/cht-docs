---
title: "Migration from 3.x Docker Compose to 4.x K3s (Single Node)"
linkTitle: "To K3s Single-Node"
weight: 20
description: >
  Guide on how to migrate existing data from CHT 3.x Docker Compose deployment to CHT 4.x single-node K3s deployment
relatedContent: >
---
{{< read-content file="hosting/4.x/migration/_partial_migration_3x_docker_to_4x_k3s.md"  >}}

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
