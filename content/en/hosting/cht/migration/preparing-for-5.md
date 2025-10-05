---
title: "Preparing to upgrade to CHT 5.0"
linkTitle: "Preparing for 5.0"
weight: 
description: >
  Steps to ensure your CHT App will run smoothly on CHT 5.0 and later
  
---

## Introduction

CHT releases use [Semantic Versioning](https://en.wikipedia.org/wiki/Semver#Semantic_versioning) (also known as "SemVer"), which means that the CHT upgrade from the major 4.x version to the 5.x version denotes there are breaking changes. The key to a successful upgrade will be to understand and plan for these breaking changes.

As with all upgrades, major or minor, you should always:
* Have [backups]({{< relref "/hosting/cht/docker/backups/" >}}) that have been tested to work
* Ensure your [CHT Conf]({{< relref "/community/contributing/code/cht-conf/" >}}) version is up to date
* Review the change log to understand how end users might be affected

Read though this entire document before upgrading and pay special attention to the "Breaking Changes" section to know which of of the changes are applicable.

## Breaking Changes

### Upgrade service removed from Kubernetes

{{< callout type="info" >}} Applies to: [Kubernetes]({{< relref "/hosting/cht/kubernetes/" >}}) hosted CHT instances {{< /callout >}}

In CHT 4.x there are two ways to upgrade a Kubernetes hosted CHT instance:

1. Click "Stage" and then "Upgrade" in the CHT administration interface.  
2. Push a new helm chart to Kubernetes that specified different versions.

A recurring problem seen on production deployments was that, over time, CHT administrators would use the CHT administration interface to upgrade.  Then, during a migration or a restore from backup, Kubernetes administrators would inadvertently downgrade a CHT instance by using an out of date Helm chart.

To avoid this situation, the upgrade service has been removed from Kubernetes based deployments.

<!-- 
    todo: fix TK link to technical guide: 
    tracking in: https://github.com/medic/cht-docs/pull/1989
    URL will be: hosting/cht/migration/helm-charts-4x-to-5x-migration
-->
Kubernetes based deployments will need to follow the migration steps from the deprecated [CHT 4.x Helm Charts repository](https://github.com/medic/helm-charts/) to the new [CHT 5.x Helm Charts](https://github.com/medic/cht-core/tree/master/scripts/build/helm) in the main CHT repository. Please see the TK technical guide on how to migrate Kubernetes based deployments to 5.0.

Background information:
* [Hide upgrade button in admin app for k8s deployments, while still allowing staging upgrades](https://github.com/medic/cht-core/issues/9954)
* [Remove upgrade service from Helm charts](https://github.com/medic/cht-core/issues/10186)

### Token login requires `app_url`

{{< callout type="info" >}} Applies to: Instances that use [token login]({{< relref "/building/login/#magic-links-for-logging-in-token-login" >}}) {{< /callout >}}

For instances that use token login,  be sure declare `app_url` in your [settings file]({{< relref "/building/reference/app-settings/token_login/#app_settingsjson-token_login" >}}). This is backwards compatible and safe to do while still on CHT 4.x.

Background information:
* [Require `app_url` to be set when enabling `token_login`](https://github.com/medic/cht-core/issues/9983)

### Enabling languages via generated docs

{{< callout type="info" >}} Applies to: Instances that enable languages via web interface {{< /callout >}}

As of [CHT 4.2.0]({{< relref "/releases/4_2_0/#technical-improvements" >}}), deployment administrators can enable or disable supported languages [via the settings file]({{< relref "/building/reference/app-settings/#app_settingsjson" >}}). CHT 5.0 removes this web interface to enable or disable languages and requires this to be done via App Settings.

Before upgrading, ensure [your app settings]({{< relref "/building/reference/app-settings/#app_settingsjson" >}}) has the correct languages enabled. This is backwards compatible and safe to do while still on CHT 4.x. If you're unsure if this applies to you, double check your app settings.

If `launguages` is not set, the login screen will show all languages.  Fix it by declaring the `launguages` per above.

Background information:
* [Deprecate enabling languages through generated docs](https://github.com/medic/cht-core/issues/8157)
* [Allow app builders to specify disabled languages in config](https://github.com/medic/cht-core/issues/6281)


### Declarative Configuration 

{{< callout type="info" >}} Applies to: All Instances {{< /callout >}}

<!-- 
    todo: add missing TK content on how to make a declarative config
-->
tk - all the content ;)  - but upgrade your app settings to be declarative.

Background information:
* [Make declarative config mandatory](https://github.com/medic/cht-core/issues/5906)

### Increase ecmaVersion ES linting to version 6

{{< callout type="info" >}} Applies to: CHT versions between 4.0 and 4.4  {{< /callout >}}

Deployments running CHT Version 4.0 and 4.4 must upgrade to version 4.5 or later before upgrading to version 5.x.

Background information:
* [Increase ecmaversion linting for ddocs](https://github.com/medic/cht-core/issues/9202)

### Ensure booleans are used with signoff fields

{{< callout type="info" >}} Applies to: Instances where `needs_signoff` triggers replication of reports  {{< /callout >}}

In some scenarios where `needs_signoff` is set to string `"false"` instead of boolean `false`, replication will happen when it shouldn't.  This is because the string of `"false"` is a truthy value.  

CHT 5.0 now correctly enforces this to be a boolean.  Deployments to make sure that workflows that use `needs_signoff` field have a boolean instead of a string.

Background information:
* [Replication fails to filter out reports with `needs_signoff` set to false](https://github.com/medic/cht-core/issues/10183)

### Angular 20 requires Chrome 107 or later

{{< callout type="info" >}} Applies to: all instances  {{< /callout >}}

CHT 5.0 includes an upgraded version of [Angular](https://blog.angular.dev/announcing-angular-v20-b5c9c06cf301) which, in turn, requires Chrome 107 or later. When [researching the impact of this upgrade](https://github.com/medic/cht-core/issues/10029#issuecomment-3358338361) we surveyed over 100,000 end users devices and found that less than 0.5% of users are affected.  These users are running Chrome 106 released 3 years ago at this writing. A best practice is to have users always run the latest version if possible.

Before starting, be sure you system has `curl`, `jq` and `sort` commands installed. For our recommended Ubuntu server, this looks like: `sudo apt update&&sudo apt install jq coreutils curl`.

To check if any of your users are impacted, check the [user-devices API](/building/reference/api/#get-apiv2exportuser-devices). This is an authenticated API endpoint and will return JSON for all users for all time.  As this may include multiple entries per user, it's important to filter out duplicate users and of course filter out users who are running Chrome 107 or later. To do this, first, save the output of the API to a JSON file being sure to replace `user`, `password` and `URL` with their correct values for your production instance:

```shell
curl https://user:password:URL/api/v2/export/user-devices > devices.json 
```

**Note**: for large instances with more than 2,000 users, run the API call after hours.  It can have an adverse impact on CHT server performance.

Now that you have the `devices.json` JSON file, flatten it into a CSV file with just one row per user. Note that we're only finding users of the APK (`select(.apk|length> 0)`) and the Chrome browser (`select(.browser.name == "Chrome"`). This excludes desktop and Firefox users which will show up in the JSON as well.  Finally, we're also only showing users active since `2025-04-01`, 6 months ago as of this writing (`select(.date > "2025-04-01")`).  Be sure to update this date to be a relative 6 months ago from when you run the command:

```shell
jq -r '.[] |  select(.apk|length> 0) 
  | select(.browser.name == "Chrome")
  | select(.date > "2025-04-01")
  | "\(.user) \(.date) \(.browser.version)"' \
  devices.json | sort -u -k1,2r | \
  sort -u -k1,1 | sort -rh -k3 | sed 's/ /,/g' \
  > devices.csv
```

The resulting file `devices.csv` will have all of your users sorted by the version of Chrome they use.  Scroll to the bottom and find any users running a version lower than `107` and ensure they update to a newer version.  The easiest way to upgrade is to open the Play Store and update any out of date software, being sure to update [WebView](https://play.google.com/store/apps/details?id=com.google.android.webview&hl=en).


Background information:
* [Upgrade to Angular 20](https://github.com/medic/cht-core/issues/10029)


## Non-Breaking Changes

These changes apply to all deployments.  No specific action needs to be taken, but administrators should be aware of the changes.

### CouchDB Nouveau

A major feature of CHT 5.0 is replacing the old freetext search in 4.x with CouchDB Nouveau. The addition of Nouveau [decreases the amount of disk space](https://github.com/medic/cht-core/issues/9898#issuecomment-2864545914) used by the CHT.  Disk space has been shown to be a major contributor to hosting costs, hence Nouveau is the first feature to [reduce Hosting Total Cost of Ownership (TCO)](https://github.com/medic/cht-roadmap/issues/171).

Nouveau has the following impact on all CHT deployments upgrading to 5.0:

* Offline users' devices will have their search indexes rebuilt after the upgrade. During the rebuild, search functionality will be initially unavailable. However, once the indexing is complete, the search behavior will be unchanged from before for all users:  the search experience is the same in both CHT 4.x and CHT 5.x.
* The Nouveau index data on the server will be stored in `${COUCHDB_DATA}/nouveau` for single-node CouchDBs and in `${DB1_DATA}/nouveau` for clustered CouchDBs.
* The following `medic-client` views no longer exist. Be sure to update any custom scripts which use them:  `contacts_by_freetext`,  `contacts_by_type_freetext` and  `reports_by_freetext` .

Background information:
* [Reduce disk space with CouchDB Nouveau (TCO)](https://github.com/medic/cht-core/issues/9542)
