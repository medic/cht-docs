---
title: "CHT Sync Setup with Kubernetes"
weight: 2
linkTitle: "Kubernetes"
description: >
  Setting up CHT Sync with Kubernetes and the CHT
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
aliases:
    - /apps/guides/data/analytics/production
    - /building/guides/data/analytics/production
---

This guide will walk you through setting up a deployment of CHT Sync with the CHT using Kubernetes. This path is recommended if you already have a Kubernetes cluster [hosting the CHT]({{< relref "hosting/4.x/production/kubernetes" >}}).

## Prerequisites

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- A Kubernetes cluster: You can use a managed Kubernetes service like Google Kubernetes Engine (GKE), Amazon Elastic Kubernetes Service (EKS), or Azure Kubernetes Service (AKS), or you can set up a cluster using a tool like Minikube.
- kubectl: The Kubernetes command-line tool. You can install it using the [kubectl installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) instructions.
- Helm: The Kubernetes package manager. You can install it using the [helm installation guide](https://helm.sh/docs/intro/install/).
- [cht-sync](https://github.com/medic/cht-sync) GitHub repository (can be cloned via `git clone https://github.com/medic/cht-sync`).

## Setup

In the `cht-sync` folder, copy the values in `deploy/cht_sync/values.yaml.template` file to a new file named `deploy/cht_sync/values.yaml`.

If you require a Postgres database to be set up in the cluster, you can use the `postgres.enabled` flag in the `values.yaml` file. If you already have a Postgres database outside the cluster, you can set the `postgres.enabled` flag to `false`. Also, if Postgres is outside the cluster, specify `host` and `port` in this section.

In either case, specify `user`, `password`, `db`, `schema`, and `table`.
  - `schema` can be used to separate CHT models from any other data that may already be in the database.
  - `table` is the name of the table that couch2pg will write couch documents to, and the source table for dbt models. It is recommended to leave this as `couchdb`.

```yaml
postgres:
  enabled: true
  user: "postgres"
  password: ""
  db: ""
  schema: "v1"
  table: "couchdb"
  host: "postgres" # if postgres is outside the cluster
  port: 5432 # if postgres is outside the cluster
```

Set CouchDB shared values in the `values.yaml` file.

```yaml
couchdb:
  user: "your_couchdb_user"
  dbs: "medic"
  port: "443"
  secure: "true"
```

Configure the CouchDB instance to be replicated in the `values.yaml` file. For the host, use the CouchDB host URL used to publicly access the instance and for the password, use the password associated with the user set above.

```yaml
couchdbs:
  - host: "host1.cht-core.test"
    password: "password1"
```

If you have multiple CouchDB instances to replicate, you can add them to the `couchdbs` list.

```yaml
couchdbs:
  - host: "host1.cht-core.test"
    password: "password1"
  - host: "host2.cht-core.test"
    password: "password2"
```

If an instance has a different port, user or different CouchDB databases to be synced, you can specify it in the `couchdbs` list.

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

Set the [cht-pipeline branch URL]({{< relref "hosting/analytics/building-dbt-models#setup" >}}) in the `values.yaml` file.

```yaml
cht_pipeline_branch_url: "https://github.com/medic/cht-pipeline.git#main"
```

(Optional) You can also configure a Metrics Exporter. If enabled, this will create a sql exporter that queries the database for couch2pg status, number of changes pending, and current sequence and exposes these metrics in Prometheus format at a service with name `metrics` at port 9399, for use with [CHT Watchdog]({{< relref "hosting/monitoring/setup" >}}) or any other monitoring service.

An HTTP ingress needs to be created to allow access from outside the cluster.

```yaml
metrics_exporter:
  enabled: true
```
## Deploy

Run the command below to deploy the CHT Sync helm chart. The chart is at `deploy/cht_sync`; if `values.yaml` is in a different directory, specify the path.

```shell
cd deploy/cht_sync
helm install cht-sync . --values values.yaml
```

### Verify the deployment

Run the following command to get the status of the deployment.

```shell
kubectl get pods
```

Run the following command to get the logs of a pod.

```shell
kubectl logs -f cht-sync-<pod-id>
```

### Tuning dbt

In production setups with large tables, it can be helpful to [tune how dbt runs]({{< relref "hosting/analytics/tuning-dbt" >}}).
To use threads or batching, set the corresponding values in the `values.yaml` file.

```yaml
dbt_thread_count: 3
dbt_batch_size: 100000
```

To use multiple dbt containers, specify the different selectors in a list called `dbt_selectors`.

This will create one pod running dbt for each entry, where each entry is passed to one dbt pod as a `--select` argument.

```yaml
dbt_selectors:
  - "package:cht_pipeline_base"
  - "tag:tag-one"
  - "tag:tag-two"
```

### Upgrading

To upgrade to a newer version of CHT Sync with kubernetes, run helm upgrade.
If there are any database changes that require a migration script, the major version will be changed and the changes detailed below.
After running any migrations scripts, restart containers with the new docker-compose.yml

```shell
cd deploy/cht_sync
helm upgrade cht-sync . --values values.yaml
```

#### Upgrading V1 to V2

V2 added the `source` column to the `couchdb` table, and several other columns to the metadata table.
To add these columns log in to the database and run this sql. 

```sql
  ALTER TABLE _dataemon ADD COLUMN IF NOT EXISTS manifest jsonb;
  ALTER TABLE _dataemon ADD COLUMN IF NOT EXISTS dbt_selector text;
  ALTER TABLE couchdb ADD COLUMN IF NOT EXISTS source varchar;
  CREATE INDEX IF NOT EXISTS source ON couchdb(source);
```
