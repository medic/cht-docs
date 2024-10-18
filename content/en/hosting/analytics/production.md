---
title: "Production CHT Sync"
weight: 6
linkTitle: "Production"
description: >
  Production considerations for CHT Watchdog
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
aliases:
   - /apps/guides/data/analytics/production
---

Follow the installation guides to set up CHT Sync with [Kubernetes]({{< relref "hosting/analytics/setup-kubernetes" >}}) or [Docker Compose]({{< relref "hosting/analytics/setup-docker-compose" >}}).

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

## Setup Superset
To build data visualization dashboards, follow the [Superset instructions](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose/) to run Superset and connect it to the PostgreSQL database. It is recommended that a way to track Superset changes be added via a git repository or any other version control system to make it easier to track changes over time and potentially catch and remediate bugs and regressions. Instructions on how to do this using a GitHub action can be found [in the cht-sync repository](https://github.com/medic/cht-sync/blob/main/.github/actions/superset-backup/README.md).
