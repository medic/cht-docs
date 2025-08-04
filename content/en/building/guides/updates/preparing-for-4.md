---
title: "Preparing to upgrade to CHT 4.0"
linkTitle: "Preparing to upgrade to CHT 4.0"
weight:
aliases:
  - /apps/guides/hosting/3.x/preparing-for-4.0
  - /apps/guides/updates/preparing-for-4.md
  - /apps/guides/updates/preparing-for-4/
description: >
  Steps to ensure your CHT App will run smoothly on CHT 4.0 and later
  
---

> [!NOTE] 
> This guide applies to both self-hosted and Medic hosted deployments.

## Introduction

Medic uses [Semantic Versioning](https://en.wikipedia.org/wiki/Semver#Semantic_versioning) (aka "SemVer") which means that the CHT upgrade from the major 3.x version to the 4.x version denotes there are breaking changes. The key to a successful upgrade will be to understand and plan for these breaking changes. Aside from the Docker hosting infrastructure (out of scope for this prep document), the two breaking changes are around CHT Android and Enketo.
Upgrading to CHT 4.0  can be quite time consuming, especially for large deployments that may need to do handset upgrades in a worst case.  The sooner deployments start preparing for the upgrade, the easier it will be when it comes to the upgrade itself.  Conveniently, all device and Android app changes to prepare for 4.x are backwards compatible with 3.x. Prepare now, so you will be ready to upgrade sooner than later!

## CHT Android v1.0.0+ 

This change is straightforward in that CHT 4.x no longer supports versions _before_ `1.0.0`, so deployments need to update their Play Store app. As of this writing, [CHT Android](https://github.com/medic/cht-android/) is at `1.0.4`. See the [Android docs]({{< relref "building/guides/android" >}}) on how to update your app and release it.  Note that Google's Play Store can often have delays which deployments have no control over. Again, the sooner you start, the better.

### Versions in use

After you have published your app, you need to instruct your users to check the Play Store for upgrades. You can then check [CHT Telemetry]({{< relref "building/guides/performance/telemetry" >}})  to see what CHT Android versions are in use. Assuming you have [CHT Sync set up](https://github.com/medic/cht-sync) to pull in your CouchDB data to a PostgreSQL database, this query will list Android versions `count`s for the current year, broken out by `month`, `year` and `version`:

```sql
SELECT
	concat(doc#>>'{metadata,year}','-',lpad(doc#>>'{metadata,month}',2,'0')) as telemetry_month, 	
	doc#>>'{device,deviceInfo,app,version}' as cht_android_version,
	count(distinct(doc#>>'{metadata,user}')) AS count_distinct_users,
	count(distinct(doc#>>'{metadata,deviceId}')) AS count_distinct_devices,
	count(*) AS count_telemetry
FROM
	couchdb_users_meta 
WHERE
	doc#>>'{type}' = 'telemetry'  
	AND doc#>>'{metadata,year}' = to_char(current_date, 'yyyy')
	AND doc#>>'{device,deviceInfo,app,version}' is not null
GROUP BY 
	telemetry_month, cht_android_version	
ORDER BY 
	telemetry_month DESC,
	cht_android_version DESC NULLS LAST
```

Note that each user can submit many telemetry docs (`count_telemetry`), so the query breaks out users (`count_distinct_users`) and devices (`count_distinct_devices`) for the given month. This means that telemetry counts will be higher than the number of active users. As well, early in the current  month, many users may not have had a chance to synchronize their telemetry data yet. For example, this report was run on the 5th of October, so the counts for all three tables are low. Refer to prior months in this case.

> [!NOTE] 
> In some cases users are accessing the system via the [progressive web app (PWA)]({{< relref "technical-overview/concepts/pwa" >}}) or are online users.  We see the `cht_android_version` field is empty in this case. 

|telemetry_month|cht_android_version|count_distinct_users|count_distinct_devices|count_telemetry|
|---------------|-------------------|--------------------|----------------------|---------------|
|2022-10        |v0.8.0-xwalk       |                   8|                     8|             12|
|2022-10        |v0.8.0-webview     |                 140|                   140|            244|
|2022-10        |v0.4.34            |                   2|                     2|              2|
|2022-10        |                   |                  10|                    10|             12|
|2022-09        |v0.8.0-xwalk       |                  17|                    18|            139|
|2022-09        |v0.8.0-webview     |                 350|                   351|           3255|
|2022-09        |v0.5.0             |                   1|                     1|              8|
|2022-09        |v0.4.34            |                  24|                    24|             69|
|2022-09        |                   |                  64|                    61|            143|
|2022-08        |v0.8.0-xwalk       |                  27|                    30|            181|
|2022-08        |v0.8.0-webview     |                 365|                   376|           3169|
|2022-08        |v0.5.0             |                   1|                     1|             12|
|2022-08        |v0.4.34            |                  25|                    25|             92|
|2022-08        |                   |                  81|                    86|            158|


### Active user counts

You can check the [monitoring API]({{< relref "building/reference/api#monitoring" >}}) with `curl` to check active users for the last `30` days.  Remember that the users can send a telemetry report once per day, so this active user count will be less than the counts from the query above. 

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


|user|cht_android_version|
|----|-------------------|
|adj |v0.11.0-webview    |

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


|user            |cht_android_version|
|----------------|-------------------|
|moh-west-chw-1  |v1.0.1-4           |
|moh-west-chw-12 |v1.0.1-4           |
|moh-west-chw-14 |v1.0.1-4           |
|moh-west-chw-3  |v1.0.1-4           |
|moh-west-chw-3  |v1.0.1-5           |
|moh-west-chw-4  |v1.0.1-5           |
|moh-west-chw-5  |v1.0.1-4           |
|moh-west-chw-6  |v1.0.1-5           |
|moh-west-chw-7  |v1.0.1-5           |
|moh-west-chw-8  |v1.0.1-4           |
|adj             |v0.11.0-webview    |

## CHT Conf

[CHT Conf](https://github.com/medic/cht-conf/) has been upgraded to be aware of forms written to work in CHT 3.x that may not work in CHT 4.x.  Upgrading, can help you identify forms in need of fixing when pushing to dev instances as outlined below.

To upgrade app, run `npm update cht-conf`

## cht-conf-test-harness

The [cht-conf-test-harness](http://docs.communityhealthtoolkit.org/cht-conf-test-harness) has [been upgraded](https://forum.communityhealthtoolkit.org/t/announcing-release-of-cht-conf-test-harness-3-0/2393) (in version 3.x of the cht-conf-test-harness) to support testing CHT 4.x forms. When preparing to upgrade to CHT 4.x, it is important to use the [latest version](https://www.npmjs.com/package/cht-conf-test-harness?activeTab=versions) of the cht-conf-test-harness for automated testing.

_(Note that the 3.x version of cht-conf-test-harness only supports CHT 4.x.  If you are still running CHT 3.x, you should continue using cht-conf-test-harness 2.x.)_

The [breaking Enketo changes](#enketo) included in CHT 4.x are reflected in cht-conf-test-harness 3.x. Running your automated tests with the latest test harness can help identify potential form issues.

## Enketo

CHT 4.0 [upgrades the version of Enketo](https://github.com/medic/cht-core/pull/7256) used to render forms. This upgrade provides a ton of bug fixes and enhancements (particularly around ODK spec compliance) which will make the forms experience in the CHT even better! (For example, we now have proper support for `repeat`s with a dynamic length, including the various XPath functions necessary to take full advantage of this functionality!)  That being said, it does introduce a few changes which may affect the way your forms function (or even cause some forms to fail to load at all).


### Manual testing

You can also manually test your forms on a non-prod CHT instance. It is possible to test your forms against the new Enekto changes without having to uplift your non-prod CHT instance to the new 4.0 architecture.

An easy way of doing this is to use the [CHT 3.x Docker Helper](https://github.com/medic/cht-core/blob/master/scripts/docker-helper/cht-docker-compose.sh) to deploy a 3.x CHT instance. After you have your dev instance up and running, use [Horticulturalist](https://github.com/medic/horticulturalist) to upgrade to the `3.17.0-FR-enketo-upgrade` [feature release]({{< relref "community/contributing/code/releasing/feature_releases" >}}):

```shell
COUCH_URL=https://medic:password@*your-my.local.ip.co-address*:8443/medic horti --local --install=3.17.0-FR-enketo-upgrade-beta.1
```

After pushing your app config (see "CHT Conf" above), you can proceed to go through each of your forms in a browser and on a device to ensure there's no errors.

### Notable changes to form behavior

#### XPath expressions

* Proper syntax in XPath expressions is more strictly enforced (e.g. parameters passed to the `concat` function must be separated by commas)
    * The `+` operator can no longer be used to concatenate string values in an expression. Although previous versions of Enketo supported this functionality, it was never part of the [ODK Specification](https://docs.getodk.org/form-operators-functions/#math-operators).  The [`concat` function](https://docs.getodk.org/form-operators-functions/#concat) should be used instead. 
* The behavior of expressions referencing _invalid XPath paths_ (both absolute and relative) has changed. Previously, an invalid XPath path (one pointing to a non-existent node) was evaluated as being equivalent to an empty string. So, `/invalid/xpath/path = ''` would evaluate to `true`. Now that expression will evaluate to `false` since invalid XPath paths are no longer considered equivalent to empty strings.
    * Validation has been added to `cht-conf` that can detect many invalid XPath paths and will provide an error when trying to upload a form.
* The value returned for an _unanswered_ number question, when referenced from an XPath expression, has changed from `0` to `NaN`. This can affect existing logic comparing number values to `0`.

#### Layout

* The `horizontal` and `horizontal-compact` appearances are now deprecated (a warning will be displayed by cht-conf when uploading to the server). The `columns`, `columns-pack`, and `columns-n` appearances should be used instead. See [the documentation](https://docs.getodk.org/form-question-types/#select-widget-with-columns-pack-appearance) for more details.
* [Markdown syntax](https://docs.getodk.org/form-styling/#markdown) is now supported for all question labels (and not just `note` fields).

#### Updated XPath functions

* The `format-date` and `format-date-time` functions no longer accept month values that are `<= 0` (e.g. `1984-00-23`). This is notable because some patterns for calculating dates based on an offset of a certain amount of years/months relied on this functionality (e.g. birth date).
    * See the details below regarding the new `add-date` function for a cleaner way of calculating dates based on an offset.
* The behavior of the `today` function has changed to return the current date at _midnight_ in the current timezone instead of at the _current time_. To get the current date _and current time_ use the `now` function.
* `decimal-date-time`:
    * The behavior of this function has changed with regard to the default timezone used when calculating the decimal value of a date that does not include any timezone information. _(Note that the values from basic `date` questions do NOT include time zone information.)_ Previously, the timezone used in the calculation for dates with no timezone information was UTC. Now, the user's current timezone will be used.
        * Practically speaking, this means it is no longer safe to assume that the output from `decimal-date-time`, for a value from a basic `date` question, will be a whole number. Now it is likely that a _decimal value_ will be returned (with the numbers after the decimal point representing the offset of the user's timezone from UTC).
    * Previously this function would accept various string parameters (e.g. date strings with various formats) as input. Now, the only string values it will only accept are ones formatted according to ISO 8601 (e.g. `2022-10-03`).
        * Strings containing date values should be parsed with the [`date` function](https://docs.getodk.org/form-operators-functions/#date) before calling `decimal-date-time`.

#### New XPath functions

* Custom CHT functions:
    * [`add-date`]({{< relref "building/forms/app#add-date" >}}) - Adds the provided number of years/months/days/hours/minutes to a date value.
* ODK Functions:
    * Repeats and other node sets:
        * [`position`](https://docs.getodk.org/form-operators-functions/#position) - Returns the current iteration index within a repeat group.
        * [`count`/`count-non-empty`](https://docs.getodk.org/form-operators-functions/#count) - Returns the number of elements in a repeat group.
            * Now is re-calculated when the size of the `repeat` changes
    * [`once`](https://docs.getodk.org/form-operators-functions/#once) - Returns the value of the given expression if the question's value is empty. Otherwise, returns the current value of the question.
    * [`checklist`/`weighted-checklist`](https://docs.getodk.org/form-operators-functions/#checklist) - Returns `True` when the required number of affirmative responses is given.

#### Known issues

##### Active

* [A regression](https://github.com/medic/cht-core/issues/8225) added in `4.6.0`, causes the [contact selector functionality](https://docs.communityhealthtoolkit.org/building/guides/forms/form-inputs/#contact-selector) to not work as expected when loading contact data into the `inputs` group _when the group is non-relevant._ More details, including a viable workaround, are documented on the  [issue](https://github.com/medic/cht-core/issues/8225).

##### Resolved

* The answer to a non-relevant question [is not immediately cleared](https://github.com/medic/cht-core/issues/7674) when the question becomes non-relevant and is still provided to XPath expressions that reference the question. When the form is submitted, the non-relevant answers will be cleared and any dependent XPath expressions will be re-evaluated.
    * This behavior applies both to questions that were answered and later became non-relevant as well as to questions which have configured default values.
    * This issue was resolved in CHT `4.6.0` and so only affects versions `4.0` - `4.5`. 
* In `3.x` versions of the CHT you could simulate a _bulleted list_ in a form label (e.g. a `note`) by using `-` or `*`. Now, in `4.x`, the bullets are no longer properly displayed in the label due to [this bug](https://github.com/medic/cht-core/issues/8002). 
    * This issue was resolved in CHT `4.6.0` and so only affects versions `4.0` - `4.5`.

#### Community cht-upgrade-helper

An unofficial [cht-upgrade-helper](https://github.com/jkuester/cht-upgrade-helper) utility has been created by a community member that can help flag form elements that should be manually reviewed before upgrading to `4.0.0`. It is not officially supported by Medic and is provided as-is. 
