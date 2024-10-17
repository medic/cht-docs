---
title: "Production CHT Sync Setup"
weight: 5
linkTitle: "Production CHT Sync Setup"
description: >
  Setting up a production deployment of CHT Sync with the CHT
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
aliases:
   - /apps/guides/data/analytics/production
---

We recommend running [CHT Sync](https://github.com/medic/cht-sync) in production using Kubernetes. This guide will walk you through setting up a production deployment of CHT Sync with the CHT using Kubernetes.

## Prerequisites:
- A Kubernetes cluster: You can use a managed Kubernetes service like Google Kubernetes Engine (GKE), Amazon Elastic Kubernetes Service (EKS), or Azure Kubernetes Service (AKS), or you can set up a cluster using a tool like Minikube.
- kubectl: The Kubernetes command-line tool. You can install it using the [kubectl installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) instructions.
- Helm: The Kubernetes package manager. You can install it using the [helm installation guide](https://helm.sh/docs/intro/install/).

## Database disk space requirements
The disk space required for the database depends on a few things including the size the of CouchDB databases being replicated, and the [models]({{< relref "hosting/analytics/building-dbt-models" >}}) defined. The database will grow over time as more data is added to CouchDB. The database should be monitored to ensure that it has enough space to accommodate the data. To get an idea of the size requirements of the database, you can replicate 10% of the data from CouchDB to Postgres and then run the following command to see disk usage:
```shell
SELECT pg_size_pretty(pg_database_size('your_database_name'));
```

If Postgres is running in a Kubernetes cluster, you can use the following command to get the disk usage:
```shell
kubectl exec -it postgres-pod-name -- psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('your_database_name'));"
```

You can then multiply this figure by 10 to get an estimate of the disk space required for the full dataset and then add some extra space for indexes and other overhead as well as future growth.

For example if the size of the database is 1GB, you can expect the full dataset to be around 10GB. If the CouchDB docs grow by 20% every year then you can compound this growth over 5 years to get an estimate of the disk space required: `10GB * 1.2^5 = 18.5GB`. You can add an extra 20% for indexes and overhead to get an estimate of 22.2GB.

Please note that this is just an estimate and the actual disk space required may vary so actively monitoring the disk space usage and making necessary adjustments is recommended.

## Setup
- Using `git`, clone the  [CHT Sync repository from GitHub](https://github.com/medic/cht-sync): `git clone https://github.com/medic/cht-sync.git`
- In the `cht-sync` folder, copy the values in `deploy/cht_sync/values.yaml.template` file to a new file named `deploy/cht_sync/values.yaml`.
- If you require a Postgres database to be set up in the cluster, you can use the `postgres.enabled` flag in the `values.yaml` file. If you already have a Postgres database outside the cluster, you can set the `postgres.enabled` flag to `false`.
- If outside the cluster, specify `host` and `port` in this section
- In either case, specify `user`, `password`, `db`, `schema`, and `table`
  - `schema` can be used to separate CHT models from any other data that may already be in the database
  - `table` is the name of the table that couch2pg will write couch documents to, and the source table for dbt models. It is recommended to leave this as `couchdb`.
```yaml
postgres:
  enabled: true
  user: "postgres"
  password: ""
  db: ""
  schema: "v1"
  table: "couchdb"
```
- Set CouchDB shared values in the `values.yaml` file.
```yaml
couchdb:
  user: "your_couchdb_user"
  dbs: "medic"
  port: "443"
  secure: "true"
```
- Configure the CouchDB instance to be replicated in the `values.yaml` file. For the host, use the CouchDB host URL used to publicly access the instance and for the password, use the password associated with the user set above.
```yaml
couchdbs:
  - host: "host1.cht-core.test"
    password: "password1"
```
- If you have multiple CouchDB instances to replicate, you can add them to the `couchdbs` list.
```yaml
couchdbs:
  - host: "host1.cht-core.test"
    password: "password1"
  - host: "host2.cht-core.test"
    password: "password2"
```
- If an instance has a different port, user or different CouchDB databases to be synced, you can specify it in the `couchdbs` list.
```yaml
  - host: "host1" # required for all couchdb instances
    password: "" # required for all couchdb instances
  - host: "host2.cht-core.test"
    password: "new_password"
    user: "separate_user"
    dbs: "medic medic_sentinel"
    port: "5984"
    secure: "false"
  - host: "host3.cht-core.test"
    password: "password3"
  ```

- Set the cht-pipeline branch URL in the `values.yaml` file.
```yaml
cht_pipeline_branch_url: "https://github.com/medic/cht-pipeline.git#main"
```
- (Optional) Configure the Metrics Exporter. If enabled, this will create a sql exporter that queries the database for couch2pg status, number of changes pending, and current sequence and exposes these metrics in prometheus format at a service with name `metrics` at port 9399, for use with [CHT Watchdog]({{< relref "hosting/monitoring/setup" >}}) or any other monitoring service.
An HTTP ingress needs to be created to allow access from outside the cluster.
```yaml
metrics_exporter:
  enabled: true
```
## Deploy
Run the command below to deploy the cht-sync helm chart. The chart is at `deploy/cht_sync`, if values.yaml is in a different directory, specify the path.
```shell
cd deploy/cht_sync
helm install cht-sync . --values values.yaml
```
## Verify the deployment
Run the following command to get the status of the deployment.
```shell
kubectl get pods
```
Run the following command to get the logs of a pod.
```shell
kubectl logs -f cht-sync-<pod-id>
```
