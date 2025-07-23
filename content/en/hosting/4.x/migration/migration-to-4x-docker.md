---
title: "Migration from CHT 3.x to CHT 4.x"
linkTitle: "To Docker Single-Node"
weight: 3
description: >
  Guide to migrate existent data from CHT 3.x to CHT 4.x
aliases:
  - /apps/guides/hosting/4.x/data-migration
---

The hosting architecture differs entirely between CHT-Core 3.x and CHT-Core 4.x. Migrating data from an existing instance running CHT 3.x requires a few manual steps.
This guide will present the required steps while using a migration helping tool, called `couchdb-migration`. This tool interfaces with CouchDb, to update shard maps and database metadata.
By the end of this guide, your CHT-Core 3.x CouchDb will be down and CHT-Core 4.x ready to be used.
Using this tool is not required, and the same result can be achieved by calling CouchDb endpoints directly. [Consult CouchDB documentation for details about moving shards](https://docs.couchdb.org/en/stable/cluster/sharding.html#moving-a-shard).

> [!TIP] 
> If after upgrading you get an error, `Cannot convert undefined or null to object` - please see [issue #8040](https://github.com/medic/cht-core/issues/8040) for a work around.  This only affects CHT 4.0.0, 4.0.1, 4.1.0 and 4.1.1.  It was fixed in CHT 4.2.0.

### 1. Install CHT data migration tool

Open your terminal and run these commands. They will create a new directory, download a docker compose file and download the required docker image.
```shell
mkdir -p ~/couchdb-migration/
cd ~/couchdb-migration/
curl -s -o ./docker-compose.yml https://raw.githubusercontent.com/medic/couchdb-migration/main/docker-compose.yml
docker compose up
```

For the following steps, the tool needs access to your CouchDb installation. To allow this access, you will need to provide a URL to your CouchDB installation that includes authentication.
If your installation exposes a different port for CouchDb cluster API endpoints, export that port.
If running against an installation of `MedicOS`, make sure that the protocol of the URL is `https`.

```shell
export COUCH_URL=http(s)://<authentication>@<host-ip>:<port>
```

For simplicity, you could store these required values in an `.env` file:
```shell
cat > ${HOME}/couchdb-migration/.env << EOF
COUCH_URL=http(s)://<authentication>@<host-ip>:<port>
EOF
```

### 2. Prepare CHT-Core 3.x installation for upgrading

Backup your data! If you encounter any problems executing the instructions of this guide, you should be able to restore your CHT 3X instance using the backup data.
[Consult information about backups for details](/hosting/3.x/self-hosting#backup).
Ensure no changes happen to your CouchDB data in your CHT 3.x server after you have begun the migration process.

To minimize downtime when upgrading, it's advised to prepare the 3.x installation for the 4.x upgrade, and pre-index all views that are required by 4.x.

The migration tool provides a command which will download all 4.x views to your 3.x CouchDb, and initiate view indexing. `<desired CHT version>` is any version at or above `4.0.0`:

```shell
cd ~/couchdb-migration/
docker compose run couch-migration pre-index-views <desired CHT version>
```

Once view indexing is finished, proceed with the next step.

> [!CAUTION] 
> If this step is omitted, 4.x API will fail to respond to requests until all views are indexed. Depending on the size of the database, this could take many hours, or even days. 

### 3. Save existent CouchDb configuration

Some CouchDb configuration values must be ported from existent CouchDb to the 4.x installation. Store them in a safe location before shutting down 3.x CouchDb.
Use the migration tool to obtain these values:
```shell
cd ~/couchdb-migration/
docker compose run couch-migration get-env
```

##### a) CouchDB secret
Used in encrypting all CouchDb passwords and session tokens.
##### b) CouchDb server uuid
Used in generating replication checkpointer documents, which track where replication progress between every client and the server, and ensure that clients don't re-download or re-upload documents.

### 4. Locate and make a copy of your CouchDb Data folder
a) If running in MedicOS, [CouchDb data folder](/hosting/3.x/self-hosting#backup) can be found at `/srv/storage/medic-core/couchdb/data`.

b) If running a custom installation of CouchDb, data would be typically stored at `/opt/couchdb/data`.

### 5. Stop your 3.x CouchDb / CHT-Core installation and launch 4.x CouchDb installation

Depending on your project scalability needs and technical possibilities, you must decide whether you will deploy CouchDb in a single node or in a cluster with multiple nodes.
Consult this guide about clustering and horizontal scalability to make an informed decision. <insert link>

> [!NOTE] 
> You can start with single node and then change to a cluster. This involves running the migration tool again to distribute shards from the existent node to the new nodes.

Depending on your choice, follow the instructions that match your deployment below:

#### Single node

a) Download 4.x single-node CouchDb docker-compose file:
```shell
mkdir -p ~/couchdb-single/
cd ~/couchdb-single/
curl -s -o ./docker-compose.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:<desired CHT version>/docker-compose/cht-couchdb.yml
```
a) Make a copy of the 3.x CouchDb data folder from **step 4**.

b) Set the correct environment variables:
```shell
cat > ${HOME}/couchdb-single/.env << EOF
COUCHDB_USER=<admin>
COUCHDB_PASSWORD=<password>
COUCHDB_SECRET=<COUCHDB_SECRET from step 3>
COUCHDB_UUID=<COUCHDB_UUID from step 3>
COUCHDB_DATA=<absolute path to folder created in step 5.a>
EOF
```

c) Start 4.x CouchDb.
```shell
cd ~/couchdb-single/
docker compose up -d
```

d) Update `couchdb-migration` environment variables. Depending on your setup, it's possible you will need to update `CHT_NETWORK` and `COUCH_URL` to match the newly started 4.x CouchDb.
From this point on, the `couchdb-migration` container should connect to the same docker network as your CouchDb installation, in order to access APIs that are only available on protected ports. Correctly setting `CHT_NETWORK` is required for the next steps to succeed.
To get the correct `docker-network-name` and `docker-service-name`, you can use `docker network ls` to list all networks and `docker network inspect <docker-network-name>` to get the name of the CouchDb container that exists in this network.

```shell
cat > ${HOME}/couchdb-migration/.env << EOF
CHT_NETWORK=<docker-network-name>
COUCH_URL=http://<authentication>@<docker-container-name>:<port>
EOF
```

e) Check that `couchdb-migration` can connect to the CouchDb instance and that CouchDb is running. You'll know it is working when the `docker compose` call exits without errors and logs `CouchDb is Ready`.
```shell
cd ~/couchdb-migration/
docker compose run couch-migration check-couchdb-up
```

f) Change metadata to match the new CouchDb node
```shell
cd ~/couchdb-migration/
docker compose run couch-migration move-node
```
g) Run the `verify` command to check whether the migration was successful.
```shell
docker compose run couch-migration verify
```
If all checks pass, you should see a message `Migration verification passed`. It is then safe to proceed with starting CHT-Core 4.x, using the same environment variables you saved in `~/couchdb-single/.env`.

h) [Remove unnecessary containers](#6-cleanup).

#### Multi node

a) Download 4.x clustered CouchDb docker-compose file:
```shell
mkdir -p ~/couchdb-cluster/
cd ~/couchdb-cluster/
curl -s -o ./docker-compose.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:<desired CHT version>/docker-compose/cht-couchdb-clustered.yml
```
b) Create a data folder for every one of the CouchDb nodes.
If you were going to a 3 cluster node, this would be:
```shell
mkdir -p ~/couchdb-data/main
mkdir -p ~/couchdb-data/secondary1
mkdir -p ~/couchdb-data/secondary2
```

c) Copy the 3.x CouchDb data folder into `~/couchdb-data/main`, which will be your main CouchDb node. This main node will create your cluster and the other secondary nodes will be added to it. In `main`'s environment variable file, define `CLUSTER_PEER_IPS`. In all other secondary nodes, declare the `COUCHDB_SYNC_ADMINS_NODE` variable instead.

d) Create a `shards` and a `.shards` directory in every secondary node folder.

e) Set the correct environment variables:
```shell
cat > ${HOME}/couchdb-cluster/.env << EOF
COUCHDB_USER=<admin>
COUCHDB_PASSWORD=<password>
COUCHDB_SECRET=<COUCHDB_SECRET from step 3>
COUCHDB_UUID=<COUCHDB_UUID from step 3>
DB1_DATA=<absolute path to main folder created in step 5.a>
DB2_DATA=<absolute path to secondary1 folder created in step 5.a>
DB3_DATA=<absolute path to secondary2 folder created in step 5.a>
EOF
```

f) Start 4.x CouchDb.
```shell
cd ~/couchdb-cluster/
docker compose up -d
```

g) Update `couchdb-migration` environment variables. Depending on your setup, it's possible you will need to update `CHT_NETWORK` and `COUCH_URL` to match the newly started 4.x CouchDb.
From this point on, the `couchdb-migration` container should connect to the same docker network as your CouchDb installation, in order to access APIs that are only available on protected ports. Correctly setting `CHT_NETWORK` is required for the next steps to succeed.
To get the correct `docker-network-name` and `docker-service-name`, you can use `docker network ls` to list all networks and `docker network inspect <docker-network-name>` to get the name of the CouchDb container that exists in this network.
```shell
cat > ${HOME}/couchdb-migration/.env << EOF
CHT_NETWORK=<docker-network-name>
COUCH_URL=http://<authentication>@<docker-container-name>:<port>
EOF
```

h) Check that `couchdb-migration` can connect to the CouchDb instance and that CouchDb is running. You'll know it is working when the `docker compose` call exits without errors and logs `CouchDb Cluster is Ready`.
```shell
cd ~/couchdb-migration/
docker compose run couch-migration check-couchdb-up <number-of-nodes>
```

i) Generate the shard distribution matrix and get instructions for final shard locations.
```shell
cd ~/couchdb-migration/
shard_matrix=$(docker compose run couch-migration generate-shard-distribution-matrix)
docker compose run couch-migration shard-move-instructions $shard_matrix
```

j) Follow the instructions from the step above and move the shard files to the correct location, according to the shard distribution matrix. This is a manual step that requires to physically move data around on disk.

Example of moving one shard from one node to another:

```shell
/couchdb_data_main
   /.delete
   /_dbs.couch
   /_nodes.couch
   /_users.couch
   /.shards
     /00000000-15555554
     /2aaaaaaa-3ffffffe
     /3fffffff-55555553
     /6aaaaaa9-7ffffffd
     /7ffffffe-95555552
     /15555555-2aaaaaa9
     /55555554-6aaaaaa8
     /95555553-aaaaaaa7
   /shards
     /00000000-15555554
     /2aaaaaaa-3ffffffe
     /3fffffff-55555553
     /6aaaaaa9-7ffffffd
     /7ffffffe-95555552
     /15555555-2aaaaaa9
     /55555554-6aaaaaa8
     /95555553-aaaaaaa7

/couchdb_data_secondary
   /.shards
   /shards
```
After moving two shards: `55555554-6aaaaaa8` and `6aaaaaa9-7ffffffd`
```shell
/couchdb_data_main
   /.delete
   /_dbs.couch
   /_nodes.couch
   /_users.couch
   /.shards
     /00000000-15555554
     /2aaaaaaa-3ffffffe
     /3fffffff-55555553
     /7ffffffe-95555552
     /15555555-2aaaaaa9
     /95555553-aaaaaaa7
   /shards
     /00000000-15555554
     /2aaaaaaa-3ffffffe
     /3fffffff-55555553
     /7ffffffe-95555552
     /15555555-2aaaaaa9
     /95555553-aaaaaaa7

/couchdb_data_secondary
   /.shards
     /6aaaaaa9-7ffffffd
     /55555554-6aaaaaa8
   /shards
     /6aaaaaa9-7ffffffd
     /55555554-6aaaaaa8
```
k) Change metadata to match the new shard distribution. We declared `$shard_matrix` in step "g" above, so it is still set now:

```shell
docker compose run couch-migration move-shards $shard_matrix
```

l) Remove old node from the cluster:
```shell
docker compose run couch-migration remove-node couchdb@127.0.0.1
```

j) Run the `verify` command to check whether the migration was successful.
```shell
docker compose run couch-migration verify
```
If all checks pass, you should see a message `Migration verification passed`. It is then safe to proceed with starting CHT-Core 4.x, using the same environment variables you saved in `~/couchdb-cluster/.env`.

k) [Remove unnecessary containers](#6-cleanup).

### 6. Cleanup

It's very important to remove temporary containers that were used during migration and containers that deployed the previous CHT-Core 3.x installation. Only follow this step after making sure your CHT-Core 4.x installation is ready and can be used.

> [!WARNING]
> Even if these containers are stopped, depending on their configuration, they could restart when the Docker engine is restarted, for example on system reboot.

##### Risks for not removing containers include
- resource contention - where your new CHT installation might not have access to certain resources (for example network ports) because they are already used.
- data corruption - when multiple CouchDb installations are accessing the same data source.
- data loss - when multiple CouchDb installation are exposing on the same port.

To get a list of all containers run:
```
docker ps -a
```

From this list, you should find the names for :
- containers that ran CHT-Core 3.x, likely named `medic-os` and `haproxy`.
- temporary single node CouchDb containers, likely named `couchdb-single-couchdb-1`
- temporary clustered CouchDb containers, likely named `couchdb-cluster-couchdb-2.local-1`, `couchdb-cluster-couchdb-1.local-1` and `couchdb-cluster-couchdb-3.local-1`

To remove containers, run these commands:
```
docker stop <container> <container> <container>
docker rm <container> <container> <container>
```


