---
title: "Creating good first issues"
linkTitle: "Good First Issues"
weight: 400
description: >
  How to set new community members up for success with good first issue tickets

---


The goal of the GitHub tickets labelled with "Good First Issue" is to make it easy for a first time contributor to get started with contributing to the CHT.

1. Find an issue you know a lot about.  Ideally one where you know exactly what the steps are
2. Edit the body of the issue and add a `## Good first issue` section
3. List out the steps you would take to solve the issue. be sure to list out out any gotchas or possible errors that might come up
4. Where possible, add code snippets or links to existing code that contributor can reference or mimic.
5. Link to any relevant docs (like first [time contributors docs]({{% ref "community/contributing/first-time-contributors" %}}) etc) that will guide them

## Example ticket

Taken from [#9869](https://github.com/medic/cht-core/issues/9869) opened Apr 2025:


> **Add user storage usage to user-devices API**
> 
>  **Is your feature request related to a problem? Please describe.**
> CHWs can run out of disk space and not know why their device is not performing as expected.  Giving administrators an easy way to monitor this would be really helpful
> 
> **Describe the solution you'd like**
> Right now there's a [user-devices API](https://docs.communityhealthtoolkit.org/building/reference/api/#get-apiv2exportuser-devices) which has per user information, but does not include used and total storage space on the device.  If we add this to this report, it would make an easy way to find this data!
> 
> **Describe alternatives you've considered**
> Administrators could either manually check telemetry documents per user in Couch ([see](https://docs.communityhealthtoolkit.org/building/guides/performance/telemetry/#metadata) `deviceInfo.storage.free`) or they could set up a process like CHT Sync or couch2pg to sync this data to a Postgres database.
> 
> These are either slow (manually checking) or hard to set up (syncing data), where as the API is built in.
> 
> **Additional context**
> * [Forum discussion](https://forum.communityhealthtoolkit.org/t/storage-pressure-indicator/4795/12).
> * [Original work](https://github.com/medic/cht-core/issues/8462) on user-devices API
> 
> ### Good first issue
> 
> This ticket has the [Good first issue label](https://github.com/medic/cht-core/issues?q=state%3Aopen%20label%3A%22Good%20first%20issue%22)! This means it's been especially curated by other CHT contributors to be easy to work on for first time contributors.
> 
> To succeed on this ticket, please:
> 1. set up your [development environment](https://docs.communityhealthtoolkit.org/contribute/code/core/dev-environment/) - and ensure it works by logging in to you CHT instance
> 2. create an offline user called `test` in the administrative interface
> 3. log in as this user to ensure a unique device ID in the CHT  is created
> 4. go to [fauxton](http://localhost:5984/_utils/#database/medic-users-meta/) and create a document based on the JSON below
> 5.  do a `curl` call to the user-devices API and not it's output: `http://medic:password@localhost:5988/api/v2/export/user-devices` - ensure you see the values from the document you created above
> 6. review the code changes made when the original [User Devices API](https://github.com/medic/cht-core/pull/8797/files) was added:
>     * while 35 files were edited (a lot!) - check out the changes to `api/src/services/export/user-devices.js` and `ddocs/users-meta-db/users-meta/views/device_by_user/map.js`
>     * how might you extend these two files to include two new values based on the earlier work in this PR?
>     * look at the path in the JSON below - what will be the path you'll need to use to add the values to `map.js`?
> 
> #### Sample telemetry JSON
> 
> ```json
> {
>   "_id": "f9f8846e894b412e0ac45874d3005b01",
>   "_rev": "7-76f4d0a2b4ab01fd37acfdea84fab57c",
>   "type": "telemetry",
>   "metrics": {},
>   "device": {
>     "userAgent": "Mozilla/5.0 (Linux; Android 10; TECNO KC8 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.146 Mobile Safari/537.36 org.medicmobile.webapp.mobile.moh_togo_echis/v1.1.0-alpha.echis_togo",
>     "deviceInfo": {
>       "app": {
>         "version": "v1.1.0-alpha.echis_togo",
>         "packageName": "org.medicmobile.webapp.mobile.moh_togo_echis",
>         "versionCode": 101009900
>       },
>       "software": {
>         "androidVersion": "10",
>         "osApiLevel": 29,
>         "osVersion": "4.9.190+(LMN-OP-201103V104)"
>       },
>       "hardware": {
>         "device": "TECNO-KC8",
>         "model": "TECNO KC8",
>         "manufacturer": "TECNO",
>         "hardware": "mt6761",
>         "cpuInfo": {
>           "cores": 4,
>           "arch": "armv7l",
>           "model name": "ARMv7 Processor rev 4 (v7l)"
>         }
>       },
>       "storage": {
>         "free": 16713310208,
>         "total": 26544680960
>       },
>       "ram": {
>         "free": 490688512,
>         "total": 1919627264,
>         "threshold": 150994944
>       },
>       "network": {}
>     }
>   },
>   "metadata": {
>     "year": 2024,
>     "month": 10,
>     "day": 12,
>     "aggregate_date": "2024-10-13T09:42:59.143Z",
>     "user": "test",
>     "deviceId": "3ea7d1c5-3481-45a9-8989-728e95efda42",
>     "versions": {
>       "app": "4.9.2",
>       "forms": {
>         "abandonment": "7-df0764a3f37db1a1a673c3933ef7903f"
>       },
>       "settings": "6-d9a3d151837a45fde187d21206aa78a7"
>     }
>   },
>   "dbInfo": {
>     "doc_count": 572,
>     "update_seq": 1252,
>     "idb_attachment_format": "binary",
>     "db_name": "medic-user-test",
>     "auto_compaction": true,
>     "adapter": "idb"
>   },
>   "quux": "banana"
> }
> ```