---
title: "Data Flows for Analytics"
linkTitle: "Data Flows"
weight: 9
description: >
  Overview of data flows in the CHT for analytics, impact monitoring, and data science
relatedContent: >
  building/guides/data
  building/guides/database
aliases:
   - /core/data-flows-for-analytics
   - /core/overview/data-flows-for-analytics
   - /technical-overview/data-flows-for-analytics/
---

In this section, we focus on how data flows through the various components of the Community Health Toolkit. The CHT is built to support the delivery of quality community health care at the last mile. The CHT is designed to work in areas with low connectivity, which means it is an [Offline-First]({{< ref "technical-overview/concepts/offline-first" >}}) toolkit for care provision. The architectural and technology choices in the stack are mostly guided by this principle, which will be evident in the discussion of the data management pipeline.

## Overview

{{< figure src="data-flows.png" link="data-flows.png" caption="Data Flows" >}}

At a high level:

- Data are collected from the device of a health worker;
- Data are pushed to an online instance from where data are available to other health workers, supervisors, and decision makers;
- Data are transferred to a relational database (PostgreSQL) using [CHT Sync](https://github.com/medic/cht-sync) and made available for impact monitoring, data science projects, and visualizations;
- Access to PostreSQL is given to relevant parties at this level, for example members of the Research & Learning team for impact monitoring and data science;
- Visualization platforms, such as [Klipfolio](https://www.klipfolio.com/) or [Superset](https://superset.apache.org/), are then connected to PostgreSQL from where program managers and other partner representatives can access visualizations of their data for decision-making.


## Details of the data flow

The layout detailed here is specific to how Medic supports its CHT partners at the moment. It is replicable and can be deployed as is or tweaked independent of Medic either by modifying or replacing pieces of it with other options.

### Current infrastructure

We look at this in three general phases.

#### 1. Data Collection

Data is collected in the community at the point of care, i.e. the community health worker interacting with the toolkit. These tools and their corresponding data stores are::-

- Mobile app -> PouchDB
- Webapp -> PouchDB / CouchDB
- Text forms / sms -> SMS gateway / SMS aggregator -> CouchDB

The mobile app and webapp, when deployed for offline first use, use a local database namely PouchDB. Similar to CouchDB, it is a document-oriented database. The data collected in PouchDB is synced to an online CouchDB upon the user connecting to the internet. Local storage is not applicable to SMS; instead, an [SMS gateway](https://github.com/medic/cht-gateway) or an SMS aggregator (for example [Africa's Talking](https://africastalking.com)) is used to help get the data to an online CouchDB instance.

Ultimately all the data ends up in a CouchDB instance deployed in the cloud whether through data synchronization with PouchDB local to the health workers devices, use of SMS aggregators or gateway. It should be mentioned that you can have a deployment supported by all of webapp, mobile app and SMS and have all the data end up in the same CouchDB instance.

#### 2. Data Transformation

[CHT Sync]({{< relref "technical-overview/architecture/cht-sync" >}}) is used to move data from CouchDB to a relational database, PostgreSQL in this case. The choice of PostgreSQL for analytics dashboard data sources is to allow use of the more familiar SQL querying. It is an open source tool that can be [easily deployed]({{< ref "hosting/analytics" >}}). When deployed the service uses [CouchDB's changes feed](https://docs.couchdb.org/en/stable/api/database/changes.html) which allows capturing of everything happening in CouchDB in incremental updates. It is run and monitored by the operating system where it is configured to fetch data at a configurable interval.

Data copied over to PostgreSQL is first stored as raw json (document) making use of PostgreSQL's jsonb data type to create an exact replica of a CouchDB database. From this, default views are created at deployment of the service and refreshed during every subsequent run. Additional custom materialized views created later are also refreshed at this time.

Custom materialized views and functions are added specific to a deployment's needs. Generally the following naming convention is recommended:

- _formview_ as a view of raw forms
- _useview_ as a view of form data supporting a use case as defined by design
- _contactview_ as a view of people and places
- Database functions are used as a way to join as much relevant data as possible for easier querying in analytics or dashboard visualizations.

Data in the views and functions mentioned in this section is as accurate as the accuracy of the SQL queries. Best practice is to begin the process of defining these objects at design in order to align analytics and dashboards requirements with workflows being deployed.

#### 3. Data Use

The data in PostgreSQL is mostly either used by direct querying or via dashboard visualizations for impact monitoring and data driven-decision making. Database visualizations are built scoped to the requirements of supporting a successful deployment. The work of our Research & Learning team, specifically data science, is supported at the PostgreSQL level through updated contactviews, formviews, useviews and functions with access to these provided to relevant parties as and when needed. Our use of data follows our Privacy & Data Protection policy and is in accordance to agreements with our CHT partners.

As mentioned previously, formviews are built to present data in a structure similar to the data collection tool (form) used. Useviews are tailored to align with a use case, mostly using the formviews as the data sources. These are fundamentally guided by design of the workflows and should be interpreted in the context of the design materials including a document explaining the definitions of variables used.

The objects present here are not limited to views and functions. Additional tables can be added, for example providing mappings or supporting operations external to the functions available in the toolkit. In short, there is no limitation to the utility that can be added this level to support analytics and dashboards. That said, measures are taken to ensure controlled access, reliability and timely access of the data by the various parties. Some of these measures are:


- Roles and users allocation and deallocation done by specific roles within partner technical teams with support from Medic as needed;
- Access control management is left to the partner technical teams where possible;
- Dashboard data source refresh intervals set to align with project needs;
- Update of the data sources monitored to ensure updating works as expected;
- Review of the dashboards as part of the design process;
- Qualitative design activities to interrogate trends observed in the dashboards and iterate on them if need be;

### Beyond Our Current Pipeline

The [cht-core](https://github.com/medic/cht-core) is mostly data collection tools and is the first component of the data management pipeline. It is the core part of a deployment but the rest of the tools can be easily replaced with other preferred options. It also helps that CHT Sync is an open source tool which provides the opportunity for collaboration to extend its functionality to support other implementations. Klipfolio, the tool that we currently use for visualizations, is a proprietary tool but there are many open source options, such as [Apache Superset](https://superset.incubator.apache.org/) that are worth exploring and building into future iterations of our impact monitoring and analytics support for the CHT.

## Backup

The machines running each of CouchDB and PostgreSQL instances are backed up daily.
