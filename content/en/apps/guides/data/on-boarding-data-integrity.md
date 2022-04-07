---
title: "Best Practices for Data Integrity During On-Boarding"
linkTitle: "Data Integrity in On-Boarding"
weight: 15
description: >
    How to ensure training data ends up in training and production data ends up production.

---

{{% pageinfo %}}
This best practices guide should not be followed verbatim.  Instead, it is important to review each suggestion and assess if your deployment can benefit from it.
{{% /pageinfo %}}

## Introduction

When onoarding CHWs or refreshing their training, it is important to enable them to learn how to use the CHT using a real mobile device with a real CHT Android application on the exact same configuration as production will use. This will give them the confidence to correctly and safely use the app to do their first household visits. This guide assumes that CHWs will have both a training and production app installed at the same time, or the CHW will be instructed to go install and log into the production app when training has been completed.

Just as important, is to ensure their training data does not end up polluting production data.

On-boarding is not a one-size-fits-all process. Be sure to assess which of the items below meet your deployment's needs and implement them accordingly. Within this assessment, consider if extra set up is needed (eg couch2pg hooked up to training) to enable the size you need to fit your deployment.

## Training and Documentation

When training CHWs, it is critical that they understand when they're using the training instance vs. the production instance. Consider adding a step to training documentation of "Ensure you're in the training app by confirming the 'URL' in 'About' under the hamburger menu". While laborious, it is a relatively quick check which empowers the CHW to know which instance they're using:

![App URL in settings](app.url.png)

The URL may not be a good proxy for CHWs to know which instance they're on. Will a CHW looking at  "**dev**.example.org" be able to tell the difference from "**app**.example.org"? To aid  CHWs, consider using a [different icon for the launcher and login]({{< relref "core/guides/android/branding" >}}).

{{% alert title="Note" %}}Careful when selecting **About** to not select **Logout**. If accidental log outs are a frequent problem the logout option can be removed [from the menu by setting `can_log_out_on_android` to false]({{< relref "apps/reference/app-settings/user-permissions" >}}).{{% /alert %}}

When publishing documentation on how to use the CHT, be sure to include steps to identify which instance you're on. Consider disseminating laminated copies of key steps so CHWs can easily reference them in the field.

Checklists for Admins, Supervisors and CHWs to follow can be extremely helpful to ensure no critical steps are missed during training. An important part of this checklist will be to set up and test communication methods and groups to be used during escalation.

CHWs will have different comfort levels with smartphones. Take note of which CHWs are more fluent using the CHT and smartphones in general. Encourage CHWs to work together to solve problems with members of their training cohort which will take less time than the escalation process.

## Escalation

Another common issue with onoarding is a CHW who is unable to log into either the training or production instance. The lack of data can be just as bad as the right data in the wrong location. Ensure CHWs know who to contact when they have an issue, including when they can not log into the CHT. By using direct contact methods like SMS, WhatsApp or other non-CHT communication methods, the CHW can let their supervisor know they're having issues without waiting hours or days to get logged back into the CHT.

## Proactive Approaches

By directly uninstalling the training application from a CHWs device, you will ensure they can not use it to collect production data. While the ability to easily do a refresher training is also removed, it may be a worthwhile trade off.

Changing the password of users in the CHT on the training instance will prevent them from synchronizing data to the training instance. Use care when using this password changing approach: if a CHW goes for a long time offline collecting production data, when they come online they will not be able to access the production data stored on their device. To avoid this, couple it with monitoring solutions listed above. Otherwise, the password change is a direct and unmistakable signal that the CHW is using the wrong instance.

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