---
title: ".dhis_data_sets"
linkTitle: ".dhis_data_sets"
weight: 5
description: >
  **DHIS2 Integration**: Instructions and schema for defining DHIS2 integrations
relevantLinks: >
keywords: dhis2
aliases:
   - /apps/reference/app-settings/dhis2
---

From 3.9.0 it is possible to integrate with DHIS2 by modifying the `dhis_data_sets` property in `app_settings.json`. 

{{< see-also page="building/features/integrations/dhis2" title="DHIS2 Integration" >}}

## `app_settings.js .dhis_data_sets[]`

|Property|Type|Description|Required|
|---|---|---|---|
id | `string` | The data set id from DHIS2 with which to integrate | Yes
translation_key | `string` | The translation key of the DHIS2 data set name to be displayed | Yes

## Code samples

Configure the `id` and `translation_key` of the DHIS2 data set. The `id` corresponds to the `id` of the data set in the DHIS2 instance you want to integrate with. The `translation_key` corresponds to the name of the DHIS2 data set as it appears in the dropdown in the App Management app.

### `app_settings.js`

```json
"dhis_data_sets": [
  {
    "id": "VMuFODsyWaO",
    "translation_key": "dhis.dataset.moh515"
  }
],
```
