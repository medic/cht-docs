---
title: ".replications [deprecated]"
linkTitle: ".replications"
weight: 5
description: >
  **Replications** [deprecated]: Configure replication of databases to a main meta database.
keywords: replications
aliases:
   - /apps/reference/app-settings/replications
---


{{% alert title="Deprecated" %}} 
The `replications` field is only available in versions 3.5.0 to 3.9.0. As of 3.10.0 this field is ignored, and replication happens nightly for user meta databases to a central meta data database.
{{% /alert %}}

Replications are defined under the `app_settings.replications` key as an array of replication objects. The definition takes the typical form below:


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
|property|description|required|
|-------|---------|----------|
|`fromSuffix`|The suffix of the source table(s). Regular expression may be used.|yes|
|`toSuffix`|The suffix of the target table.|yes|
|`text_expression`|Any valid text expression. For more information, see [LaterJS](https://bunkat.github.io/later/parsers.html#text)|no if `cron` provided|
|`cron`|Any valid Cron expression. For more information, see [LaterJS](https://bunkat.github.io/later/parsers.html#cron)|no if `text_expression` provided|
