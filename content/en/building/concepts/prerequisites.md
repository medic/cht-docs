---
title: "Prerequisites for App Development"
linkTitle: "Prerequisites"
weight: 9
description: >
  Tools and background skills that are helpful for developing CHT apps
relatedContent: > 
  building/tutorials/local-setup
aliases:
   - /apps/concepts/prerequisites
----
There are no set prerequisites for users of CHT apps, yet the following are helpful for developing CHT applications.

## Test Instance
To build your own application using the Core Framework you will need an instance set up for testing. You can set up a local instance by [following these instructions]({{< ref "building/tutorials/local-setup" >}}).

## Build tool
The build tool for applications using the Core Framework is `cht-conf`. To set it up, follow the [installation instructions](https://github.com/medic/cht-conf/blob/master/README.md). To properly use the tool you will need your application files in set locations within a folder. Once you are set up with the basic file structure you can edit the files, and rebuild the application by compiling or converting components as needed, and uploading them to your test instance.

## Background skills
To build applications with the Core Framework the following skills are helpful, ordered by importance:

### XLSForms and XForms
Many workflows in your application, including completing tasks and creating contacts, will be generated using [ODK XForms](https://opendatakit.github.io/xforms-spec/). Many app developers use XLSForms as an easier way to generate XForms. A strong knowledge of [XLSForm standard](http://xlsform.org/) is very useful in building your own application.

### JSON
JSON (JavaScript Object Notation) is a format for storing structured text. Understanding JSON will help with minor modification of existing applications.

### Javascript
Many key aspects are defined with JavaScript code and expressions. This includes managing profile pages, creating tasks and targets, and setting the condition for when to show forms. Unless you are only doing minor modification to an existing application, a good understanding of JavaScript is required.

### CouchDB
A free and open source NoSQL database we use to store all our data, configuration, and even the application code. CouchDB is really good at replication which is the process of sending the data to another database, such as PouchDB in the client application, and back again. Although building your own app using the Core Framework does not require knowledge or experience with CouchDB it can be useful to be familiar with general concepts as a document store.

### SQL
Although the application you build uses a NoSQL database, a parallel PostgreSQL database is available in the Core Framework to make querying data easier. Familiarity with SQL is needed to set up and query the database.
