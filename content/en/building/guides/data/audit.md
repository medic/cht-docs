---
title: "Database document auditing"
linkTitle: "Document auditing"
weight: 10
description: >
    Overview of document change auditing 
keywords: audit
relatedContent: >
  technical-overview/concepts/db-schema
---

{{< callout >}}
Available from 4.20.0.
{{< /callout >}}

The CHT maintains a complete change history by tracking all document modifications in a dedicated `medic-audit` database. For each document in the `medic` database, there exists a corresponding audit document in `medic-audit` sharing the same `_id`. This audit document maintains a chronological record of all changes made to the original document, including creations, modifications and deletions.

### Audit Document Structure

Each audit document contains a `history` array that records all document changes. The audit entries are stored chronologically, with the most recent changes appearing last.

#### Field Definitions


| Field   | Optional | Type   | Description                                                                                                                                                                                                                                                                                                                                                    |
|---------|----------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| rev     | no       | string | Document revision (`_rev` property).                                                                                                                                                                                                                                                                                                                           |
| date    | no       | string | Server request timestamp in ISO format                                                                                                                                                                                                                                                                                                                         
|
| service | no       | string | Source of change (API or Sentinel)                                                                                                                                                                                                                                                                                                                             
|
| user    | no       | string | User who initiated the change. If the change is a result of a client request, then the logged in user will be saved, even if the change was made through a separate mechanism (a change cascading or affecting multiple documents). In case the change was made though internal server mechanisms, the admin user for the service will be stored. |
| request_id | yes      | string | Client request identifier for api / haproxy log tracing
|

**Example audit document:** 
```json
{
  "_id": "567fd08b-ce83-4b34-a06f-d3b338b474ba",
  "_rev": "2-4f412383ef1e3d643a3682081753f492",
  "history": [
    {
      "rev": "1-c8344ea78152d7471bfcd356b04ca9ae",
      "request_id": "9ba2a86d9dbb",
      "user": "john",
      "date": "2025-06-04T08:45:32.937Z",
      "service": "api"
    },
    {
      "rev": "2-4864a734c3a0287a2f6c6b9d6d3ed0f2",
      "request_id": "284317077052",
      "user": "admin",
      "date": "2025-06-04T08:47:22.182Z",
      "service": "api"
    },
    {
      "rev": "3-4f412383ef1e3d643a3682081753f492",
      "user": "admin",
      "date": "2025-06-04T08:50:30.214Z",
      "service": "sentinel"
    }
  ]
}
```

### Rotation Policy

Because some documents are expected to be edited frequently (for example forms, tasks or the settings document), saving all history entries in a single document can make it very large. Storing and retrieving large documents can incur unnecessary stress over the CouchDb database and CHT Service. 


To avoid audit documents from getting too large, they are rotated at a maximum of **10 history entries** . When an audit document has 10 entries and the `medic` document is changed again, the existent 10 history entries will be saved in a new (rotated) audit doc, and the main audit doc history will only contain the new entry. The rotated audit document will have the _id format of `<document_uuid>:<last rev in history entry>`.

#### Example Document Rotation:

**Rotated Audit Document:**

```json
{
  "_id": "567fd08b-ce83-4b34-a06f-d3b338b474ba:10-b5df1417dc0025f605312fb4ddf6702e",
  "_rev": "1-4f412383ef1e3d643a3682081753f492",
  "history": [
    ....<9 entries>
    {
      "rev": "10-b5df1417dc0025f605312fb4ddf6702e",
      "user": "admin",
      "date": "2025-06-04T08:50:30.214Z",
      "service": "sentinel"
    }
  ]
}
```

**Main Audit Document After Rotation:**

```json
{
  "_id": "567fd08b-ce83-4b34-a06f-d3b338b474ba",
  "_rev": "11-c5e90b06e06ee53fd2a762d7aaa43e2f",
  "history": [
    {
      "rev": "11-3e5008a65d4d08b297ef937bf23fa6a1",
      "user": "ted",
      "date": "2025-06-04T09:50:30.214Z",
      "service": "api"
    }
  ]
}
```

### Limitations

1. There is no automated cleanup mechanism for audit history. 
2. When offline edits sync to the server, they appear as a single audit entry. This is because only the last version of the document is replicated to the server. 
3. Because the audit system was added in 4.20.0, older document edits will not be audited. 

