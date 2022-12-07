---
title: "Upgrading from CHT 3.x to CHT 4.x"
linkTitle: "Upgrading to 4.x"
weight: 10
description: >
  How to upgrade from CHT 3.x to CHT 4.x
aliases:
relatedContent: >
---

The hosting architecture differs entirely between CHT-Core 3.x and CHT-Core 4.x. Thus upgrading involves some manual steps.

### 0. Ensure all clients have successfully synced
This is not necessary. Should this be a step?

### 1. Install CHT data migration tool

Open your terminal and run these commands. They will create a new directory, download a docker compose file and download the required docker image. 
```shell
mkdir -p ~/couchdb-migration/ 
cd ~/couchdb-migration/ 
curl -s -o ./docker-compose.yml https://github.com/medic/couchdb-migration/blob/main/docker-compose.yml
docker-compose up
```

For the following steps, the tool needs access to your CouchDb installation. To provide this access, you will need to provide a URL that includes authentication. 
Additionally, if your CouchDb runs in docker, the tool needs to be added to the same docker network in order to access protected endpoints:

```shell
export COUCH_URL=http://admin:pass@127.0.0.1:5984
```
or 
```shell
export CHT_NETWORK=<docker-network-name>
export COUCH_URL=http://admin:pass@docker-service-name:5984
```

For simplicity, you could store these required values in an `.env` file: 
```shell
cat > ${HOME}/couchdb-migration/.env << EOF
CHT_NETWORK=cht-net
COUCH_URL=http://admin:pass@127.0.0.1:5984
EOF
```

### 2. Prepare CHT-Core 3.x installation for upgrading
To minimize downtime when upgrading, it's advised to prepare the 3.x installation for the 4.x upgrade, and pre-index all views that ar required by 4.x.

The migration tool provides a command which will download all 4.x views on your 3.x CouchDb installation, and initiate view indexing.

```shell
cd ~/couchdb-migration/ 
docker-compose run couch-migration pre-index-views 4.1.0
```

Once view indexing is finished, proceed with the next step.

{{% alert title="Note" %}} If this step is omitted, 4.x API will fail to respond to requests until all views are indexed. Depending on the size of the database, this could take many hours, or even days. {{% /alert %}} 

### 3. Save existent CouchDb configuration

Some CouchDb configuration values must be ported from existent CouchDb to the 4.x installation. Store them in a safe location before shutting down 3.x CouchDb.

##### a. CouchDB secret 
Used in encrypting all CouchDb passwords and session tokens.
##### b. CouchDb server uuid
Used in generating replication checkpointer documents, which track where replication progress between every client and the server, and ensure that clients don't re-download or re-upload documents.

Use the migration tool to obtain these values.
```shell
cd ~/couchdb-migration/ 
docker-compose run couch-migration get-env
```

### 4. Locate and backup CouchDb Data folder
a) If running in MedicOS, [CouchDb data folder]({{< relref "apps/guides/hosting/3.x/self-hosting#backup" >}}) can be found at `/srv/storage/medic-core/couchdb/data`.

b) If running a custom installation of CouchDb, data would be typically stored at `/opt/couchdb/data`.

c) TODO when using orchestration / AWS 

### 5. Launch 4.x CouchDb installation

#### Single node

a) Download 4.x single-node CouchDb docker-compose file:
```shell
mkdir -p ~/couchdb-single/ 
cd ~/couchdb-single/ 
curl -s -o ./docker-compose.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.1.0/docker-compose/cht-couchdb.yml
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
c) Start 4.x CouchDb and wait until it is up.
```shell
cd ~/couchdb-single/ 
docker-compose up -d
cd ~/couchdb-migration/ 
docker-compose run couch-migration check-couchdb-up
```

d) Change metadata to match the new CouchDb node
```shell
cd ~/couchdb-migration/ 
docker-compose run couch-migration move-node
```
e) Verify that the migration was successful
```shell
docker-compose run couch-migration verify
```
If all checks pass, proceed with starting CHT-Core 4.x, using the same environment variables.   

#### Multi node

a) Download 4.x clustered CouchDb docker-compose file:
```shell
mkdir -p ~/couchdb-cluster/ 
cd ~/couchdb-cluster/ 
curl -s -o ./docker-compose.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.1.0/docker-compose/cht-couchdb-clustered.yml
```
b) Create a data folder for every one of the CouchDb nodes.

c) Copy the 3.x CouchDb data folder into your main CouchDb node's folder. Your main node will be creating your cluster and adding the other secondary nodes to the cluster. You can tell which is your main node by checking your CouchDb docker compose files and identifying which service receives the `CLUSTER_PEER_IPS` environment variable. Your secondary nodes will receive `COUCHDB_SYNC_ADMINS_NODE` variable instead.  

d) Create a `shards` and a `.shards` directory in every secondary node folder. 

e) Set the correct environment variables:
```shell
cat > ${HOME}/couchdb-cluster/.env << EOF
COUCHDB_USER=<admin>
COUCHDB_PASSWORD=<password>
COUCHDB_SECRET=<COUCHDB_SECRET from step 3>
COUCHDB_UUID=<COUCHDB_UUID from step 3>
COUCHDB1_DATA=<absolute path to main folder created in step 5.a>
COUCHDB2_DATA=<absolute path to secondary folder created in step 5.a>
COUCHDB3_DATA=<absolute path to secondary folder created in step 5.a>
EOF
```

f) Start 4.x CouchDb and wait until it is up.
```shell
cd ~/couchdb-cluster/ 
docker-compose up -d
cd ~/couchdb-migration/ 
docker-compose run couch-migration check-couchdb-up
```

g) Generate the shard distribution matrix and get instructions for final shard locations. 
```shell
cd ~/couchdb-migration/ 
shard_matrix=$(docker-compose run couch-migration generate-shard-distribution-matrix)
docker-compose run couch-migration shard-move-instructions $shard_matrix
``` 

h) Follow the instructions from the step above and move the shard files to the correct location, according to the shard distribution matrix. 

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
i) Change metadata to match the new shard distribution. You will be using the same `shard_matrix` as the step above. 

```shell
docker-compose run couch-migration move-shards $shard_matrix
``` 

j) Verify that the migration was successful
```shell
docker-compose run couch-migration verify
```
If all checks pass, proceed with starting CHT-Core 4.x, using the environment variables indicated.  
