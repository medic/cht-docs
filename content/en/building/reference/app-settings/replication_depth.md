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

Replication depth is defined under `replication_depth` as an array of objects. 
It grants the ability to limit document replication depending on user roles.

## `app_settings.json .replication_depth`

| property | description | required |
|-------|---------|----------|
|`role`| The configured user role the depth applies to. | yes |
|`depth`| The replication depth value. Must be a positive integer or 0. | yes |
|`report_depth`| **As of 3.10**. Replication depth applied to reports submitted by other users. | no |
|`replicate_primary_contacts`| **As of 5.1.0**. When `true`, the primary contact of every place in the user's replication scope is replicated to their device, even if that contact is beyond the configured `depth`. Defaults to `false`. | no |
 
##### Code sample:
```json
{
  "replication_depth": [
    { "role": "district_manager", "depth": 1, "report_depth": 1, "replicate_primary_contacts": true },
    { "role": "national_manager", "depth": 2 }
  ]
}
```

## replicate_primary_contacts

When set to `true`, the primary contact of every place within the user's 
replication scope is replicated to their device, even if that contact 
document exists beyond the configured `depth`.

### Behavior

- Defaults to `false` if omitted.
- When a user has **multiple roles**, the role with the highest `depth` 
  determines the value. If two roles share the same `depth`, the setting 
  is `true` if **either** role has it enabled.
- Primary contacts inherit the same depth as their parent place for 
  `report_depth` calculations.

### Example
```json
{
  "replication_depth": [
    {
      "role": "district_manager",
      "depth": 1,
      "report_depth": 0,
      "replicate_primary_contacts": true
    }
  ]
}
```

In this example, a `district_manager` replicates contacts up to depth 1, 
**plus** the primary contact of any place in their hierarchy regardless 
of how deep that contact is.