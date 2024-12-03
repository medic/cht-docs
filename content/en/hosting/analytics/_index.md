---
title: Data Synchronization and Analytics
weight: 150
description: >
    Using CHT Sync for data synchronization and analytics
relatedContent: >
  core/overview/cht-sync
  core/overview/data-flows-for-analytics/
aliases:
    - /apps/guides/data/analytics/
    - /apps/guides/data/analytics/introduction
    - /building/guides/data/analytics/
    - /building/guides/data/analytics/introduction
---

{{% pageinfo %}}
The pages in this section apply to both CHT 3.x (beyond 3.12) and CHT 4.x. 
{{% /pageinfo %}}

Most CHT deployments require some sort of analytics so that stakeholders can make data driven decisions. CouchDB, which is the database used by the CHT, is not designed for analytics. It is a document database, which means that it is optimized for storing and retrieving documents, and not for aggregating data. For example, if you wanted to know how many patients were registered in a particular area, you would have to query the database for all the patients in that area, and then count them. This is not a very efficient process. It is much more efficient to store the number of patients in a particular area in a separate database, and update that number whenever a patient is registered or unregistered. This is what CHT Sync is designed to do.

[CHT Sync]({{< relref "core/overview/cht-sync" >}}) is an integrated solution designed to enable data synchronization between CouchDB and PostgreSQL for the purpose of analytics. It has been designed to work in both local development environments for testing models or workflows, and in production environments. It can be deployed using [Docker or Kubernetes]({{< relref "hosting/kubernetes-vs-docker" >}}). It is supported on CHT 3.12 and later, including CHT 4.x. By using CHT Sync, a CHT deployment can easily get analytics by using a [data visualization tool]({{< relref "hosting/analytics/dashboards" >}}), such as [Superset](https://superset.apache.org/). CHT Sync is open-source and has no licensing fees.
