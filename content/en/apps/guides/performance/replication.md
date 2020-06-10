---
title: "CouchDB replication"
linkTitle: "Replication"
weight: 
description: >
  Settings for downloading copies of data onto a user's device.
keywords: 
relatedContent: >
  apps/reference/app-settings/replication_depth
  apps/guides/debugging/replicating-production-data-locally
---

Replication is what we call it when users download a copy of the data on to their device.

## Restricting replication

If the user has an online role they can access all the data, otherwise they will get restricted access to the data.

### Restriction by place

The most common restriction is by place. This is where we check the user's `facility_id` property, and allow access to all contacts that are descendants of that place, and all reports and messages that are about one of those descendants.

For example, if a CHP's `facility_id` property is set to the ID of the Maori Hill clinic, then they will be able to see all patients and all reports about patients at that clinic.

### Depth

Sometimes though you want to only access contacts near the top of the hierarchy. This may be because returning all contacts would be too much data to be practical, or for patient privacy, or because it's just not part of your workflow. In this case you can configure a replication depth for a specific role under `replication_depth` in the app settings.

In 3.10, we add the ability to limit replication depth for reports, in conjunction with replication depth for contacts.

##### Code sample:
```json
{
  "replication_depth": [
    { "role": "district_manager", "depth": 1, "report_depth": 1 },
    { "role": "national_manager", "depth": 2 }
  ]
}
```

{{% see-also page="apps/reference/app-settings/replication_depth" title="Replication Depth" %}}

##### Contact Depth

Contact depth is calculated relative to the user's home place, having the user's facility at depth = 0. Places and contacts that are direct children the facility are on depth = 1, and so on. 

For example, considering the following contact hierarchy:
```
district > health_center > clinic > area > family > patient
``` 
a `supervisor` at `health_center` level, and the following configuration:
```json
{ "replication_depth": [{ "role": "supervisor_role", "depth": <variable> }]}
``` 

The `supervisor` would download the following contacts and reports, depending on condigured depth:

| Documents                                         | depth=0 | depth=1 | depth=2 | depth=3 |
|---------------------------------------------------|---------|---------|---------|---------|
| `health_center`                                   | ✔       | ✔       | ✔       | ✔       |
| all reports about `health_center`                 | ✔       | ✔       | ✔       | ✔       |
| person children of `health_center`                | ❌       | ✔       | ✔       | ✔       |
| reports about person children of  `health_center` | ❌       | ✔       | ✔       | ✔       |
| `clinic`                                          | ❌       | ✔       | ✔       | ✔       |
| all reports about `clinic`                        | ❌       | ✔       | ✔       | ✔       |
| person children of `clinic`                       | ❌       | ❌       | ✔       | ✔       |
| reports about person children of `clinic` | ❌       | ❌       | ✔       | ✔       |
| `family`                                          | ❌       | ❌       | ✔       | ✔       |
| all reports about `family`                        | ❌       | ❌       | ✔       | ✔       |
| person children of `family`                       | ❌       | ❌       | ❌       | ✔       |
| reports about person children of `family`         | ❌       | ❌       | ❌       | ✔       |


##### Report Depth

As of 3.10, `report_depth` works similarly to `depth`, but it's applied to reports (documents with `"type": "data_record"`) alone, excepting reports that are submitted by the authenticated user. 
It only works in conjunction with `depth`.   

Following the examples above:
```json
{ "replication_depth": [{ "role": "supervisor_role", "depth": <variable>, "report_depth": <variable> }]}
```

The `supervisor` would download the following contacts and reports:

| Documents                                                                   | depth=0 | depth=1 report_depth=0 | depth=2 report_depth=0 | depth=2 report_depth=1 | depth=2 report_depth=0 | depth=3 report_depth=1 | depth=3 report_depth=2 |
|-----------------------------------------------------------------------------|---------|-------------------------|-------------------------|-------------------------|-------------------------|-------------------------|-------------------------|
| `health_center`                                                             | ✔       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| all reports about `health_center`                                           | ✔       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| children of `health_center`                                          | ❌       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| reports about children of `health_center`  submitted by `supervisor` | ❌       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| reports about children of `health_center`  submitted by other users  | ❌       | ❌                       | ❌                       | ✔                       | ❌                       | ✔                       | ✔                       |
| `clinic`                                                                    | ❌       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| reports about `clinic` submitted by `supervisor`                            | ❌       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| reports about `clinic` submitted by other users                             | ❌       | ❌                       | ❌                       | ✔                       | ❌                       | ✔                       | ✔                       |

| Documents                                                                   | depth=0 | depth=1 report_depth=0 | depth=2 report_depth=0 | depth=2 report_depth=1 | depth=2 report_depth=0 | depth=3 report_depth=1 | depth=3 report_depth=2 |
|-----------------------------------------------------------------------------|---------|-------------------------|-------------------------|-------------------------|-------------------------|-------------------------|-------------------------|
| children of `clinic`                                                 | ❌       | ❌                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| reports about children of `clinic` submitted by `supervisor`         | ❌       | ❌                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| reports about children of `clinic` submitted by other users          | ❌       | ❌                       | ❌                       | ❌                       | ❌                       | ❌                       | ✔                       |
| `family`                                                                    | ❌       | ❌                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| reports about `family` submitted by `supervisor`                            | ❌       | ❌                       | ✔                       | ✔                       | ✔                       | ✔                       | ✔                       |
| reports about `family` submitted by other users                             | ❌       | ❌                       | ❌                       | ❌                       | ❌                       | ❌                       | ✔                       |
| children of `family`                                                 | ❌       | ❌                       | ❌                       | ❌                       | ❌                       | ✔                       | ✔                       |
| reports about children of `family` submitted by `supervisor`         | ❌       | ❌                       | ❌                       | ❌                       | ❌                       | ✔                       | ✔                       |
| reports about children of `family` submitted by other users          | ❌       | ❌                       | ❌                       | ❌                       | ❌                       | ❌                       | ❌                       |
        

If `report_depth` is omitted, the user will have access to all reports about contacts they see. 

If `report_depth` is higher than `depth`, it has no effect.  

If `depth` is omitted, the rule is invalid and will be ignored. 

If a user's roles match multiple `replication_depth` entries, the one with the highest `depth` is selected.
```json
{ 
  "replication_depth": [
    { "role": "role1", "depth": 1 },
    { "role": "role2", "depth": 2 },
    { "role": "role3", "depth": 3 }
  ]
}
``` 
A user with `roles: ["role1", "role2", "role3"]` will have a replication depth of 3. 

```json
{ 
  "replication_depth": [
    { "role": "role1", "depth": 2, "report_depth": 1 },
    { "role": "role2", "depth": 5, "report_depth": 2 },
    { "role": "role3", "depth": 4, "report_depth": 3 }
  ]
}
``` 
A user with `roles: ["role1", "role2", "role3"]` will have a replication depth of 5 and report replication depth of 2.



### Supervisor signoff

Some reports need to be signed off by a supervisor even though that supervisor doesn't have the depth to see the patient the report is about. To achieve this the report needs a field named `needs_signoff` with a value of `true`.

### Sensitive documents

We won't replicate documents that are about the user when the sender is someone the user can't access. For example, if a supervisor submits a report about one of their CHPs, that CHP won't be able to see it.
