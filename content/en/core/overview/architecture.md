---
title: "Architecture of CHT Instances"
linkTitle: "Architecture"
weight: 1
description: >
  The different pieces of a CHT project, how they interact, and what they're used for
---

## Overview

![Architecture of a CHT project](architecture.png)

## Server side

### CHT Core Framework

The cht-core product is the primary component of the CHT. The server comes with authentication, role based authorization, data security, and a range of protected data access endpoints. Read more detail in [cht-core GitHub repository](https://github.com/medic/cht-core).

#### api

A NodeJS service which runs on the server and provides security and APIs for browsers and integrations. It also includes a custom implementation of filtered replication to allow it to support more concurrent users. See more at the [CHT Core API repo](https://github.com/medic/cht-core/tree/master/api) on Github.

#### sentinel

Another NodeJS service running on the server, sentinel performs actions called transitions every time a document in CouchDB is added or modified. Some examples are validations, generating scheduled messages, automatic responses, creating patients, and sending alerts. See more at the [CHT Core Sentinel repo](https://github.com/medic/cht-core/tree/master/sentinel) on Github. 

#### CouchDB

A free and open source NoSQL database used to store all data and configuration. This can be multiple instances clustered together for additional scalability. CouchDB is really good at replication which is the process of sending the data to another database and back again, which makes it ideal for replicating data to the phone for offline access. See more at the [CouchDB](http://couchdb.apache.org) site.

#### nginx

Provides SSL termination and routes requests to API.

#### haproxy

Provides audit logging for any request that makes it to CouchDB so any data access or modification can be validated at a later date.

### CHT Sync

The cht-sync product is a suite of tools for extracting and normalizing data from the Core Framework's CouchDB and rendering the data in analytics dashboards to measure the performance of the program. Read more detail in [cht-sync GitHub repository](https://github.com/medic/cht-sync).

#### Logstash and PostgREST

[Logstash](https://www.elastic.co/logstash/) streams data from CouchDB and forwards it to [PostgREST](https://postgrest.org/en/stable/) which provides REST endpoints to store the data in the PostreSQL database.

#### PostgreSQL

A free and open source SQL database used for analytics queries. See more at the [PostgreSQL](https://www.postgresql.org) site.

#### DBT

[DBT](https://www.getdbt.com/) is used to ingest raw JSON data from the postgres database and normalize it into a relational schema to make it much easier to query.

#### Superset

[Apache Superset](https://superset.apache.org/) is a free an open source platform for creating data dashboards.

## Client side

### cht-core

[cht-core](https://github.com/medic/cht-core) is composed of two web applications:

#### CHT Web Application
The CHT Web Application is used by Community Health Workers and provides a large variety of [features](https://docs.communityhealthtoolkit.org/apps/features/).

View the source code in [our GitHub repository](https://github.com/medic/cht-core/tree/master/webapp).

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
