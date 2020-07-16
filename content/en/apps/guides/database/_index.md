---
title: "Managing Databases"
linkTitle: "Database"
weight: 100
description: >
  Managing databases used by CHT applications
---

## CouchDB

The CHT has a range of CouchDB databases for storing different types of data. By default, databases all start with the prefix "medic".

### medic

The main database, used to store all contact and report data. Data access is protected by API to provide protection on a per document basis.

{{< see-also page="core/overview/db-schema" >}}

### medic-sentinel

Stores the `_local/sentinel-meta-data` document which stores the sequence of the last processed change in the `medic` db. This is used so Sentinel can resume from where it left off and process all changes in order.

This database also stores metadata about the documents in the "medic" database, such as when it was received and which Sentinel transitions have executed on this doc. The UUID of the metadata doc is the same as the UUID of the "medic" doc with "-info" appended at the end.

For example:

```json
{
  "_id": "f8cc78d0-31a7-44e8-8073-176adcc0dc7b-info",
  "_rev": "2-6e08756f62fa0595d87a3f50777758dc",
  "type": "info",
  "doc_id": "f8cc78d0-31a7-44e8-8073-176adcc0dc7b",
  "latest_replication_date": "2018-08-13T22:02:46.699Z",
  "initial_replication_date": "2018-08-14T10:02:13.625Z"
}
```

### medic-user-{username}-meta

Used for documents which are only relevant to a single user, including:

- "feedback". Errors and exceptions caught in the browser, and user initiated feedback. Support staff must monitor these docs to detect any errors that are occurring on the client device.
- "read". Records that a document has been opened in the browser so it can be marked as read in the UI.
- "telemetry". Aggregate telemetry information for performance and usage metrics analysis. {{< see-also page="apps/guides/performance/telemetry" >}}

### medic-users-meta

To make it easier to perform analysis of all the docs in each user's "medic-user-{username}-meta" database, Sentinel replicates all the "feedback" and "telemetry" docs into this single database. This is used for reporting, monitoring, and usage analytics.

Replication to this database can be enabled via configuration from 3.5.0 and works without configuration from 3.10.0.

### \_users

This is the standard CouchDB database used to configure user authentication and authorization.

## PouchDB

Used to store documents on the client device to allow for offline-first access. Bidirectional replication is done on the "medic" and "medic-user-{username}-meta" databases. The "medic" database is only partially replicated so the user stores only a subset of the entire CouchDB database for performance and security reasons.

{{< see-also page="apps/guides/performance/replication" >}}

## PostgreSQL

Used to store data for performant analytical queries such as impact and monitoring dashboards. The CHT uses [medic-couch2pg](https://github.com/medic/medic-couch2pg) to handle replication of docs from "medic", "medic-sentinel", and "medic-users-meta" databases into Postgres.

{{< see-also page="core/overview/data-flows-for-analytics" >}}
