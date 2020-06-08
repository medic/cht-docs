---
title: ".replication_depth"
linkTitle: ".replication_depth"
weight: 5
description: >
  **Replications**: Instructions for replication depth
keywords: replication
---

Replication depth is defined under `replication_depth` as an array of objects. It grants the ability to limit document replication depending on user roles.
 
## `app_settings.json .replication_depth`

| property | description | required |
|-------|---------|----------|
|`role`| The configured user role the depth applies to. | yes |
|`depth`| The replication depth value. Must be a positive integer or 0. | yes |
|`report_depth`| **As of 3.10**. Replication depth applied to reports submitted by other users | no | 

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
