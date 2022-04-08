---
title: "Fixing data on the wrong server"
linkTitle: "Fixing data on the wrong server"
weight: 15
description: >
    What to do when training data ends up in production and vise versa.

---


## Monitoring

To ensure CHWs erroneously using the training instance enter as little production data as possible, consider different monitoring solutions. By catching the problem early, it may be easy to fix manually which avoids more laborious fixes on the command line for admins.

Direct monitoring by Supervisors can be achieved via checking in with each CHW as they register their first household. If each CHW is given a deadline to do this, the Supervisor can follow up directly after the deadline with any CHWs who have not achieved this goal.

From an administrative perspective, queries can be run on the Postgres instance that couch2pg is populating. Assuming the date to stop using the training instance ended on 2020-09-14, this SQL query would show users on the instance later than that day:

```shell
with forms as (
  select
    doc #>> '{fields,inputs,user,contact_id}' as chw_id,
    count(*) as n_forms
  from
    couchdb
  where to_timestamp((doc ->> 'reported_date' )::bigint / 1000) > '2020-09-14 00:00:00'
  group by 1
), chw_names as (
  select 
  doc ->> '_id' as chw_id, 
  doc ->> 'name' as chw_name
  from couchdb 
  where doc ->> 'role' = 'chw'
  and doc ->> 'name' not like 'ASC%'
)
select 
  n.chw_name,
  f.n_forms
from 
forms f 
left join 
chw_names n 
using(chw_id)
order by n_forms desc;
```

A limitation of this technique is that CHWs who have not synchronized their device will not show up. In this case, a supervisor proactively checking per above is a better failsafe.

[Tasks for supervisors]({{< relref "apps/features/supervision#supervisor-tasks" >}}) can also be used for the CHWs that report to them. This can be used to trigger a task when a CHW hasn't submitted a task within a given period on production.

## Remediation

In the case that production data has been entered into a training instance, care must be used to ensure data is not lost or overwritten. These steps assume you're on a Linux command line and have jq, curl and cat installed. The task is to carefully download all docs created after a certain date on a training, clean up extra docs not needed and then upload them to a production instance:

1. Set the aliases and environment variables:

    ```
    alias ts='date -u +"%Y-%m-%dT%H:%M:%SZ"'
    alias curlj="curl -H 'content-type:application/json'"
    alias curljz="curl --compressed -H 'content-type:application/json'"
    export COUCH_URL=https://admin:pass@dev.example.org
    ```

2. Ensure affected CHWs have synced their devices to the development instance one last time. If they have been offline for some time and gathered production data, signing out or deleting the app before synchronizing may result in lost data.
3. Find the date when CHWs should have started using production. Convert this to epoch with milliseconds. For example if the time was "Tue, 01 Dec 2020 09:36:50 GMT" then the epoch would be "1606815410000"
4. Using Fauxton, create a view to show all documents created after this date:

    ```
    function (doc) {
        if(doc.reported_date > 1606815410000) {
            emit(doc._id, 1);
        }
    }
   ```

    ![Creating a view in Fauxton](create.view.png)
5. Download the UUIDs of the documents in the view, and convert it to raw format (uuids-2.txt):

    ```
    curl "$COUCH_URL/medic/_design/temp/_view/temp1" > uuids-1.txt
    cat uuids-1.txt | jq -r '.rows[].id' > uuids-2.txt
    ```
6. Download all the matching docs to docs.json:

    ```
    cat uuids-2.txt | jq --raw-input --slurp '{keys: split("\n") }' | curljz -d@- "$COUCH_URL/medic/_all_docs?include_docs=true" | jq '{docs: [ .rows[] | select(.doc).doc ]}' > docs.json
    ```
7. Change the fields by deleting "_rev" field and also "_attachments" if uploading in a different instance. This can be carefully done by manually editing the JSON locally before uploading.
8. Change the COUCH_URL to be your production instance by setting another export:
    ```
    export COUCH_URL=http://admin:pass@app.example.org
    ```
9. Upload the docs, for example, the following command adds a field (updated=true) to the docs and uploads them:
    ```
    cat docs.json | jq '{"docs":[ .docs[] | .updated = true ]}' | curljz -d@- $COUCH_URL/medic/_bulk_docs > results.json
    ```