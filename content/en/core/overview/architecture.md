---
title: "Architecture of CHT Instances"
linkTitle: "Architecture"
weight: 1
description: >
  The different pieces of a CHT project, how they interact, and what they're used for
---

## Overview

![Architecture of a CHT project](../../img/architecture.png)

## Server side

### CouchDB

A free and open source NoSQL database we use to store all our data, configuration, and even the application code. CouchDB is really good at replication which is the process of sending the data to another database and back again. See more at the [CouchDB](http://couchdb.apache.org) site.

### api

A NodeJS service which runs on the server as a wrapper around CouchDB. It provides security and APIs for browsers and integrations. It also includes a custom implementation of filtered replication to allow it to support more concurrent users. See more at the [Medic API site](https://github.com/medic/medic/tree/master/api) on Github.

### sentinel

Another NodeJS service running on the server, sentinel performs actions called transitions every time a document in CouchDB is added or modified. Some examples are validations, generating scheduled messages, automatic responses, creating patients, and sending alerts. See more at the [Medic Sentinel site](https://github.com/medic/medic/tree/master/sentinel) on Github. 

### PostgreSQL

A free and open source SQL database that we use for analytics queries for display in tools like klipfolio. We created a library called [couch2pg](https://github.com/medic/couch2pg) to replicate data from CouchDB into PostgreSQL. See more at the [PostgreSQL](https://www.postgresql.org) site.

## Client side

### cht-core

[cht-core](https://github.com/medic/cht-core) is composed of the following web applications:

#### CHT Web Application
The CHT Web Application is the main entry point for must users, providing a large variety of [features](https://docs.communityhealthtoolkit.org/apps/features/).

Click [here](https://github.com/medic/cht-core/tree/master/webapp) to see the application source code.

##### Technology
The CHT Web Application is [reactive](https://angular.io/guide/rx-library), responsive and a single page application built with [Angular](https://angular.io/) and [NgRx](https://ngrx.io) frameworks.

It uses an offline first strategy which means the data is stored on the client and all pages can load immediately regardless of whether the user has a fast connection, slow connection, or no connection at all. The data is stored in [PouchDB](https://pouchdb.com) which replicates changes back and forth in the background with the server CouchDB.

It uses [Enketo](https://enketo.org) to render configured xforms and help with styling and dynamic elements such as show/hide and validation rules.

It uses the [Nools](https://github.com/C2FO/nools) rules engine to compute the upcoming tasks and monthly targets of the users.

It uses the [Ngx-Bootstrap](https://github.com/valor-software/ngx-bootstrap) to integrate Bootstrap components in the Angular application.

It uses the [Ngx-translate](https://github.com/ngx-translate/core) for Angular framework to automatically translate the application labels. See [here](https://docs.communityhealthtoolkit.org/apps/reference/translations/) how to manage translations.

It uses [Karma](https://github.com/karma-runner/karma) and [MochaJS](https://mochajs.org/) to run the [application’s unit tests](https://github.com/medic/cht-core/tree/master/webapp/tests)

It uses [Protractor](https://www.protractortest.org/#/) to run the [application’s e2e tests](https://github.com/medic/cht-core/tree/master/tests/e2e)

It uses [Less](http://lesscss.org/) as a CSS preprocessor.

##### Structure

The CHT Web Application has the following high level structure: 

- **/js**: Contains the vanilla JavaScript scripts, for example: Enketo widgets, MomentJS locales, etc.
- **/ts**: Contains the Angular application source code which uses TypeScript.
  - **/actions**, **/effects**, **/reducers** and **/selectors**: Contain the implementation for the application’s reactive state which uses [NgRx](https://ngrx.io) framework.
  - **/components**, **/directives**, **/pipes**, **/providers** and **/services**: Contain the reusable elements from [Angular](https://angular.io/) framework.
  - **/modals**: Contains the all application’s modals components.
  - **/modules**: Contains the application’s modules, each of them has components that are associated to the modules’ routing.
- **/css**:  Contains the application’s style files. It uses [Less](http://lesscss.org/) as a CSS preprocessor. 
- **/fonts**: Contains the application fonts.
- **/img**: Contains the application static images.
#### App Management
[App Management](https://docs.communityhealthtoolkit.org/apps/features/admin/) is an interface for non-technical administrative users to manage users and settings.

Click [here](https://github.com/medic/cht-core/tree/master/admin) to see the application source code.

##### Technology
App Management is a single page application built with [AngularJS](https://angularjs.org) framework and implements [Redux](https://github.com/reduxjs/redux) to manage a reactive state.

It uses [PouchDB](https://pouchdb.com) to store the data and it replicates changes back and forth in the background with the server CouchDB.

It uses [Angular Translate](https://github.com/angular-translate/angular-translate) for AngularJS to automatically translate the application labels. See [here](https://docs.communityhealthtoolkit.org/apps/reference/translations/) how to manage translations.  

It uses [Karma](https://github.com/karma-runner/karma) and [MochaJS](https://mochajs.org/) to run the [application’s unit tests](https://github.com/medic/cht-core/tree/master/admin/tests)

It uses [Protractor](https://www.protractortest.org/#/) to run the [application’s e2e tests](https://github.com/medic/cht-core/tree/master/tests/e2e)

It uses [Less](http://lesscss.org/) as a CSS preprocessor.

##### Structure
- **/css**: Contains the application’s style files. It uses [Less](http://lesscss.org/) as a CSS preprocessor. 
- **/js**: Contains the application JavaScript code. 
  - **/actions**, **/reducers** and **/selectors**: Contain the implementation of [Redux](https://github.com/reduxjs/redux). 
  - **/controllers**, **/directives**, **/filters** and **/services**: Contain the reusable elements from [AngularJS](https://angularjs.org) framework.
  - **/modules**: Contains the vanilla JavaScript scripts.
- **/template**: Contains the application’s HTML templates that are used in the AngularJS components and directives.

### medic-android

[medic-android](https://github.com/medic/medic-android) application works in the browser or wrapped in the medic-android app which allows for project branding, sets the project URL, and hides browser elements like the URL bar.

## Other applications

### medic-gateway

[Medic Gateway](https://github.com/medic/medic-gateway) is an android app for sending and receiving SMS messages. Each SMS enabled project has one gateway running. It polls an api endpoint to write incoming SMS into the CouchDB and retrieve outgoing SMS to send.

### medic-collect

[medic-collect](https://github.com/medic/medic-collect) is an android app based on [Open Data Kit](https://opendatakit.org) to render xforms on the phone and send reports in to medic-gateway over SMS or directly to api over mobile data.

### medic-conf

[medic-conf](https://github.com/medic/medic-conf) is a command line utility for uploading configuration and bulk importing of records.
