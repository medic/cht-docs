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
-->
Kubernetes based deployments will need to follow the migration steps from the deprecated [CHT 4.x Helm Charts repository](https://github.com/medic/helm-charts/) to the new [CHT 5.x Helm Charts](https://github.com/medic/cht-core/tree/master/scripts/build/helm) in the main CHT repository. Please see the TK technical guide on how to migrate Kubernetes based deployments to 5.0.

Background information:
* [Hide upgrade button in admin app for k8s deployments, while still allowing staging upgrades](https://github.com/medic/cht-core/issues/9954)
* [Remove upgrade service from Helm charts](https://github.com/medic/cht-core/issues/10186)

### Token login requires `app_url`

{{< callout type="info" >}} Applies to: Instances that use [token login]({{< relref "/building/login/#magic-links-for-logging-in-token-login" >}}) {{< /callout >}}

For instances that use token login,  be sure declare `app_url` in your [settings file]({{< relref "/building/reference/app-settings/token_login/#app_settingsjson-token_login" >}}). This is backwards compatible and safe to do while still on CHT 4.x.  
For instances that use token login,  be sure declare `app_url` in your [settings file]({{< relref "/building/reference/app-settings/token_login/#app_settingsjson-token_login" >}}). This is backwards compatible and safe to do while still on CHT 4.x.  

Be sure to use [the new declarative config](#declarative-configuration) as well.

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

Be sure to [update](#token-login-requires-app_url) your `app_url` in settings if you're using token login..

Background information:
* [Make declarative config mandatory](https://github.com/medic/cht-core/issues/5906)

### Increase ecmaVersion ES linting to version 6

{{< callout type="info" >}} Applies to: CHT versions between 4.0 and 4.4  {{< /callout >}}

Deployments running CHT Version 4.0 and 4.4 must upgrade to version 4.5 or later before upgrading to version 5.x.

Background information:
* [Increase ecmaversion linting for ddocs](https://github.com/medic/cht-core/issues/9202)

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
