---
title: "CHT Sync"
linkTitle: "CHT Sync"
weight: 5
description: >
  Data synchronization tools to enable analytics
relatedContent: >  
  technical-overview/architecture
  technical-overview/data/analytics/data-flows-for-analytics/
  hosting/analytics/
aliases:
    - /core/overview/data-flows-for-analytics/cht-sync/
    - /core/overview/cht-sync/
    - /technical-overview/cht-sync/
---

CHT Sync is an integrated solution designed to enable data synchronization between CouchDB and PostgreSQL for the purpose of analytics. It combines several technologies to achieve this synchronization and provides an efficient workflow for data processing and visualization. The synchronization occurs in near real-time, ensuring that the data displayed on dashboards is up-to-date.

Read more about setting up [CHT Sync](//hosting/analytics).

<!-- make updates to this diagram on the google slides:            -->
<!-- https://docs.google.com/presentation/d/1j4jPsi-gHbiaLBfgYOyru1g_YV98PkBrx2zs7bwhoEQ/ -->
{{< figure src="cht-sync.png" link="cht-sync.png" class=" center col-8 col-lg-6" >}}

[CHT Sync](https://github.com/medic/cht-sync) replicates data from CouchDB to PostgreSQL in a near real-time manner. It listens to changes in the CHT database, and updates the analytics database accordingly.
It is not designed to be accessed by users, and it does not have a user interface. It is designed to be run on the same server as the CHT, but it can be run on a separate server if necessary. 

As CHT Sync puts all new data into a PostgreSQL database into a single table that has a `jsonb` column, this is not very useful for analytics. [cht-pipeline](https://github.com/medic/cht-pipeline) contains a set of SQL queries that transform the data in the `jsonb` column into a more useful format. It uses [dbt](https://www.getdbt.com/) to define the models that are translated into PostgreSQL tables or views, which makes it easier to query the data in the analytics platform of choice. 

#### couch2pg

[couch2pg](https://github.com/medic/cht-sync/tree/main/couch2pg) streams data from CouchDB and forwards it to PostgreSQL, ensuring near real-time updates.

#### PostgreSQL

A free and open source SQL database used for analytics queries. See more at the [PostgreSQL](https://www.postgresql.org) site.

#### dbt

Once the data is synchronized and stored in PostgreSQL, it undergoes transformation using predefined [dbt](https://www.getdbt.com/) models from the [cht-pipeline](https://github.com/medic/cht-pipeline). dbt is used to ingest raw JSON data from the PosgtreSQL database (`jsonb` column) and normalize it into a relational schema to make it easier to query. A daemon runs the dbt models, and it updates the database whenever the data in the `jsonb` column changes.

#### Data Visualization

We recommend [Apache Superset](https://superset.apache.org/) as the Data Visualization Tool. Superset is a free, open-source platform for data exploration and data visualization.

### CHT Core Framework & CouchDB

For more information on these technologies, see [CHT Core overview](/technical-overview/architecture).

