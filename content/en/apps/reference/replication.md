---
title: "Replications"
linkTitle: "Replications"
weight: 5
description: >
  Instructions for defining replications
keywords: replication
---

Replications are defined under the `replications` key as an array of replication objects. 

## `app_settings.json .replications`
|property|description|required|
|-------|---------|----------|
|`fromSuffix`|The suffix of the source table(s). Regular expression may be used.|yes|
|`toSuffix`|The suffix of the target table.|yes|
|`text_expression`|Any valid text expression. For more information, see [LaterJS](https://bunkat.github.io/later/parsers.html#text)|no if `cron` provided|
|`cron`|Any valid Cron expression. For more information, see [LaterJS](https://bunkat.github.io/later/parsers.html#cron)|no if `text_expression` provided|

## Code sample

The definition takes the typical form below:

```json
"replications": [
  {
    "fromSuffix": "user-[^\\-]+-meta",
    "toSuffix": "users-meta",
    "text_expression": "",
    "cron": "0 2 * * *"
  }
]
```
