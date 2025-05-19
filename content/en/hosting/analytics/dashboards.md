---
title: "Data visualization"
weight: 7
linkTitle: "Dashboards"
description: >
  Data visualization tools for CHT Sync
relatedContent: >
  technical-overview/architecture
  technical-overview/cht-sync
---

{{< callout >}}
  These instructions assume you are running CHT Sync, CHT Core and PostgreSQL either with [Kubernetes]({{< relref "hosting/analytics/setup-kubernetes" >}}) or [Docker]({{< relref "hosting/analytics/setup-docker-compose" >}}).
{{< /callout >}}

## Superset
To build data visualization dashboards, follow the [Superset instructions](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose/) to run Superset and connect it to the PostgreSQL database. It is recommended that a way to track Superset changes be added via a git repository or any other version control system to make it easier to track changes over time and potentially catch and remediate bugs and regressions. Instructions on how to do this using a GitHub action can be found [in the cht-sync repository](https://github.com/medic/cht-sync/blob/main/.github/actions/superset-backup/README.md).
