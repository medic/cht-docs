---
title: "CouchDB replication"
linkTitle: "Replication"
weight: 
description: >
  Settings for downloading copies of data onto a user's device
keywords: 
relatedContent: >
  building/reference/app-settings/replication_depth
  community/contributing/code/troubleshooting/replicating-production-data-locally
aliases:
   - /apps/guides/performance/replication
   - /building/guides/performance/replication
---

Replication is what we call it when users download a copy of the data on to their device.

## Restricting replication

If the user has an online role they can access all the data, otherwise they will get restricted access to the data.

### Restriction by place

The most common restriction is by place. This is where we check the user's `facility_id` property, and allow access to all contacts that are descendants of that place, and all reports and messages that are about one of those descendants.

For example, if a CHP's `facility_id` property is set to the ID of the Maori Hill clinic, then they will be able to see all patients and all reports about patients at that clinic.

> [!NOTE] 
> Starting in v4.9.0, users with the `can_have_multiple_places` permission can be assigned more than one `facility_id`. The primary use case for this is for Supervisors who manage multiple areas. A video demonstration of setting up a multi-facility user and what this looks like from a user's perspective can be found [on the forum](https://forum.communityhealthtoolkit.org/t/support-for-supervisors-who-need-to-manage-multiple-areas/3497/2?u=michael) and in the [June 2024 CHT Round-up](https://youtu.be/hrhdrzP41gE?si=_7wglk7Nm7CCSFbY&t=606).

### Depth

Sometimes though you want to only access contacts near the top of the hierarchy. This may be because returning all contacts would be too much data to be practical, or for patient privacy, or because it's just not part of your workflow. In this case you can configure a replication depth for a specific role under `replication_depth` in the app settings.

In 3.10, we add the ability to limit replication depth for reports, in conjunction with replication depth for contacts.
In 4.18, we add the ability to allow replication of primary contacts and their reports at max depth. 

##### Code sample:

```json
{
  "replication_depth": [
    {
      "role": "district_manager",
      "depth": 1,
      "report_depth": 1
    },
    {
      "role": "supervisor",
      "depth": 1,
      "report_depth": 1,
      "replicate_primary_contacts": true
    },
    {
      "role": "national_manager",
      "depth": 2
    }
  ]
}
```

{{< see-also page="building/reference/app-settings/replication_depth" title="Replication Depth" >}}

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

##### Replicate primary contacts

_As of 4.18.0._   
When a `replication_depth` sets `replicate_primary_contacts` to `true`, users with the assigned role will replicate the primary contacts of the places they are allowed to see. Primary contacts are replicated even if they are deeper than these users are allowed to download, and even if these contacts belong to other branches of the hierarchy. The primary contact is treated as if it is at the same depth as the place, and will follow the report replication depth of the place. 

For example, considering the following settings:
```json
{
  "replication_depth": [
    {
      "role": "chw",
      "depth": 2,
      "report_depth": 2,
      "replicate_primary_contacts": true
    },
    {
      "role": "supervisor",
      "depth": 2,
      "report_depth": 1,
      "replicate_primary_contacts": true
    }
  ],
  "contact_types": [
    { "id": "level1" },
    { "id": "level2", "parents": ["level1"] },
    { "id": "level3", "parents": ["level2"] },
    { "id": "level4", "parents": ["level3"] },
    { "id": "level5", "parents": ["level4"] },
    { "id": "person", "parents": ["level1", "level2", "level3", "level4", "level5"], "person": true s}
  ]
}
```

For the configuration above, a user that has the role `chw` is allowed to replicate contacts 2 levels below their facility and replicate reports for contacts 2 levels below their facility and replicate primary contacts. For a `chw` at `level2`, it will replicate contacts at `level2`, `level3` and `level4`, along with their reports. They will also replicate the primary contact of a place at `level4`, even if the primary contact is a child of a `level5` contact, along with this contact's reports.     


A user that has the `supervisor` role is allowed to replicate contacts 2 levels below their facility and replicate reports for contacts 1 level below their facility and replicate primary contacts. 
A `supervisor` at `level2` will replicate the same contacts as the `chp` role above. Similar to the `chp`, they will replicate primary contacts for places at `level4`, but the `supervisor` users will not replicate the reports of primary contacts because a primary contact of a `level4` place has a depth of 2. The `supervisor` will replicate reports for primary contacts of places at `level2` or `level3`. 

### Supervisor signoff

Some reports need to be signed off by a supervisor even though that supervisor doesn't have the depth to see the patient the report is about. To achieve this the report needs a field named `needs_signoff` with a value of `true`.

### Sensitive documents

We won't replicate reports that are `private` and are about the user when the sender is someone the user can't access. A report is private when it has a property `doc.fields.private` with a value of `true`. For example, if a supervisor submits a private report about one of their CHPs, that CHP won't be able to see it.
