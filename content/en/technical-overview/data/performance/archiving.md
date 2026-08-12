---
title: "Archiving"
linkTitle: "Archiving"
weight:
description: >
  Move outdated documents from the primary database to cold storage
keywords: archiving cold-storage
relatedContent: >
  technical-overview/data/performance/purging
  technical-overview/data/db-schema
  building/reference/api
---

*Only available in 5.3.0 and above*

Archiving moves outdated documents from the primary `medic` database to a separate `medic-archive` database. This keeps the primary database small while the archived documents remain available for analytics and audit purposes.

Archiving differs from [purging](/technical-overview/data/performance/purging) in two important ways:

- Purging removes documents from user devices while keeping them in the `medic` database, whereas archiving removes documents from the `medic` database entirely. Archived documents are copied to `medic-archive` and then purged from `medic`, leaving no trace in the changes feed.
- Purging is conditional on user roles: the purge function decides per roles group, so a document can be purged for one user and not for another. Archiving is unconditional: an archived document is removed for all users.

> [!WARNING]
> Archived documents are no longer available to the CHT application. They cannot be viewed in the app, used in [tasks](/building/tasks/tasks-js), [targets](/building/targets/targets-js), or contact summaries, and they are deleted from user devices on the next sync. Make sure the documents are no longer needed before archiving them.

## Benefits

- **Improved overall server performance.** A smaller `medic` database means less work for CouchDB across the board: reads, writes, compaction, and backups all get faster as the database shrinks.
- **Faster indexing.** Every document in `medic` is processed by every view and search index. With fewer documents, indexes build and update faster, both in day-to-day operation and after upgrades, when views are rebuilt from scratch.
- **Faster replication.** Calculating which documents each user can replicate is proportional to the size of the `medic` database. Removing outdated documents speeds up initial replication and routine syncs for all users.
- **Reduced disk usage.** The `medic-archive` database has no indexes, so archived documents cost only their raw storage. The same documents occupy dramatically less disk space in `medic-archive` than they did in `medic`, where every document also carries its share of view and search index storage.
- **Data is retained.** Unlike deleting documents, archiving keeps the full document, including attachments, along with an audit entry recording when it was archived. The data stays available for compliance and analytics purposes.

## How it works

Archiving is a pipeline with three stages:

1. You submit a list of document IDs to the [archive API endpoint](#queueing-documents-for-archiving). API validates the payload and queues the job for Sentinel.
2. Sentinel processes the queued jobs, either on a [configurable schedule](#configuration) or immediately when no schedule is configured. Each document is copied to `medic-archive` and then purged from `medic`.
3. When users sync, archived documents are treated as deleted and are removed from their devices.

## Queueing documents for archiving

Determining _which_ documents to archive is up to you. For example, you can use analytics queries to find reports older than a retention threshold, or contacts that have been inactive for years.

Submit the document IDs to the archive endpoint:

```
POST /api/v1/archive
```

The request must:

- Be authenticated as a database admin.
- Use the `Content-Type: text/csv` header.
- Contain one document ID per line. Surrounding double quotes are stripped and blank lines are ignored, so a single-column CSV export works as-is.
- Be at most 32 MB. Split larger ID lists across multiple requests.

For example:

```bash
curl -X POST \
  -H "Content-Type: text/csv" \
  --data-binary @doc-ids.csv \
  https://<admin>:<password>@<host>/api/v1/archive
```

The endpoint splits the IDs into archive job documents of at most {{< format-number 100_000 >}} IDs each, stored in the `medic-sentinel` database, and responds with `202 Accepted` and the list of created jobs:

```json
{
  "jobs": [
    { "id": "archive:0197c2f0-9a41-7000-8000-000000000000", "count": 100000 },
    { "id": "archive:0197c2f0-9a42-7000-8000-000000000001", "count": 25000 }
  ]
}
```

Jobs are persisted while the payload streams in, so a mid-payload failure can leave some jobs queued even though the request returns an error. Retrying the full payload is safe because archiving is idempotent; duplicate jobs only cost redundant processing.

## Server-side processing

Sentinel processes queued jobs in creation order, working through each job's IDs in batches of {{< format-number 1_000 >}}. For each batch, Sentinel:

1. Copies the documents, including attachments, to the `medic-archive` database. An `archive_date` timestamp is added to each archived document.
2. Records an audit entry for each archived document.
3. Purges the documents' metadata documents (`<id>-info`) from `medic-sentinel`.
4. Purges the documents from `medic`, including all conflicting revisions, so they leave no trace in the changes feed.

Only contacts, reports, tasks, and targets can be archived. IDs of documents that are missing or of any other type, such as forms or settings, are silently skipped.

Every 10 batches, Sentinel queries the critical view indexes so that indexing keeps pace with the purges.

A job that fails is retried on the next run, resuming from the last completed batch. After 10 failed attempts the job is removed from the queue so it cannot block other jobs; its record remains in `medic-logs`.

## Replication

Archived documents appear as deleted to syncing clients. Users who have an archived document on their device delete it during their next sync, and initial replication never downloads archived documents. Users are not notified that documents were archived, so as with purging, the expectation is that documents are only archived once they are no longer relevant to users.

## Analytics and cht-sync

Archiving is invisible to [CHT Sync](/hosting/analytics/). Because archived documents are purged rather than deleted, they disappear from the changes feed without leaving deletion records, and cht-sync — which watches the changes feed — never learns that anything happened. Documents that were synced to PostgreSQL before being archived remain there, so archived data stays available for analytics. Documents that are archived before cht-sync has synced them never reach PostgreSQL.

## Configuration

Archiving requires no configuration to work: with no `archive` settings, Sentinel processes queued jobs as soon as they are submitted, and runs until the queue is drained.

Depending on the number of documents queued, archiving can be a lengthy and resource intensive operation. You can configure a schedule so processing runs when your server is under light load, and bound how long each run lasts:

```json
{
  "//": "other app_settings settings",
  "archive": {
    "cron": "0 22 * * *",
    "duration": "4 hours"
  }
}
```

The same schedule expressed as a text expression:

```json
{
  "//": "other app_settings settings",
  "archive": {
    "text_expression": "at 10:00 pm",
    "duration": "4 hours"
  }
}
```

Some examples of valid text expressions:

| text expression | runs |
|-------|---------|
| `"at 10:00 pm"` | Every day at 10:00 pm |
| `"at 00:00 on Sunday"` | Every Sunday at midnight |
| `"at 11:00 pm on Fri and Sat"` | Every Friday and Saturday at 11:00 pm |

Text expressions are evaluated in the server's local time.

| property | description | required |
|-------|---------|----------|
| `text_expression` | Any valid text expression to describe when archiving runs. For more information, see [LaterJS](https://bunkat.github.io/later/parsers.html#text) | no |
| `cron` | Any valid Cron expression to describe when archiving runs. For more information, see [LaterJS](https://bunkat.github.io/later/parsers.html#cron) | no |
| `duration` | Maximum length of each run, as `"<number> <unit>"`. For example, `"30 minutes"` or `"4 hours"`. When omitted, each run continues until the queue is drained. | no |

## Monitoring

Each archive job writes a log document to the `medic-logs` database with the same ID as the job. The log document outlives the job and is the durable record of its lifecycle:

| property | value type | description |
| ----- | ----- | ----- |
| `status` | String | `running`, `completed`, or `failed` |
| `cursor` | Number | How many of the job's IDs have been processed |
| `total` | Number | The total number of IDs in the job |
| `start_date` | Number | Timestamp of when processing started |
| `updated_date` | Number | Timestamp of the last progress update |
| `errors` | Array | The last 10 errors, each with a `date` and `message` |

A job whose log has `status: "failed"` has exhausted its 10 attempts and was removed from the queue. Review the `errors` entries, resolve the underlying problem, and resubmit the remaining IDs to the archive endpoint.

Each archived document also has an audit entry recording that it was archived and when.

## Restoring archived documents

There is no automated way to restore an archived document, but you can restore one manually:

1. Retrieve the document from the `medic-archive` database.
2. Remove its `_rev` and `archive_date` properties.
3. Save the document to the `medic` database **twice**: save it once, then save the resulting revision again without any changes. A single write recreates the exact revision that user devices already deleted, so syncing devices skip it and the document stays deleted on the device. The second write creates a revision that devices have never seen, which they download and which wins over the local deletion.
4. Delete the document from the `medic-archive` database. This step is required: replication treats any document present in `medic-archive` as deleted, so users cannot download the restored document while it remains in the archive.

On their next sync, users with access to the document download it again with its original content.

## Considerations

- **Archiving is meant to be permanent.** Archived documents live on in `medic-archive` and [restoring one](#restoring-archived-documents) is a manual, per-document process. Do not archive documents you expect to need again.
- **Rules may break.** As with purging, any tasks or targets that depend on an archived document lose access to it. For example, archiving a report that completed a task reopens that task unless the document that created the task is also archived.
- **Users may be confused.** Documents disappear from devices without notification. Work with your users to ensure documents are only archived once there is no use for them.
- **The `medic-archive` database grows.** Archived documents, including attachments, accumulate in `medic-archive`. Because the database has no indexes, its size is dramatically smaller than the footprint the same documents had in `medic`, but account for it in your [hosting](/hosting/) disk capacity planning all the same.
