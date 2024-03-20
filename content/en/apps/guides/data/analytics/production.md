---
title: "Production CHT Sync"
weight: 3
linkTitle: "Production CHT Sync"
description: >
  Production considerations for CHT Sync
relatedContent: >
  core/overview/architecture
  core/overview/cht-sync
---

## What it means to run in production

Running CHT in Production means running several components:

* **DBT**, **PostgREST**, **Logstash**. These are the main components of [cht-sync]({{< relref "core/overview/cht-sync" >}}) and details about deploying them can be found below.   
* **CouchDB**. In the context of this documentation, CouchDB will be more often run as part of the CHT Core, but it doesn't have to. This guide doesn't cover the deployment of CouchDB and it assumes a CouchDB instance exists. The [Hosting section]({{< relref "apps/guides/hosting" >}}) provides detailed instructions on how to deploy CHT Core. 
* **PostgreSQL**. This documentation assumes an instance of PostgreSQL exists. 
* (Optional) **Data Visualization Tool**. In order to build data analytics dashboards and better leverage CHT Sync, a data visualization tool such as [Apache Superset](https://superset.apache.org/) can be used.
