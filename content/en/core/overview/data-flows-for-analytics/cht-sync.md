---
title: "CHT Sync and CHT Pipeline setup"
linkTitle: "CHT Sync"
weight: 2
description: >
  An overview of what CHT-Sync is and how to set it up.
---

## Introduction


[![Data Flows](cht-sync.png)](cht-sync.png)

Most CHT deployments require some sort of analytics so that stakeholders can make data driven decisions. CouchDB, which is the database used by the CHT, is not designed for analytics. It is a document database, which means that it is optimized for storing and retrieving documents. It is not optimized for aggregating data. For example, if you wanted to know how many patients were registered in a particular area, you would have to query the database for all the patients in that area, and then count them. This is not a very efficient process. It is much more efficient to store the number of patients in a particular area in a separate database, and update that number whenever a patient is registered or unregistered. This is what CHT Sync paired with CHT Pipeline is designed to do.

## Requirements

### CHT Sync

[CHT-Sync](https://github.com/medic/cht-sync) is a logstash and PostgREST application that runs on the server. It is a service that listens to changes in the CHT database, and updates the analytics database accordingly. It is designed to be run as a service on the server, and it is not designed to be accessed by users. It is not a web application, and it does not have a user interface. It is designed to be run on the same server as the CHT, but it can be run on a separate server if necessary. CHT Sync runs in a Docker container. See the [CHT Sync readme](https://github.com/medic/cht-sync/blob/main/README.md) for more information and instructions on how to run it.

### CHT Pipeline

CHT Sync puts all new data into the postgres database into a single table that has a `jsonb` column. This is not very useful for analytics. CHT Pipeline is a set of SQL queries that transform the data in the jsonb column into a more useful format. It uses [DBT](https://www.getdbt.com/) to define the data transformations. There is a [daemon](https://github.com/medic/dataemon) that runs CHT Pipeline, and it updates the database whenever the data in the jsonb column changes. 

You can pass in your CHT Pipeline model definitions to CHT Sync through the [variables](https://github.com/medic/cht-sync/blob/main/docker-compose.postgres.yml#L13) passed to the docker container. The ensures that you have an easy way of getting your data into the analytics database seamlessly.

