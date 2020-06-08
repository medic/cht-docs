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

##### Code sample 3.9 and earlier:

```json
{
  "replication_depth": [
    { "role": "district_manager", "depth": 1 },
    { "role": "national_manager", "depth": 2 }
  ]
}
```

##### Code sample 3.10 and later:
```json
{
  "replication_depth": [
    { "role": "district_manager", "depth": 1, "report_depth": 1 },
    { "role": "national_manager", "depth": 2 }
  ]
}
```

##### Contact Depth

Contact depth is calculated relative to the user's home place, having the user's facility at depth = 0. Places and contacts that are parented by the facility are on depth = 1, and so on. 

For example, considering the following contact hierarchy:
```
district > health_center > clinic > area > family > patient
``` 
a `supervisor` at `health_center` level, and the following configuration:
```json
{ "replication_depth": [{ "role": "supervisor_role", "depth": 2 }]}
``` 

The `supervisor` would download the following contacts and reports:
- (level 0) `health_center` + all reports about `health_center`
- (level 1) contacts whose parent is `health_center` +  all reports about these contacts
- (level 1) `clinic` + all reports about `clinic`
- (level 2) contacts whose parent is `clinic` + all reports about these contacts
- (level 2) `family` + all reports about `family`

With the following configuration:
```json
{ "replication_depth": [{ "role": "supervisor_role", "depth": 1 }]}
``` 
the `supervisor`'s docs change to:
- (level 0) `health_center` + all reports about `health_center`
- (level 1) contacts whose parent is `health_center` + all reports about these contacts
- (level 1) `clinic` + all reports about `clinic` 

##### Report Depth

As of 3.10, `report_depth` works similarly to `depth`, but it's applied to reports (documents with `"type": "data_record"`) alone, excepting reports that are submitted by the authenticated user. 
It only works in conjunction with `depth`.   

Following the examples above:
```json
{ "replication_depth": [{ "role": "supervisor_role", "depth": 2, "report_depth": 1 }]}
```

The `supervisor` would download the following contacts and reports:
- (level 0) `health_center` + all reports about `health_center`
- (level 1) contacts whose parent is `health_center` + all reports about these contacts
- (level 1) `clinic` + all reports about `clinic`
- (level 2) contacts whose parent is `clinic` + reports about `clinic` submitted by `supervisor`
- (level 2) `family` +  reports about `family` submitted by the `supervisor`

Similarly, with:
```json
{ "replication_depth": [{ "role": "supervisor_role", "depth": 2, "report_depth": 0 }]}
``` 
the `supervisor`'s docs change to:
- (level 0) `health_center` + all reports about `health_center`
- (level 1) contacts whose parent is `health_center` + reports about these contacts submitted by `supervisor`
- (level 1) `clinic` + reports about `clinic` submitted by the `supervisor`
- (level 2) contacts whose parent is `clinic` + reports about these contacts submitted by `supervisor`
- (level 2) `family` + reports about `family` submitted by the `supervisor`

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
