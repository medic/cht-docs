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

### 1. Prepare CHT-Core 3.x installation for upgrading
To minimize downtime when upgrading, it's advised to prepare the 3.x installation for the 4.x upgrade, and pre-index all views that ar required by 4.x.

We provide a script that will download all 4.x views on your 3.x CouchDb installation, and initiate view indexing. Once view indexing is finished, proceed with the next step.

{{% alert title="Note" %}} If this step is omitted, 4.x API will fail to respond to requests until all views are indexed. Depending on the size of the database, this could take many hours, or even days. {{% /alert %}} 

### 3. Save existent CouchDb configuration

Some CouchDb configuration values must be ported from existent CouchDb to the 4.x installation. Store them in a safe location before shutting down 3.x CouchDb.

#### a. CouchDB secret 
Used in encrypting all CouchDb passwords and session tokens. 

```shell
curl http(s)://<auth_instance>/_node/_local/_config/couch_httpd_auth/secret
```

#### b. CouchDb server uuid
Used in generating replication checkpointer documents, which track where replication progress between every client and the server, and ensure that clients don't re-download or re-upload documents. 
```shell
curl http(s)://<auth_instance>/_node/_local/_config/couchdb/uuid
```

#### c. CouchDb node name
Used by the data migration script to update database metadata.
```shell
curl http(s)://<auth_instance>/_membership | | jq ".all_nodes[0]"
``` 

### 3. Locate and backup CouchDb Data folder
a. If running in MedicOS, [CouchDb data folder]({{< relref "apps/guides/hosting/3.x/self-hosting#backup" >}}) can be found at `/srv/storage/medic-core/couchdb/data`.
b. If running a custom installation of CouchDb, data would be typically stored at `/opt/couchdb/data`

### 2. Launch 4.x CouchDb installation

#### a. Single node

- Make a copy of the 3.x CouchDb data folder from step 3. Export the new location as an environment variable: `COUCHDB_DATA`. 
- Set `COUCHDB_USER`, `COUCHDB_PASSWORD` environment variables
- set `COUCHDB_SECRET` environment variable with the value from step **3.a**.
- set `COUCHDB_UUID` environment variable with the value from step **3.b**.
- Start 4.x CouchDb.
- run data migration script
```shell
cht-data-migration rename-node <value from step 3.c>
```
- run data migration checks
```shell
cht-data-migration verify
```
If all checks pass, proceed with starting CHT-Core 4.x, using the environment variables indicated.  

#### b. Multi node

1) Create a data folder for every one of the future CouchDb nodes

2) Save a copy of the 3.x CouchDb data folder into one of the folders created above. This will serve as the main folder, while the orders will be secondary folders.

3) Create a `shards` and a `.shards` directory in every secondary folder 
4) Distribute the shards among nodes: 
   - Each shard has a corresponding folder in the `shards` and `.shards` folders. 
   - To move a shard data from main node to secondary, move the corresponding shard folders from `shards` and `.shards` of the main node to the corresponding shards in the secondary node.
   - You will most likely have 8 existent shards.
   - Equal distribution among nodes is advised, but not required.

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

Repeat this process until reaching desired distribution of shards.  

5) Start clustered 4.x CouchDb, passing the main folder to your main node as data volume, and your secondary folders to your secondary nodes, make note of this association. 
6) get the node names of your installation 
```shell
curl http(s)://<auth_instance>/_membership | | jq ".cluster_nodes"
```
- for every shard, run the migration tool to update database metadata: 
```shell
cht-data-migration move_shard <shard_name> <to_node>
```
where the `shard_name` is the name of the folder you moved, and `to_node` is the destination node of your shard. 
- run 
```shell
cht-data-migration remove_node <your_old_node_name>
```
- run migration checks
```shell
cht-data-migration verify
```
If all checks pass, proceed with installing CHT-Core 4.x, pointing CouchDb to use the same data folder you created above.





