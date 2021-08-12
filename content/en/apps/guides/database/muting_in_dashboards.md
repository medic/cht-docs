When a contact gets muted, two of [many things](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/transitions/#muting) happen:

- The target contact and all of its descendants have a `muted` property set equal to the date they were muted
- an entry is added to the contact's `muting_history` in sentinel's info docs

When building dashboards on KF, you might need to exclude these muted contacts from analytics. An easy way to do this is to check the contact's `muted` property which when present has the date value of when the contact was muted and when absent means that the contact is not muted. This works work when you're only interested in the seeing the latest data but it gets a little bit complicated when you want to look at a contact's mute state from a certain period in the past. 

For example, Say a contact was muted on February and unmuted on May; If you check the contact's mute state in March from June, you'd find that the contact would not have the muted property as it would have been removed during the `unmute` in May. This is where the `muting_history` comes in. A contact's `muting_history` contains all mute and unmute events stored in a json array. An example of the mute/unmute entries

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

If we extract this data into a separate table we can get a timeline we can use to check if the contact was muted at a certain point in the past. An example of this approach can be found [here](https://github.com/medic/config-moh-kenya-app/blob/moh-kenya-safari-doctors/postgres/matviews/contactview_muted.sql) where we first extract the data using

```sql
    SELECT x.contact_uuid, date AS muted_on, muted, report_id FROM(
        SELECT 
            doc ->> 'doc_id' AS contact_uuid,
            couchdb.doc ->> 'muting_history' AS muting_history
        FROM 
            couchdb
        WHERE
            doc ->> 'type' :: text = 'info'
            AND doc ->> 'muting_history' IS NOT NULL
    ) x
    CROSS JOIN LATERAL json_populate_recordset(null::record, x.muting_history::json) AS (date text, muted bool, report_id uuid);

```

to get a result set like below

```
contact_uuid | muted_on      |  muted | report_id
-------------------------------------------
1 | 2021-06-07T13:41:11.119Z | True   | *****
2 | 2020-12-24T18:02:53.190Z | True   | *****
3 | 2021-01-24T17:36:31.917Z | True   | *****
3 | 2021-04-15T16:56:05.984Z | False  | *****

```

Now you can query the table above (`mute_timeline`) to check if the contact was muted in a certain period in time like 

```sql
    SELECT 
        contact_uuid IS NOT NULL AS muted
    FROM
        mute_timeline
    WHERE
        contact_uuid = *****
        AND date_trunc('day',muted_on) <= date_trunc('day', EXAMPLE_DATE)
        AND unmuted_on >= (date_trunc('day', EXAMPLE_DATE) + '1 day'::interval))

```

What this does is check if a record exists for this contact where they were muted earlier or on EXAMPLE_DATE and unmuted on or after the EXAMPLE_DATE. So for our earlier example where a contact was muted on February and unmuted on May if we pass February, March or April as `EXAMPLE_DATE`, we find a record because our unmuted_on is always greater than `EXAMPLE_DATE`. If we pass May going foward, we find no records that match our condition. Example of this can found in [this util func](https://github.com/medic/config-moh-kenya-app/blob/moh-kenya-safari-doctors/postgres/functions/is_muted.sql).