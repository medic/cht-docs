---
title: "Introduction & Prerequisites to data synchronization and analytics"
weight: 1
linkTitle: "Introduction & Prerequisites"
description: >
    High level approach to data synchronization and analytics with CHT applications
relatedContent: >
  core/overview/cht-sync
  core/overview/data-flows-for-analytics/
aliases:
   - /apps/guides/data/analytics/introduction
---

{{% pageinfo %}}
The pages in this section apply to both CHT 3.x (beyond 3.12) and CHT 4.x. 
{{% /pageinfo %}}

Most CHT deployments require some sort of analytics so that stakeholders can make data driven decisions. CouchDB, which is the database used by the CHT, is not designed for analytics. It is a document database, which means that it is optimized for storing and retrieving documents, and not for aggregating data. For example, if you wanted to know how many patients were registered in a particular area, you would have to query the database for all the patients in that area, and then count them. This is not a very efficient process. It is much more efficient to store the number of patients in a particular area in a separate database, and update that number whenever a patient is registered or unregistered. This is what CHT Sync is designed to do.

## CHT Sync Introduction

CHT Sync is an integrated solution designed to enable data synchronization between CouchDB and PostgreSQL for the purpose of analytics. It can easily be deployed using Docker. It is supported on CHT 3.12 and later, including CHT 4.x. By using CHT Sync, a CHT deployment can easily get analytics by using a data visualization tool. All tools are open-source and have no licensing fees.

CHT Sync has been designed to work in both local development environments for testing models or workflows, and in production environments. The setup can accommodate the needs of different environments.

## CHT Sync Prerequisites

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  (Node 18 LTS or newer)
- [CHT Sync](https://github.com/medic/cht-sync) GitHub repository (can be cloned via `git clone https://github.com/medic/cht-sync`).

