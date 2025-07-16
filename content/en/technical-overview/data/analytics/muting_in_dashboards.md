---
title: "Contact Muting in SQL queries"
linkTitle: "Contact Muting in SQL queries"
weight: 
description: >
  How to write SQL queries excluding muted contacts correctly
relevantLinks: >
aliases:
   - /apps/guides/database/muting_in_dashboards
---

When a contact gets muted, two of [many things]({{< ref "building/reference/app-settings/transitions#muting" >}}) happen: 

- The target contact and all of its descendants have a `muted` property set equal to the date they were muted
- an entry is added to the contact's `muting_history` in sentinel's info docs

When building dashboards on Superset, Klipfolio, or other data visualization platforms, you might need to exclude these muted contacts from the visualized data. An easy way to do this is to check the contact's `muted` property which when present has the date value of when the contact was muted and when absent means that the contact is not muted. This works when you are only interested in seeing the latest data but it gets complicated when you want to look at a contact's mute state from a certain period in the past.

For example, if a contact was muted in February and unmuted in May; If you check the contact's mute state in March from June, you'd find that the contact would not have the muted property as it would have been removed during the `unmute` in May. This is where the `muting_history` comes in. A contact's `muting_history` contains all mute and unmute events stored in a JSON array. An example of the mute/unmute entries is shown below:

```json
{
    "_id": "_id",
    "_rev": "3-01ecfdd2958baeaf16fc621c5622f4a9",
    "type": "info",
    "doc_id": "doc-id",
    "transitions": {
    },
    "muting_history": [
        {
            "date": "2021-04-07T13:41:09.769Z",
            "muted": true,
            "report_id": "_id"
        },
        {
            "date": "2021-06-07T13:41:09.769Z",
            "muted": false,
            "report_id": "_id"
        }
    ],
    "latest_replication_date": "2020-10-30T15:46:45.482Z",
    "initial_replication_date": "2020-10-30T15:46:45.482Z"
}
```
If you extract this data into a separate table you can get a timeline that you can use to check if the contact was muted at a certain point in the past. An example of this approach is shown below where the data is first extracted using the query:

```sql
    SELECT 
        contact_muting_history.contact_uuid, 
        date AS muted_on, 
        muted, 
        report_id 
    FROM (
        SELECT 
            doc ->> 'doc_id' AS contact_uuid,
            couchdb.doc ->> 'muting_history' AS muting_history
        FROM 
            couchdb
        WHERE
            doc ->> 'type' :: text = 'info'
            AND doc ->> 'muting_history' IS NOT NULL
    ) contact_muting_history
    CROSS JOIN LATERAL json_populate_recordset(null::record, contact_muting_history.muting_history::json) AS (date text, muted bool, report_id uuid);

```

The query above will give you a result set like the one below:

| contact_uuid | muted_on | muted | report_id |
| --- | --- | --- | --- |
| 1 | 2021-06-07T13:41:11.119Z | True   | ***** |
| 2 | 2020-12-24T18:02:53.190Z | True   | ***** |
| 3 | 2021-01-24T17:36:31.917Z | True   | ***** |
| 3 | 2021-04-15T16:56:05.984Z | False  | ***** |


You can query the table above (`mute_timeline`) to check if the contact was muted in a certain period in time as shown below:

```sql
    SELECT 
        contact_uuid IS NOT NULL AS muted
    FROM
        mute_timeline
    WHERE
        contact_uuid = ***** AND 
        date_trunc('day',muted_on) <= date_trunc('day', EXAMPLE_DATE) AND 
        unmuted_on >= (date_trunc('day', EXAMPLE_DATE) + '1 day'::interval)

```

This query checks if a record exists for this contact where they were muted earlier or on `EXAMPLE_DATE` and unmuted on or after the `EXAMPLE_DATE`. For the earlier example where the contact was muted in February and unmuted in May if we pass February, March, or April as `EXAMPLE_DATE`, we find a record because our `unmuted_on` is always greater than `EXAMPLE_DATE`. If we pass May going forward, we find no records that match our condition.