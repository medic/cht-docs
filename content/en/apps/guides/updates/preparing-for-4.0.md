---
title: "Preparing to upgrade to CHT 4.0"
linkTitle: "Preparing to upgrade to CHT 4.0"
weight:
description: >
  Steps to ensure your CHT App will run smoothly on CHT 4.0 and later
  
---

{{% alert title="Note" %}} This guide applies to both self-hosted and Medic hosted deployments. {{% /alert %}}

## Introduction

Medic uses [Semantic Versioning](https://en.wikipedia.org/wiki/Semver#Semantic_versioning) (aka "SemVer") which means that the CHT upgrade from the major 3.x version to the 4.x version denotes there are breaking changes. The key to a successful upgrade will be to understand and plan for these breaking changes. Aside from the Docker hosting infrastructure (out of scope for this prep document), the two breaking changes are around CHT Android and Enketo.

While CHT 4.0 has not been released yet, the effort to be prepared can be quite time consuming, especially for large deployments that may need to do handset upgrades in a worst case.  The sooner deployments start preparing for the upgrade, the easier it will be when it comes to the upgrade itself.  Conveniently, all device and app changes to prepare for 4.x are backwards compatible with 3.x. Prepare now, so you will be ready to upgrade sooner than later!

## CHT Android v1.0.0+ 

This change is straightforward in that CHT 4.x no longer supports versions _before_ `1.0.0`, so deployments need to update their Play Store app. As of this writing, [CHT Android](https://github.com/medic/cht-android/) is at `1.0.4`.  Please see the [Android docs]({{< relref "core/guides/android" >}}) on how to update your app and release it.  Note that Google's Play Store can often have delays which deployments have no control over. Again, the sooner you start, the better.

### Versions in use

After you have published your app, you need to instruct your users to check the Play Store for upgrades. You can then check [CHT Telemetry]({{< relref "apps/guides/performance/telemetry" >}})  to see what CHT Android versions are in use. Assuming you have [couch2pg set up](https://github.com/medic/couch2pg) to pull in your CouchDB data to a PostgreSQL database, this query will list Android versions `count`s for the current year, broken out by `month`, `year` and `version`:

```sql
select 
	count(*) as count,
	(doc#>>'{metadata,month}')::int as month,
	doc#>>'{metadata,year}' as year, 
	doc#>>'{device,deviceInfo,app,version}' as cht_android_version
from 
	couchdb_users_meta 
where 
	doc#>>'{type}' = 'telemetry'  
	and doc#>>'{device,deviceInfo,app,version}' is not null 
	and doc#>>'{metadata,year}' = to_char(current_date, 'yyyy')
group by 
	cht_android_version, month, year
order by 
	month desc, count desc
```

Note that this is actually showing a count of telemetry reports with a given version for the current month, so the counts will be higher than number of active users. The result will look something like this:

```
count|month|year|cht_android_version|
-----+-----+----+-------------------+
    7|    3|2022|v1.0.1-4           |
    7|    3|2022|v1.0.1-5           |
    4|    3|2022|v0.11.0-webview    |
   25|    2|2022|v1.0.1-5           |
    3|    2|2022|v0.11.0-webview    |
  100|    1|2022|v1.0.1-5           |
   57|    1|2022|v1.0.1-4           |
    1|    1|2022|v0.11.0-webview    |
```


### Active user counts

You can check the [monitoring API]({{< relref "apps/reference/api#monitoring" >}}) with `curl` to check active users for the last `30` days.  Remember that the users can send a telemetry report once per day, so this active user count will be less than the counts from the query above. 

We'll [use `jq` to filter](https://stedolan.github.io/jq/) out the unrelated metrics.  Be sure to replace `CHT-URL-HERE` with your production CHT URL:

```shell
curl -s https://CHT-URL-HERE/api/v2/monitoring\?connected_user_interval\=30 | \
  jq '. | {connected_users}'
```

This call will show the JSON with active users for the last 30 days:

```json
{
  "connected_users": {
    "count": 80
  }
}
```

### Users in need of upgrade

In the above table we can see there's 4 users in the most recent month that are on version `v0.11.0-webview`. Let's find their username so we can follow up with them directly.  This query is hard coded for the current year (`2022`), the current month (`3`) and the version `v0.11.0-webview`. Be sure to update the query to fit your needs according to which month, year and version you need to search for:

```sql
select 
	distinct doc#>>'{metadata,user}' as user, 
	doc#>>'{device,deviceInfo,app,version}' as cht_android_version
from 
	couchdb_users_meta 
where 
	doc#>>'{type}' = 'telemetry'  
	and doc#>>'{device,deviceInfo,app,version}' is not null 
	and doc#>>'{metadata,year}' = to_char(current_date, 'yyyy')
	and doc#>>'{metadata,month}' = to_char(current_date, 'FMMM')
	and doc#>>'{device,deviceInfo,app,version}' = 'v0.11.0-webview'
```

In this case only one user is found:

```
user|cht_android_version|
----+-------------------+
adj |v0.11.0-webview    |
```

A twist on this query is to remove the version filter. Do not remove the year and month filter as you will get duplicate values for users who have upgraded over time:

```sql
select 
	distinct doc#>>'{metadata,user}' as user, 
	doc#>>'{device,deviceInfo,app,version}' as cht_android_version
from 
	couchdb_users_meta 
where 
	doc#>>'{type}' = 'telemetry'  
	and doc#>>'{device,deviceInfo,app,version}' is not null 
	and doc#>>'{metadata,year}' = to_char(current_date, 'yyyy')
	and doc#>>'{metadata,month}' = to_char(current_date, 'FMMM')
```

This will give a list of every user and the version they're running as of the current month and year:

```
user            |cht_android_version|
----------------+-------------------+
moh-west-chw-1  |v1.0.1-4           |
moh-west-chw-12 |v1.0.1-4           |
moh-west-chw-14 |v1.0.1-4           |
moh-west-chw-3  |v1.0.1-4           |
moh-west-chw-3  |v1.0.1-5           |
moh-west-chw-4  |v1.0.1-5           |
moh-west-chw-5  |v1.0.1-4           |
moh-west-chw-6  |v1.0.1-5           |
moh-west-chw-7  |v1.0.1-5           |
moh-west-chw-8  |v1.0.1-4           |
adj             |v0.11.0-webview    |
```

## CHT Conf

[CHT Conf](https://github.com/medic/cht-conf/) has been upgraded to be aware of forms written to work in CHT 3.x that may not work in CHT 4.x.  Upgrading, can help you identify forms in need of fixing when pushing to dev instances as outlined below.

To upgrade app, run `npm update cht-conf`

## Enketo 

CHT 4.0 [upgrades the version of Enketo](https://github.com/medic/cht-core/pull/7256) used to render forms to version `5.18.1`. While this is not the latest version, it introduces a few changes that may change the way your forms work. In the worst case, there may be an error when trying to show them in the CHT.  To test every form, set up a development instance of the CHT 3.x.  An easy way of doing this is to use the [CHT Docker Helper]({{< relref "apps/guides/hosting/app-developer#cht-docker-helper" >}}).  

After you have your dev instance up and running, upgrade to the `7786-fix-report-label` branch:

1. Log in as an Admin and go to the admin section, choose upgrades:

   ![CHT Admin - Upgrade Section](admin-upgrades.png)

2. Expand the “Pre-releases” section by clicking on it and scroll down to the `7786-fix-report-label` branch and click “Install” on the right:

   ![CHT Admin - Selecting the 7786-fix-report-label to upgrade to](select-branch.png)

After pushing your app config (see "CHT Conf" above), you can proceed to go through each of your forms in a browser and on a device to ensure there's no errors.


