---
toc_hide: true
hide_summary: true
---

The hosting architecture differs entirely between CHT-Core 3.x and CHT-Core 4.x. When migrating from Docker Compose to K3s, specific steps are required using the [couchdb-migration](https://github.com/medic/couchdb-migration) tool. This tool interfaces with CouchDB to update shard maps and database metadata.

{{% alert title="Note" %}}
If after upgrading you get an error, `Cannot convert undefined or null to object` - please see [issue #8040](https://github.com/medic/cht-core/issues/8040) for a work around. This only affects CHT 4.0.0, 4.0.1, 4.1.0 and 4.1.1. It was fixed in CHT 4.2.0.
{{% /alert %}}


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

{{% alert title="Note" %}} 
If pre-indexing is omitted, 4.x API will fail to respond to requests until all views are indexed. For large databases, this could take many hours or days.
{{% /alert %}}

## Save CouchDB Configuration
```shell
cd ~/couchdb-migration/
docker compose run couch-migration get-env
```

Save the output containing:
- CouchDB secret (used for encrypting passwords and session tokens)
- CouchDB server UUID (used for replication checkpointing)
- CouchDB admin credentials

The next part of  the guide assumes your K3s cluster is already prepared. If not, please run the set of commands [here](https://docs.k3s.io/quick-start).

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
