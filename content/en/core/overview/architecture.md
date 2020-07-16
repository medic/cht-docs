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

[cht-core](https://github.com/medic/cht-core) is the application that most users interact with. It's an [AngularJS](https://angularjs.org) single page responsive web application.

We use an offline first strategy which means the data is stored on the client and all pages can load immediately regardless of whether you have a fast connection, slow connection, or no connection at all. The data is stored in [PouchDB](https://pouchdb.com) which replicates changes back and forth in the background with the server CouchDB.

We use [Enketo](https://enketo.org) to render configured xforms and help with styling and dynamic elements such as show/hide and validation rules.

We use the [nools](https://github.com/C2FO/nools) rules engine to compute the upcoming tasks and monthly targets of the users.

### medic-android

[medic-android](https://github.com/medic/medic-android) application works in the browser or wrapped in the medic-android app which allows for project branding, sets the project URL, and hides browser elements like the URL bar.

## Other applications

### medic-gateway

[Medic Gateway](https://github.com/medic/medic-gateway) is an android app for sending and receiving SMS messages. Each SMS enabled project has one gateway running. It polls an api endpoint to write incoming SMS into the CouchDB and retrieve outgoing SMS to send.

### medic-collect

[medic-collect](https://github.com/medic/medic-collect) is an android app based on [Open Data Kit](https://opendatakit.org) to render xforms on the phone and send reports in to medic-gateway over SMS or directly to api over mobile data.

### medic-conf

[medic-conf](https://github.com/medic/medic-conf) is a command line utility for uploading configuration and bulk importing of records.
