---
title: "Architecture of CHT Instances"
linkTitle: "Architecture"
weight: 1
description: >
  The different pieces of a CHT project, how they interact, and what they're used for
---

## Overview

### CHT Core test

```mermaid
flowchart TB

linkStyle default stroke-width:1px

subgraph client
  classDef client_node fill:#dfeaea,stroke:#7cb3b3
  classDef client_device_node fill:#f0f4fd,stroke:#84a1f0
  
  subgraph app_browser[App Browser]
    pouchdb[(PouchDB)]:::client_node
    style app_browser fill:#dfeaea,stroke:#7cb3b3
  end
  
  subgraph app_android[Android App]
    app_android_browser[Browser]:::client_node
    style app_android fill:#dfeaea,stroke:#7cb3b3
  end
  
  integrations["Integrations
    with other
    systems"]:::client_node
  sms_aggregator["SMS 
    aggregator"]:::client_node
  sms_gateway["SMS 
    gateway"]:::client_node
  feature_phones[Feature phones]:::client_device_node
  smartphones_tables_computers["Smartphones, tablets, 
    and computers"]:::client_device_node
  feature_phones <--> sms_gateway & sms_aggregator
  smartphones_tables_computers <--> app_browser & app_android
end

subgraph server
  subgraph cht_core[CHT Core Framework]
    classDef cht_core_node fill:#eef5f9,stroke:#68a5c8
    couchdb[(CouchDB)]:::cht_core_node
    haproxy(HAProxy):::cht_core_node
    upgrade_service("Upgrade 
      Service"):::cht_core_node
    api(API):::cht_core_node
    sentinel(Sentinel):::cht_core_node
    nginx(NGINX):::cht_core_node
    haproxy --> couchdb
    api --> upgrade_service & haproxy
    sentinel --> api
    nginx --> api
    style cht_core fill:none,stroke:#68a5c8,stroke-width:1px,color:#68a5c8
  end
  
end

integrations & pouchdb & app_android_browser & sms_aggregator & sms_gateway <--> nginx

classDef outer_group fill:none,stroke-dasharray: 5 5
class client,server outer_group
```

### CHT Core + Sync Test

```mermaid
flowchart TB

linkStyle default stroke-width:1px

subgraph client
  classDef client_node fill:#dfeaea,stroke:#7cb3b3
  classDef client_device_node fill:#f0f4fd,stroke:#84a1f0
  
  subgraph app_browser[App Browser]
    pouchdb[(PouchDB)]:::client_node
    style app_browser fill:#dfeaea,stroke:#7cb3b3
  end
  
  subgraph app_android[Android App]
    app_android_browser[Browser]:::client_node
    style app_android fill:#dfeaea,stroke:#7cb3b3
  end
  
  integrations["`Integrations
    with other
    systems`"]:::client_node
  browser[Browser]:::client_node
  sms_aggregator["`SMS 
    aggregator`"]:::client_node
  sms_gateway["`SMS 
    gateway`"]:::client_node
  feature_phones[Feature phones]:::client_device_node
  smartphones_tables_computers["`Smartphones, tablets, 
    and computers`"]:::client_device_node
  feature_phones <--> sms_gateway & sms_aggregator
  smartphones_tables_computers <--> app_browser & app_android
end

subgraph server
  subgraph cht_core[CHT Core Framework]
    classDef cht_core_node fill:#eef5f9,stroke:#68a5c8
    couchdb[(CouchDB)]:::cht_core_node
    haproxy(HAProxy):::cht_core_node
    upgrade_service("`Upgrade 
      Service`"):::cht_core_node
    api(API):::cht_core_node
    sentinel(Sentinel):::cht_core_node
    nginx(NGINX):::cht_core_node
    haproxy --> couchdb
    api --> upgrade_service & haproxy
    sentinel --> api
    nginx --> api
    style cht_core fill:none,stroke:#68a5c8,stroke-width:1px,color:#68a5c8
  end

  subgraph cht_sync[CHT Sync]
    classDef cht_sync_node fill:#fcf6e7,stroke:#ebb338
    postgres[(PostgreSQL)]:::cht_sync_node
    postgrest(PostgREST):::cht_sync_node
    dbt(DBT):::cht_sync_node
    logstash(Logstash):::cht_sync_node
    superset(Superset):::cht_sync_node
    postgrest --> postgres
    dbt --> postgres
    logstash --> postgrest
    superset ----> postgres    
    style cht_sync fill:none,stroke:#ebb338,stroke-width:1px,color:#ebb338
  end

  couchdb --> logstash
end

browser <--> superset
integrations & pouchdb & app_android_browser & sms_aggregator & sms_gateway <--> nginx

classDef outer_group fill:none,stroke-dasharray: 5 5
class client,server outer_group
```

## Server

### CHT Core Framework

The cht-core product is the primary component of the CHT. The server comes with authentication, role based authorization, data security, and a range of protected data access endpoints. Read more detail in [cht-core GitHub repository](https://github.com/medic/cht-core).

#### API

A NodeJS service which runs on the server and provides security and APIs for browsers and integrations. It also includes a custom implementation of filtered replication to allow it to support more concurrent users. See more at the [CHT Core API repo](https://github.com/medic/cht-core/tree/master/api) on Github.

#### Sentinel

Another NodeJS service running on the server, sentinel performs actions called transitions every time a document in CouchDB is added or modified. Some examples are validations, generating scheduled messages, automatic responses, creating patients, and sending alerts. See more at the [CHT Core Sentinel repo](https://github.com/medic/cht-core/tree/master/sentinel) on Github. 

#### CouchDB

A free and open source NoSQL database used as the primary store for all app data and configuration. This can be multiple instances clustered together for additional scalability. CouchDB is really good at replication which is the process of sending the data to another database and back again, which makes it ideal for replicating data to the phone for offline access. See more at the [CouchDB](http://couchdb.apache.org) site.

#### NGINX

[NGINX](https://www.nginx.com/) provides SSL termination and routes requests to API.

#### HAProxy

[HAProxy](https://www.haproxy.com/) provides audit logging for any request that makes it to CouchDB so any data access or modification can be validated at a later date.

### CHT Upgrade Service

The CHT Upgrade Service is used within the CHT to update individual Docker containers when an upgrade is requested. Read more detail in the [cht-upgrade-service GitHub repository](https://github.com/medic/cht-upgrade-service/).

### CHT Sync

A suite of tools for extracting and normalizing data from the Core Framework's CouchDB, and rendering the data in analytics dashboards to visualize key data for a CHT deployment. Read more detail in [cht-sync GitHub repository](https://github.com/medic/cht-sync).

#### Logstash and PostgREST

[Logstash](https://www.elastic.co/logstash/) streams data from CouchDB and forwards it to [PostgREST](https://postgrest.org/en/stable/) which provides REST endpoints to store the data in the PostreSQL database.

#### PostgreSQL

A free and open source SQL database used for analytics queries. See more at the [PostgreSQL](https://www.postgresql.org) site.

#### DBT

[DBT](https://www.getdbt.com/) is used to ingest raw JSON data from the postgres database and normalize it into a relational schema to make it much easier to query.

#### Superset

[Apache Superset](https://superset.apache.org/) is a free an open source platform for creating data dashboards.

## Client

### CHT Core Framework

The CHT Core Framework provides two web applications: the [CHT Web App]({{% ref "#cht-web-application" %}}) for care teams and program staff, and [App Management]({{% ref "#app-management" %}}) for program administrators.

#### CHT Web Application
The CHT Web Application is used by Community Health Workers and provides a large variety of [features](https://docs.communityhealthtoolkit.org/apps/features/). View the source code in [our GitHub repository](https://github.com/medic/cht-core/tree/master/webapp).

##### Technology
The CHT Web Application is [reactive](https://angular.io/guide/rx-library), responsive and a single page application built with [Angular](https://angular.io/) and [NgRx](https://ngrx.io) frameworks. Additionally, it uses the following technology:

| Technology                                                       | Usage                                                                                                                                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PouchDB](https://pouchdb.com)                                   | To implement an [Offline-First]({{< ref "core/overview/offline-first" >}}) strategy which means the data is stored on the client and all pages can load immediately regardless of whether the user has a fast connection, slow connection, or no connection at all. The data is stored in PouchDB which replicates changes back and forth in the background with the server CouchDB. |
| [Enketo](https://enketo.org)                                     | To render configured xforms and help with styling and dynamic elements such as show/hide and validation rules.                                                                         |
| [Nools](https://github.com/C2FO/nools)                           | A rules engine to compute the upcoming tasks and monthly targets of the users.                                                                                                         |
| [Ngx-Bootstrap](https://github.com/valor-software/ngx-bootstrap) | To integrate Bootstrap components in the Angular application.                                                                                                                          |
| [Ngx-translate](https://github.com/ngx-translate/core)           | To automatically translate the labels from a Angular application. Read more about [how to configure translations](https://docs.communityhealthtoolkit.org/apps/reference/translations/). |
| [Karma](https://github.com/karma-runner/karma)                   | A test runner for [unit tests](https://github.com/medic/cht-core/tree/master/webapp/tests)                                                                                             |
| [MochaJS](https://mochajs.org/)                                  | A test framework to run the [unit tests](https://github.com/medic/cht-core/tree/master/webapp/tests)                                                                                   |
| [Protractor](https://www.protractortest.org/#/)                  | To run the [e2e tests](https://github.com/medic/cht-core/tree/master/tests/e2e)                                                                                                        |
| [Less](http://lesscss.org/)                                      | A CSS preprocessor                                                                                                                                                                     |

##### Structure

The CHT Web Application has the following high level structure:

- **/js**: Contains the vanilla JavaScript scripts, for example: Enketo widgets, MomentJS locales, etc.
- **/ts**: Contains the Angular application source code which uses TypeScript.
  - **/actions**, **/effects**, **/reducers** and **/selectors**: Contain the implementation for the application’s reactive state which uses [NgRx](https://ngrx.io) framework.
  - **/components**, **/directives**, **/pipes**, **/providers** and **/services**: Contain the reusable elements from [Angular](https://angular.io/) framework.
  - **/modals**: Contains the all application’s modals components.
  - **/modules**: Contains the application’s modules, each of them has components that are associated to the modules’ routing.
- **/css**:  Contains the style files. It uses [Less](http://lesscss.org/) as a CSS preprocessor.
- **/fonts**: Contains the fonts.
- **/img**: Contains the static images.

#### App Management
[App Management](https://docs.communityhealthtoolkit.org/apps/features/admin/) is an interface for non-technical administrative users to manage users and settings.

View the application source code in [our GitHub repository](https://github.com/medic/cht-core/tree/master/admin).

##### Technology
App Management is a single page application built with [AngularJS](https://angularjs.org) framework and implements [Redux](https://github.com/reduxjs/redux) to manage a reactive state. Additionally, it uses the following technology:

| Technology                                                                  | Usage                                                                                                                                                                                   |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Angular Translate](https://github.com/angular-translate/angular-translate) | To automatically translate the labels from a AngularJS application. Read more about [how to manage translations](https://docs.communityhealthtoolkit.org/apps/reference/translations/). |
| [Karma](https://github.com/karma-runner/karma)                              | A test runner for [unit tests](https://github.com/medic/cht-core/tree/master/admin/tests)                                                                                               |
| [MochaJS](https://mochajs.org/)                                             | A test framework to run the [unit tests](https://github.com/medic/cht-core/tree/master/admin/tests)                                                                                     |
| [Protractor](https://www.protractortest.org/#/)                             | To run the [e2e tests](https://github.com/medic/cht-core/tree/master/tests/e2e)                                                                                                         |
| [Less](http://lesscss.org/)                                                 | A CSS preprocessor                                                                                                                                                                      |

##### Structure
- **/css**: Contains style files. It uses [Less](http://lesscss.org/) as a CSS preprocessor.
- **/js**: Contains the JavaScript code.
  - **/actions**, **/reducers** and **/selectors**: Contain the implementation of [Redux](https://github.com/reduxjs/redux).
  - **/controllers**, **/directives**, **/filters** and **/services**: Contain the reusable elements from [AngularJS](https://angularjs.org) framework.
  - **/modules**: Contains the vanilla JavaScript scripts.
- **/template**: Contains the HTML templates that are used in the AngularJS components and directives.

### cht-android

CHT Web Application works in the browser or wrapped in the [CHT Android](https://github.com/medic/cht-android) app which allows for project branding, sets the project URL, and hides browser elements like the URL bar.

## Other applications

### cht-gateway

[CHT Gateway](https://github.com/medic/cht-gateway) is an android app for sending and receiving SMS messages. Each SMS enabled project has one gateway running. It polls an api endpoint to write incoming SMS into the CouchDB and retrieve outgoing SMS to send.

### medic-collect

[Medic Collect](https://github.com/medic/medic-collect) is an android app based on [Open Data Kit](https://opendatakit.org) to render xforms on the phone and send reports in to cht-gateway over SMS or directly to api over mobile data.

### cht-conf

[cht-conf](https://github.com/medic/cht-conf) is a command line utility for uploading configuration and bulk importing of records.
