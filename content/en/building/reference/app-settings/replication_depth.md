---
title: ".replication_depth"
linkTitle: ".replication_depth"
weight: 5
description: >
  **Replications**: Instructions for replication depth
keywords: replication
aliases:
   - /apps/reference/app-settings/replication_depth
---

Replication depth is defined under `replication_depth` as an array of objects. It grants the ability to limit document replication depending on user roles.

## `app_settings.json .replication_depth`

| property | description | required |
|-------|---------|----------|
|`role`| The configured user role the depth applies to. | yes |
|`depth`| The replication depth value. Must be a positive integer or 0. | yes |
|`report_depth`| **As of 3.10**. Replication depth applied to reports submitted by other users. | no |
|`replicate_primary_contacts`| **As of 4.18.0**. When `true`, the primary contact of every place in the user's replication scope is replicated to their device, even if that contact is beyond the configured `depth`. Defaults to `false`.  See [docs](/technical-overview/data/performance/replication/#replicate-primary-contacts).| no |
 
##### Code sample:
```json
{
  "replication_depth": [
    { "role": "district_manager", "depth": 1, "report_depth": 1, "replicate_primary_contacts": true },
    { "role": "national_manager", "depth": 2 }
  ]
}
```