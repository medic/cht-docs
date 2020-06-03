---
title: "DHIS2 Integration"
linkTitle: "DHIS2"
weight: 5
description: >
  Instructions and schema for defining DHIS2 integrations
relevantLinks: >
keywords: dhis2
---

## `app_settings.js .dhisDataSets[]`

|Property|Type|Description|Required|
|---|---|---|---|
id | `string` | The data set id from DHIS2 with which to integrate | Yes
translation_key | `string` | The translation key of the DHIS2 data set name to be displayed | Yes

## Code samples

Configure the `id` and `translation_key` of the DHIS2 data set. The `id` corresponds to the `id` of the data set in the DHIS2 instance you want to integrate with. The `translation_key` corresponds to the name of the DHIS2 data set as it appears in the dropdown in the App Management app.

### `app_settings.js`

```json
"dhisDataSets": [
  {
    "id": "VMuFODsyWaO",
    "translation_key": "dhis.dataset.moh515"
  }
],
```
