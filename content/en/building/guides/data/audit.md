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
4. Due to space considerations, audit data is not indexed. A deployment with plenty of disk space can choose to index audit data for quick queries. 

## Examples

All the following examples involve querying the audit database using CouchDB Mango queries.
Please consult the [full documentation for Mango queries](https://docs.couchdb.org/en/stable/ddocs/mango.html) from the CouchDB documentation. 

You can run Mango queries against the `medic-audit` databse in Fauxton. This is accessible at `/_utils/#database/medic-audit/_find`.  So if your CHT instance was `https://cht.exmple.com`, you could access it at `https://cht.exmple.com/_utils/#database/medic-audit/_find`.  

#### Retrieving all document edits made through a specific request id

Each request that API receives has an assigned unique id. 
This request id is propagated to HAProxy through the `X-Request-Id` header,
so that the resulting CouchDB queries can be traced.  

```json
{
   "selector": {
      "history": {
         "$elemMatch": {
            "request_id": "<request_id>"
         }
      }
   }
}
```

**Example tracing the request with id `d7b2b47958ae`:** 

* CHT API logs:
```
2025-06-02T12:04:00.798 REQ: d7b2b47958ae 172.18.0.1 - POST /medic-test/_bulk_docs HTTP/1.0
2025-06-02T12:04:00.806 RES: d7b2b47958ae 172.18.0.1 - POST /medic-test/_bulk_docs HTTP/1.0 201 2 7.563 ms
```

* HAProxy logs: 
```
172.18.0.8,couchdb-3.local,200,0,0,0,GET,/_session,-,0,d7b2b47958ae,322,0,147,'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'
172.18.0.8,couchdb-2.local,200,0,0,0,GET,/_session,-,admin,d7b2b47958ae,322,0,147,'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'
172.18.0.8,couchdb-3.local,201,0,0,0,POST,/medic-test/_bulk_docs,-,admin,d7b2b47958ae,229,0,3,'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'
```

- retrieve all docs that were edited by this request:
```json
{
   "selector": {
      "history": {
         "$elemMatch": {
            "request_id": "d7b2b47958ae"
         }
      }
   }
}
```

#### Retrieving all changes a user made in a specific period of time

```json
{
   "selector": {
      "history": {
         "$elemMatch": {
            "user": "<user_name>",
            "date": {
               "$and": [
                  {
                     "$gt": "<start_date>"
                  },
                  {
                     "$lt": "<end_date>"
                  }
               ]
            }
         }
      }
   }
}
```

- retrieve all document changes made by user `joan` between May 25th and May27th 2025 (inclusive): 
```json
{
   "selector": {
      "history": {
         "$elemMatch": {
            "user": "joan",
            "date": {
               "$and": [
                  {
                     "$gt": "2025-05-25T00:00:00"
                  },
                  {
                     "$lt": "2025-05-27T23:59:59"
                  }
               ]
            }
         }
      }
   }
}
```

- retrieve all document changes made by user `jesse` after June 3rd at noon:
```json
{
   "selector": {
      "history": {
         "$elemMatch": {
            "user": "jesse",
            "date": {
              "$gt": "2025-06-03T12:00:00"
            }
         }
      }
   }
}
```

- retrieve all document changes made by user `mark_twain` before Feb 26th:
```json
{
   "selector": {
      "history": {
         "$elemMatch": {
            "user": "mark_twain",
            "date": {
              "$lt": "2025-02-26"
            }
         }
      }
   }
}
```

#### Retrieving all changes a service made in a specific period of time

```json
{
   "selector": {
      "history": {
         "$elemMatch": {
           "service": "<service>",
           "date": {
             "$and": [
               {
                 "$gt": "<start date>"
               },
               {
                 "$lt": "<end date>"
               }
             ]
           }
         }
      }
   }
}
```

- retrieve all changes made by Sentinel in a specific period:
```json
{
   "selector": {
      "history": {
         "$elemMatch": {
            "service": "sentinel",
           "date": {
             "$and": [
               {
                 "$gt": "2025-05-30"
               },
               {
                 "$lt": "2025-06-20"
               }
             ]
           }
         }
      }
   }
}
```