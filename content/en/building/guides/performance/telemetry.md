---
title: "User telemetry"
linkTitle: "Telemetry"
weight: 
description: >
  Performance data of certain user actions
relatedContent: >
  technical-overview/data-flows-for-analytics
aliases:
   - /apps/guides/performance/telemetry
---

_Introduced in v3.4.0_

The app collects performance data on certain user actions which is then aggregated each day and replicated to the server. This can be used to evaluate the performance of the code and configuration and to evaluate where improvements can be made.

The aggregate doc for the previous day is created when the first telemetry item is recorded each day. This is stored in the `medic-user-<username>-meta` database on the device and replicated to the server when an internet connection is available. This user specific server db is then replicated into the `medic-users-meta` database which holds all aggregate telemetry docs for all users.

The aggregate docs' IDs follow the pattern `telemetry-<year>-<month>-<day>-<username>-<uuid>`.

{{% alert title="Note" %}}
Versions prior to v3.12.0 do aggregate in a monthly basis instead of daily, and the aggregate docs' IDs follow the pattern `telemetry-<year>-<month>-<username>-<uuid>`.
{{% /alert %}}

## Performance data

Each aggregate data point has the following fields:

| Field | Description |
|----|----|
| `sum` | A sum of all the recorded times in milliseconds. |
| `min` | The smallest time recorded in milliseconds. |
| `max` | The largest time recorded in milliseconds. |
| `count` | The number of times recorded. |
| `sumsqr` | The sum of squares of the times recorded in milliseconds. This is useful to see the variance, for example, a lower sumsqr can be indicative of having data closer together. |

The CHT records the Apdex (Application Performance Index) that is an open standard for measuring performance of software applications. Its purpose is to convert measurements into insights about user satisfaction, by specifying a uniform way to analyze and report on the degree to which measured performance meets user expectations. 

The Apdex level is `satisfied` when the duration is less than or equal to 3s; `tolerable` when the duration is more than 3s but less than or equal to 12s; `frustrated` when duration is more than 12s. The Apdex is recorded as a telemetry entry using the format: `<telemetry_field>:apdex:<satisfied/tolerable/frustrated>`, for example, if the telemetry is about boot time and it had a tolerable performance, the Apdex is recorded as `boot_time:apdex:tolerable`. 

Find below the list of telemetry data recorded by CHT:

| Field                                                              | Description                                                                                                                                                                                                                                                                                                                                                            | Apdex |
|--------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----|
| `boot_time`                                                        | The overall boot time including loading the code, purging, and accessing the database.                                                                                                                                                                                                                                                                                 | Yes. Added in 4.7|
| `boot_time:1:to_first_code_execution`                              | The time between the page loading and the JavaScript starting to run.                                                                                                                                                                                                                                                                                                  | |
| `boot_time:2:to_bootstrap`                                         | The time between JavaScript starting and the bootstrapping (purging, initial replication, etc) to complete.                                                                                                                                                                                                                                                            | |
| `boot_time:2_1:to_replication`                                     | The time it takes to complete initial replication. If initial replication was interrupted and retried, this value will be incorrect. Added in 3.14.                                                                                                                                                                                                                    | |
| `boot_time:2_2:to_purge`                                           | The time it takes to complete the purge. Added in 3.14 and removed in 4.3.                                                                                                                                                                                                                                                                                             | |
| `boot_time:2_3:to_purge_meta`                                      | The time it takes to complete the purge of local meta database. Added in 3.14.                                                                                                                                                                                                                                                                                         | |
| `boot_time:3:to_angular_bootstrap`                                 | The time between bootstrapping completing and the webapp being ready to use.                                                                                                                                                                                                                                                                                           | |
| `boot_time:4:to_db_warmed`                                         | The time between the webapp being ready to use and the database being ready to use. Added in 3.6 and removed in 3.8.                                                                                                                                                                                                                                                   | |
| `boot_time:purging:<boolean>`                                      | `boot_time:purging:true` when purging ran successfully on device startup, `boot_time:purging:false` when purging did not run. Added in 3.14 and removed in 4.3.                                                                                                                                                                                                        | |
| `boot_time:purging_failed`                                         | The purging failed when running on device startup. Added in 3.14 and removed in 4.3.                                                                                                                                                                                                                                                                                   | |
| `boot_time:purging_meta:<boolean>`                                 | `boot_time:purging_meta:true` when purging of the local meta database ran successfully, `boot_time:purging_meta:false` when it did not run. Added in 3.14.                                                                                                                                                                                                             | |
| `boot_time:purging_meta_failed`                                    | The purging of the local meta database failed. Added in 3.14.                                                                                                                                                                                                                                                                                                          | |
| `contact_list:load`                                                | The time taken to load the list of contacts on the left hand side of the Contacts tab. Added in 4.7.                                                                                                                                                                                                                                                                   | Yes. Added in 4.7|
| `contact_list:query`                                               | The time taken to query the People tab on initial load, when searching or sorting, this metric covers from fetching the data to preparing the data before display. Added in 4.7.                                                                                                                                                                                       | Yes. Added in 4.7|
| `enketo:reports:<form>:<action>:<component>`                       | The time taken to fill in app forms that are opened from Reports Tab. The `action` can either be "add" or "edit". The `component` is one of: "render" covers getting the form and rendering it on screen; "user_edit_time" is the time the user took to fill in and submit the form; or "save" is about converting the form into a report and saving it.               | Yes, added for `render` and `save` actions. Added in 4.7 |
| `enketo:contacts:<form>:<action>:<component>`                      | The time taken to fill contact forms and app forms that are opened from People Tab. The `action` can either be "add" or "edit". The `component` is one of: "render" covers getting the form and rendering it on screen; "user_edit_time" is the time the user took to fill in and submit the form; or "save" is about converting the form into a report and saving it. |  Yes, added for `render` and `save` actions. Added in 4.7 |
| `enketo:tasks:<form>:<action>:<component>`                         | As above but for forms on the Tasks tab.                                                                                                                                                                                                                                                                                                                               | Yes, added for `render` and `save` actions. Added in 4.7 |
| `message_list:load`                                                | The time taken to load the list of messages on the left hand side of the Messages tab. Added in 4.7.                                                                                                                                                                                                                                                                   | Yes. Added in 4.7 |
| `search:contacts`                                                  | The time taken to list all contacts.                                                                                                                                                                                                                                                                                                                                   | |
| `search:contacts:<filter[:filter]>`                                | The time taken to search all contacts using the given filters.                                                                                                                                                                                                                                                                                                         | |
| `search:reports`                                                   | The time taken to list all reports.                                                                                                                                                                                                                                                                                                                                    | |
| `search:reports:<filter[:filter]>`                                 | The time taken to search all reports using the given filters.                                                                                                                                                                                                                                                                                                          | |
| `contact_detail:<contact_type>:load`                               | On the People tab, the time taken to load a contact, from the time the contact was selected to the time all content for that contact (contact summary, condition cards, reports, tasks, etc...) has fully loaded on the screen. Added in 4.7.                                                                                                                          |  Yes. Added in 4.7|
| `contact_detail:<_form>:load:contact_data`                         | The time taken to load a contact's data. Added in 4.7.                                                                                                                                                                                                                                                                                                                 | | 
| `contact_detail:<_form>:load:load_descendants`                     | The time taken to load a contact's descendants, that is places and contacts under the contact hierarchy level. Added in 4.7.                                                                                                                                                                                                                                           | |
| `contact_detail:<_form>:load:load_reports`                         | The time taken to load a contact's associated reports. Added in 4.7.                                                                                                                                                                                                                                                                                                   | |
| `contact_detail:<_form>:load:load_targets`                         | The time taken to load a contact's targets. Added in 4.7.                                                                                                                                                                                                                                                                                                              | |
| `contact_detail:<_form>:load:load_tasks`                           | The time taken to load a contact's tasks. Added in 4.7.                                                                                                                                                                                                                                                                                                                | |
| `contact_detail:<_form>:load:load_contact_summary`                 | The time taken to load a contact's contact-summary. Added in 4.7.                                                                                                                                                                                                                                                                                                      | |
| `report_detail:<form>:load`                                        | On the Reports tab, the time taken to load a report from the point it was selected on the left hand side to the time it was fully rendered. Added in 4.7.                                                                                                                                                                                                              | Yes. Added in 4.7 |
| `messages_detail:load`                                             | On the Messages tab, the time taken to load the messages detail on the right hand side once has been selected from the list on the left hand side. Added in 4.7.                                                                                                                                                                                                       | Yes. Added in 4.7 |
| `sidebar_filter:reports:open`                                      | Number of times the user opens the sidebar filter in Reports tab.                                                                                                                                                                                                                                                                                                      | |
| `sidebar_filter:analytics:target_aggregates:open`                  | Number of times the user opens the sidebar filter in Aggregate Targets tab.                                                                                                                                                                                                                                                                                            | |
| `client-date-offset`                                               | The difference between the client datetime and the server datetime. Only recorded if the difference is large enough that it may cause issues.                                                                                                                                                                                                                          | |
| `analytics:targets:load`                                           | The time taken to load the targets page. Added in 3.9                                                                                                                                                                                                                                                                                                                  | Yes. Added in 4.7 |
| `analytics:target_aggregates:load`                                 | The time taken to load the target aggregates. Added in 4.7.                                                                                                                                                                                                                                                                                                            | Yes. Added in 4.7 |
| `tasks:load`                                                       | The time taken to load the tasks page. Added in 3.9                                                                                                                                                                                                                                                                                                                    | Yes. Added in 4.7 |
| `tasks:refresh`                                                    | The time taken to refresh tasks on the tasks page. Added in 3.9                                                                                                                                                                                                                                                                                                        | Yes. Added in 4.7 |
| `report_list:load`                                                 | On the Reports tab, the time taken to load the list of reports on the left hand side. Added in 4.7.                                                                                                                                                                                                                                                                    | Yes. Added in 4.7|
| `report_list:query`                                                | The time taken to query the Reports tab on initial load, when searching or filtering, this metric covers from fetching the data to preparing the data before display. Added in 4.7.                                                                                                                                                                                    | Yes. Added in 4.7|
| `rules-engine:initialize`                                          | The time taken to initialize the rules-engine . Added in 3.9                                                                                                                                                                                                                                                                                                           | |
| `rules-engine:update-emissions`                                    | Removed in 4.13. The time taken to update emissions in the rules-engine, when receiving a change. Added in 3.9                                                                                                                                                                                                                                                         | |
| `rules-engine:refresh`                                             | The time taken to refresh tasks and targets in the rules-engine, when receiving a change. Added in 4.14                                                                                                                                                                                                                                                                | |
| `rules-engine:refresh:dirty-contacts`                              | Number of "dirty" contacts[1] when refreshing targets and tasks in the rules-engine. Added in 4.14                                                                                                                                                                                                                                                                     | |
| `rules-engine:tasks:all-contacts`                                  | The time taken to fetch tasks for all contacts in rules-engine. Added in 3.9                                                                                                                                                                                                                                                                                           | | 
| `rules-engine:tasks:some-contacts`                                 | The time taken to fetch tasks for some specific contacts in rules-engine. Added in 3.9                                                                                                                                                                                                                                                                                 | |
| `rules-engine:tasks:dirty-contacts`                                | Number of "dirty" contacts[1] when fetching tasks in the rules-engine. Added in 3.9                                                                                                                                                                                                                                                                                    | |
| `rules-engine:targets`                                             | Time taken for the rules-engine to fetch targets. Added in 3.9                                                                                                                                                                                                                                                                                                         | |
| `rules-engine:targets:dirty-contacts`                              | Number of "dirty" contacts[1] when fetching targets in the rules-engine. Added in 3.9                                                                                                                                                                                                                                                                                  | | 
| `rules-engine:tasks:dirty-contacts`                                | Number of "dirty" contacts[1] when fetching tasks in the rules-engine. Added in 3.9                                                                                                                                                                                                                                                                                    | | 
| `rules-engine:ensureTaskFreshness:cancel`                          | Removed in 4.13. The time taken to cancel the automated task freshness thread in the rules-engine. This event is only recorded when the thread is cancelled before executing the refresh. Added in 3.9                                                                                                                                                                 | | 
| `rules-engine:ensureTargetFreshness:cancel`                        | Removed in 4.13. The time taken to cancel the automated target freshness thread in the rules-engine. This event is only recorded when the thread is cancelled before executing the refresh. Added in 3.9                                                                                                                                                               | |
| `rules-engine:background-refresh`                                  | The time taken automatically recalculate tasks and targets in the rules-engine when starting the app. Added in 4.14.                                                                                                                                                                                                                                                   | |
| `rules-engine:background-refresh:dirty-contacts`                   | Number of "dirty" contacts[1] when automatcally refreshing tasks and targets in the rules-engine.. Added in 4.14.                                                                                                                                                                                                                                                      | |
| `rules-engine:background-refresh:cancel`                           | The time taken to cancel the automated task and target recalculation thread in the rules-engine. This event is only recorded when the thread is cancelled before executing the refresh. Added in 4.14.                                                                                                                                                                 | |
| `rules-engine:tasks-breakdown:some-contacts`                       | The time taken to fetch the tasks breakdown by status for some contacts. Added in 3.13.                                                                                                                                                                                                                                                                                | |
| `rules-engine:tasks-breakdown:all-contacts`                        | The time taken to fetch the tasks breakdown by status for all contacts. Added in 3.13.                                                                                                                                                                                                                                                                                 | |
| `replication:user-initiated`                                       | Number of times the user clicked "Sync now". Added in 3.12.                                                                                                                                                                                                                                                                                                            | | 
| `replication:<database>:<direction>:success`                       | Time taken to replicate, when replication was successful. Added in 3.12.                                                                                                                                                                                                                                                                                               | | 
| `replication:<database>:<direction>:failure`                       | Time taken to replicate, when replication failed. Added in 3.12.                                                                                                                                                                                                                                                                                                       | | 
| `replication:<database>:<direction>:failure:reason:offline:client` | Number of times replication failed because of connection errors, and the app detects the client is offline. Added in 3.12.                                                                                                                                                                                                                                             | |
| `replication:<database>:<direction>:failure:reason:offline:server` | Number of times replication failed because of connection errors, and the app detects the client is online. Added in 3.12.                                                                                                                                                                                                                                              | | 
| `replication:<database>:<direction>:failure:reason:error`          | Number of times replication failed because of errors other than connection errors. Added in 3.12.                                                                                                                                                                                                                                                                      | |
| `replication:<database>:<direction>:docs`                          | Number of replicated docs. For `medic` replication, stores number of "read" docs, for `meta` replication, stores sum of read docs for every direction. Added in 3.12.                                                                                                                                                                                                  | | 
| `replication:medic:<direction>:ms-since-last-replicated-date`      | Time between a replication attempt and the last successful replication. Only recorded for medic database, every time replication is attempted. Added in 3.12.                                                                                                                                                                                                          | | 
| `replication:medic:<direction>:denied`                             | Number of times replication was denied[2]. Added in 3.12.                                                                                                                                                                                                                                                                                                              | |
| `tasks:group:all-tasks`                                            | Total number of tasks for the household (includes all statuses), when displaying household tasks page. Added in 3.13.                                                                                                                                                                                                                                                  | | 
| `tasks:group:cancelled`                                            | Number of cancelled tasks for the household, when displaying household tasks page. Added in 3.13.                                                                                                                                                                                                                                                                      | | 
| `tasks:group:ready`                                                | Number of tasks in "Ready" state for the household, when displaying household tasks page. Added in 3.13.                                                                                                                                                                                                                                                               | |
| `tasks:group:ready:<task_title>`                                   | Breakdown of "Ready" tasks by `task_title` for the household, when displaying household tasks page. Added in 3.13.                                                                                                                                                                                                                                                     | |
| `tasks:group:modal:confirm`                                        | Number times the user confirms navigation away from the household tasks page. Added in 3.13.                                                                                                                                                                                                                                                                           | |
| `tasks:group:modal:reject`                                         | Number times the user rejects navigation away from the household tasks page. Added in 3.13.                                                                                                                                                                                                                                                                            | |
| `user_settings:language:<language_code>`                           | The selected language by the user, example: `user_settings:language:en`. Added in 3.14.                                                                                                                                                                                                                                                                                | |
| `enketo:<training-card>:add:render`                                | The time it took to render the training card. Added in 4.2.0                                                                                                                                                                                                                                                                                                           | Yes. Added in 4.15.0 |
| `enketo:<training-card>:add:user_edit_time`                        | The time the user took to complete the training card. Added in 4.2.0                                                                                                                                                                                                                                                                                                   | |
| `enketo:<training-card>:add:save`                                  | The time it took to save the training card. Added in 4.2.0                                                                                                                                                                                                                                                                                                             | |
| `enketo:<training-card>:add:quit`                                  | The time from when the training card was rendered to when the user quits the training. Added in 4.2.0                                                                                                                                                                                                                                                                  | |
| `geolocation:success`                                              | A successful GPS response with the value showing the accuracy.                                                                                                                                                                                                                                                                                                         | |
| `geolocation:failure:<x>`                                          | An unsuccessful GPS response. `x` is a constant matching the [GeolocationPositionError](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code) or with one of the following values: `-1` unknown failure, `-2` timeout, or `-3` geolocation services unavailable.                                                                             | |
| `training_materials_list:load`                                     | On the Training Materials page, the time taken to load the list of trainings on the left hand side. Added in 4.15.0.                                                                            | Yes. Added in 4.15.0 |

[1] "Dirty" indicates that the contact's task documents are not up to date. They will be refreshed before being used.    
[2] Replication can be denied when the user doesn't have permissions to create a doc (hierarchy permissions) or when a doc fails a `validate_doc_update` check.  

Unless otherwise specified, `database` and `direction` placeholders stand for any combination of:

| database | direction |
| --- | --- |
| `medic` | `from` or `to`  |
| `meta` | `sync` |

## Metadata

When the aggregate doc is created the Telemetry service also includes a snapshot of some metadata.

| Field | Description |
|----|----|
| `year` | The year the data was collected. Added in 3.4.0. |
| `month` | The month the data was collected. Initially the month was 0 indexed (eg: 0=Jan, 1=Feb, ...), but from 3.8.0 [this bug was fixed](https://github.com/medic/cht-core/issues/5949) so it changed to 1 indexed (eg: 1=Jan, 2=Feb, ...). Added in 3.4.0. |
| `day` | The day of the month the data was collected. Added in 3.12.0. |
| `user` | The username of the logged in user. Added in 3.4.0. |
| `deviceId` | A unique key for this device. Added in 3.4.0. |
| `versions.app` | The version of the webapp. Added in 3.5.0. |
| `versions.forms.<form>` | The version of each form. Added in 3.5.0. |
| `userAgent` | The userAgent string from the user's browser. Added in 3.4.0. |
| `hardwareConcurrency` | The number of cores reported from the browser. Added in 3.4.0. |
| `screen.width` | The width of the screen in pixels. Added in 3.4.0. |
| `screen.height` | The height of the screen in pixels. Added in 3.4.0. |
| `deviceInfo.app.version` | The version name of the Android app. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.app.packageName` | The package name of the Android app. Only captured when running in the Android wrapper v0.9.0+. Added in 3.12.0. |
| `deviceInfo.app.versionCode` | The Internal [version code](https://developer.android.com/reference/android/R.styleable#AndroidManifest_versionCode) of the Android app. Only captured when running in the Android wrapper v0.9.0+. Added in 3.12.0. |
| `deviceInfo.software.androidVersion` | The version of Android OS. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.software.osApiLevel` | The API of the Android OS. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.software.osVersion` | The version of Android OS (detailed). Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.hardware.device` | The Android device name. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.hardware.model` | The Android model name. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.hardware.manufacturer` | The Android device manufacturer. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.hardware.hardware` | The Android device hardware. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.hardware.cpuInfo` | The Android device CPU information. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.storage.free` | The available storage on the device. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.storage.total` | The total storage on the device. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.ram.free` | The available RAM on the device. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.ram.total` | The total RAM on the device. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.ram.threshold` | The level of RAM at which certain services will be killed by Android. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.network.downSpeed` | The reported download speed of the network. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `deviceInfo.network.upSpeed` | The reported upload speed of the network. Only captured when running in the Android wrapper v0.4.0+. Added in 3.8.0. |
| `dbInfo.doc_count` | The number of docs in the local database. Added in 3.4.0. |
| `dbInfo.update_seq` | The update sequence of the local database. Added in 3.4.0. |
| `dbInfo.idb_attachment_format` | The format of database attachments. Added in 3.4.0. |
| `dbInfo.db_name` | The name of the local database. Added in 3.4.0. |
| `dbInfo.auto_compaction` | Whether or not auto compaction is set. Added in 3.4.0. |
| `dbInfo.adapter` | The database adapter being used. Added in 3.4.0. |

## Export data 

### Summary data via API

To get summary data with one item per user, see the `/api/v2/export/user-devices` [API]({{< ref "building/reference/api#get-apiv2exportuser-devices" >}}), which was added in CHT 4.7.0. 

### Summary data via Node script

{{% alert title="Note" %}}
Telemetry data can be viewed directly in your browser with [Fauxton](https://couchdb.apache.org/fauxton-visual-guide/) at `https://{{CHT_INSTANCE_URL}}/_utils`, and navigating the `medic-users-meta` database.
{{% /alert %}}

To bulk export all telemetry in JSON for further analysis or visualization, first meet these prerequisites:

1. Ensure that both [`node`](https://nodejs.org/en/) and [`npm`](https://www.npmjs.com/get-npm) are installed and that the needed `node` libraries are installed: `npm install inquirer pouchdb-core fs path minimist pouchdb-adapter-http`
1. Get a current copy of the export script: `curl -s -o get_users_meta_docs.js https://raw.githubusercontent.com/medic/cht-core/master/scripts/get_users_meta_docs.js` 

To export the data open a terminal in the folder where you want to save the export, and run this command:
 
```bash
node get_users_meta_docs.js --mode batch --type telemetry https://USERNAME:PASSWORD@COUCHDB_SERVER:COUCHDB_PORT/medic-users-meta > telemetry.json
``` 

For example, if your username is `admin`, your password is `pass`, your CouchDB server is `localhost` and your CouchDB port is `5984`, you would run: 

```bash
node get_users_meta_docs.js --mode batch --type telemetry https://admin:pass@localhost:5984/medic-users-meta > telemetry.json
```

This will save a file named `telemetry.json` containing all the telemetry data in the current directory. 

## Telemetry Examples

### Offline user on Tecno KC8 Device

```json
{
  "_id": "telemetry-2024-12-18-mrjones-5d2e1833-ed7a-46d7-a50e-b6f3becb9e14",
  "_rev": "1-c3b23df8b2701839d726576e3d87fd26",
  "type": "telemetry",
  "metrics": {
    "boot_time": {
      "sum": 3633.899999976158,
      "min": 3633.899999976158,
      "max": 3633.899999976158,
      "count": 1,
      "sumsqr": 13205229.209826723
    },
    "boot_time:1:to_first_code_execution": {
      "sum": 2280.2000000476837,
      "min": 2280.2000000476837,
      "max": 2280.2000000476837,
      "count": 1,
      "sumsqr": 5199312.040217456
    },
    "boot_time:2:to_bootstrap": {
      "sum": 1057.2999999523163,
      "min": 1057.2999999523163,
      "max": 1057.2999999523163,
      "count": 1,
      "sumsqr": 1117883.289899168
    },
    "boot_time:2_3:to_purge_meta": {
      "sum": 126.30000007152557,
      "min": 126.30000007152557,
      "max": 126.30000007152557,
      "count": 1,
      "sumsqr": 15951.69001806736
    },
    "boot_time:3:to_angular_bootstrap": {
      "sum": 296.39999997615814,
      "min": 296.39999997615814,
      "max": 296.39999997615814,
      "count": 1,
      "sumsqr": 87852.95998586655
    },
    "boot_time:apdex:tolerable": {
      "sum": 3633.899999976158,
      "min": 3633.899999976158,
      "max": 3633.899999976158,
      "count": 1,
      "sumsqr": 13205229.209826723
    },
    "boot_time:purging_meta:true": {
      "sum": 1,
      "min": 1,
      "max": 1,
      "count": 1,
      "sumsqr": 1
    },
    "replication:meta:sync:docs": {
      "sum": 0,
      "min": 0,
      "max": 0,
      "count": 1,
      "sumsqr": 0
    },
    "replication:meta:sync:failure": {
      "sum": 103,
      "min": 103,
      "max": 103,
      "count": 1,
      "sumsqr": 10609
    },
    "replication:meta:sync:failure:reason:offline:client": {
      "sum": 1,
      "min": 1,
      "max": 1,
      "count": 1,
      "sumsqr": 1
    },
    "rules-engine:ensureTaskFreshness:cancel": {
      "sum": 13,
      "min": 13,
      "max": 13,
      "count": 1,
      "sumsqr": 169
    },
    "rules-engine:initialize": {
      "sum": 957,
      "min": 957,
      "max": 957,
      "count": 1,
      "sumsqr": 915849
    },
    "rules-engine:targets": {
      "sum": 68,
      "min": 68,
      "max": 68,
      "count": 1,
      "sumsqr": 4624
    },
    "rules-engine:targets:dirty-contacts": {
      "sum": 0,
      "min": 0,
      "max": 0,
      "count": 1,
      "sumsqr": 0
    },
    "rules-engine:targets:queued": {
      "sum": 1,
      "min": 1,
      "max": 1,
      "count": 1,
      "sumsqr": 1
    },
    "rules-engine:tasks:all-contacts": {
      "sum": 9201,
      "min": 9201,
      "max": 9201,
      "count": 1,
      "sumsqr": 84658401
    },
    "rules-engine:tasks:all-contacts:queued": {
      "sum": 1,
      "min": 1,
      "max": 1,
      "count": 1,
      "sumsqr": 1
    },
    "rules-engine:tasks:dirty-contacts": {
      "sum": 212,
      "min": 212,
      "max": 212,
      "count": 1,
      "sumsqr": 44944
    },
    "tasks:load": {
      "sum": 11560,
      "min": 11560,
      "max": 11560,
      "count": 1,
      "sumsqr": 133633600
    },
    "tasks:load:apdex:tolerable": {
      "sum": 11560,
      "min": 11560,
      "max": 11560,
      "count": 1,
      "sumsqr": 133633600
    },
    "user_settings:language:fr": {
      "sum": 1,
      "min": 1,
      "max": 1,
      "count": 1,
      "sumsqr": 1
    }
  },
  "device": {
    "userAgent": "Mozilla/5.0 (Linux; Android 10; TECNO KC8 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.104 Mobile Safari/537.36 org.medicmobile.webapp.mobile.moh_echis/v1.4.0-moh-echis-publish.1",
    "hardwareConcurrency": 4,
    "screen": {
      "width": 360,
      "height": 800
    },
    "deviceInfo": {
      "app": {
        "version": "v1.4.0-moh-echis-publish.1",
        "packageName": "org.medicmobile.webapp.mobile.moh_echis",
        "versionCode": 104000100
      },
      "software": {
        "androidVersion": "10",
        "osApiLevel": 29,
        "osVersion": "4.9.190+(LMN-OP-210708V261)"
      },
      "hardware": {
        "device": "TECNO-KC8",
        "model": "TECNO KC8",
        "manufacturer": "TECNO",
        "hardware": "mt6761",
        "cpuInfo": {
          "cores": 4,
          "arch": "armv7l",
          "model name": "ARMv7 Processor rev 4 (v7l)"
        }
      },
      "storage": {
        "free": 5767675904,
        "total": 26175582208
      },
      "ram": {
        "free": 463101952,
        "total": 1919627264,
        "threshold": 150994944
      },
      "network": {}
    }
  },
  "metadata": {
    "year": 2024,
    "month": 12,
    "day": 18,
    "aggregate_date": "2024-12-19T11:05:35.661Z",
    "user": "mrjones",
    "deviceId": "5d2e1833-ed7a-46d7-a50e-b6f3becb9e14",
    "versions": {
      "app": "4.9.0",
      "forms": {
        "contact:clinic:create": "2-7a176b9cd9169832634b63e03d391294",
        "contact:clinic:edit": "2-fe81a67e42ef0f43d7fcd7295d7ce2f8",
        "contact:district_hospital:create": "2-00139379e7991109b19d5bfe632f5dc2",
        "contact:district_hospital:edit": "2-84bc951a4a35618329d7186b1b3fa38d",
        "contact:health_center:create": "2-69448427b175e4ba03765d9a7c058d37",
        "contact:health_center:edit": "2-ea5fd64b71c5ec20e68ad63de611baf0",
        "contact:person:create": "2-9f42c026ecb7f8343d20bf3aedd13cb4",
        "contact:person:edit": "2-1d3c910ccaae9b29b1a8faf7ae89a590",
        "death_report": "2-7f714822d6fe7b93a883d6a81036cb9f",
        "delivery": "2-97c685e244f96cf0651e044859bbb5a6",
        "pnc_danger_sign_follow_up_baby": "2-89d24a536053cb8cea5df7e72a047145",
        "pnc_danger_sign_follow_up_mother": "2-640160361599e3f342b464a934280c9f",
        "pregnancy": "2-110d0b12ff93265f5920b42d6e7d24c9",
        "pregnancy_danger_sign": "2-759bad093e027981b5aaa3271c7e5748",
        "pregnancy_danger_sign_follow_up": "2-4be953f24626861103030310539d9577",
        "pregnancy_facility_visit_reminder": "2-46bceb0e07953b4f2313ad882bb50a11",
        "pregnancy_home_visit": "2-db0284587b0a8c629f7e33beb788f75a",
        "replace_user": "2-f7e079b0740f43a271916813a4608862",
        "undo_death_report": "2-002af440802f3ca3c3ad7ef8514b0cb3"
      },
      "settings": "7-ae079730f416fd090c94df3716ff07ee"
    }
  },
  "dbInfo": {
    "doc_count": 578,
    "update_seq": 1297,
    "idb_attachment_format": "binary",
    "db_name": "medic-user-mrjones",
    "auto_compaction": true,
    "adapter": "idb"
  }
}
```

### Online user in the browser

```json
{
  "_id": "telemetry-2020-5-medic-016304ab-7167-4c97-93bb-a6626ef6128d",
  "_rev": "1-90a94d76eb30ac47e2f498b80cf54cd1",
  "type": "telemetry",
  "metrics": {
    "boot_time": {
      "sum": 3879.43500012625,
      "min": 308.0550000304356,
      "max": 1110.6599999475293,
      "count": 7,
      "sumsqr": 2616858.529000253
    },
    "boot_time:1:to_first_code_execution": {
      "sum": 2096.309999935329,
      "min": 141.66500000283122,
      "max": 558.6599999805912,
      "count": 8,
      "sumsqr": 672987.1618553334
    },
    "boot_time:2:to_bootstrap": {
      "sum": 628.5150001058355,
      "min": 70.50499995239079,
      "max": 129.88000002223998,
      "count": 7,
      "sumsqr": 58704.48214660012
    },
    "boot_time:3:to_angular_bootstrap": {
      "sum": 1415.5550000723451,
      "min": 45.25000008288771,
      "max": 787.9549999488518,
      "count": 7,
      "sumsqr": 732805.5498113176
    },
    "search:contacts:types": {
      "sum": 3728.9899999741465,
      "min": 96.60000004805624,
      "max": 1134.1099999845028,
      "count": 8,
      "sumsqr": 2939824.639961114
    },
    "search:reports:subjectIds": {
      "sum": 3825.224999745842,
      "min": 27.304999995976686,
      "max": 982.2900000144728,
      "count": 25,
      "sumsqr": 1461182.0137715642
    }
  },
  "metadata": {
    "year": 2020,
    "month": 5,
    "day": 20,
    "user": "medic",
    "deviceId": "016304ab-7167-4c97-93bb-a6626ef6128d",
    "versions": {
      "app": "master",
      "forms": {
        "client_review": "2-51ad4bd1c86c18ea768196da8264147e",
        "contact:clinic:create": "16-8dbb4dde6f8f9067e9cbed5b44ce5fd0",
        "contact:clinic:edit": "2-c1c955042db963a95470bdf891bcef6f",
        "contact:district_hospital:create": "2-42b8b579b38ca6c2978c238e7d9c78fe",
        "contact:district_hospital:edit": "2-4360bb0eb6f6ff863849a07adac7e851",
        "contact:health_center:create": "2-c9b86820479f211c8e505eba150c5203",
        "contact:health_center:edit": "2-19b3da5f9f146be07ec1854a372e374b",
        "contact:person:create": "2-230d39c41682da720b83e4909b138c9b",
        "contact:person:edit": "6-75781492122157beb7c2451861970ece",
        "death_report": "2-97cfa3cc24ee743dfea03c019d644bec",
        "delivery": "2-adf37c0da7d5e58c8e4d27fc940f70e6",
        "enroll": "10-13322d437e301f3c436e3b989a3fd384",
        "no_contact": "4-0901afd126ec6c87fe952ca3c3a652ed",
        "pnc_danger_sign_follow_up_baby": "2-12e8989f6774828bb10aa4b675bc43ff",
        "pnc_danger_sign_follow_up_mother": "2-62f58b6e0ade10d70f15df73ddb6a025",
        "pregnancy": "2-4fa3db96cae638c4cb041125c9970496",
        "pregnancy_danger_sign": "2-49758bfd894fb5db6e719bff864f9da9",
        "pregnancy_danger_sign_follow_up": "2-a9a2b6800d6f93e151a3a63359620976",
        "pregnancy_facility_visit_reminder": "2-0e3deaf22966166d05bcf803615499c8",
        "pregnancy_home_visit": "2-283eb323e61a7fc756bda61f9d9be382",
        "referral_for_care": "2-627c6c21bd54e482133acc8188a71f8d",
        "undo_death_report": "2-3a4ca8d678f0338d7044cb1bc35d103d"
      }
    }
  },
  "device": {
    "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36",
    "hardwareConcurrency": 4,
    "screen": {
      "width": 1920,
      "height": 1080
    },
    "deviceInfo": {}
  },
  "dbInfo": {
    "db_name": "medic",
    "purge_seq": "0-g1AAAAEzeJzLYWBg4MhgTmHgzcvPy09JdcjLz8gvLskBCjPlsQBJhgNA6v____ezEhnwqnsAUfefkLoFEHX7CalrgKibj1tdkgKQTLLHa2dSAkhNPX41DiA18XjVJDIkyUMUZAEAuYBi9g",
    "update_seq": "1456-g1AAAAE2eJzLYWBg4MhgTmHgzcvPy09JdcjLz8gvLskBCjMlMiTJ____PytxAg4FSQpAMskerGYhLjUOIDXxYDVTcKlJAKmpB6tZhENNHguQZGgAUkBl87MSl-JVtwCibn9WYjtedQcg6u7jdj9E3QOIuv9ZSQwMjDVZAFZfZ6g",
    "sizes": {
      "file": 67196510,
      "external": 65800620,
      "active": 65357308
    },
    "other": {
      "data_size": 65800620
    },
    "doc_del_count": 41,
    "doc_count": 497,
    "disk_size": 67196510,
    "disk_format_version": 7,
    "data_size": 65357308,
    "compact_running": false,
    "cluster": {
      "q": 8,
      "n": 1,
      "w": 1,
      "r": 1
    },
    "instance_start_time": "0",
    "host": "http://localhost:5988/medic/",
    "auto_compaction": false,
    "adapter": "http"
  }
}
```
