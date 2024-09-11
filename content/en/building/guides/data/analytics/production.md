---
title: "Production CHT Sync Setup"
weight: 3
linkTitle: "Production CHT Sync Setup"
description: >
  Setting up a production deployment of CHT Sync with the CHT
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
---

We recommend running [CHT Sync](https://github.com/medic/cht-sync) in production using Kubernetes. This guide will walk you through setting up a production deployment of CHT Sync with the CHT using Kubernetes.

## Prerequisites:
- A Kubernetes cluster: You can use a managed Kubernetes service like Google Kubernetes Engine (GKE), Amazon Elastic Kubernetes Service (EKS), or Azure Kubernetes Service (AKS), or you can set up a cluster using a tool like Minikube.
- kubectl: The Kubernetes command-line tool. You can install it using the [kubectl installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) instructions.
- Helm: The Kubernetes package manager. You can install it using the [helm installation guide](https://helm.sh/docs/intro/install/).

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
Run the command below to deploy the cht-sync helm chart. If installing from root, specify path to directory containing `chart.yaml` and `values.yaml`
```shell
helm install cht-sync cht-sync --values values.yaml
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
