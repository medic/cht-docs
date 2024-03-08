---
title: "Introduction & Prerequisites to data synchronization and analytics"
weight: 100
linkTitle: "Introduction & Prerequisites"
description: >
    High level approach to data synchronization and analytics with CHT applications
relatedContent: >
  core/overview/cht-sync
  core/overview/data-flows-for-analytics/
---

Most CHT deployments require some sort of analytics so that stakeholders can make data driven decisions. CouchDB, which is the database used by the CHT, is not designed for analytics. It is a document database, which means that it is optimized for storing and retrieving documents, and not for aggregating data. For example, if you wanted to know how many patients were registered in a particular area, you would have to query the database for all the patients in that area, and then count them. This is not a very efficient process. It is much more efficient to store the number of patients in a particular area in a separate database, and update that number whenever a patient is registered or unregistered. This is what CHT Sync paired with CHT Pipeline is designed to do.

