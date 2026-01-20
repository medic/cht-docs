---
title: "Preparing to Upgrade to CHT 5.0"
linkTitle: "Preparing for 5.0"
weight: 10
description: >
  Steps to ensure your CHT App will run smoothly on CHT 5.0 and later
---

## Introduction

CHT releases use [Semantic Versioning](https://en.wikipedia.org/wiki/Semver#Semantic_versioning) (also known as "SemVer"), which means that the CHT upgrade from the major 4.x version to the 5.x version denotes there are breaking changes. The key to a successful upgrade will be to understand and plan for these breaking changes.

As with all upgrades, major or minor, you should always:
* Have [backups]({{< relref "/hosting/cht/docker/backups/" >}}) that have been tested to work
* Ensure your [CHT Conf]({{< relref "/community/contributing/code/cht-conf/" >}}) version is up to date
* Review the change log to understand how end users might be affected
* Check [troubleshooting upgrades](/hosting/cht/upgrade-troubleshooting/) guide if the upgrade doesn't succeed

Read though this entire document before upgrading and pay special attention to the "Breaking Changes" section to know which of of the changes are applicable.

## Breaking Changes

### Upgrade service removed from Kubernetes

{{< callout type="info" >}} Applies to: [Kubernetes]({{< relref "/hosting/cht/kubernetes/" >}}) hosted CHT instances {{< /callout >}}

In CHT 4.x there are two ways to upgrade a Kubernetes hosted CHT instance:

1. Click "Stage" and then "Upgrade" in the CHT administration interface.  
2. Push a new helm chart to Kubernetes that specified different versions.

A recurring problem seen on production deployments was that, over time, CHT administrators would use the CHT administration interface to upgrade.  Then, during a migration or a restore from backup, Kubernetes administrators would inadvertently downgrade a CHT instance by using an out of date Helm chart.

To avoid this situation, starting with 5.0.0, the "Upgrade" button has been removed from Kubernetes based deployments, so only the "Stage" button will show.  Here is a mockup of what it look like:

![k8s.no.upgrade.button.png](preparing-for-5/k8s.no.upgrade.button.png)

Deployments which used the now deprecated [CHT 4.x Helm Charts](https://github.com/medic/helm-charts/),  will need to [migrate](/hosting/cht/migration/helm-charts-4x-to-5x-migration/) to the  [5.x charts](/hosting/cht/migration/helm-charts-4x-to-5x-migration/), now moved to the CHT Core repository. 

{{< callout type="warning" >}}
Deployments should only use the "Stage" button when upgrading from 4.x to 5.x in Kubernetes. Once staging completes, it is safe to upgrade through helm upgrade!

If a 4.x deployment uses the "Upgrade" button for a 5.x version in the admin web GUI, the upgrade may appear to succeed. However the Nouveau service will not be deployed.  This means both replication and synchronization for offline users will not work.  To fix both, follow the helm upgrade per above which will ensure the Nouveau service is working as expected.
{{< /callout >}}

Background information:
* [Add documentation for migrating from 4.x medic/helm-charts to the new production charts in 5.x cht-core](https://github.com/medic/cht-docs/issues/1943)
* [Hide upgrade button in admin app for k8s deployments, while still allowing staging upgrades](https://github.com/medic/cht-core/issues/9954)
* [Remove upgrade service from Helm charts](https://github.com/medic/cht-core/issues/10186)

### Token login requires `app_url`

{{< callout type="info" >}} Applies to: Instances that use [token login]({{< relref "/building/login/#magic-links-for-logging-in-token-login" >}}) {{< /callout >}}

For instances that use token login,  be sure to declare `app_url` in your [settings file]({{< relref "/building/reference/app-settings/token_login/#app_settingsjson-token_login" >}}). This is backwards compatible and safe to do while still on CHT 4.x.

Background information:
* [Require `app_url` to be set when enabling `token_login`](https://github.com/medic/cht-core/issues/9983)

### Enabling languages via generated docs

{{< callout type="info" >}} Applies to: Instances that enable languages via web interface {{< /callout >}}

As of [CHT 4.2.0]({{< relref "/releases/4_2_0/#technical-improvements" >}}), deployment administrators can enable or disable supported languages [via the settings file]({{< relref "/building/reference/app-settings/#app_settingsjson" >}}). 

Before upgrading, ensure [your app settings]({{< relref "/building/reference/app-settings/#app_settingsjson" >}}) has the correct languages enabled. This is backwards compatible and safe to do while still on CHT 4.x. If you're unsure if this applies to you, double check your app settings.

If `languages` is not set, the login screen will show all languages.  Fix it by declaring the `languages` per above.

Background information:
* [Deprecate enabling languages through generated docs](https://github.com/medic/cht-core/issues/8157)
* [Allow app builders to specify disabled languages in config](https://github.com/medic/cht-core/issues/6281)


### Declarative Configuration 

{{< callout type="info" >}}Applies to: All Instances{{< /callout >}}

Deployments that have not compiled their app settings config in a very long time with a new version of CHT Conf,  when logging in as an offline user may see, `Error: Rules Engine: Rules are not declarative. Updates are required.`

Additionally, the web developer console will show:

```shell
Error selecting contact Error: Rules Engine: Rules are not declarative. Updates are required.
ERROR Error: Uncaught (in promise): TypeError: Cannot read properties of null (reading 'doc')
TypeError: Cannot read properties of null (reading 'doc')
```

The fix is to:
1. Update [CHT Conf](/community/contributing/code/cht-conf/) to be current
2. Recompile the app settings and upload them to the CHT. Be sure to replace the value of `--url` to the current password, URL and port: `cht --url=https://medic:password@example.com:12345 compile-app-settings upload-app-settings`


Background information:
* [Make declarative config mandatory](https://github.com/medic/cht-core/issues/5906)

### CHT 4.0 - 4.4 upgrade to CHT 4.5 first

{{< callout type="info" >}} Applies to: CHT versions between 4.0 and 4.4  {{< /callout >}}

Deployments running CHT Version 4.0 through 4.4 must upgrade to version 4.5 or later before upgrading to version 5.x. This accounts for changes to ecmaVersion ES linting to version 6.

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

CHT 5.0 is preparing for an upgrade to [Angular 20](https://blog.angular.dev/announcing-angular-v20-b5c9c06cf301). As this version of Angular will require Chrome 107 or later, we're making this a requirement in 5.0 as a breaking change to pave the path for the upgrade later. When [researching the impact of this upgrade](https://github.com/medic/cht-core/issues/10029#issuecomment-3358338361) we surveyed over 100,000 end users devices and found that less than 0.5% of users are affected.  These users are running Chrome 106 released 3 years ago at this writing. A best practice is to have users always run the latest version if possible.

To check if any of your users are impacted, check the [user-devices API](/building/reference/api/#get-apiv2exportuser-devices). This is an authenticated API endpoint and will return JSON for all users for all time.  As this may include multiple entries per user, it's important to filter out duplicate users and those running Chrome 107 or later. 

Before starting, be sure `curl`, `jq` and `sort` are installed. In Ubuntu server, this looks like: `sudo apt update&&sudo apt install jq coreutils curl`. After confirming these tools are installed, save the output of the API to a JSON file being sure to replace `user`, `password` and `URL` with their correct values for your production instance:

```shell
curl https://user:password:URL/api/v2/export/user-devices > devices.json 
```

{{< callout type="warning" >}}
For large instances with more than 2,000 users, run the API call after hours.  It can have an adverse impact on CHT server performance.
{{< /callout >}}

Now that you have the `devices.json` JSON file, flatten it into a CSV file with just one row per user. Note that we're only finding users of the APK (`select(.apk|length> 0)`) and the Chrome browser (`select(.browser.name == "Chrome"`). This excludes desktop and Firefox users which will show up in the JSON as well.  Finally, we're also only showing users active since `2025-04-01`, 6 months ago as of this writing (`select(.date > "2025-04-01")`).  Be sure to update this date to be a relative 6 months ago from when you run the command:

```shell
jq -r '.[] |  select(.apk|length> 0) 
  | select(.browser.name == "Chrome")
  | select(.date > "2025-04-01")
  | "\(.deviceId) \(.user) \(.date) \(.browser.version)"' \
  devices.json | sort -u -k1,2r \
  | sort -u -k1,1 | cut -f2,3,4 -d' '| sort -rh -k3 \
  | sed 's/ /,/g' > devices.csv
```

The resulting file `devices.csv` will have all of your users sorted by the version of Chrome they use.  Scroll to the bottom and find any users running a version lower than `107` and ensure they update to a newer version.  The easiest way to upgrade is to open the Play Store and update any out of date software, being sure to update [WebView](https://play.google.com/store/apps/details?id=com.google.android.webview&hl=en).

For instances with users who share devices, or have multiple devices they log in on, they may have multiple entries. This is because the CHT creates one entry per device per user. Be sure to upgrade all affected devices!

Background information:
* [Upgrade to Angular 20](https://github.com/medic/cht-core/issues/10029)


## Non-Breaking Changes

{{< callout >}}
These changes apply to all deployments.  No specific action is required, but administrators should be aware of the changes.
{{< /callout >}}

### CouchDB Nouveau

A major feature of CHT 5.0 is replacing the freetext search in 4.x with CouchDB Nouveau. The addition of Nouveau [decreases the amount of disk space](https://github.com/medic/cht-core/issues/9898#issuecomment-2864545914) used by the CHT.  Disk space is a major contributor to hosting costs, hence Nouveau is a feature meant to [reduce Hosting Total Cost of Ownership (TCO)](https://github.com/medic/cht-roadmap/issues/171).

Nouveau has the following impact on all CHT deployments upgrading to 5.0:

* Offline users' devices will have their search indexes rebuilt after the upgrade. During the rebuild, search functionality will be initially unavailable. However, once indexing is complete, the search behavior will remain unchanged for all users: the search experience is the same in both CHT 4.x and CHT 5.x.
* The Nouveau index data on the server will be stored in `${COUCHDB_DATA}/nouveau` for single-node CouchDBs and in `${DB1_DATA}/nouveau` for clustered CouchDBs.
* The following `medic-client` views no longer exist. Be sure to update any custom scripts which use them:  `contacts_by_freetext`,  `contacts_by_type_freetext` and  `reports_by_freetext` .

### Additional disk storage required for upgrading

{{< callout type="warning" >}}
  IMPORTANT: Disk Space Requirement for 5.x Upgrade

  Before upgrading to version 5.x, ensure your instance has at least 5x the current disk space used. This is a critical requirement for a successful upgrade. Insufficient disk space may cause the upgrade to fail.
{{< /callout >}}

An internal mechanism of CouchDB requires **up to 5x disk space** when updating views. As a side-effect of all the performance and TCO changes in 5.0.0, some views were either moved or removed, and as a result, two large design documents need reindexing.  

In our testing, the total database storage size increased during indexing to 5x, as seen in this graph:

{{< cards >}}
{{< card  image="/releases/images/5_0_reduction2.png"  title="Disk space storage requirement during 5.0.0 upgrade">}}
{{< /cards >}}

This issue is not limited to the upgrade to 5.0.0 alone. [Any upgrade that requires indexing new views requires additional disk space.](/hosting/cht/requirements/#production-hosting)

### Temporary downtime for replication and online search immediately after upgrade

With the addition of both [the disk use reduction](/releases/5_0_0/#reducing-hosting-total-cost-of-ownership) feature and [replication speed improvements](/releases/5_0_0/#seconds-to-synchronize-lower-is-better), two indexes need to be built in CouchDB Nouveau after the upgrade. While these indexes are being created, there's a brief initialization period where the following services will become available shortly: 
* Replication for offline users - Replication will start working once the indexing jobs complete. In the meantime, requests will timeout after 1h. Users will see "sync failed" messages. 
* Search for online users - Search functionality will return results as soon as indexing finishes.

The indexes build automatically; no manual intervention is required. This is a one-time process that occurs only when upgrading from 4.x to 5.0. Subsequent upgrades from 5.0 to later versions and fresh 5.0 installations are unaffected.


What to expect:

- Small deployments: Indexes typically complete within minutes, and you may not notice any service interruption.
- Large deployments: Index building may take up to 24 hours, depending on data volume.
- All deployments: Services automatically resume normal operation once indexing completes.

Monitoring progress:
You can track the indexing progress in real-time by navigating to Fauxton's active tasks page at `/_utils/#/activetasks` (for example, `https://cht.example.com/_utils/#/activetasks`). Once all `search_indexer` tasks have disappeared from the list, the upgrade is complete and all services are operational.

Background information:
* [Reduce disk space with CouchDB Nouveau (TCO)](https://github.com/medic/cht-core/issues/9542)
* [Temporary downtime for replication and online search immediately after 5.0 upgrade](https://github.com/medic/cht-core/issues/10460)
